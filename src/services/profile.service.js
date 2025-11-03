import Profile from "../models/profile.model.js";
import NodeGeocoder from "node-geocoder";

const geocoder = NodeGeocoder({
  provider: "openstreetmap",
  httpAdapter: "https",
  formatter: null,
  fetchOptions: {
    headers: {
      "User-Agent": "CodemateBackend/1.0 (arishkannan941@gmail.com)", // ← your contact or project name
      "Accept-Language": "en",
    },
  },
});


export const findMatches = async (userId) => {
  // Fetch current user's profile
  const currentProfile = await Profile.findOne({ user: userId });
  if (!currentProfile) throw new Error("Profile not found");

  // Match developers with at least 1 common skill + same location
  const matches = await Profile.find({
    user: { $ne: userId }, // exclude self
    isPublic: true, // only public profiles
    skills: { $in: currentProfile.skills }, // at least one skill matches
  }).lean();

  // Sort matches by number of common skills
  const sortedMatches = matches.sort((a, b) => {
    const commonSkillsA = a.skills.filter(skill =>
      currentProfile.skills.includes(skill)
    ).length;
    const commonSkillsB = b.skills.filter(skill =>
      currentProfile.skills.includes(skill)
    ).length;
    return commonSkillsB - commonSkillsA; 
  });

  return sortedMatches;
};

function haversineDistance(coord1, coord2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const findMatchesKNN = async (userId) => {
  const currentProfile = await Profile.findOne({ user: userId });
  if (!currentProfile) throw new Error("Profile not found");

  if (!currentProfile.location || !currentProfile.location.coordinates[0] || !currentProfile.location.coordinates[1]) {
    throw new Error("Current user location not set");
  }

  // Fetch all other public profiles
  const otherProfiles = await Profile.find({
    user: { $ne: userId },
    isPublic: true,
  }).populate("user", "username email");

  // Compute similarity scores
  const results = otherProfiles.map((profile) => {
    // --- Skills similarity (Jaccard index) ---
    const intersection = currentProfile.skills.filter((s) =>
      profile.skills.includes(s)
    );
    const union = new Set([...currentProfile.skills, ...profile.skills]);
    const skillScore = union.size > 0 ? intersection.length / union.size : 0;

    // --- Experience similarity (closer is better) ---
    const expDiff = Math.abs(
      (currentProfile.experience || 0) - (profile.experience || 0)
    );
    const expScore = 1 / (1 + expDiff); // decays as diff grows

    // --- Distance similarity ---
    let distanceScore = 0;
    if (profile.location?.coordinates[1] && profile.location?.coordinates[0]) {
      const distanceKm = haversineDistance(
        { lat: currentProfile.location.coordinates[1], lng: currentProfile.location.coordinates[0] },
        { lat: profile.location.coordinates[1], lng: profile.location.coordinates[0] }
      );
      // Convert distance to similarity: closer = higher score
      // Example: if distance = 0km => 1, 50km => ~0.5, 200km => very low
      distanceScore = 1 / (1 + distanceKm / 50); 
    }

    // --- Combine scores (weights adjustable) ---
    const finalScore =
      skillScore * 0.5 + expScore * 0.2 + distanceScore * 0.3;

    return {
      profile,
      score: finalScore,
    };
  });

  // Sort descending by score
  return results.sort((a, b) => b.score - a.score);
};



export const createOrUpdateProfile = async (userId, profileData) => {
  let location = {};
  if (profileData.location) {
    const geoRes = await geocoder.geocode(profileData.location);
    if (geoRes.length > 0) {
      location = {
        type: "Point",
        coordinates: [geoRes[0].longitude, geoRes[0].latitude],
      };
      profileData.locationName = profileData.location;
      profileData.location = location;
    }
  }

  return await Profile.findOneAndUpdate(
    { user: userId },
    { $set: profileData },
    { new: true, upsert: true }
  );
};

export const getProfileByUserId = async (userId) => {
  return await Profile.findOne({ user: userId }).populate("user", "username email");
};

export const getAllProfiles = async () => {
  return await Profile.find({ isPublic: true }).populate("user", "username email");
};

export const deleteProfile = async (userId) => {
  return await Profile.findOneAndDelete({ user: userId });
};

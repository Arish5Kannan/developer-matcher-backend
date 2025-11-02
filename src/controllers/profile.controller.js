import * as profileService from "../services/profile.service.js";


//Get Matches
export const getMatches = async (req, res) => {
  try {
    const userId = req.user.id; 
    const matches = await profileService.findMatches(userId);
    res.json(matches);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//Get matches for KNN
export const getMatchesKNN = async (req, res) => {
  try {
    const userId = req.user.id; // logged-in user
    
    const matches = await profileService.findMatchesKNN(userId);
    res.json({ success: true, matches });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Create or Update Profile
export const createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // user from auth middleware
    const profileData = req.body;

    const profile = await profileService.createOrUpdateProfile(userId, profileData);

    res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      data: profile,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get own profile
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await profileService.getProfileByUserId(userId);

    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all public profiles
export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await profileService.getAllProfiles();
    res.status(200).json({ success: true, data: profiles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete own profile
export const deleteMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    await profileService.deleteProfile(userId);

    res.status(200).json({ success: true, message: "Profile deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

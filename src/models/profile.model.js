import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    bio: { type: String, maxlength: 500, trim: true },
    skills: [{ type: String, trim: true }],
    experience: { type: Number, default: 0, min: 0 },
    avatar: {
      type: String,
      default:
        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    },
    locationName: {
      type: String,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    company: { type: String, trim: true },
    designation: { type: String, trim: true },
    github: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    website: { type: String, trim: true },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes
profileSchema.index({ skills: 1 });
profileSchema.index({ location: "2dsphere" }); // For geo queries

export default mongoose.model("Profile", profileSchema);

import mongoose from "mongoose";
import Profile from "./profile.model.js"; 

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    phoneNumber: {
      type: String,
      match: [/^\+?\d{7,15}$/, "Please enter a valid phone number"],
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Post-save hook:
 * Automatically create a Profile when a User is created
 */
userSchema.post("save", async function (doc, next) {
  try {
    // Check if profile already exists (avoid duplicates on updates)
    const existingProfile = await Profile.findOne({ user: doc._id });
    if (!existingProfile) {
      await Profile.create({
        user: doc._id,
        bio: "",
        skills: [],
        avatar: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y", 
      });
      console.log(`Profile created for user: ${doc.username}`);
    }
    next();
  } catch (err) {
    console.error("Error creating profile:", err);
    next(err);
  }
});

/* Cascade the profile model when user is deleted */
userSchema.pre("findOneAndDelete", async function (next) {
  try {
    const user = await this.model.findOne(this.getQuery());
    if (user) {
      await Profile.deleteOne({ user: user._id });
      console.log(`Profile deleted for user: ${user.username}`);
    }
    next();
  } catch (err) {
    console.error("Error deleting profile:", err);
    next(err);
  }
});


export default mongoose.model("User", userSchema);

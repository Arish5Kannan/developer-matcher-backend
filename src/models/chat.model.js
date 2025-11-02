import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // [user1, user2]
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);

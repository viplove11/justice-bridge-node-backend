import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    file_text: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", chatMessageSchema);
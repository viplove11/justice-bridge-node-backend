import mongoose from "mongoose";

const lawSimplifierSchema = new mongoose.Schema(
  {
    input_type: {
      type: String,
      enum: ["text", "file"],
      required: true
    },

    // When user pastes text
    input_text: {
      type: String,
      default: ""
    },

    // When user uploads PDF
    file_name: {
      type: String,
      default: ""
    },
    extracted_text: {
      type: String,
      default: ""
    },

    // LLM response (English + Hindi)
    response_text: {
      type: String,
      required: true
    },
    isLiked: {
      type: Boolean,
      default: false
    },

    // Optional user (if logged in)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

const LawSimplifier = mongoose.model("LawSimplifier", lawSimplifierSchema);
export default LawSimplifier;

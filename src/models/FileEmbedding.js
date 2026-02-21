import mongoose from "mongoose";

const fileEmbeddingSchema = new mongoose.Schema({
  chunk_id: Number,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  content: String,
  embedding: [Number],
  file_name: String
}, { timestamps: true });

export default mongoose.model("FileEmbedding", fileEmbeddingSchema);

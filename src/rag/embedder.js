import { pipeline } from "@xenova/transformers";

let embedder = null;

export const getEmbedder = async () => {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
};

export const generateEmbedding = async (text) => {
  const embed = await getEmbedder();
  const output = await embed(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
};

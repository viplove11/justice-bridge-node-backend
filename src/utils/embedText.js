import { pipeline } from "@xenova/transformers";

let embedder;

// Load once
const loadModel = async () => {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
};

export const embedChunks = async (chunks) => {
  const model = await loadModel();
  const vectors = [];

  for (const chunk of chunks) {
    const output = await model(chunk, { pooling: "mean", normalize: true });
    vectors.push(Array.from(output.data));
  }

  return vectors;
};

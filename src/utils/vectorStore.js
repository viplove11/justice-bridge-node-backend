import hnswlib from "hnswlib-node";
import fs from "fs";

const INDEX_PATH = "vectorStore.index";
const META_PATH = "vectorMeta.json";

export const saveVectorStore = (vectors, chunks) => {
  const dim = vectors[0].length;

  const index = new hnswlib.HierarchicalNSW("cosine", dim);
  index.initIndex(vectors.length);

  vectors.forEach((vector, i) => {
    index.addPoint(vector, i);
  });

  index.writeIndex(INDEX_PATH);

  fs.writeFileSync(META_PATH, JSON.stringify({ chunks }));
};

export const loadVectorStore = () => {
  const dim = 384; // MiniLM output dimension

  const index = new hnswlib.HierarchicalNSW("cosine", dim);
  index.readIndex(INDEX_PATH);

  const meta = JSON.parse(fs.readFileSync(META_PATH, "utf-8"));

  return { index, chunks: meta.chunks };
};

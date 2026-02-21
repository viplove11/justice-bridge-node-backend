import hnswlib from "hnswlib-node";

class VectorStore {
  constructor() {
    this.dim = 384;           // embedding dimension
    this.space = "cosine";    // distance type
    this.initialized = false;

    this.index = new hnswlib.HierarchicalNSW(this.space, this.dim);
  }

  init() {
    if (this.initialized) return;

    // capacity for vectors (increase later if needed)
    this.index.initIndex(10000);

    this.initialized = true;
  }

  addEmbedding(id, vector) {
    this.init();

    if (!Array.isArray(vector)) {
      throw new Error("Vector must be an array");
    }

    this.index.addPoint(vector, id);
  }

  search(vector, k = 5) {
    this.init();

    return this.index.searchKnn(vector, k);
  }
}

export const vectorStore = new VectorStore();

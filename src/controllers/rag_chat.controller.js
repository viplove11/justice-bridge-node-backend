import axios from "axios";
import { extractTextFromPDF } from "../utils/extractText.js";
import { chunkText } from "../utils/chunkText.js";
import { generateEmbedding } from "../rag/embedder.js";
import FileEmbedding from "../models/FileEmbedding.js";
import fs from "fs";
import { vectorStore } from "../rag/vectorStore.js";
import ChatMessage from "../models/ChatMessage.js";

export const chatHandler = async (req, res) => {
  try {
    let userMessage = req.body.message || "";
    let fileText = "";

    // 1. Handle uploaded PDF
    if (req.file) {
      fileText = await extractTextFromPDF(req.file.path);
      fs.unlinkSync(req.file.path);

      // Chunk PDF
      const chunks = chunkText(fileText);

      // For each chunk → embed + store
      for (let i = 0; i < chunks.length; i++) {
        const embedding = await generateEmbedding(chunks[i]);

        await FileEmbedding.create({
          chunk_id: i,
          userId: req.user?._id || null,
          content: chunks[i],
          embedding,
          file_name: req.file.originalname
        });

        vectorStore.addEmbedding(i, embedding);
      }
    }

    if (!userMessage.trim()) {
      return res.status(400).json({ message: "Message required" });
    }

    // 2. Embed user query
    const queryEmbedding = await generateEmbedding(userMessage);

    // 3. Search FAISS for top relevant chunks
    const nearest = vectorStore.search(queryEmbedding, 5);

    let context = "";
    if (nearest.labels && nearest.labels.length > 0) {
      const matchedChunks = await FileEmbedding.find({
        chunk_id: { $in: nearest.labels }
      });

      context = matchedChunks.map(c => c.content).join("\n\n");
    }

    // 4. Get recent chat history
    const history = await ChatMessage.find().sort({ createdAt: -1 }).limit(10);
    const chatHistory = history.reverse().map(h => ({
      role: h.role,
      content: h.message
    }));

    // 5. Build LLM prompt
    const prompt = `
You are LexAI, an intelligent legal & general assistant.
Use the provided CONTEXT if helpful.

CONTEXT:
${context}

User Question:
${userMessage}
    `;

    // 6. Groq LLM Call
    const groqApi = process.env.GROQ_API_KEY;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          ...chatHistory,
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${groqApi}`
        }
      }
    );

    const reply = response.data.choices[0].message.content;

    // 7. Save conversation
    await ChatMessage.create({ role: "user", message: userMessage });
    await ChatMessage.create({ role: "assistant", message: reply });

    return res.status(200).json({ reply });

  } catch (error) {
    console.log("CHAT ERROR:", error.response?.data || error.message);
    res.status(500).json({ message: "Chat error" });
  }
};


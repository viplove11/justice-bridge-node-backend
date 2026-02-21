import axios from "axios";
import fs from "fs";
import { extractTextFromPDF } from "../utils/extractText.js";
import ChatMessage from "../models/ChatMessage.js";

export const chatHandler = async (req, res) => {
  try {
    let userMessage = req.body.message || "";
    let fileText = "";

    // Case 1 — If user uploads a file
    if (req.file) {
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ message: "Only PDF allowed" });
      }

      fileText = await extractTextFromPDF(req.file.path);
      fs.unlinkSync(req.file.path);
    }

    if (!userMessage.trim() && !fileText.trim()) {
      return res.status(400).json({ message: "Message or file required" });
    }

    // Fetch last 10 messages (context)
    const history = await ChatMessage.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const chatHistory = history.reverse().map(msg => ({
      role: msg.role,
      content: msg.message
    }));

    // Prepare system prompt
    const prompt = `
You are LexAI — a legal and general AI assistant.
Answer user queries clearly, in simple language.
If file_text exists, use it as reference context.

User question: ${userMessage}

File Content (if any):
${fileText}
`;

    const groqApi = process.env.GROQ_API_KEY;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          ...chatHistory,
          { role: "user", content: prompt }
        ],
        temperature: 0.3
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApi}`
        }
      }
    );

    const reply = response.data.choices[0].message.content;

    // Save user + assistant message
    await ChatMessage.create({
      role: "user",
      message: userMessage,
      file_text: fileText
    });

    await ChatMessage.create({
      role: "assistant",
      message: reply
    });

    return res.status(200).json({
      reply
    });

  } catch (error) {
    console.log("CHAT ERROR:", error.response?.data || error.message);
    return res.status(500).json({ message: "Chat error" });
  }
};



// API responsible for generating random question on law
export const getLawSuggestion = async(req, res)=>{
  try {
    const prompt = `
      Generate 5 random valid questions related to Indian Law.
      Requirements:
      - Must be factual
      - Must be legally accurate
      - Must be simple and easy to understand
      - Do NOT provide explanations
      Output only the list of 5 questions.
    `;
const groqApi = process.env.GROQ_API_KEY;
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.4
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApi}`
        }
      }
    );

    const questions = response.data.choices[0].message.content;

    res.status(200).json({
      success: true,
      questions: questions
    });

  } catch (error) {
    console.error("Groq API Error:", error?.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Failed to generate questions",
      error: error?.response?.data || error.message
    });
  }
}
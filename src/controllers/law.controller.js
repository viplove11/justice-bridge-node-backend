import fs from "fs";
import axios from "axios";
import mongoose from "mongoose";
import { extractTextFromPDF } from "../utils/extractText.js";
import LawSimplifier from "../models/LawSimplifier.js";
import { looksLikeIndianLaw } from "../utils/documentGuards.js";

export const simplifyLaw = async (req, res) => {
    try {
        let text = "";
        let inputType = "";
        let fileName = "";
        let extractedText = "";

        // Case 1 — PDF Upload
        if (req.file) {
            if (req.file.mimetype !== "application/pdf") {
                return res.status(400).json({ message: "Only PDF files allowed" });
            }

            extractedText = await extractTextFromPDF(req.file.path);
            text = extractedText;
            fileName = req.file.originalname;
            inputType = "file";

            fs.unlinkSync(req.file.path);
        }

        // Case 2 — User typed text
        if (!text && req.body.text) {
            text = req.body.text;
            inputType = "text";
        }

        if (!text.trim()) {
            return res.status(400).json({ message: "No text provided" });
        }

        // Guardrail: this endpoint is ONLY for Indian law/statutes.
        if (!looksLikeIndianLaw(text)) {
            return res.status(400).json({
                message: "This feature only simplifies Indian law/statutes. Please upload/paste an Indian legal provision (e.g., an Act/Section/Article from Indian law)."
            });
        }

        // Groq LLM
        const groqApi = process.env.GROQ_API_KEY;

       const prompt = `
You are LexAI, a specialist assistant that ONLY simplifies Indian law (Indian statutes, rules, regulations, and Constitutional provisions). 

Hard rules:
- If the text is not clearly Indian law, respond exactly: "NOT_INDIAN_LAW".
- Do not answer general questions.
- Do not provide legal advice.
- Do not add any content not present in the input.

Task: Simplify the given Indian law in:
1) Simple English (brief bullet points)
2) Simple Hindi (Hindi text only; brief sentences)
3) 2–3 Real-life Indian examples with specific dates (e.g., 12 March 2023)

Follow this format:

### 🟦 Simplified English
...

### 🟩 Simplified Hindi
...

### 🟧 Real-Life Examples
...

INPUT LAW TEXT:
${text}
`;


        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.2
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${groqApi}`
                }
            }
        );

        const simplified = response.data.choices[0].message.content;

        // Convert userId string to ObjectId if provided
        let userObjectId = null;
        if (req.body.userId) {
            if (mongoose.Types.ObjectId.isValid(req.body.userId)) {
                userObjectId = new mongoose.Types.ObjectId(req.body.userId);
            }
        }

        // 🟢 Save history to MongoDB
        const record = await LawSimplifier.create({
            input_type: inputType,
            input_text: inputType === "text" ? text : "",
            file_name: inputType === "file" ? fileName : "",
            extracted_text: inputType === "file" ? extractedText : "",
            response_text: simplified,
            userId: userObjectId
        });

        return res.status(200).json({
            message: "Simplified successfully",
            simplifiedText: simplified,
            recordId: record._id,
            isLiked: record.isLiked
        });

    } catch (error) {
        console.log("Law Simplifier Error:");

        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Data:", error.response.data);
        } else {
            console.log(error);
        }

        return res.status(500).json({ message: "Error simplifying text" });
    }
};

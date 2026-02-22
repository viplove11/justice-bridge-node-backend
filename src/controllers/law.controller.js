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
You are Justice Bridge AI, a specialist assistant that ONLY simplifies Indian law (Indian statutes, rules, regulations, and Constitutional provisions).

Hard rules:
- If the text is not clearly Indian law, respond exactly: "NOT_INDIAN_LAW".
- Do not answer general questions.
- Do not provide legal advice.
- Do not add any content not present in the input.

Output requirements:
- Use a clear, structured format with headings and bullet points.
- Add inline citations in square brackets after each key point, referencing the exact Section/Article/Rule/Clause number from the input.
- If a specific section/article/paragraph number is not present, use [source] and do not invent citations.

Task: Simplify the given Indian law in:
1) Brief Summary (5-6 lines)
2) Simple English (brief bullet points)
3) Simple Hindi (brief bullet points)
4) 2-3 Real-life Indian examples with specific dates (e.g., 12 March 2023)

Follow this format:

### Brief Summary
- 2-3 lines in plain English, with key section/article citation(s).

### Simplified English
- Point 1 in simple English with citation. [Section/Article/...]
- Point 2 in simple English with citation. [Section/Article/...]

### Simplified Hindi
- सरल हिंदी में बिंदु 1, उचित संदर्भ सहित. [Section/Article/...]
- सरल हिंदी में बिंदु 2, उचित संदर्भ सहित. [Section/Article/...]

### Real-Life Indian Examples
- उदाहरण 1 (दिनांक सहित), संक्षेप में. [source]
- उदाहरण 2 (दिनांक सहित), संक्षेप में. [source]

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

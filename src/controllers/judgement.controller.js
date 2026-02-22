import fs from "fs";
import axios from "axios";
import mongoose from "mongoose";
import { extractTextFromPDF } from "../utils/extractText.js";
import JudgementSimplifier from "../models/JudgementSimplifier.js";
import { looksLikeIndianJudgement } from "../utils/documentGuards.js";

export const simplifyJudgement = async (req, res) => {
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

        // Guardrail: must look like an Indian court judgement.
        if (!looksLikeIndianJudgement(text)) {
            return res.status(400).json({
                message: "No Indian court judgement identified in the provided text/PDF. Please upload a valid Indian judgement document."
            });
        }

        // Groq LLM
        const groqApi = process.env.GROQ_API_KEY;

        const prompt = `
You are Justice Bridge AI, a specialist assistant that ONLY simplifies Indian court judgements (Supreme Court of India / High Courts / Indian tribunals).

Hard rules:
- If the input is not an Indian court judgement, respond exactly: "NOT_A_JUDGEMENT".
- Do not answer general questions.
- Do not provide legal advice.
- Do not add content not present in the judgement.

Output requirements:
- Use a clear, structured format with headings and bullet points.
- Add inline citations in square brackets after each key point, referencing paragraph numbers, page numbers, or section references present in the input.
- If specific paragraph/page/section numbers are not present, use [source] and do not invent citations.

Simplify the following judgement in a way that is accurate, clear, and easy to understand, without losing legal meaning or context.

Format:

### Brief Summary
- 2-3 lines in plain English, with citation(s).

### Simplified English
- Short bullet points covering: facts, issues, arguments (if any), reasoning, final decision.

### Simplified Hindi
- Same content in simple Hindi (short sentences).

### Real-Life Indian Examples
- 2-3 relatable Indian scenarios that illustrate the judgement/implications.

JUDGEMENT TEXT:
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
        const record = await JudgementSimplifier.create({
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

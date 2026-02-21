import express from "express";
import multer from "multer";
import { chatHandler } from "../controllers/rag_chat.controller.js";
import { getLawSuggestion } from "../controllers/chat.controller.js";
// import { chatHandler } from "../controllers/chat.controller.js";

const router = express.Router();
const upload = multer({ dest: "tmp/" });

// router.post("/", upload.single("file"), chatHandler);
router.post("/", upload.single("file"), chatHandler);
router.get("/lawQuestionSuggestion", getLawSuggestion);

export default router;

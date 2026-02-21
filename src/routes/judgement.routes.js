import express from "express";
import multer from "multer";
import { simplifyJudgement } from "../controllers/judgement.controller.js";

const router = express.Router();
const upload = multer({ dest: "tmp/" });

// User can upload PDF OR send text manually
router.post("/simplify", upload.single("file"),simplifyJudgement);

export default router;

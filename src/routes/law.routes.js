import express from "express";
import multer from "multer";
import { simplifyLaw } from "../controllers/law.controller.js";

const router = express.Router();
const upload = multer({ dest: "tmp/" });

// User can upload PDF OR send text manually
router.post("/simplify", upload.single("file"), simplifyLaw);

export default router;

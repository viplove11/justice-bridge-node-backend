import express from "express";
import { registerUser, loginUser, logoutUser, googleAuth } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser)
router.post("/google", googleAuth);

export default router;

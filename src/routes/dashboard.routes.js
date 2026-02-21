import express from "express";
import {
  getUserSimplificationStats,
  getUserLawSimplifications,
  getUserJudgementSimplifications
} from "../controllers/dashboard.controller.js";

const router = express.Router();

// Stats
router.get("/user/:userId/stats", getUserSimplificationStats);

// History
// Returns: userQuery + aiResponse per record
router.get("/user/:userId/law-simplifications", getUserLawSimplifications);
router.get("/user/:userId/judgement-simplifications", getUserJudgementSimplifications);

export default router;

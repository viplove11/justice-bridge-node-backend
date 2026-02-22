import mongoose from "mongoose";
import LawSimplifier from "../models/LawSimplifier.js";
import JudgementSimplifier from "../models/JudgementSimplifier.js";

const parsePaging = (req) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const requireValidUserId = (userId) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }
  return new mongoose.Types.ObjectId(userId);
};

export const getUserSimplificationStats = async (req, res) => {
  try {
    const { userId } = req.params; // userId sent in string format in URL

    const userObjectId = requireValidUserId(userId);
    if (!userObjectId) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // Optional: If you distinguish between "law" and "judgment" via `category` field
    const lawCount = await LawSimplifier.countDocuments({
      userId: userObjectId,
    });

    const judgmentCount = await JudgementSimplifier.countDocuments({
      userId: userObjectId,
    });

    const totalSimplifications = lawCount + judgmentCount;

    return res.status(200).json({
      totalSimplifications:totalSimplifications || 0,
      lawSimplified: lawCount || 0,
      judgmentSimplified: judgmentCount || 0
    });

  } catch (error) {
    console.error("Error fetching user simplification stats:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserLawSimplifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const userObjectId = requireValidUserId(userId);
    if (!userObjectId) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const { page, limit, skip } = parsePaging(req);

    const [items, total] = await Promise.all([
      LawSimplifier.find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      LawSimplifier.countDocuments({ userId: userObjectId })
    ]);

    const formatted = items.map((doc) => ({
      id: doc._id,
      inputType: doc.input_type,
      fileName: doc.file_name,
      // “user query” = what the user provided (typed text or extracted pdf text)
      userQuery: doc.input_type === "text" ? doc.input_text : doc.extracted_text,
      aiResponse: doc.response_text,
      createdAt: doc.createdAt
    }));

    return res.status(200).json({
      page,
      limit,
      total,
      items: formatted
    });
  } catch (error) {
    console.error("Error fetching user law simplifications:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserJudgementSimplifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const userObjectId = requireValidUserId(userId);
    if (!userObjectId) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const { page, limit, skip } = parsePaging(req);

    const [items, total] = await Promise.all([
      JudgementSimplifier.find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      JudgementSimplifier.countDocuments({ userId: userObjectId })
    ]);

    const formatted = items.map((doc) => ({
      id: doc._id,
      inputType: doc.input_type,
      fileName: doc.file_name,
      userQuery: doc.input_type === "text" ? doc.input_text : doc.extracted_text,
      aiResponse: doc.response_text,
      createdAt: doc.createdAt
    }));

    return res.status(200).json({
      page,
      limit,
      total,
      items: formatted
    });
  } catch (error) {
    console.error("Error fetching user judgement simplifications:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserAllSimplifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const userObjectId = requireValidUserId(userId);
    if (!userObjectId) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const limit = 5;
    const [lawItems, judgementItems, lawTotal, judgementTotal] = await Promise.all([
      LawSimplifier.find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean(),
      JudgementSimplifier.find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean(),
      LawSimplifier.countDocuments({ userId: userObjectId }),
      JudgementSimplifier.countDocuments({ userId: userObjectId })
    ]);

    const normalizedLaw = lawItems.map((doc) => ({
      id: doc._id,
      type: "law",
      inputType: doc.input_type,
      fileName: doc.file_name,
      userQuery: doc.input_type === "text" ? doc.input_text : doc.extracted_text,
      aiResponse: doc.response_text,
      createdAt: doc.createdAt
    }));

    const normalizedJudgement = judgementItems.map((doc) => ({
      id: doc._id,
      type: "judgement",
      inputType: doc.input_type,
      fileName: doc.file_name,
      userQuery: doc.input_type === "text" ? doc.input_text : doc.extracted_text,
      aiResponse: doc.response_text,
      createdAt: doc.createdAt
    }));

    const merged = [...normalizedLaw, ...normalizedJudgement]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    return res.status(200).json({
      limit,
      total: lawTotal + judgementTotal,
      items: merged
    });
  } catch (error) {
    console.error("Error fetching user all simplifications:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

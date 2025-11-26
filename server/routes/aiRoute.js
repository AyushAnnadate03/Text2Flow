// server/routes/aiRoute.js
import express from "express";
import { convertWithGemini } from "../services/aiService.js";

const router = express.Router();

// ----- AI Conversion Route (Google Gemini) -----
router.post("/convert-ai", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const pseudo = await convertWithGemini(text);
    res.json({ pseudo });
  } catch (err) {
    console.error("AI Service Error:", err);
    res.status(500).json({ error: "AI conversion failed" });
  }
});

export default router;

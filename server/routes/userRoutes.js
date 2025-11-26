// server/routes/flowRoutes.js
import express from "express";
import { generatePseudoCode } from "../services/nlpService.js";
import { parsePseudoCode } from "../services/parserService.js";

const router = express.Router();

// 1️⃣ Plain text → pseudo code
router.post("/convert", async (req, res) => {
  try {
    const { text } = req.body;
    const pseudo = await generatePseudoCode(text);
    res.json({ pseudo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI conversion failed" });
  }
});

// 2️⃣ Pseudo code → flowchart JSON (nodes + edges)
router.post("/parse", async (req, res) => {
  try {
    const { pseudo } = req.body;
    const graph = parsePseudoCode(pseudo);
    res.json(graph);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Parsing failed" });
  }
});

export default router;

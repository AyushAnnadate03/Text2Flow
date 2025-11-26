// server.js
import dotenv from "dotenv";
dotenv.config();
console.log("Loaded GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "✅ Loaded" : "❌ Not Found");

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

// Routes
import authRoute from "./routes/authRoute.js";
import aiRoute from "./routes/aiRoute.js";

// Services
import { convertToPseudoCode } from "./services/nlpService.js"; // non-AI fallback
import { parsePseudoCode } from "./services/parserService.js";

const app = express();
const port = process.env.PORT || 5000;

// ----- Middleware -----
app.use(cors());
app.use(bodyParser.json());

// ----- Connect MongoDB -----
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ----- Routes -----
app.use("/auth", authRoute);  // login/register
app.use("/api", aiRoute);         // AI conversion

// ----- Non-AI Text -> Pseudo -----
app.post("/convert", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const pseudo = await convertToPseudoCode(text);
    res.json({ pseudo });
  } catch (err) {
    console.error("Conversion Error:", err);
    res.status(500).json({ error: "Conversion failed" });
  }
});

// ----- Parse Pseudo Code -> Flowchart -----
app.post("/parse", async (req, res) => {
  const { pseudo } = req.body;
  if (!pseudo) return res.status(400).json({ error: "Pseudo code is required" });

  try {
    const graph = parsePseudoCode(pseudo);
    res.json(graph);
  } catch (err) {
    console.error("Parse Error:", err);
    res.status(500).json({ error: "Parsing failed" });
  }
});

// ----- AI Conversion (Google Gemini) -----
app.post("/api/ai-convert", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const { convertWithGemini } = await import("./services/aiService.js");
    const pseudoText = await convertWithGemini(text);

    console.log("AI Conversion Output:\n", pseudoText);

    res.json({ pseudo: pseudoText });
  } catch (err) {
    console.error("AI Service Error:", err);
    res.status(500).json({ error: "AI conversion failed" });
  }
});

// ----- Start Server -----
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));

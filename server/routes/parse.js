const express = require("express");
const axios = require("axios");

const router = express.Router();

// Proxy /parse to Flask NLP service
router.post("/", async (req, res) => {
  try {
    // Get plain or pseudo text from frontend
    const text = req.body.plain || req.body.pseudo || "";
    if (!text.trim()) return res.status(400).json({ error: "No text provided" });

    // Call Flask NLP service
    const flaskRes = await axios.post("http://localhost:5001/convert", { text });

    const { pseudo, pseudo_readable } = flaskRes.data;

    // Return to frontend
    res.json({
      graph: null, // frontend handles React Flow conversion
      pseudoGenerated: pseudo,
      pseudoReadable: pseudo_readable,
    });
  } catch (err) {
    console.error("Parse error:", err.message);
    res.status(500).json({ error: "Failed to parse text" });
  }
});

module.exports = router;

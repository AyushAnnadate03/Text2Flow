import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log("Gemini key detected:", GEMINI_API_KEY ? "✅ Yes" : "❌ No");

export async function convertWithGemini(prompt) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not set");
  }

  // 🛑 ERROR FIX: The correct public model ID for Gemini 1.5 Flash is 'gemini-1.5-flash'
  // We recommend using the 'latest' or 'current' versions.
  
  // Option 1: Use the correct 1.5 Flash model ID
  // const modelId = "gemini-1.5-flash";

  // Option 2 (Recommended): Use the latest, fastest Flash model (Gemini 2.5 Flash)
  const modelId = "gemini-2.5-flash"; 
  
  // Construct the correct endpoint URL
  const endpoint = `https://generativelanguage.googleapis.com/v1/models/${modelId}:generateContent`;

  const response = await fetch(`${endpoint}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `Convert the following natural language description into structured pseudocode:\n\n${prompt}`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini API error:", errorText);
    // The original error message will now show the actual API error, not the 404
    throw new Error("Gemini API error: " + errorText);
  }

  const data = await response.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Error: No output generated.";
  return text;
}
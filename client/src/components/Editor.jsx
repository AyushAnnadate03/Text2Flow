import React, { useState } from "react";
import FlowRenderer from "./FlowRenderer";
import axios from "axios";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import "../styles/Editor.css";

export default function Editor() {
  const [plainText, setPlainText] = useState("");
  const [pseudoText, setPseudoText] = useState("");
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null); // <-- Notifications state

  // --- Helper to show toast notifications ---
  const notify = (message, type = "info", duration = 3000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  };

  // Non-AI conversion
  const handleConvert = async () => {
    if (!plainText.trim()) return notify("Enter some text!", "error");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/convert", { text: plainText });
      setPseudoText(res.data.pseudo);
      setGraph(null);
      notify("Conversion successful!", "success");
    } catch (err) {
      console.error("Conversion Error:", err);
      notify("Conversion failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  // AI conversion with retry + better error messages
  const handleAIConvert = async () => {
    if (!plainText.trim()) return notify("Enter some text!", "error");
    setLoading(true);

    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      try {
        const res = await axios.post("http://localhost:5000/api/ai-convert", { text: plainText });
        setPseudoText(res.data.pseudo);
        setGraph(null);
        notify("AI Conversion successful!", "success");
        return; // success — exit the loop
      } catch (err) {
        attempt++;
        console.error(`AI Conversion Attempt ${attempt} Failed:`, err);

        // Handle Gemini overload (503)
        if (err.response?.status === 503) {
          if (attempt < maxAttempts) {
            notify(`Gemini servers overloaded. Retrying... (${attempt}/${maxAttempts})`, "error");
            await new Promise((r) => setTimeout(r, 2000));
            continue;
          } else {
            notify("Gemini servers are currently overloaded. Please try again later.", "error");
          }
        } 
        // Handle invalid key / quota issues
        else if (err.response?.status === 401 || err.response?.status === 403) {
          notify("Invalid or expired Gemini API key. Please check your configuration.", "error");
        } 
        // Handle other server issues
        else if (err.response?.status === 500) {
          notify("Server encountered an internal error. Please check backend logs.", "error");
        } 
        else {
          notify("AI Conversion failed. Please try again.", "error");
        }

        break; // exit loop if not retrying
      } finally {
        setLoading(false);
      }
    }

    setLoading(false);
  };

  // Parse pseudo code to flowchart
  const handleParsePseudo = async () => {
    if (!pseudoText.trim()) return notify("Enter pseudo code!", "error");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/parse", { pseudo: pseudoText });
      setGraph(res.data);
      notify("Flowchart generated!", "success");
    } catch (err) {
      console.error("Flowchart Parse Error:", err);
      notify("Parsing failed.", "error");
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="editor-page">
      {/* Left Panel */}
      <div className="editor-card">
        <h2 className="editor-title">Text2Flow Editor</h2>

        <label className="editor-label">Plain Text Input</label>
        <textarea
          className="editor-textarea"
          rows={5}
          placeholder="Enter plain English text..."
          value={plainText}
          onChange={(e) => setPlainText(e.target.value)}
        />

        <div className="editor-btn-group">
          <button className="editor-btn" onClick={handleConvert} disabled={loading}>
            {loading ? "Converting..." : "Convert to Pseudo Code"}
          </button>
          <button className="editor-btn ai-btn" onClick={handleAIConvert} disabled={loading}>
            {loading ? "AI Converting..." : "AI Convert"}
          </button>
        </div>

        <label className="editor-label">Pseudo Code Input</label>
        <textarea
          className="editor-textarea"
          rows={10}
          placeholder="Or edit/enter pseudo code here..."
          value={pseudoText}
          onChange={(e) => setPseudoText(e.target.value)}
        />

        <div className="editor-btn-group">
          <button className="editor-btn" onClick={handleParsePseudo} disabled={loading}>
            {loading ? "Parsing..." : "Generate Flowchart"}
          </button>
        </div>

        
      </div>

      {/* Right Panel */}
      <div className="preview-card">
        <h3 className="preview-title">Flowchart Preview</h3>
        {graph ? (
          <FlowRenderer graph={graph} />
        ) : (
          <p className="preview-placeholder">
            No diagram yet. Enter text or pseudo code and click "Generate Flowchart".
          </p>
        )}
      </div>

      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            background: notification.type === "error" ? "#e74c3c" : notification.type === "success" ? "#2ecc71" : "#3498db",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "5px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 2000,
          }}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
}

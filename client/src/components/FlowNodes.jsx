// FlowNodes.jsx
import React from "react";

export function StartNode({ data }) {
  return (
    <div style={{
      padding: "10px 20px",
      border: "2px solid #333",
      borderRadius: "50%",
      background: "#e0ffe0",
      textAlign: "center",
      minWidth: 80
    }}>
      {data.label || "Start"}
    </div>
  );
}

export function EndNode({ data }) {
  return (
    <div style={{
      padding: "10px 20px",
      border: "2px solid #333",
      borderRadius: "50%",
      background: "#ffe0e0",
      textAlign: "center",
      minWidth: 80
    }}>
      {data.label || "End"}
    </div>
  );
}

export function ProcessNode({ data }) {
  return (
    <div style={{
      padding: "10px 20px",
      border: "2px solid #333",
      borderRadius: "6px",
      background: "#f0f0f0",
      textAlign: "center"
    }}>
      {data.label}
    </div>
  );
}

export function DecisionNode({ data }) {
  return (
    <div style={{
      width: 100,
      height: 60,
      background: "#e0f0ff",
      border: "2px solid #333",
      transform: "rotate(45deg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{ transform: "rotate(-45deg)" }}>
        {data.label || "?"}
      </div>
    </div>
  );
}

export function LoopNode({ data }) {
  return (
    <div style={{
      padding: "10px 20px",
      border: "2px dashed #333",
      borderRadius: "12px",
      background: "#fffbe0",
      textAlign: "center"
    }}>
      {data.label || "Loop"}
    </div>
  );
}

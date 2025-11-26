import React from "react";
import "../styles/FlowchartCard.css";

export default function FlowchartCard({ diagram }) {
  return (
    <div className="flowchart-card">
      <h3>{diagram.name}</h3>
      <p>Created at: {new Date(diagram.createdAt).toLocaleDateString()}</p>
      <div className="card-buttons">
        <button>View</button>
        <button>Edit</button>
        <button>Delete</button>
      </div>
    </div>
  );
}

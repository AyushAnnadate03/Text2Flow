import React from "react";
import "../styles/FlowchartsInfo.css";
import { AiOutlineFileText, AiOutlineBranches, AiOutlineEdit } from "react-icons/ai";

export default function FlowchartsInfo() {
  return (
    <div className="flowcharts-info-page">
      {/* Hero Section */}
      <div className="hero">
        <h2>All About Flowcharts</h2>
        <p>
          Flowcharts visually represent a process or algorithm using boxes, diamonds, and arrows.
          They make logic easy to follow.
        </p>
      </div>

      {/* Types Section */}
      <section className="section">
        <h3>Types of Flowcharts</h3>
        <ul>
          <li><strong>Process flowchart:</strong> shows sequence of steps.</li>
          <li><strong>Decision flowchart:</strong> highlights branching logic.</li>
          <li><strong>Data flowchart:</strong> focuses on data movement.</li>
        </ul>
      </section>

      {/* When to Use */}
      <section className="section">
        <h3>When to Use</h3>
        <p>
          Use flowcharts when you want to clarify steps, show decision points,
          or document workflows for teaching or collaboration.
        </p>
      </section>

      {/* Flowchart Shapes Section */}
      <section className="shapes-section">
        <h3>Flowchart Shapes</h3>
        <div className="shapes-cards">
          <div className="shape-card">
            <AiOutlineFileText className="icon" />
            <h4>Process</h4>
            <p>Represents a step or task in the process (rectangle).</p>
          </div>
          <div className="shape-card">
            <AiOutlineBranches className="icon" />
            <h4>Decision</h4>
            <p>Represents a decision point with yes/no or true/false outcomes (diamond).</p>
          </div>
          <div className="shape-card">
            <AiOutlineEdit className="icon" />
            <h4>Connector / Flow Line</h4>
            <p>Shows the direction of flow between steps using arrows.</p>
          </div>
          <div className="shape-card">
            <AiOutlineFileText className="icon" />
            <h4>Input/Output</h4>
            <p>Shows data entering or leaving the system (parallelogram).</p>
          </div>
          <div className="shape-card">
            <AiOutlineFileText className="icon" />
            <h4>Start/End</h4>
            <p>Marks the beginning or end of a process (oval/rounded rectangle).</p>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import "../styles/FlowchartPreview.css";
import dagre from "dagre";

// 🔹 Custom node components
const StartNode = ({ data }) => (
  <div
    style={{
      width: 100,
      height: 60,
      borderRadius: "50%",
      background: "#e0f7fa",
      border: "2px solid #00796b",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {data.label}
  </div>
);

const EndNode = ({ data }) => (
  <div
    style={{
      width: 100,
      height: 60,
      borderRadius: "50%",
      background: "#ffebee",
      border: "2px solid #c62828",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {data.label}
  </div>
);

const ProcessNode = ({ data }) => (
  <div
    style={{
      padding: "10px 20px",
      borderRadius: 6,
      background: "#fff",
      border: "2px solid #333",
      textAlign: "center",
    }}
  >
    {data.label}
  </div>
);

const DecisionNode = ({ data }) => (
  <div
    style={{
      width: 120,
      height: 120,
      background: "#fff",
      border: "2px solid #0077cc",
      transform: "rotate(45deg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div style={{ transform: "rotate(-45deg)", textAlign: "center" }}>
      {data.label}
    </div>
  </div>
);

const LoopNode = ({ data }) => (
  <div
    style={{
      padding: "10px 20px",
      borderRadius: "12px",
      background: "#f3e5f5",
      border: "2px dashed #6a1b9a",
      textAlign: "center",
    }}
  >
    {data.label}
  </div>
);

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  process: ProcessNode,
  decision: DecisionNode,
  loop: LoopNode,
};

export default function FlowchartPreview({ graph }) {
  if (!graph || !graph.nodes) {
    return <p style={{ color: "#666" }}>No diagram yet. Click Parse to generate one.</p>;
  }

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB" }); // Top → Bottom (vertical)

  const nodeWidth = 160;
  const nodeHeight = 60;

  // Add nodes to dagre
  graph.nodes.forEach((n) => {
    dagreGraph.setNode(n.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges
  graph.edges.forEach((e) => {
    dagreGraph.setEdge(e.source, e.target);
  });

  dagre.layout(dagreGraph);

  // Map nodes for ReactFlow
  const nodes = graph.nodes.map((n) => {
    const { x, y } = dagreGraph.node(n.id);
    let type = "process";
    const lbl = n.label.toLowerCase();
    if (lbl.includes("start")) type = "start";
    else if (lbl.includes("end")) type = "end";
    else if (lbl.includes("if") || lbl.includes("else")) type = "decision";
    else if (lbl.includes("loop") || lbl.includes("while") || lbl.includes("for")) type = "loop";

    return { id: n.id, data: { label: n.label }, position: { x, y }, type };
  });

  // Map edges for ReactFlow
  const edges = graph.edges.map((e, i) => ({
    id: e.id || `e${i}`,
    source: e.source,
    target: e.target,
    label: e.label || "",
    animated: true,
    style: { stroke: "#333" },
    markerEnd: { type: "arrowclosed" },
  }));

  return (
    <div className="flowchart-preview">
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

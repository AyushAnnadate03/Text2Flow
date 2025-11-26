// client/src/components/FlowRenderer.jsx
import React, { useEffect, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap, Handle } from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";

/**
 * NOTE:
 * - parserService should set node.type to one of:
 *   "start", "end", "decision", "process" (default), "io", "loop"
 * - This renderer will keep those semantic types in data.nodeType and
 *   set node.type = "custom" so ReactFlow uses our CustomNode.
 */

// default sizes (used for dagre layout and styling)
const SIZE_MAP = {
  start: { width: 140, height: 70 },
  end: { width: 140, height: 70 },
  decision: { width: 120, height: 120 },
  io: { width: 180, height: 70 },
  loop: { width: 160, height: 70 },
  process: { width: 180, height: 70 }, // fallback
};

function CustomNode({ data }) {
  // data.nodeType contains semantic type from parserService
  const nodeType = data?.nodeType || "process";
  const label = data?.label || "(empty)";

  // base style
  let style = {
    padding: "6px 10px",
    textAlign: "center",
    fontWeight: 600,
    color: "#222",
    wordWrap: "break-word",
    border: "2px solid #333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    boxSizing: "border-box",
  };

  // apply shape-specific styles
  if (nodeType === "start" || nodeType === "end") {
    // oval / pill (ellipse)
    style = {
      ...style,
      width: `${SIZE_MAP.start.width}px`,
      height: `${SIZE_MAP.start.height}px`,
      borderRadius: "50%",
      background: nodeType === "start" ? "#A7FFEB" : "#FFCDD2",
      border: "2px solid #00796B",
      padding: 8,
    };
  } else if (nodeType === "decision") {
    // diamond: rotate container, rotate text back
    style = {
      ...style,
      width: `${SIZE_MAP.decision.width}px`,
      height: `${SIZE_MAP.decision.height}px`,
      transform: "rotate(45deg)",
      background: "#FFF59D",
      border: "2px solid #F57F17",
      padding: 0,
    };
  } else if (nodeType === "io") {
    // parallelogram
    style = {
      ...style,
      width: `${SIZE_MAP.io.width}px`,
      height: `${SIZE_MAP.io.height}px`,
      clipPath: "polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)",
      background: "#FFE0B2",
      border: "2px solid #FB8C00",
      padding: 8,
    };
  } else if (nodeType === "loop") {
    style = {
      ...style,
      width: `${SIZE_MAP.loop.width}px`,
      height: `${SIZE_MAP.loop.height}px`,
      clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
      background: "#D1C4E9",
      border: "2px solid #512DA8",
      padding: 8,
    };
  } else {
    // process / default
    style = {
      ...style,
      width: `${SIZE_MAP.process.width}px`,
      height: `${SIZE_MAP.process.height}px`,
      borderRadius: "8px",
      background: "#C8E6C9",
      border: "2px solid #2E7D32",
      padding: 8,
    };
  }

  return (
    <div style={{ position: "relative", textAlign: "center" }}>
      <Handle type="target" position="top" />
      <div
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* rotate label back for diamond */}
        <div
          style={{
            transform: nodeType === "decision" ? "rotate(-45deg)" : "none",
            width: "100%",
            padding: "0 8px",
            overflow: "hidden",
          }}
        >
          {label}
        </div>
      </div>
      <Handle type="source" position="bottom" />
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

// layout using dagre, but use the semantic sizes per node
const getLayoutedElements = (nodes, edges) => {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 70, ranksep: 100 });

  // register each node with its semantic size
  nodes.forEach((n) => {
    const semanticType = n.type || "process";
    const size = SIZE_MAP[semanticType] || SIZE_MAP.process;
    g.setNode(n.id, { width: size.width, height: size.height });
  });

  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  const layoutedNodes = nodes.map((n) => {
    const pos = g.node(n.id);
    const semanticType = n.type || "process";
    // preserve original semantic type inside data.nodeType
    const data = {
      ...(n.data || {}),
      nodeType: semanticType,
    };

    return {
      ...n,
      position: { x: pos.x - (SIZE_MAP[semanticType]?.width || 180) / 2, y: pos.y - (SIZE_MAP[semanticType]?.height || 70) / 2 },
      type: "custom", // use our CustomNode
      data,
    };
  });

  const layoutedEdges = edges.map((e) => ({ ...e }));

  return { nodes: layoutedNodes, edges: layoutedEdges };
};

export default function FlowRenderer({ graph }) {
  const [elements, setElements] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    if (graph?.nodes?.length) {
      const layouted = getLayoutedElements(graph.nodes, graph.edges);
      setElements(layouted);
    } else {
      setElements({ nodes: [], edges: [] });
    }
  }, [graph]);

  return (
    <div style={{ width: "100%", height: "640px", background: "#fafafa", padding: 8 }}>
      <ReactFlow
        nodes={elements.nodes}
        edges={elements.edges}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background gap={16} size={1} />
        <MiniMap zoomable pannable />
        <Controls />
      </ReactFlow>
    </div>
  );
}

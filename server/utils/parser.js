// utils/parser.js

/**
 * Rule-based parser for pseudo code → flowchart graph
 * Generates nodes and edges suitable for flowchart rendering
 */

function sanitizeLine(line) {
  return line.replace(/^\s*[-*\d+.]+\s*/, "").trim();
}

function parseToGraph(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const nodes = [];
  const edges = [];
  let idCounter = 1;
  const stack = []; // for handling if/else and loops

  function makeNode(label, type = "process") {
    const id = `n${idCounter++}`;
    nodes.push({ id, label, type });
    return id;
  }

  let prevId = null;

  for (const raw of lines) {
    const line = sanitizeLine(raw);
    const lower = line.toLowerCase();
    let type = "process";

    if (lower.startsWith("start")) type = "start";
    else if (lower.startsWith("end")) type = "end";
    else if (lower.startsWith("if")) type = "decision";
    else if (lower.startsWith("else")) type = "decision";
    else if (lower.startsWith("while") || lower.startsWith("for") || lower.startsWith("repeat")) type = "loop";

    const nodeId = makeNode(line, type);

    // Connect to previous node if applicable
    if (prevId && type !== "start") {
      edges.push({ id: `e${prevId}-${nodeId}`, source: prevId, target: nodeId });
    }

    // Handle decision (if/else) stack
    if (lower.startsWith("if")) {
      stack.push({ type: "if", nodeId });
    } else if (lower.startsWith("else")) {
      const lastIf = [...stack].reverse().find(s => s.type === "if");
      if (lastIf) {
        edges.push({
          id: `e${lastIf.nodeId}-${nodeId}`,
          source: lastIf.nodeId,
          target: nodeId,
          label: "else"
        });
      }
    }

    // Set previous node
    prevId = nodeId;
  }

  return { nodes, edges };
}

module.exports = { parseToGraph };

// utils/aiConverter.js

/**
 * Fake/offline pseudocode generator from plain text
 * Replace this with AI model integration later if needed
 */
function convertToPseudocode(plainText) {
  // Simple rules-based conversion example
  if (!plainText) return "";
  
  // Example: convert simple instructions to pseudo code
  if (plainText.toLowerCase().includes("number")) {
    return `Ask the user for a number
IF number > 0
    Print "Positive"
ELSE
    Print "Non-positive"
END IF
END`;
  }

  return plainText; // fallback
}

/**
 * Rule-based parser: pseudocode → graph nodes & edges
 */
function parseTextToGraph(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const nodes = [];
  const edges = [];
  let prevId = null;
  let idCounter = 1;

  function makeNode(label, type = "process") {
    const id = `n${idCounter++}`;
    nodes.push({ id, label, type });
    return id;
  }

  const stack = [];

  for (const line of lines) {
    let type = "process";
    const lower = line.toLowerCase();

    if (lower.startsWith("start")) type = "start";
    else if (lower.startsWith("end")) type = "end";
    else if (lower.startsWith("if") || lower.startsWith("else")) type = "decision";
    else if (lower.startsWith("while") || lower.startsWith("for") || lower.startsWith("repeat")) type = "loop";

    const nodeId = makeNode(line, type);

    if (prevId && type !== "start") {
      edges.push({ id: `e${prevId}-${nodeId}`, source: prevId, target: nodeId });
    }

    if (lower.startsWith("if")) stack.push(nodeId);
    else if (lower.startsWith("else")) {
      const lastIf = stack[stack.length - 1];
      if (lastIf) edges.push({ id: `e${lastIf}-${nodeId}`, source: lastIf, target: nodeId, label: "else" });
    } else if (lower.startsWith("end") && stack.length) {
      stack.pop();
    }

    prevId = nodeId;
  }

  return { nodes, edges };
}

module.exports = { convertToPseudocode, parseTextToGraph };

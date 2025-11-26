/**
 * Robust pseudocode -> nodes & edges parser
 * - Nodes use data.label (ReactFlow)
 * - Supports START, END, PROCESS:, IF / ELSE / ENDIF, LOOP
 * - Creates Yes/No labels for decision edges and properly connects branch joins
 */

export function parsePseudoCode(pseudo) {
  if (!pseudo || typeof pseudo !== "string") return { nodes: [], edges: [] };

  const lines = pseudo
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const nodes = [];
  const edges = [];
  const stack = []; // frames for IF blocks
  const pendingJoins = []; // holds closed IF frames waiting to join next node

  let nodeCounter = 1;
  let edgeCounter = 1;

  function addNode(label, type = "process") {
    const id = `n${nodeCounter++}`;
    const node = { id, type, data: { label }, position: { x: 0, y: 0 } };
    nodes.push(node);
    return id;
  }

  function addEdge(source, target, label) {
    const id = `e${edgeCounter++}`;
    const edge = { id, source, target };
    if (label) edge.label = label;
    edges.push(edge);
    return id;
  }

  // helper: when a pending join exists, connect it to newNode
  function resolvePendingJoinsTo(newNodeId) {
    while (pendingJoins.length) {
      const frame = pendingJoins.shift();
      // true branch last node -> newNode
      if (frame.trueLast) addEdge(frame.trueLast, newNodeId);
      // false branch last node -> newNode
      if (frame.falseLast) addEdge(frame.falseLast, newNodeId);
      // if there was no false branch, connect decision -> newNode with label "No"
      if (!frame.falseLast) addEdge(frame.decisionId, newNodeId, "No");
    }
  }

  let prev = null;

  for (let rawLine of lines) {
    const line = rawLine;
    const lower = line.toLowerCase();

    // START
    if (lower === "start") {
      const id = addNode("START", "start");
      // if there are pending joins, resolve them into this node
      if (pendingJoins.length) resolvePendingJoinsTo(id);
      // connect previous sequentially if exists
      if (prev && nodes.find(n => n.id === prev)?.type !== "decision") {
        addEdge(prev, id);
      }
      prev = id;
      continue;
    }

    // END
    if (lower === "end") {
      const id = addNode("END", "end");
      if (pendingJoins.length) resolvePendingJoinsTo(id);
      if (prev) addEdge(prev, id);
      prev = id;
      continue;
    }

    // PROCESS:
    if (lower.startsWith("process:") || /^input:|^output:/i.test(lower)) {
      // normalize PROCESS:, INPUT:, OUTPUT:
      const label = line.replace(/^(process:|input:|output:)\s*/i, "");
      const id = addNode(label, "process");
      // if there's a pending join waiting, connect join -> this node
      if (pendingJoins.length) {
        resolvePendingJoinsTo(id);
      } else if (prev) {
        // if prev is a decision node, create labeled edge Yes/No depending on frame state
        const prevNode = nodes.find(n => n.id === prev);
        const topFrame = stack[stack.length - 1];
        if (prevNode && prevNode.type === "decision" && topFrame) {
          const labelEdge = topFrame.state === "true" ? "Yes" : "No";
          addEdge(prev, id, labelEdge);
          // register first/last for branch tracking
          if (topFrame.state === "true") {
            if (!topFrame.trueFirst) topFrame.trueFirst = id;
            topFrame.trueLast = id;
          } else {
            if (!topFrame.falseFirst) topFrame.falseFirst = id;
            topFrame.falseLast = id;
          }
        } else {
          // normal sequential
          addEdge(prev, id);
          // if inside a branch update that branch's last pointer
          const frame = stack[stack.length - 1];
          if (frame) {
            if (frame.state === "true") frame.trueLast = id;
            else frame.falseLast = id;
          }
        }
      }
      prev = id;
      continue;
    }

    // IF condition
    if (lower.startsWith("if")) {
      // strip leading IF and trailing THEN (if present)
      let cond = line.replace(/^if\s*/i, "");
      cond = cond.replace(/\s*then$/i, "").trim();
      if (!cond) cond = "condition";

      const condId = addNode(cond, "decision");

      // if there were pending joins, resolve them into this condition node
      if (pendingJoins.length) resolvePendingJoinsTo(condId);

      // connect previous -> condition
      if (prev) addEdge(prev, condId);

      // push frame
      stack.push({
        decisionId: condId,
        trueFirst: null,
        trueLast: null,
        falseFirst: null,
        falseLast: null,
        state: "true", // start filling true branch
      });

      // set prev to condition node (so next node will link from condition)
      prev = condId;
      continue;
    }

    // ELSE
    if (lower === "else") {
      const top = stack[stack.length - 1];
      if (top) {
        // mark that true branch ended at prev (if prev was inside true branch)
        if (!top.trueLast && prev && prev !== top.decisionId) {
          top.trueLast = prev;
        }
        // switch to false branch
        top.state = "false";
        // set prev back to decision so next node will attach decision->node as No
        prev = top.decisionId;
      }
      continue;
    }

    // ENDIF
    if (lower === "endif") {
      const top = stack.pop();
      if (top) {
        // if the user never provided a false branch, top.falseLast may be null
        // ensure trueLast is recorded (if prev was the last true node)
        if (!top.trueLast && top.trueFirst === null && prev && prev !== top.decisionId) {
          // no real true nodes, nothing to do
        }

        // push into pending joins so next node connects to branch ends
        pendingJoins.push({
          decisionId: top.decisionId,
          trueLast: top.trueLast,
          falseLast: top.falseLast,
        });

        // after ENDIF, we don't set prev to any branch node; next created node will resolve pending join
        prev = null;
      }
      continue;
    }

    // LOOP / WHILE / FOR - treat as process with type loop
    if (/^(loop:|while|for)/i.test(lower) || /loop/i.test(lower)) {
      const id = addNode(line, "loop");
      if (pendingJoins.length) resolvePendingJoinsTo(id);
      else if (prev) addEdge(prev, id);
      prev = id;
      continue;
    }

    // FALLBACK - free text becomes a process node
    {
      const label = line;
      const id = addNode(label, "process");

      if (pendingJoins.length) {
        // If there are pending joins, connect the join branches to this node
        resolvePendingJoinsTo(id);
      } else if (prev) {
        const prevNode = nodes.find(n => n.id === prev);
        const topFrame = stack[stack.length - 1];

        if (prevNode && prevNode.type === "decision" && topFrame) {
          const labelEdge = topFrame.state === "true" ? "Yes" : "No";
          addEdge(prev, id, labelEdge);
          if (topFrame.state === "true") {
            if (!topFrame.trueFirst) topFrame.trueFirst = id;
            topFrame.trueLast = id;
          } else {
            if (!topFrame.falseFirst) topFrame.falseFirst = id;
            topFrame.falseLast = id;
          }
        } else {
          addEdge(prev, id);
          // update branch last if inside a branch
          if (topFrame) {
            if (topFrame.state === "true") topFrame.trueLast = id;
            else topFrame.falseLast = id;
          }
        }
      }

      prev = id;
      continue;
    }
  } // end for lines

  // if any pending joins remain at the end (e.g., missing trailing node), connect them to nothing - we won't add edges
  // return graph
  return { nodes, edges };
}

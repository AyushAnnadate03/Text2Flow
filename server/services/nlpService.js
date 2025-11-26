// server/services/nlpService.js
export async function convertToPseudoCode(text) {
  if (!text || !text.trim()) return "START\nEND";

  const sentences = text.split(".").map(s => s.trim()).filter(Boolean);
  const pseudoLines = ["START"];

  sentences.forEach(line => {
    if (/ask|input|enter/i.test(line)) pseudoLines.push(`PROCESS: ${capitalize(line)}`);
    else if (/print|display|show/i.test(line)) pseudoLines.push(`PROCESS: ${capitalize(line)}`);
    else if (/if\s+.*then/i.test(line) || /if\s+.*else/i.test(line)) {
      const condition = line.match(/if\s+(.*?)\s*(then|else|$)/i)?.[1] ?? "";
      const actions = line.split(/then|else/i);

      pseudoLines.push(`IF ${condition} THEN`);
      if (actions[1]) pseudoLines.push(`  PROCESS: ${capitalize(actions[1].trim())}`);
      if (/else/i.test(line)) {
        pseudoLines.push("ELSE");
        const afterElse = line.split(/else/i)[1];
        if (afterElse) pseudoLines.push(`  PROCESS: ${capitalize(afterElse.trim())}`);
        pseudoLines.push("ENDIF");
      }
    } else if (/while|for each|repeat|loop/i.test(line)) pseudoLines.push(`LOOP: ${capitalize(line)}`);
    else pseudoLines.push(`PROCESS: ${capitalize(line)}`);
  });

  if (!pseudoLines.includes("END")) pseudoLines.push("END");
  return pseudoLines.join("\n");
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

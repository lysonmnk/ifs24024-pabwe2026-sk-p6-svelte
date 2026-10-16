const fs = require("fs");
const cov = require("./coverage/coverage-final.json");
const targets = /Navbar\.svelte|DetailPage\.svelte/;

function snip(src, loc) {
  const lines = src.split("\n");
  const s = loc.start;
  const e = loc.end;
  if (!e || e.line == null) return (lines[s.line - 1] || "").trim();
  if (s.line === e.line) return (lines[s.line - 1] || "").slice(s.column, e.column);
  return (lines[s.line - 1] || "").slice(s.column) + " ...";
}

for (const [file, d] of Object.entries(cov)) {
  if (!targets.test(file)) continue;
  const src = fs.readFileSync(file, "utf8");
  console.log("\n=== " + file);
  for (const [id, n] of Object.entries(d.s)) {
    if (n === 0) {
      const l = d.statementMap[id];
      console.log("STATEMENT baris", l.start.line, "->", snip(src, l));
    }
  }
  for (const [id, n] of Object.entries(d.f)) {
    if (n === 0) {
      const m = d.fnMap[id];
      console.log("FUNGSI    baris", m.loc.start.line, m.name, "->", snip(src, m.loc));
    }
  }
  for (const [id, counts] of Object.entries(d.b)) {
    const m = d.branchMap[id];
    counts.forEach((c, i) => {
      if (c === 0) {
        const l = m.locations[i];
        console.log("CABANG    baris", l.start.line, m.type, "#" + i, "->", snip(src, l));
      }
    });
  }
}
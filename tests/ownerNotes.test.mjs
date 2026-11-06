// tests/ownerNotes.test.mjs — owner's notes in the app (utils/ownerNotes.js, data/ownerNotes.js)
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseNotes, sectionCount, redactEmails } from "../utils/ownerNotes.js";
import { OWNER_NOTES } from "../data/ownerNotes.js";

const md = `# Title
Intro line.

## Group
Tick items.

### Section A
- [ ] first box
  continues here
- [x] done box
Some text.
\`\`\`bash
- [ ] not a box inside code
## not a heading
\`\`\`

## Plain
1. step one
`;
const n = parseNotes(md);
assert.equal(n.title, "Title");
assert.equal(n.intro[0].text, "Intro line.");
assert.deepEqual(n.sections.map((s) => [s.title, s.group]), [["Group", true], ["Section A", false], ["Plain", false]]);
const a = n.sections[1];
assert.equal(a.body[0].type, "check");
assert.equal(a.body[0].text, "first box continues here");
assert.equal(a.body[1].done, true);
assert.equal(a.body[2].type, "md");
assert.ok(a.body[2].text.includes("- [ ] not a box inside code") && a.body[2].text.includes("## not a heading"), "code stays code");
assert.deepEqual(sectionCount(a), { done: 1, total: 2 });
assert.deepEqual(sectionCount(a, { [a.body[0].key]: true, [a.body[1].key]: false }), { done: 1, total: 2 });
assert.deepEqual(sectionCount(a, { [a.body[0].key]: true }), { done: 2, total: 2 });

assert.equal(redactEmails("a me@gmail.com b demo.kid@example.com"), "a (your email) b demo.kid@example.com");

// The bundled notes: both files, parsed, no private email (the bundle ships to every phone).
assert.deepEqual(OWNER_NOTES.map((x) => x.id), ["launch", "testing", "store", "map", "play", "practice", "pilot"]);
OWNER_NOTES.forEach((x) => {
  assert.equal(redactEmails(x.md), x.md, `${x.id}: private email in data/ownerNotes.js`);
  const p = parseNotes(x.md);
  assert.ok(p.sections.length >= (x.id === "store" ? 0 : ["play", "pilot"].includes(x.id) ? 2 : 4), `${x.id}: sections`);
});
const testing = parseNotes(OWNER_NOTES[1].md);
assert.ok(testing.sections.some((s) => s.body.some((b) => b.type === "check")), "testing has boxes");
const stale = ["docs/LAUNCH_CHECKLIST.md", "docs/qa/OWNER_TESTING.md"].some((f, i) => redactEmails(readFileSync(new URL(`../${f}`, import.meta.url), "utf8")) !== OWNER_NOTES[i].md);
if (stale) console.log("ownerNotes: note, data/ownerNotes.js is older than the .md files (run node scripts/genOwnerNotes.mjs before publishing)");
console.log(`ownerNotes tests passed (${OWNER_NOTES.map((x) => `${x.id}: ${parseNotes(x.md).sections.length} sections`).join(", ")})`);

// scripts/genOwnerNotes.mjs — copies the owner's notes into the app (Admin tools → My notes).
// Run before every "eas update": node scripts/genOwnerNotes.mjs
// Private emails are removed: the app bundle ships to every phone.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { redactEmails } from "../utils/ownerNotes.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const NOTES = [
  { id: "launch", title: "Launch checklist", file: "docs/LAUNCH_CHECKLIST.md" },
  { id: "testing", title: "Testing", file: "docs/qa/OWNER_TESTING.md" },
  { id: "store", title: "Store listing", file: "docs/release/STORE_LISTING.md" },
  { id: "map", title: "App map", file: "docs/APP_MAP.md" },
  { id: "play", title: "Play forms", file: "docs/release/PLAY_FORMS_STEPS.md" },
];
const updated = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const notes = NOTES.map(({ id, title, file }) => ({ id, title, md: redactEmails(readFileSync(join(root, file), "utf8")) }));
const out = `// data/ownerNotes.js — made by scripts/genOwnerNotes.mjs from docs/LAUNCH_CHECKLIST.md and docs/qa/OWNER_TESTING.md.
// Don't edit by hand: edit the .md files and run the script again.
export const OWNER_NOTES_UPDATED = ${JSON.stringify(updated)};
export const OWNER_NOTES = ${JSON.stringify(notes, null, 1)};
`;
writeFileSync(join(root, "data/ownerNotes.js"), out);
console.log(`data/ownerNotes.js: ${notes.map((n) => `${n.title} ${Math.round(n.md.length / 1024)} KB`).join(", ")} (updated ${updated})`);

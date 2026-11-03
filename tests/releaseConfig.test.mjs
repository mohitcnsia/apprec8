// Release builds leave out the gitignored .env, so anything read from "@env" is undefined there.
// 20.0.23 shipped without the admin ID and hid the Dashboard. This test keeps that from happening again.
// Run: npm test
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const DIRS = ["screens", "components", "services", "utils", "hooks", "navigation", "context", "config", "data", "store"];
const ALLOWED = ["config/appConfig.js"]; // has a built-in fallback (checked below)

const files = [];
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(js|jsx|ts|tsx)$/.test(e.name)) files.push(p);
  }
};
DIRS.forEach((d) => walk(path.join(ROOT, d)));
["App.js", "AppContent.js"].forEach((f) => fs.existsSync(path.join(ROOT, f)) && files.push(path.join(ROOT, f)));

const usesEnv = files
  .filter((f) => /from\s+["']@env["']/.test(fs.readFileSync(f, "utf8")))
  .map((f) => path.relative(ROOT, f));
assert.deepEqual(usesEnv.filter((f) => !ALLOWED.includes(f)), [], "Only config/appConfig.js may read @env (it is empty in release builds)");

const cfg = fs.readFileSync(path.join(ROOT, "config/appConfig.js"), "utf8");
assert.match(cfg, /export const ADMIN_UID = "[A-Za-z0-9]{28}";/, "ADMIN_UID must be written in the code");
assert.match(cfg, /APPREC8_TEAM_REVIEWER_UID = UID_FROM_ENV \|\| ADMIN_UID;/, "the admin ID must fall back to ADMIN_UID");

console.log(`releaseConfig: ok (${files.length} files checked)`);

// Cross-tab jumps (device walk, 13 Nov): a jump into the Me tab must keep Me's own page underneath
// (`initial: false`), or the Me tab gets stuck on People / "Join your class"; and every
// navigate("<Tab>", { screen }) must name a screen that exists in that tab's stack. Run: npm test
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const files = [];
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith(".js") && files.push(p); });
["screens", "components", "hooks", "utils"].forEach(walk);
const names = (f) => [...readFileSync(f, "utf8").matchAll(/Screen\s+name="([A-Za-z0-9]+)"/g)].map((m) => m[1]);
const stacks = { Profile: names("navigation/ProfileNavigator.js"), Stats: names("navigation/ProgressNavigator.js"), Apprec8: names("navigation/HomeNavigator.js") };

let n = 0;
for (const f of files) {
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(/navigate(?:To)?\("(Profile|Stats|Apprec8)",\s*\{\s*screen:\s*"([A-Za-z0-9]+)"([^}]*)/g)) {
    n++;
    const [, tab, screen, rest] = m;
    assert.ok(stacks[tab].includes(screen), `${f}: "${screen}" is not a screen in the ${tab} tab`);
    if (tab === "Profile") assert.ok(/initial:\s*false/.test(rest), `${f}: jump to Me → ${screen} needs initial: false`);
  }
}
assert.ok(n >= 5, "found the cross-tab jumps");
console.log(`navTargets: ${n} cross-tab jumps ok`);

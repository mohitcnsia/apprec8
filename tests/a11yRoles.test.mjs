// Android throws away the whole screen for an unknown accessibilityRole (2026-11-09: "region" on the Home idea card
// blanked Home and crashed Seema's phone). Only roles React Native supports on Android are allowed.
import assert from "node:assert";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const OK = new Set(["none", "button", "togglebutton", "link", "search", "image", "keyboardkey", "text", "adjustable",
  "imagebutton", "header", "summary", "alert", "checkbox", "combobox", "menu", "menubar", "menuitem", "progressbar",
  "radio", "radiogroup", "scrollbar", "spinbutton", "switch", "tab", "tabbar", "tablist", "timer", "list", "toolbar",
  "grid", "pager", "scrollview", "horizontalscrollview", "viewgroup", "webview", "drawerlayout", "slidingdrawer", "iconmenu"]);

const files = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".js")) files.push(p);
  }
};
["screens", "components", "navigation"].forEach(walk);
files.push("App.js", "AppContent.js");

const bad = [];
for (const f of files) {
  for (const m of readFileSync(f, "utf8").matchAll(/accessibilityRole=\{?["']([a-zA-Z]+)["']/g)) {
    if (!OK.has(m[1])) bad.push(`${f}: ${m[1]}`);
  }
}
assert.deepStrictEqual(bad, [], `Invalid accessibilityRole (blanks the screen on Android): ${bad.join(", ")}`);
console.log(`a11yRoles tests passed (${files.length} files)`);

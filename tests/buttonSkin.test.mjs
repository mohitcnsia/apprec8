// tests/buttonSkin.test.mjs: the three button styles (owner-approved mockup "Apprec8 buttons", 16 Nov 2026).
import assert from "node:assert/strict";
import { buttonLook, SKINS, thumbAlign } from "../utils/buttonSkin.js";

for (const skin of SKINS) for (const isDark of [false, true]) for (const variant of ["primary", "soft", "danger", "chip"]) for (const size of ["sm", "md", "lg"]) for (const iconOnly of [false, true]) {
  const L = buttonLook({ skin, variant, size, isDark, iconOnly });
  const h = L.box.height;
  assert.ok(h >= 36, `${skin}/${variant}/${size}: at least 36 tall (44 with hitSlop)`);
  if (iconOnly) assert.ok(L.box.width >= 44 && L.box.width === L.box.height, "icon buttons are square and ≥ 44");
  assert.ok(!("width" in L.box) || iconOnly, "labelled buttons are only as wide as their words");
  assert.ok(L.text.color && L.iconColor, "always a text colour");
}
// A is soft and round; B has the 3D edge; C is outlined.
assert.equal(buttonLook({ skin: "A", variant: "primary", size: "md" }).box.borderRadius, 22);
assert.ok(buttonLook({ skin: "B", variant: "primary" }).box.borderBottomWidth > 0, "B: pressable edge");
assert.ok(buttonLook({ skin: "C", variant: "soft" }).box.borderWidth > 0, "C: outline");
assert.equal(buttonLook({ skin: "Z" }).box.borderRadius, buttonLook({ skin: "A" }).box.borderRadius, "unknown style falls back to A");
// Dark mode: the main colour is muted, never the bright light-mode purple on black.
assert.notEqual(buttonLook({ isDark: true }).box.backgroundColor, buttonLook({ isDark: false }).box.backgroundColor);
// Chips: selected = filled.
assert.notEqual(buttonLook({ variant: "chip", selected: true }).box.backgroundColor, buttonLook({ variant: "chip", selected: false }).box.backgroundColor);
assert.equal(thumbAlign("left"), "flex-start");
assert.equal(thumbAlign("right"), "flex-end");
console.log("buttonSkin tests passed");

// utils/figures.js: line drawings for picture questions (spec U, owner OK 2026-11-05). Pure: returns SVG text.
// Colours are tokens ({ink}, {soft}, {line}) filled in by themeFigure() at render time, so the same picture is soft on
// the dark theme and dark on the light one. Shapes are drawn on a 60 × 60 grid; transforms are exact (rotate / mirror),
// so a generated question's right answer is right by construction (tests/figures.test.mjs).

/** Shapes with no symmetry (a mirror image never equals a turn of the same shape). */
export const SHAPES = {
  flag: '<path d="M16 8v46" stroke="{ink}" stroke-width="4" stroke-linecap="round"/><path d="M18 10h26l-8 9 8 9H18z" fill="{soft}"/><circle cx="16" cy="54" r="4" fill="{ink}"/>',
  arrowDot: '<path d="M12 30h30M32 18l12 12-12 12" stroke="{ink}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="14" cy="16" r="5" fill="{soft}"/>',
  boot: '<path d="M18 8h12v30h16a6 6 0 0 1 0 12H18z" fill="none" stroke="{ink}" stroke-width="4" stroke-linejoin="round"/><circle cx="24" cy="16" r="3.5" fill="{soft}"/>',
  key: '<circle cx="18" cy="22" r="9" fill="none" stroke="{ink}" stroke-width="4"/><path d="M26 26l20 20M38 38l-6 6M44 44l-5 5" stroke="{ink}" stroke-width="4" stroke-linecap="round"/><circle cx="15" cy="19" r="3" fill="{soft}"/>',
};

/**
 * One drawing of a shape. `turn` = degrees clockwise; `flip` = "mirror" (left ↔ right) or "water" (top ↔ bottom),
 * applied before the turn.
 */
export function figure(shape, { turn = 0, flip = null, size = 60 } = {}) {
  const f = flip === "mirror" ? "translate(60 0) scale(-1 1)" : flip === "water" ? "translate(0 60) scale(1 -1)" : "";
  const t = `rotate(${((turn % 360) + 360) % 360} 30 30)${f ? " " + f : ""}`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 60 60"><g transform="${t}">${SHAPES[shape]}</g></svg>`;
}

/** Normal form of a drawing (turn, flip) so tests can tell whether two drawings look the same. */
export function pose({ turn = 0, flip = null }) {
  // A water image = a mirror image turned 180°.
  let t = ((turn % 360) + 360) % 360;
  let m = false;
  if (flip === "mirror") m = true;
  if (flip === "water") {
    m = true;
    t = (t + 180) % 360;
  }
  return `${m ? "M" : "N"}${t}`;
}

/** A row of drawings for the question (with a dashed "?" box at the end, or a dashed mirror line). */
export function figureRow(items, { ask = true, mirrorLine = null } = {}) {
  const w = 64;
  const n = items.length + (ask ? 1 : 0) + (mirrorLine ? 1 : 0);
  const width = n * w + (n - 1) * 8;
  let x = 0;
  let out = "";
  for (const it of items) {
    out += `<rect x="${x + 1}" y="1" width="${w - 2}" height="${w - 2}" rx="10" fill="none" stroke="{line}" stroke-width="2"/>`;
    out += `<g transform="translate(${x + 2} 2)">${figure(it.shape, it).replace(/^<svg[^>]*>|<\/svg>$/g, "")}</g>`;
    x += w + 8;
    if (mirrorLine === "after-first") {
      out += `<path d="M${x - 4} -6v76" stroke="{soft}" stroke-width="3" stroke-dasharray="6 5"/>`;
    }
  }
  if (ask) {
    out += `<rect x="${x + 1}" y="1" width="${w - 2}" height="${w - 2}" rx="10" fill="none" stroke="{soft}" stroke-width="2" stroke-dasharray="6 5"/>`;
    out += `<text x="${x + w / 2}" y="${w / 2 + 9}" text-anchor="middle" font-size="26" font-weight="bold" fill="{soft}">?</text>`;
  }
  return `<svg width="${width}" height="${w + 4}" viewBox="-2 -8 ${width + 4} ${w + 16}">${out}</svg>`;
}

/** Fills colour tokens; `P` = the quiz palette (components/quiz/quizPalette.js). */
export function themeFigure(svg, P) {
  const ink = P?.text || "#241027";
  const soft = P?.label || "#85508a";
  const line = P?.border || "#E8DCE9";
  return String(svg).replace(/\{ink\}/g, ink).replace(/\{soft\}/g, soft).replace(/\{line\}/g, line);
}

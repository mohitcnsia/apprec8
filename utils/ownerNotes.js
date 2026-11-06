// utils/ownerNotes.js
// The owner's notes in the app (owner 2026-11-06: ".md files are difficult to read on Antigravity"): the launch
// checklist and the testing list, split into folded sections with tickable boxes. Pure; the text comes from
// data/ownerNotes.js (made by scripts/genOwnerNotes.mjs before every publish).

const CHECK = /^\s*[-*] \[( |x|X)\] (.*)$/;
const HEADING = /^(#{1,3}) (.*)$/;

/**
 * Markdown → { title, intro, sections: [{ id, level, title, body: [{ type: "md", text } | { type: "check", key, text, done }], group }] }
 * A level-2 heading with level-3 sections under it is a group label (group: true); every other heading is a folded card.
 */
export function parseNotes(md = "") {
  const lines = String(md).replace(/\r/g, "").split("\n");
  let title = "";
  const intro = [];
  const sections = [];
  let cur = null;
  let inCode = false;

  const push = (type, text, extra = {}) => {
    const body = cur ? cur.body : intro;
    const last = body[body.length - 1];
    if (type === "md" && last?.type === "md") last.text += "\n" + text;
    else body.push({ type, text, ...extra });
  };

  lines.forEach((line) => {
    if (/^\s*```/.test(line)) inCode = !inCode;
    const h = !inCode && line.match(HEADING);
    if (h && h[1].length === 1 && !title) {
      title = h[2].trim();
      return;
    }
    if (h && h[1].length >= 2) {
      cur = { id: `s${sections.length}`, level: h[1].length, title: h[2].trim(), body: [] };
      sections.push(cur);
      return;
    }
    const c = !inCode && line.match(CHECK);
    if (c) {
      push("check", c[2].trim(), { done: c[1] !== " " });
      return;
    }
    const body = cur ? cur.body : intro;
    const last = body[body.length - 1];
    // An indented line right after a box continues its text.
    if (!inCode && last?.type === "check" && /^\s{2,}\S/.test(line)) {
      last.text += " " + line.trim();
      return;
    }
    push("md", line);
  });

  const clean = (body) =>
    body
      .map((b) => (b.type === "md" ? { ...b, text: b.text.trim() } : b))
      .filter((b) => b.type !== "md" || b.text);
  sections.forEach((s, i) => {
    s.body = clean(s.body);
    s.group = s.level === 2 && sections[i + 1]?.level === 3;
    s.body.forEach((b) => {
      if (b.type === "check") b.key = `${s.title}::${b.text}`.slice(0, 200);
    });
  });
  return { title, intro: clean(intro), sections };
}

/** Boxes in a section: { done, total }, with the phone's own ticks (ticks: { key: true|false }) over the file's [x]. */
export function sectionCount(section, ticks = {}) {
  const boxes = section.body.filter((b) => b.type === "check");
  const done = boxes.filter((b) => (b.key in ticks ? ticks[b.key] : b.done)).length;
  return { done, total: boxes.length };
}

/** Removes private email addresses (the bundle ships to every phone); made-up @example.com logins stay. */
export const redactEmails = (text = "") =>
  String(text).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, (m) => (/@example\.com$/i.test(m) ? m : "(your email)"));

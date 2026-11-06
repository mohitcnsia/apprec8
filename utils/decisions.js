// utils/decisions.js
// The owner's Decisions inbox (owner 2026-11-06: "get approval on the app itself… Yes, No, More details, Later").
// Claude writes questions in docs/agents/decisions.json; scripts/admin/decisions.cjs copies new ones to Firestore
// `ownerDecisions/{id}` and sends one push to the owner's phone; the owner taps an answer in Me → Decisions; the script
// copies the answers back into decisions.json. Pure, so tests can check it (the script and the app both use it).

export const ANSWERS = [
  { id: "yes", label: "YES", emoji: "👍" },
  { id: "no", label: "NO", emoji: "✋" },
  { id: "more", label: "MORE DETAILS", emoji: "❓" },
  { id: "later", label: "LATER", emoji: "⏰" },
];
export const answerLabel = (id) => ANSWERS.find((a) => a.id === id)?.label || "";

const LATER_MS = 24 * 3600 * 1000;

/** A question from decisions.json is valid when it has an id, a title and a one-line ask. */
export function validQuestion(q) {
  return !!q && /^[a-z0-9-]{3,60}$/.test(q.id || "") && typeof q.title === "string" && q.title.trim().length > 0 && typeof q.ask === "string" && q.ask.trim().length > 0;
}

/** The Firestore doc for a new question (createdAt = the caller's server timestamp). */
export function questionDoc(q, createdAt) {
  return {
    title: q.title.trim().slice(0, 120),
    ask: q.ask.trim().slice(0, 400),
    details: String(q.details || "").slice(0, 6000),
    link: /^https:\/\//.test(q.link || "") ? q.link : null,
    from: q.from === "gemini" ? "gemini" : "claude",
    status: "open",
    answer: null,
    note: null,
    pushedAt: null, // set by the script once a notification went out (it waits until the owner's phone is registered)
    createdAt,
  };
}

/** Questions in decisions.json that aren't in Firestore yet. */
export const newQuestions = (list = [], existingIds = []) => {
  const have = new Set(existingIds);
  return list.filter((q) => validQuestion(q) && !q.answer && !have.has(q.id));
};

/** What the owner's tap writes. "Later" keeps it open but hides it for a day; "More details" = Claude explains more. */
export function answerPatch(answer, note, now = Date.now()) {
  if (!ANSWERS.some((a) => a.id === answer)) throw new Error("Unknown answer");
  const n = String(note || "").trim().slice(0, 500);
  return {
    answer,
    note: n || null,
    status: answer === "later" ? "later" : "answered",
    answeredAt: now,
    laterUntil: answer === "later" ? now + LATER_MS : null,
  };
}

/** Sorts the inbox: waiting first (oldest first), then "later" ones whose day is over, then the rest folded. */
export function inbox(docs = [], now = Date.now()) {
  const waiting = [];
  const later = [];
  const done = [];
  for (const d of docs) {
    if (d.status === "open" || (d.status === "later" && (d.laterUntil || 0) <= now)) waiting.push(d);
    else if (d.status === "later") later.push(d);
    else done.push(d);
  }
  const t = (d) => d.createdAt || 0;
  waiting.sort((a, b) => t(a) - t(b));
  done.sort((a, b) => (b.answeredAt || 0) - (a.answeredAt || 0));
  return { waiting, later, done: done.slice(0, 10) };
}

/** Copies answers from Firestore into the decisions.json list (the script writes the file). */
export function mergeAnswers(list = [], docs = []) {
  const byId = new Map(docs.map((d) => [d.id, d]));
  return list.map((q) => {
    const d = byId.get(q.id);
    if (!d || !d.answer) return q;
    return { ...q, answer: d.answer, note: d.note || null, answeredAt: new Date(d.answeredAt).toISOString() };
  });
}

/** The one push for new questions. */
export function pushText(fresh = []) {
  const n = fresh.length;
  if (!n) return null;
  return {
    title: n === 1 ? "Apprec8: 1 decision for you" : `Apprec8: ${n} decisions for you`,
    body: n === 1 ? fresh[0].title : `${fresh[0].title} + ${n - 1} more. Tap: Yes, No, More details or Later.`,
  };
}

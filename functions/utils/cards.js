// functions/utils/cards.js: cards and team tasks (owner-approved mockup "Apprec8 cards and team tasks", 16 Nov 2026).
// Pure helpers (tested in tests/cards.test.mjs): what a card may contain, who it reaches, one card push a day.
const { kindOf } = require("./people");

const KINDS = ["safety", "story", "fact", "task", "other"];
const AUDIENCES = ["parents", "children", "class", "everyone", "people"];
const HATS = ["admin", "teacher", "counsellor", null];
const MAX_CARDS = 8;
const clean = (s, max) => String(s || "").replace(/\s+\n/g, "\n").trim().slice(0, max);

/** → a clean card or throws Error(message for the sender). */
function cleanCard(input = {}) {
  const kind = KINDS.includes(input.kind) ? input.kind : "other";
  const title = clean(input.title, 80);
  const text = clean(input.text, 220);
  if (!title) throw new Error("Give the card a title.");
  // The card's pages are study cards (owner 16 Nov: "it is supposed to have questions too"): the same idea / check
  // shapes as utils/learnCards.js, so the app shows them with the study-card screen.
  const cards = (Array.isArray(input.cards) ? input.cards : [])
    .map((c) => {
      if (c?.kind === "check") {
        const wrong = (Array.isArray(c.wrong) ? c.wrong : []).map((w) => clean(w, 120)).filter(Boolean).slice(0, 3);
        const q = { kind: "check", question: clean(c.question, 200), answer: clean(c.answer, 120), wrong, explain: clean(c.explain, 300) || null };
        return q.question && q.answer && wrong.length ? q : null;
      }
      const idea = { kind: "idea", title: clean(c?.title, 80), text: clean(c?.text, 600) };
      return idea.title && idea.text ? idea : null;
    })
    .filter(Boolean)
    .slice(0, MAX_CARDS);
  const moreQuestId = typeof input.moreQuestId === "string" && /^[a-z0-9-]{2,40}$/.test(input.moreQuestId) ? input.moreQuestId : null;
  const hat = HATS.includes(input.hat) ? input.hat : null;
  const dueAt = kind === "task" && Number.isFinite(input.dueAt) && input.dueAt > 0 ? Math.round(input.dueAt) : null;
  return { kind, title, text, cards, moreQuestId, hat, dueAt, push: !!input.push };
}

/** Does this user (users/{uid} data) belong to the group? ("class" and "people" are resolved by id elsewhere.) */
function inAudience(doc = {}, type) {
  const kind = kindOf(doc);
  if (type === "parents") return kind === "parent" || doc.isParent === true;
  if (type === "children") return kind === "child" || kind === "student";
  if (type === "everyone") return true;
  return false;
}

/** One card notification a day per person (owner: never feel like spam). day = India-time "YYYY-MM-DD". */
const canPushToday = (lastDay, day) => lastDay !== day;

module.exports = { KINDS, AUDIENCES, MAX_CARDS, cleanCard, inAudience, canPushToday };

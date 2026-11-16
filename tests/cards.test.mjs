// tests/cards.test.mjs: cards and team tasks (owner 16 Nov 2026).
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { cleanCard, inAudience, canPushToday } = require("../functions/utils/cards.js");

const c = cleanCard({ kind: "safety", title: "  ऑनलाइन ठगी से कैसे बचें ", text: "OTP कभी न बताएँ", cards: [{ title: "1", text: "a" }, {}, { kind: "check", question: "OTP?", answer: "Never", wrong: ["Bank", "Police"] }, { kind: "check", question: "no wrongs", answer: "x" }, { title: "2", text: "b" }], moreQuestId: "bharat-quest", push: 1 });
assert.equal(c.title, "ऑनलाइन ठगी से कैसे बचें");
assert.equal(c.cards.length, 3, "idea + check cards kept, broken ones dropped");
assert.equal(c.cards[1].kind, "check");
assert.equal(c.push, true);
assert.equal(cleanCard({ title: "x", kind: "nope" }).kind, "other");
assert.equal(cleanCard({ title: "x", moreQuestId: "https://evil.example" }).moreQuestId, null, "only in-app quests");
assert.throws(() => cleanCard({ title: "  " }), /title/);
assert.equal(cleanCard({ title: "x", kind: "fact", dueAt: 5 }).dueAt, null, "only tasks have a due date");
assert.ok(cleanCard({ title: "x", kind: "task", dueAt: 5 }).dueAt);

assert.ok(inAudience({ childUids: ["k"] }, "parents"));
assert.ok(inAudience({ isParent: true }, "parents"));
assert.ok(!inAudience({ grade: 5 }, "parents"));
assert.ok(inAudience({ grade: 5 }, "children") && inAudience({ isChild: true }, "children"));
assert.ok(!inAudience({ teachesClassIds: ["c"], grade: 10 }, "children"), "teachers aren't children");
assert.ok(inAudience({}, "everyone"));
assert.ok(canPushToday("2026-11-16", "2026-11-17") && !canPushToday("2026-11-17", "2026-11-17"), "one card push a day");
console.log("cards tests passed");

// Starters must survive the server's cleaning unchanged (every page kept, every question valid).
{
  const { CARD_STARTERS } = await import("../data/cardStarters.js");
  for (const s of CARD_STARTERS) {
    const c = cleanCard(s.card);
    assert.equal(c.cards.length, s.card.cards.length, `${s.id}: every page kept`);
    for (const q of c.cards.filter((x) => x.kind === "check")) assert.ok(!q.wrong.includes(q.answer), `${s.id}: answer not among the wrong ones`);
  }
  console.log("card starters tests passed");
}

// Owner 16 Nov: every non-task starter = 2–3 reading pages + 2–5 questions (about 5 minutes, a few stars).
{
  const { CARD_STARTERS } = await import("../data/cardStarters.js");
  for (const s of CARD_STARTERS.filter((x) => x.card.kind !== "task")) {
    const ideas = s.card.cards.filter((c) => c.kind === "idea").length;
    const qs = s.card.cards.filter((c) => c.kind === "check").length;
    assert.ok(ideas >= 2 && ideas <= 3, `${s.id}: 2–3 reading pages (has ${ideas})`);
    assert.ok(qs >= 2 && qs <= 5, `${s.id}: 2–5 questions (has ${qs})`);
  }
  console.log("starter size tests passed");
}

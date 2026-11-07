// tests/feedbackPipeline.test.mjs
// Tests for pure feedback pipeline logic (G66).

import assert from "node:assert/strict";
import {
  IDEA_PROMPTS,
  pickWeeklyPrompt,
  shouldShowWeeklyPrompt,
  buildIdeaPayload,
  redactFeedbackForExport,
  SEVEN_DAYS_MS,
} from "../utils/feedbackPipeline.js";

// 1. Prompts Structure
assert.equal(IDEA_PROMPTS.length, 3, "must have exactly 3 core idea prompts");
for (const p of IDEA_PROMPTS) {
  assert.ok(p.id, "prompt must have id");
  assert.ok(p.question, "prompt must have question");
  assert.equal(p.choices.length, 4, "prompt must have 4 tap choices for kids");
  for (const c of p.choices) {
    assert.ok(c.id && c.text && c.emoji, "each choice must have id, text, and emoji");
  }
}

// 2. Weekly Prompt Picker
const p0 = pickWeeklyPrompt({ index: 0 });
assert.equal(p0.id, "other_apps");
const p1 = pickWeeklyPrompt({ index: 1 });
assert.equal(p1.id, "what_to_add");
const p2 = pickWeeklyPrompt({ index: 2 });
assert.equal(p2.id, "whats_boring");
const p3 = pickWeeklyPrompt({ index: 3 });
assert.equal(p3.id, "other_apps", "rotates cleanly");

// 3. Frequency Guard
const now = 1700000000000;
assert.equal(shouldShowWeeklyPrompt({ lastPromptAt: 0, now }), true, "never shown before -> show");
assert.equal(shouldShowWeeklyPrompt({ lastPromptAt: now - 1000, now }), false, "1 sec ago -> do not show");
assert.equal(shouldShowWeeklyPrompt({ lastPromptAt: now - SEVEN_DAYS_MS + 1000, now }), false, "just under 7 days -> do not show");
assert.equal(shouldShowWeeklyPrompt({ lastPromptAt: now - SEVEN_DAYS_MS, now }), true, "7 days elapsed -> show");
assert.equal(shouldShowWeeklyPrompt({ lastPromptAt: now - SEVEN_DAYS_MS * 2, now }), true, "14 days elapsed -> show");

// 4. Payload Builder
assert.throws(() => buildIdeaPayload(), /userId is required/);

const payload = buildIdeaPayload({
  userId: "user_pratha_123",
  userName: "Pratha Chilkoti",
  userGrade: 5,
  promptId: "other_apps",
  promptQuestion: "What do you love in another app?",
  choiceId: "mini_games",
  selectedChoice: "Mini-games & puzzles",
  choiceEmoji: "🎮",
  note: "Duolingo has daily puzzles and streak freeze",
  entryPoint: "home_idea_prompt",
  appVersion: "20.0.30",
});

assert.equal(payload.userId, "user_pratha_123");
assert.equal(payload.userName, "Pratha", "must store first name only");
assert.equal(payload.userGrade, 5);
assert.equal(payload.feedbackType, "idea");
assert.equal(payload.entryPoint, "home_idea_prompt");
assert.equal(payload.selectedChoice, "Mini-games & puzzles");
assert.equal(payload.choiceEmoji, "🎮");
assert.equal(payload.feedbackText, "Duolingo has daily puzzles and streak freeze");
assert.equal(payload.status, "new");
assert.equal(payload.appVersion, "20.0.30");

// Truncation check
const longNote = "x".repeat(450);
const pTrunc = buildIdeaPayload({
  userId: "u1",
  note: longNote,
});
assert.equal(pTrunc.feedbackText.length, 300, "note must be truncated to 300 chars");

// 5. Privacy Redaction for Claude's Export
const rawDoc = {
  id: "fb_doc_999",
  userId: "PRIVATE_UID_DO_NOT_EXPORT",
  userName: "Pratha Sharma",
  userEmail: "pratha@example.com", // sensitive
  userGrade: 5,
  feedbackType: "idea",
  promptQuestion: "What do you love in another app?",
  selectedChoice: "Cool badges & avatar outfits",
  choiceEmoji: "🏆",
  feedbackText: "I want a cute hat for Chamku",
  status: "new",
  entryPoint: "me_idea",
  clientTimestamp: "2026-11-07T12:00:00.000Z",
};

const redacted = redactFeedbackForExport(rawDoc);
assert.equal(redacted.id, "fb_doc_999");
assert.equal(redacted.type, "idea");
assert.equal(redacted.name, "Pratha", "only first name");
assert.equal(redacted.class, 5);
assert.equal(redacted.choice, "🏆 Cool badges & avatar outfits");
assert.equal(redacted.note, "I want a cute hat for Chamku");
assert.equal(redacted.status, "new");
assert.equal(redacted.userId, undefined, "userId must be stripped");
assert.equal(redacted.userEmail, undefined, "userEmail must be stripped");

console.log("feedbackPipeline tests passed");

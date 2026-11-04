// Tests for utils/progressView.js (kid Progress tab). Run: npm test
import assert from "node:assert/strict";
import * as D from "../data/englishQuestData.js";
import { weekStrip, greatTopics, topicNamer, questSummary } from "../utils/progressView.js";
import { dayKey } from "../utils/kidStats.js";

const DAY = 24 * 60 * 60 * 1000;
const now = new Date(2026, 10, 4, 9, 30).getTime(); // Wed 4 Nov 2026

// weekStrip: Mon 2 Nov .. Sun 8 Nov, Wednesday is today
const daily = { [dayKey(now)]: { answered: 3 }, [dayKey(now - 2 * DAY)]: { answered: 1 }, [dayKey(now - 3 * DAY)]: { answered: 9 } };
const w = weekStrip(daily, now);
assert.equal(w.length, 7);
assert.equal(w[0].key, "2026-11-02");
assert.equal(w[6].key, "2026-11-08");
assert.deepEqual(w.map((d) => d.played), [true, false, true, false, false, false, false]); // Sun 1 Nov is last week
assert.equal(w[2].isToday, true);
assert.equal(w[3].isFuture, true);
assert.equal(w[1].isFuture, false);
// Sunday belongs to the week that started on Monday
const sunday = new Date(2026, 10, 8, 20).getTime();
assert.equal(weekStrip({}, sunday)[0].key, "2026-11-02");

// greatTopics: >= 5 answers and >= 85%
const stats = {
  bySubtopic: {
    nouns: { correct: 9, total: 10 },
    tiny: { correct: 4, total: 4 },
    "kinds-of-sentences": { correct: 19, total: 20 },
    weak: { correct: 2, total: 10 },
  },
};
assert.deepEqual(greatTopics(stats).map((t) => t.subtopic), ["kinds-of-sentences", "nouns"]);
assert.deepEqual(greatTopics({}), []);

// topicNamer: gate titles, main titles by slug, tidy fallback
const name = topicNamer(D.nodes);
assert.equal(name("kinds-of-sentences"), "Kinds of sentences");
assert.equal(name("made-up-topic"), "Made up topic");
const someGate = D.nodes.find((n) => n.kind === "gate" && n.subtopicTitles);
const [sid, stitle] = Object.entries(someGate.subtopicTitles)[0];
assert.equal(name(sid), stitle);

// questSummary on the real content: a new kid has 0 cleared and is on the first topic
const s0 = questSummary(D.nodes, {});
assert.equal(s0.cleared, 0);
assert.ok(s0.total >= 10, `expected many topics, got ${s0.total}`);
assert.ok(s0.current);
assert.equal(s0.unitOrder, 0);

console.log("progressView tests passed");

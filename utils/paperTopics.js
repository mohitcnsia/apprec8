// utils/paperTopics.js
// G91 (pilot piece 1, 2026-11-10): the week-1 check-up. Any paper gives an Accuracy per topic (owner's word), weakest
// first; a topic under 60% is "Practise this" (owner's cut-off, 2026-11-09). Same scoring every time. Pure.
import { paperQuestions } from "./paperScore.js";

export const WEAK_BELOW = 60;

/** → [{ quest, node, right, total, accuracy, weak }] sorted weakest first (ties: more questions first, then paper order). */
export function topicAccuracy(paper, answers = {}) {
  const map = new Map();
  paperQuestions(paper).forEach(({ id, number, question }) => {
    const t = question.topic;
    if (!t?.quest || !t?.node) return;
    const key = `${t.quest}/${t.node}`;
    const row = map.get(key) || { quest: t.quest, node: t.node, right: 0, total: 0, firstAt: number };
    row.total++;
    if (answers[id] === question.answer) row.right++;
    map.set(key, row);
  });
  return [...map.values()]
    .map(({ firstAt, ...r }) => {
      const accuracy = Math.round((r.right / r.total) * 100);
      return { ...r, accuracy, weak: accuracy < WEAK_BELOW, firstAt };
    })
    .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total || a.firstAt - b.firstAt)
    .map(({ firstAt, ...r }) => r);
}

/** The callable failed: was it the internet? (no NetInfo in this build, so we read the error) */
export function looksOffline(err) {
  const s = `${err?.code || ""} ${err?.message || ""}`.toLowerCase();
  return /unavailable|network|offline|internet|timeout|timed out|deadline/.test(s);
}

/** What the kid's progress doc keeps per check-up: { at, topics: { node: [right, total] } }. */
export function checkupRecord(topics = [], at = Date.now()) {
  return { at, topics: Object.fromEntries(topics.map((t) => [t.node, [t.right, t.total]])) };
}

/**
 * G91: Seema sees the whole class by topic. kids: [{ firstName, checkups: { paperId: record } }] (each kid's latest check-up).
 * → { took, topics: [{ node, right, total, accuracy, weakKids: [names] }] } weakest first.
 */
export function classCheckup(kids = []) {
  const byNode = new Map();
  let took = 0;
  for (const kid of kids) {
    const recs = Object.values(kid?.checkups || {});
    if (!recs.length) continue;
    took++;
    const latest = recs.reduce((a, b) => ((b?.at || 0) > (a?.at || 0) ? b : a));
    for (const [node, [right, total]] of Object.entries(latest.topics || {})) {
      if (!total) continue;
      const row = byNode.get(node) || { node, right: 0, total: 0, weakKids: [] };
      row.right += right;
      row.total += total;
      if (Math.round((right / total) * 100) < WEAK_BELOW) row.weakKids.push(kid.firstName || "A child");
      byNode.set(node, row);
    }
  }
  const topics = [...byNode.values()]
    .map((r) => ({ ...r, accuracy: Math.round((r.right / r.total) * 100) }))
    .sort((a, b) => a.accuracy - b.accuracy || b.weakKids.length - a.weakKids.length);
  return { took, topics };
}

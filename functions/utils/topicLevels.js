// functions/utils/topicLevels.js: the server's copy of levelOf / levelsFromStats from utils/topicLevels.js (the app's,
// ES modules). Same rules; tests/topicLevels.test.mjs checks both give the same answers.
const LEARNED_SHARE = 0.8;
const RECHECK_MIN = 3;
const SLIP_BELOW = 0.6;
const LEVEL_CODE = { new: "n", practising: "p", learned: "l", remembers: "r", slipping: "s" };

function levelOf(entry, { answered = 0 } = {}) {
  if (!entry) return answered > 0 ? "practising" : "new";
  if (!entry.learnedAt) return (entry.seen && entry.seen.length) || answered > 0 ? "practising" : "new";
  const r = entry.recheck || [];
  if (r.length >= RECHECK_MIN) {
    const share = r.reduce((x, y) => x + y, 0) / r.length;
    if (share >= LEARNED_SHARE) return "remembers";
    if (share < SLIP_BELOW) return "slipping";
  }
  return "learned";
}

function levelsFromStats(stats = {}) {
  const out = {};
  const topics = new Set([...Object.keys(stats.bySubtopic || {}), ...Object.keys(stats.levels || {})]);
  topics.forEach((t) => {
    out[t] = levelOf((stats.levels || {})[t], { answered: ((stats.bySubtopic || {})[t] || {}).total || 0 });
  });
  return out;
}

module.exports = { levelOf, levelsFromStats, LEVEL_CODE };

// functions/utils/paperStars.js: stars for a finished practice paper (owner 2026-11-05: "there must be some good rewards
// for completing such a large paper"). Pure, so tests can check it.
//   10 stars for finishing (at least 80% of the questions answered, so a blank submit earns nothing)
//   + up to 20 for marks (score / max × 20, rounded)
//   at most once per paper every 7 days (like the 7-day rule for quizzes: no farming by re-sitting the same paper).

const PAPER_REWARD_GAP_MS = 7 * 24 * 60 * 60 * 1000;

function paperStars({ score, max, answered, total, lastRewardMs = null, nowMs }) {
  if (!(max > 0) || !(total > 0)) return 0;
  if (lastRewardMs != null && nowMs - lastRewardMs < PAPER_REWARD_GAP_MS) return 0;
  if (!(answered >= Math.ceil(total * 0.8))) return 0;
  const s = Math.min(Math.max(score, 0), max);
  return 10 + Math.round((s / max) * 20);
}

module.exports = { paperStars, PAPER_REWARD_GAP_MS };

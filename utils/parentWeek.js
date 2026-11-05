// utils/parentWeek.js
// A parent's "week at a glance" for one child (mockups V2/V3, approved by the owner and Seema 2026-11-05). Pure.
// Input: the child's questProgress docs (stats + nodes) and the bundled quest nodes. English and Hindi words; the
// owner checks the Hindi (he reads both well). Topic names stay as the app shows them.

import { summarize, accuracy, weakTopics, dayKey } from "./kidStats.js";
import { nodesForGrade } from "./gradeFilter.js";

const DAY = 24 * 60 * 60 * 1000;

export const WORDS = {
  en: {
    title: (n) => `${n}'s week`,
    thisWeek: "THIS WEEK",
    practised: (d, t) => `Practised ${d} of 7 days · ${t}`,
    more: (t) => `↑ ${t} more than last week`,
    less: (t) => `${t} less than last week`,
    strong: "Strong",
    practise: "Practise",
    next: "Next",
    allDone: "All topics done",
    home: "ONE THING TO DO AT HOME",
    homeTip: (topic) => `Ask your child to explain “${topic}” to you in their own words. Two minutes is enough.`,
    homeNone: "Ask your child what they learnt today and what was hard. Listen more than you correct.",
    tipFrom: "Seema's suggestion",
    days: ["M", "T", "W", "T", "F", "S", "S"],
    nothing: (n) => `${n} didn't practise this week. A short, friendly reminder helps more than a long talk.`,
    min: (m) => (m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`),
    missed: (n) => `Questions to talk about (${n})`,
    topicMiss: (topic) => `A Challenge question about “${topic}”`,
  },
  hi: {
    title: (n) => `${n} का हफ़्ता`,
    thisWeek: "इस हफ़्ते",
    practised: (d, t) => `7 में से ${d} दिन अभ्यास · ${t}`,
    more: (t) => `↑ पिछले हफ़्ते से ${t} ज़्यादा`,
    less: (t) => `पिछले हफ़्ते से ${t} कम`,
    strong: "मज़बूत",
    practise: "अभ्यास करें",
    next: "अगला",
    allDone: "सभी टॉपिक पूरे",
    home: "घर पर एक काम",
    homeTip: (topic) => `बच्चे से कहें कि “${topic}” आपको अपने शब्दों में समझाए। दो मिनट काफ़ी हैं।`,
    homeNone: "बच्चे से पूछें कि आज क्या सीखा और क्या मुश्किल लगा। टोकने से ज़्यादा सुनें।",
    tipFrom: "सीमा की सलाह",
    days: ["सो", "मं", "बु", "गु", "शु", "श", "र"],
    nothing: (n) => `${n} ने इस हफ़्ते अभ्यास नहीं किया। लंबी बात से ज़्यादा एक छोटी, प्यार भरी याद दिलाना काम करता है।`,
    min: (m) => (m >= 60 ? `${Math.floor(m / 60)} घंटा ${m % 60} मिनट` : `${m} मिनट`),
    missed: (n) => `बात करने के लिए सवाल (${n})`,
    topicMiss: (topic) => `“${topic}” पर एक चैलेंज सवाल`,
  },
};

// Draft tips for parents: Seema reviews the wording (she is a teacher and psychologist). One per week, in turn.
export const TIPS = {
  en: [
    "Praise the effort, not the marks. “You practised 5 days!” works better than “Why only 70%?”",
    "Mistakes are how children learn. Ask “What did you learn from this one?” instead of “Why did you get it wrong?”",
    "Short and often beats long and rare: 15 minutes a day helps more than 2 hours on Sunday.",
    "Before exams, sleep matters as much as study. Help your child stop by bedtime.",
  ],
  hi: [
    "अंकों की नहीं, मेहनत की तारीफ़ करें। “तुमने 5 दिन अभ्यास किया!” “सिर्फ़ 70% क्यों?” से बेहतर है।",
    "बच्चे गलतियों से ही सीखते हैं। “गलत क्यों किया?” की जगह पूछें “इससे क्या सीखा?”",
    "थोड़ा पर रोज़, बहुत पर कभी-कभी से बेहतर है: रोज़ 15 मिनट, रविवार के 2 घंटों से ज़्यादा काम आते हैं।",
    "परीक्षा से पहले नींद भी पढ़ाई जितनी ज़रूरी है। सोने के समय तक पढ़ाई रुकवाने में मदद करें।",
  ],
};

/** Monday-first flags for the last 7 days ending today: [{ label, on }]. */
function weekDays(statsList, now, words) {
  const out = [];
  for (let i = 6; i >= 0; i--) {
    const ms = now - i * DAY;
    const key = dayKey(ms);
    const on = statsList.some((s) => (s?.daily?.[key]?.answered || 0) > 0);
    const dow = (new Date(ms).getDay() + 6) % 7; // Monday = 0
    out.push({ key, label: words.days[dow], on });
  }
  return out;
}

function prevWeekMs(stats, now) {
  let ms = 0;
  for (let i = 7; i < 14; i++) ms += stats?.daily?.[dayKey(now - i * DAY)]?.timeMs || 0;
  return ms;
}

/** Strongest sub-topic: 80%+ with 5+ answers. */
function strongest(stats, namer) {
  const best = Object.entries(stats?.bySubtopic || {})
    .filter(([, v]) => v.total >= 5 && v.correct / v.total >= 0.8)
    .sort((a, b) => b[1].correct / b[1].total - a[1].correct / a[1].total || b[1].total - a[1].total)[0];
  return best ? namer(best[0]) : null;
}

/**
 * @param {{ name: string, grade: number|null, quests: Array<{questId, title, stats, nodes, questNodes, namer}>, now?: number, lang?: "en"|"hi", weekIndex?: number }} p
 */
export function parentWeek({ name, grade = null, quests = [], now = Date.now(), lang = "en", weekIndex = 0 }) {
  const w = WORDS[lang] || WORDS.en;
  const statsList = quests.map((q) => q.stats || {});
  const days = weekDays(statsList, now, w);
  const daysOn = days.filter((d) => d.on).length;
  const timeMs = statsList.reduce((s, st) => s + summarize(st, "week", now).timeMs, 0);
  const prevMs = statsList.reduce((s, st) => s + prevWeekMs(st, now), 0);
  const min = Math.round(timeMs / 60000);
  const delta = Math.round((timeMs - prevMs) / 60000);

  const subjects = quests
    .map((q) => {
      const namer = q.namer || ((x) => x);
      const weak = weakTopics(q.stats || {})[0];
      const mains = nodesForGrade(q.questNodes || [], grade).filter((n) => n.kind === "main");
      const done = mains.filter((n) => q.nodes?.[n.id]?.status === "completed").length;
      const next = mains.find((n) => q.nodes?.[n.id]?.status !== "completed");
      const week = summarize(q.stats || {}, "week", now);
      return {
        questId: q.questId,
        title: q.title,
        answered: week.answered,
        accuracy: accuracy(week),
        strong: strongest(q.stats, namer),
        practise: weak ? namer(weak.subtopic) : null,
        done,
        total: mains.length,
        next: next ? next.title : null,
      };
    })
    .filter((s) => s.answered > 0 || s.done > 0);

  const weakest = subjects.find((s) => s.practise)?.practise || null;
  const tips = TIPS[lang] || TIPS.en;
  return {
    title: w.title(name),
    days,
    daysOn,
    timeText: w.practised(daysOn, w.min(min)),
    deltaText: delta >= 5 ? w.more(w.min(delta)) : delta <= -5 ? w.less(w.min(-delta)) : null,
    deltaUp: delta >= 5,
    subjects,
    home: weakest ? w.homeTip(weakest) : w.homeNone,
    tip: tips[((weekIndex % tips.length) + tips.length) % tips.length],
    nothingText: daysOn === 0 ? w.nothing(name) : null,
    words: w,
  };
}

/** Week number since 2026-01-05 (a Monday): picks this week's tip. */
export const weekIndexOf = (now = Date.now()) => Math.floor((now - new Date(2026, 0, 5).getTime()) / (7 * DAY));

/**
 * The child's latest mistakes for the parent (mockup V2 "see the questions she missed"), from the progress docs'
 * "My mistakes" maps: no extra reads. Challenge/Boss mistakes are topics only (their exact questions stay secret).
 * @param {Array<{ questId, mistakes, quizzes, namer }>} quests - quizzes = the bundled quest's quizzes
 * @returns [{ key, kind: "question"|"topic", text, answer?, topic, at }]
 */
export function missedQuestions(quests = [], max = 5) {
  const out = [];
  quests.forEach((q) => {
    Object.entries(q.mistakes || {}).forEach(([key, m]) => {
      if (!m) return;
      const topic = m.subtopic ? (q.namer || ((x) => x))(m.subtopic) : null;
      if (m.kind === "topic") {
        out.push({ key: `${q.questId}:${key}`, kind: "topic", text: null, topic, at: m.lastWrongAt || 0 });
        return;
      }
      let question = m.question || null; // papers store the question inline
      if (!question && m.quizId && m.questionId) {
        const idx = Number(String(m.questionId).split("-q").pop()) - 1;
        question = (q.quizzes?.[m.quizId] || [])[idx] || null;
      }
      if (!question?.question?.content) return; // generated or removed questions: skip
      const right = (question.options || []).find((o) => o.isCorrect);
      out.push({ key: `${q.questId}:${key}`, kind: "question", text: question.question.content, answer: right ? right.content : null, topic, at: m.lastWrongAt || 0 });
    });
  });
  return out.sort((a, b) => b.at - a.at).slice(0, max);
}

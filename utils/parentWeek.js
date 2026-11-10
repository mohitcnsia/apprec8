// utils/parentWeek.js
// A parent's "week at a glance" for one child (mockups V2/V3, approved by the owner and Seema 2026-11-05). Pure.
// Input: the child's questProgress docs (stats + nodes) and the bundled quest nodes. English and Hindi words; the
// owner checks the Hindi (he reads both well). Topic names stay as the app shows them.

import { accuracy, weakTopics, dayKey } from "./kidStats.js";
import { nodesForGrade } from "./gradeFilter.js";

const DAY = 24 * 60 * 60 * 1000;

export const WORDS = {
  en: {
    title: (n) => `${n}'s week`,
    thisWeek: "THIS WEEK",
    practised: (d, t) => `This week: ${d} ${d === 1 ? "day" : "days"} · ${t}`,
    notPractised: (list) => `Not practised this week: ${list}`,
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
    topicMiss: (topic) => `Missed a Challenge question on “${topic}”. Ask this similar one:`,
    strongAsk: (topic) => `Strong in “${topic}”. Start with this one:`,
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  hi: {
    title: (n) => `${n} का हफ़्ता`,
    thisWeek: "इस हफ़्ते",
    practised: (d, t) => `इस हफ़्ते: ${d} दिन · ${t}`,
    notPractised: (list) => `इस हफ़्ते अभ्यास नहीं किया: ${list}`,
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
    topicMiss: (topic) => `“${topic}” पर एक चैलेंज सवाल गलत हुआ। यह मिलता-जुलता सवाल पूछें:`,
    strongAsk: (topic) => `“${topic}” में मज़बूत। इस सवाल से शुरू करें:`,
    months: ["जन", "फ़र", "मार्च", "अप्रै", "मई", "जून", "जुला", "अग", "सितं", "अक्टू", "नवं", "दिसं"],
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

/** Midnight of the Monday that starts the week holding `now` (owner, 2026-11-10: weeks run Monday to Sunday). */
export function weekStartOf(now = Date.now()) {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.getTime();
}

/** The week's 7 days, Monday to Sunday ("future" = not yet come). Uses calendar dates, so clock changes don't matter. */
function weekDayKeys(now) {
  const start = new Date(weekStartOf(now));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i, 12);
    return { key: dayKey(d.getTime()), ms: d.getTime(), dow: i };
  });
}

/** "10–16 Nov", or "27 Oct – 2 Nov" across months. */
export function weekRangeText(now = Date.now(), lang = "en") {
  const w = WORDS[lang] || WORDS.en;
  const days = weekDayKeys(now);
  const a = new Date(days[0].ms), b = new Date(days[6].ms);
  return a.getMonth() === b.getMonth()
    ? `${a.getDate()}–${b.getDate()} ${w.months[b.getMonth()]}`
    : `${a.getDate()} ${w.months[a.getMonth()]} – ${b.getDate()} ${w.months[b.getMonth()]}`;
}

function weekDays(statsList, now, words) {
  const today = dayKey(now);
  return weekDayKeys(now).map(({ key, dow }) => ({
    key,
    label: words.days[dow],
    future: key > today,
    on: statsList.some((s) => (s?.daily?.[key]?.answered || 0) > 0),
  }));
}

/** Totals over this Monday-to-Sunday week (weekOffset -1 = last week). */
function sumWeek(stats, now, weekOffset = 0) {
  const keys = new Set(weekDayKeys(now + weekOffset * 7 * DAY).map((d) => d.key));
  const out = { answered: 0, correct: 0, timeMs: 0 };
  Object.entries(stats?.daily || {}).forEach(([k, v]) => {
    if (!keys.has(k)) return;
    out.answered += v?.answered || 0;
    out.correct += v?.correct || 0;
    out.timeMs += v?.timeMs || 0;
  });
  return out;
}

/** Strongest sub-topic: 80%+ with 5+ answers. */
function strongest(stats, namer) {
  const best = Object.entries(stats?.bySubtopic || {})
    .filter(([, v]) => v.total >= 5 && v.correct / v.total >= 0.8)
    .sort((a, b) => b[1].correct / b[1].total - a[1].correct / a[1].total || b[1].total - a[1].total)[0];
  return best ? namer(best[0]) : null;
}

function lastActiveMs(stats) {
  if (stats?.lastActiveAt) return stats.lastActiveAt;
  const days = Object.entries(stats?.daily || {})
    .filter(([, v]) => (v?.answered || 0) > 0)
    .map(([k]) => new Date(k).getTime())
    .sort((a, b) => b - a);
  return days[0] || 0;
}

/**
 * @param {{ name: string, grade: number|null, quests: Array<{questId, title, stats, nodes, questNodes, namer}>, now?: number, lang?: "en"|"hi", weekIndex?: number }} p
 */
export function parentWeek({ name, grade = null, quests = [], now = Date.now(), lang = "en", weekIndex = 0 }) {
  const w = WORDS[lang] || WORDS.en;
  const statsList = quests.map((q) => q.stats || {});
  const days = weekDays(statsList, now, w);
  const daysOn = days.filter((d) => d.on).length;
  const timeMs = statsList.reduce((s, st) => s + sumWeek(st, now).timeMs, 0);
  const prevMs = statsList.reduce((s, st) => s + sumWeek(st, now, -1).timeMs, 0);
  const min = Math.round(timeMs / 60000);
  const delta = Math.round((timeMs - prevMs) / 60000);

  const allSubjects = quests
    .map((q) => {
      const namer = q.namer || ((x) => x);
      const weak = weakTopics(q.stats || {})[0];
      const mains = nodesForGrade(q.questNodes || [], grade).filter((n) => n.kind === "main");
      const done = mains.filter((n) => q.nodes?.[n.id]?.status === "completed").length;
      const next = mains.find((n) => q.nodes?.[n.id]?.status !== "completed");
      const week = sumWeek(q.stats || {}, now);
      const subMin = Math.round((week.timeMs || 0) / 60000);
      const lastActive = lastActiveMs(q.stats);
      return {
        questId: q.questId,
        title: q.title,
        answered: week.answered,
        timeMs: week.timeMs || 0,
        min: subMin,
        accuracy: accuracy(week),
        strong: strongest(q.stats, namer),
        practise: weak ? namer(weak.subtopic) : null,
        done,
        total: mains.length,
        next: next ? next.title : null,
        lastActiveAt: lastActive,
      };
    });

  // Practised subjects: most recent first, already expanded
  const subjects = allSubjects
    .filter((s) => s.answered > 0 || s.timeMs > 0)
    .sort((a, b) => (b.lastActiveAt || 0) - (a.lastActiveAt || 0) || b.timeMs - a.timeMs);

  // Unpractised subjects for this grade: fold into one line
  const unpractised = allSubjects.filter((s) => s.answered === 0 && s.timeMs === 0 && s.total > 0);
  const unpractisedTitles = unpractised.map((s) => s.title);
  const unpractisedText = unpractisedTitles.length ? w.notPractised(unpractisedTitles.join(", ")) : null;

  // Breakdown for timeText: "Science 30 min, English 12 min"
  const breakdown = subjects
    .filter((s) => s.timeMs > 0 || s.answered > 0)
    .map((s) => `${s.title} ${s.min > 0 ? w.min(s.min) : (lang === "hi" ? "<1 मिनट" : "<1 min")}`)
    .join(", ");

  const combinedTime = daysOn === 0 && min === 0
    ? w.practised(0, w.min(0))
    : `${w.practised(daysOn, w.min(min))}${breakdown ? ` · ${breakdown}` : ""}`;

  const weakest = subjects.find((s) => s.practise)?.practise || null;
  const tips = TIPS[lang] || TIPS.en;
  return {
    title: w.title(name),
    rangeText: weekRangeText(now, lang),
    days,
    daysOn,
    timeText: combinedTime,
    deltaText: delta >= 5 ? w.more(w.min(delta)) : delta <= -5 ? w.less(w.min(-delta)) : null,
    deltaUp: delta >= 5,
    subjects,
    unpractised,
    unpractisedText,
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
/** A practice question on the same sub-topic (never from a Challenge or Boss pool), picked the same way each time. */
function similarQuestion(q, subtopic, seed) {
  const nodes = q.questNodes || [];
  const secret = new Set(nodes.filter((n) => n.kind === "gate" || n.kind === "boss").map((n) => n.quizId).filter(Boolean));
  const fromNodes = new Set(
    nodes.filter((n) => (n.kind === "main" || n.kind === "practice") && n.subtopic === subtopic).flatMap((n) => (n.steps || []).filter((st) => st.type === "quiz").map((st) => st.quizId))
  );
  const pool = [];
  Object.entries(q.quizzes || {}).forEach(([quizId, list]) => {
    if (secret.has(quizId)) return;
    (list || []).forEach((x) => {
      if (x?.question?.content && (x.subtopic === subtopic || fromNodes.has(quizId)) && (x.options || []).some((o) => o.isCorrect)) pool.push(x);
    });
  });
  if (!pool.length) return null;
  let h = 0;
  for (const c of String(seed)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return pool[h % pool.length];
}

export function missedQuestions(quests = [], max = 5) {
  const out = [];
  quests.forEach((q) => {
    Object.entries(q.mistakes || {}).forEach(([key, m]) => {
      if (!m) return;
      const topic = m.subtopic ? (q.namer || ((x) => x))(m.subtopic) : null;
      if (m.kind === "topic") {
        // Challenge/Boss questions stay secret, so the parent gets a similar question from the same topic's practice,
        // with its answer (owner, 2026-11-10). No topic name or no practice question: leave it out (no empty “”).
        const sample = topic && m.subtopic ? similarQuestion(q, m.subtopic, key) : null;
        if (!sample) return;
        const right = (sample.options || []).find((o) => o.isCorrect);
        out.push({ key: `${q.questId}:${key}`, kind: "topic", text: sample.question.content, answer: right ? right.content : null, topic, at: m.lastWrongAt || 0 });
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

/**
 * Questions to talk about (owner, 2026-11-10: "anything the kid has solved would do; it gives confidence to both"):
 * first up to `strong` questions from the child's strongest sub-topics (80%+ with 5+ answers), so the talk starts
 * with a win, then the latest mistakes. Same item shape as missedQuestions, kind "strong" for the confidence ones.
 */
export function talkQuestions(quests = [], max = 5, strong = 2) {
  const wins = [];
  quests.forEach((q) => {
    const namer = q.namer || ((x) => x);
    Object.entries(q.stats?.bySubtopic || {})
      .filter(([, v]) => v.total >= 5 && v.correct / v.total >= 0.8)
      .sort((a, b) => b[1].correct / b[1].total - a[1].correct / a[1].total || b[1].total - a[1].total)
      .forEach(([sub, v]) => {
        const x = similarQuestion(q, sub, `strong:${q.questId}:${sub}`);
        if (!x) return;
        const right = (x.options || []).find((o) => o.isCorrect);
        wins.push({ key: `strong:${q.questId}:${sub}`, kind: "strong", text: x.question.content, answer: right ? right.content : null, topic: namer(sub), score: v.correct / v.total });
      });
  });
  const picked = wins.sort((a, b) => b.score - a.score).slice(0, strong);
  return [...picked, ...missedQuestions(quests, max - picked.length)];
}

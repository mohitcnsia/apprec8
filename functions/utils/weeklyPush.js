// functions/utils/weeklyPush.js
// Pure helpers for the weekly summary notifications (mockup V1). Tested in tests/weeklyPush.test.mjs.
// Dates are India time: the app stores stats.daily under the phone's own date (IST for our users).

const DAY = 24 * 60 * 60 * 1000;
const istKey = (ms) => new Date(ms).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD

/** Days practised (of the last 7, ending today) and minutes, over several progress docs' stats. */
function weekFromStats(statsList = [], now = Date.now()) {
  const keys = Array.from({ length: 7 }, (_, i) => istKey(now - i * DAY));
  let days = 0;
  let ms = 0;
  let answered = 0;
  keys.forEach((k) => {
    let on = false;
    statsList.forEach((s) => {
      const d = s && s.daily && s.daily[k];
      if (d && d.answered > 0) {
        on = true;
        answered += d.answered;
        ms += d.timeMs || 0;
      }
    });
    if (on) days++;
  });
  return { days, minutes: Math.round(ms / 60000), answered };
}

const time = (m, lang) =>
  lang === "hi" ? (m >= 60 ? `${Math.floor(m / 60)} घंटा ${m % 60} मिनट` : `${m} मिनट`) : m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`;

/** The parent's Sunday notification for one child (owner wording: "weekly report"). */
function parentMessage({ name, days, minutes, lang = "en" }) {
  const n = String(name || "").trim() || (lang === "hi" ? "आपके बच्चे" : "Your child");
  if (lang === "hi") {
    return days
      ? { title: `${n} की साप्ताहिक रिपोर्ट तैयार है 🌟`, body: `7 में से ${days} दिन अभ्यास · ${time(minutes, "hi")}। घर के लिए एक सुझाव अंदर।` }
      : { title: `${n} की साप्ताहिक रिपोर्ट तैयार है`, body: "इस हफ़्ते अभ्यास नहीं हुआ। अंदर देखें आगे क्या करना है।" };
  }
  return days
    ? { title: `${n}'s weekly report is ready 🌟`, body: `Practised ${days} of 7 days · ${time(minutes, "en")}. One idea for home inside.` }
    : { title: `${n}'s weekly report is ready`, body: "No practice this week. See what's next inside." };
}

/** The teacher's Monday notification for one class. */
function teacherMessage({ className, active, total }) {
  return { title: `This week in ${className}`, body: `${active} of ${total} students practised. 3 things to look at inside.` };
}

/** Keeps the newest tokens (max 5), no duplicates. */
function mergeTokens(existing = [], token) {
  const list = (existing || []).filter((t) => t && t !== token);
  return [...list, token].slice(-5);
}

module.exports = { weekFromStats, parentMessage, teacherMessage, mergeTokens, istKey, DAY };

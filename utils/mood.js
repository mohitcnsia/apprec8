// utils/mood.js: the weekly mood check for kids (well-being safety steps, "Simpler Home, Progress and Me" doc, tab
// "Well-being safety steps"). Pilot messages are Claude's (owner, 2026-11-11); Seema's own words replace them later.
// Taps only: kids can't type anywhere in the app. Pure, so it is tested without a phone.

export const MOODS = [
  { id: "happy", emoji: "😀", label: "Happy" },
  { id: "okay", emoji: "🙂", label: "Okay" },
  { id: "sad", emoji: "😢", label: "Sad" },
];

export const MESSAGES = {
  happy: "That's lovely! Hold on to that happy feeling today.",
  okay: "Okay days are normal too. Thanks for telling us.",
  sad: "Thanks for telling us. Some days are hard, and that's okay. You're not alone.",
  sadAsk: "Just today, or for a while?",
  sadToday: "Hard days pass. Want to try something that helps right now?",
  sadWhile: "Thank you for telling us. You don't have to carry this alone.",
  told: "Done. The school counsellor will find a quiet moment to talk with you. You can also call any time:",
};

export const HELPLINES = [
  { id: "1098", label: "Call 1098", sub: "Childline, free, any time", tel: "1098" },
  { id: "14416", label: "Call 14416", sub: "Tele-MANAS, free, any time, Hindi too", tel: "14416" },
];

/** Once a week: ask when the kid hasn't answered for 7 days (and not on the account's first day). */
export function shouldAskMood({ lastAnsweredDay = null, today, firstDay = null }) {
  if (!Number.isInteger(today)) return false;
  if (Number.isInteger(firstDay) && today <= firstDay) return false;
  return !Number.isInteger(lastAnsweredDay) || today - lastAnsweredDay >= 7;
}

/**
 * Does this tap go on the counsellor's next-morning list? (safety steps, section 2)
 * - the kid taps "Let the counsellor know", or says sad "for a while", or
 * - sad twice in a row on weekly checks (the previous answer was sad, 6 to 20 days ago).
 * One sad tap alone reaches nobody.
 */
export function moodFlag({ mood, span = null, tellCounsellor = false, prev = null, day }) {
  if (tellCounsellor) return "asked";
  if (mood !== "sad") return null;
  if (span === "while") return "for-a-while";
  if (prev?.mood === "sad" && Number.isInteger(prev.day) && day - prev.day >= 6 && day - prev.day <= 20) return "sad-2-weeks";
  return null;
}

export const FLAG_TEXT = {
  asked: "asked to talk",
  "for-a-while": "sad for a while",
  "sad-2-weeks": "sad two weeks in a row",
};

export const OUTCOMES = [
  { id: "talked", label: "Talked, okay" },
  { id: "follow", label: "Follow up" },
  { id: "referred", label: "Referred" },
];

/** Follow up → back on the list in 3 days. */
export const FOLLOW_UP_DAYS = 3;
/** Mood taps are deleted after 2 months (Seema, 11 Nov). */
export const KEEP_DAYS = 60;

/** The 9 calming strategies from Seema's classroom (Calm corner). `guide` = a guided screen in the app. */
export const CALM = [
  { id: "breathe", emoji: "🌬️", title: "Take deep breaths", text: "Breathe in slowly while the circle grows, and out while it shrinks. Three times.", guide: "breathe" },
  { id: "senses", emoji: "🖐️", title: "Use your 5 senses", text: "Find 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell and 1 you can taste.", guide: "senses" },
  { id: "place", emoji: "🏞️", title: "Imagine a happy place", text: "Close your eyes. Picture a place where you feel safe and happy. What do you see there? What do you hear?" },
  { id: "stretch", emoji: "🙆", title: "Do a gentle stretch", text: "Reach your arms up high, then slowly bend down. Roll your shoulders back three times." },
  { id: "water", emoji: "💧", title: "Have a sip of water", text: "Drink a glass of water slowly. Notice how cool it feels." },
  { id: "music", emoji: "🎵", title: "Listen to calming music", text: "Ask a grown-up to play a song you find calm, and just listen." },
  { id: "book", emoji: "📖", title: "Read a book", text: "Pick a favourite story and read a few pages, slowly." },
  { id: "draw", emoji: "✏️", title: "Draw or write your feelings", text: "On paper, draw how you feel or write it down. You can keep it, or show someone you trust." },
  { id: "comfort", emoji: "🧸", title: "Hold a comfort item", text: "Squeeze a soft ball, a pillow or a favourite toy for a little while." },
];

/** 5 senses guide, one step per screen. */
export const SENSES_STEPS = [
  "Look around. Find 5 things you can see.",
  "Find 4 things you can touch.",
  "Listen. Find 3 things you can hear.",
  "Find 2 things you can smell.",
  "Find 1 thing you can taste.",
  "Well done. Notice how you feel now.",
];

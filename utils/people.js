// utils/people.js: the People screen's filters and dates (pure; tests/peopleView.test.mjs). Rows come from
// functions/utils/people.js via the peopleList function.

export const KIND_LABEL = { teacher: "TEACHER", parent: "PARENT", student: "STUDENT", child: "CHILD", none: "NO ROLE YET", robot: "PLAY ROBOT", test: "TEST", learner: "LEARNER" };

const HOUR = 3600e3;
const DAY = 24 * HOUR;
const istDay = (t) => new Date(t + 5.5 * HOUR).toISOString().slice(0, 10);

// Google Play's automatic test accounts sign in once to check the app: firstnamelastname.12345@gmail.com (walk, 13 Nov).
export const isPlayRobot = (p) => p?.kind === "none" && !p.quizzes && /^[a-z]{4,}\.\d{5}@gmail\.com$/.test(String(p?.email || ""));

/**
 * The owner's view of one row (13 Nov walk: "101 stuck" was mostly Play robots and 2025 accounts from before first run):
 * robot = Play test account; stuck = a real account that joined in the last 30 days, over an hour ago, and has picked
 * nothing and done no quiz.
 */
// Our own test sign-ups (example.com, testprobe.com, test.dev) are not people to help.
// Also our own "+" aliases (mohitchilkoti+…, seemachilkoti+…) and the Play reviewer login (walk, 13 Nov).
export const isTestAccount = (p) => {
  const e = String(p?.email || "").toLowerCase();
  return /@(example\.com|testprobe\.com|test\.dev)$/.test(e) || /^(mohitchilkoti|seemachilkoti)\+[^@]*@gmail\.com$/.test(e) || e === "playtest@apprec8.com";
};

export function shapePerson(p, now = Date.now()) {
  const test = isTestAccount(p);
  const robot = test || isPlayRobot(p);
  const age = p.joinedAt ? now - p.joinedAt : 0;
  const stuck = !robot && p.kind === "none" && !p.quizzes && age > HOUR && age < 30 * DAY;
  return { ...p, robot, stuck, kind: test ? "test" : robot ? "robot" : p.kind, baseKind: p.kind };
}

/** Counts for the header and the owner's Home row, robots left out. */
export function peopleCounts(people = [], now = Date.now()) {
  const real = people.filter((p) => !p.robot);
  const today = istDay(now);
  return { total: real.length, newToday: real.filter((p) => p.joinedAt && istDay(p.joinedAt) === today).length, stuck: real.filter((p) => p.stuck).length, robots: people.filter((p) => p.kind === "robot").length, tests: people.filter((p) => p.kind === "test").length };
}

/** "Who is who" (owner, 13 Nov: "kids say they joined but are not in the app"). */
export const SHOWS = [
  ["everyone", "Everyone"],
  ["students", "Students"],
  ["noclass", "No class yet"],
  ["waiting", "Waiting"],
  ["parents", "Parents"],
  ["teachers", "Teachers"],
];
const isLearner = (p) => p.kind === "student" || p.kind === "child";
const SHOW_TEST = {
  everyone: () => true,
  students: isLearner,
  noclass: (p) => isLearner(p) && !(p.classes || []).length && !(p.waiting || []).length,
  waiting: (p) => (p.waiting || []).length > 0,
  parents: (p) => p.kind === "parent",
  teachers: (p) => p.kind === "teacher",
};

export const SORTS = [
  ["joined", "Newest"],
  ["oldest", "Oldest"],
  ["seen", "Last seen"],
];

/**
 * tab: "new" (joined today, India time) | "stuck" | "all"; query matches name or email; Play robots and our test
 * accounts only with showBots (owner, 13 Nov: "All shows 125 people, there should be a way to filter bots");
 * sort: "joined" (newest first) | "oldest" | "seen" (most recently seen first).
 */
export function filterPeople(people = [], { tab = "all", query = "", now = Date.now(), showBots = false, sort = "joined", show = "everyone" } = {}) {
  const q = String(query || "").trim().toLowerCase();
  const today = istDay(now);
  const by = { joined: (a, b) => (b.joinedAt || 0) - (a.joinedAt || 0), oldest: (a, b) => (a.joinedAt || Infinity) - (b.joinedAt || Infinity), seen: (a, b) => (b.lastSeenAt || 0) - (a.lastSeenAt || 0) }[sort];
  return people.filter((p) => {
    if (p.robot && !(showBots && tab === "all")) return false;
    if (!(SHOW_TEST[show] || SHOW_TEST.everyone)(p)) return false;
    if (tab === "new" && !(p.joinedAt && istDay(p.joinedAt) === today)) return false;
    if (tab === "stuck" && !p.stuck) return false;
    if (q && !`${p.name || ""} ${p.email || ""}`.toLowerCase().includes(q)) return false;
    return true;
  }).sort(by || (() => 0));
}

/** "today 8:39 pm" · "yesterday 7:10 am" · "9 Nov 2026" (India time). */
export function whenText(t, now = Date.now()) {
  if (!t) return "—";
  const d = new Date(t);
  const time = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }).toLowerCase();
  if (istDay(t) === istDay(now)) return `today ${time}`;
  if (istDay(t) === istDay(now - 24 * HOUR)) return `yesterday ${time}`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
}

/**
 * Help messages (owner 13-14 Nov: "this custom message list with edit option should automatically populate when help
 * is pressed. If I type something new, I should be able to save so it appears for other parents/kids too").
 * One template per situation, English + Hindi; {name} is filled in. Saved wording comes from the server (peopleList).
 */
export const MESSAGE_SITUATIONS = {
  none: "Signed in, picked nothing",
  noclass: "Student without a class",
  waiting: "Waiting for the teacher",
  parent: "Parent without a child",
  learner: "Grown-up learner",
  other: "Everyone else",
};
export const DEFAULT_MESSAGES = {
  none: `Namaste {name}! Thank you for joining Apprec8 🌟
One small step: open Apprec8 → write your name → choose:
• a student: pick your class → "Join your class"
• a parent: "I'm a parent" → add your child
• learning for yourself: "I just want to learn" → Easy
नमस्ते {name}! Apprec8 खोलें → अपना नाम लिखें → विद्यार्थी हैं तो कक्षा चुनें; माता-पिता हैं तो "I'm a parent"; खुद सीखना है तो "I just want to learn" → Easy। कोई दिक्कत हो तो यहीं लिखें।`,
  noclass: `Namaste {name}! Great to see you learning on Apprec8 🌟
One step so your teacher can see you: open Apprec8 → Home → "Join your class" → your school → your class.
नमस्ते {name}! Apprec8 खोलें → Home → "Join your class" → अपना स्कूल → अपनी कक्षा। इससे आपके शिक्षक आपको देख पाएँगे।`,
  waiting: `Namaste {name}! You've asked to join your class on Apprec8 ✓ Your teacher will confirm soon. Keep practising meanwhile: everything is already open 🌟
नमस्ते {name}! आपकी कक्षा का अनुरोध पहुँच गया है। शिक्षक जल्द पुष्टि करेंगे। तब तक अभ्यास जारी रखें!`,
  parent: `Namaste {name}! Thank you for joining Apprec8 🌟
To start your child: open Apprec8 → Me → "Add a child" → your child's name and class → agree. Then "Join your class" for your child.
नमस्ते {name}! Apprec8 खोलें → Me → "Add a child" → बच्चे का नाम और कक्षा → सहमति दें। फिर बच्चे के लिए "Join your class"।`,
  learner: `Namaste {name}! Learning is for every age 🌱 Open Apprec8 and try today's practice: a few minutes a day is enough.
नमस्ते {name}! सीखने की कोई उम्र नहीं होती 🌱 Apprec8 खोलें और आज का अभ्यास करें: रोज़ कुछ मिनट काफ़ी हैं।`,
  other: `Namaste {name}! Thank you for being on Apprec8 🌟 Reply here if anything is confusing and I'll help.
नमस्ते {name}! Apprec8 पर आपका स्वागत है। कोई दिक्कत हो तो यहीं लिखें।`,
};

/** Which message fits this person. */
export function messageSituation(p = {}) {
  const kind = p.baseKind || p.kind;
  if (kind === "none") return "none";
  if (kind === "learner") return "learner";
  if (kind === "parent" && !p.children) return "parent";
  if ((kind === "student" || kind === "child") && (p.waiting || []).length && !(p.classes || []).length) return "waiting";
  if ((kind === "student" || kind === "child") && !(p.classes || []).length) return "noclass";
  return "other";
}

/** Template → message for this person (an empty name drops cleanly: "Namaste !" → "Namaste!"). */
export function fillMessage(template = "", p = {}) {
  return String(template).split("{name}").join(p.name || "").replace(/ !/g, "!").replace(/ ,/g, ",");
}

/** Message typed for this person → template for everyone in that situation (their name → {name}). */
export function toTemplate(text = "", p = {}) {
  const t = String(text).trim();
  return p.name && p.name.length >= 2 ? t.split(p.name).join("{name}") : t;
}

/** WhatsApp with the message ready; the owner picks the contact (the app has no phone numbers). */
export const whatsappUrl = (text) => `https://wa.me/?text=${encodeURIComponent(text)}`;
export const emailUrl = (email, text) =>
  email ? `mailto:${email}?subject=${encodeURIComponent("Apprec8: one small step")}&body=${encodeURIComponent(text)}` : null;

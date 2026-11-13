// utils/people.js: the People screen's filters and dates (pure; tests/peopleView.test.mjs). Rows come from
// functions/utils/people.js via the peopleList function.

export const KIND_LABEL = { teacher: "TEACHER", parent: "PARENT", student: "STUDENT", child: "CHILD", none: "NO ROLE YET", robot: "PLAY ROBOT", test: "TEST" };

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
export const isTestAccount = (p) => /@(example\.com|testprobe\.com|test\.dev)$/i.test(String(p?.email || ""));

export function shapePerson(p, now = Date.now()) {
  const test = isTestAccount(p);
  const robot = test || isPlayRobot(p);
  const age = p.joinedAt ? now - p.joinedAt : 0;
  const stuck = !robot && p.kind === "none" && !p.quizzes && age > HOUR && age < 30 * DAY;
  return { ...p, robot, stuck, kind: test ? "test" : robot ? "robot" : p.kind };
}

/** Counts for the header and the owner's Home row, robots left out. */
export function peopleCounts(people = [], now = Date.now()) {
  const real = people.filter((p) => !p.robot);
  const today = istDay(now);
  return { total: real.length, newToday: real.filter((p) => p.joinedAt && istDay(p.joinedAt) === today).length, stuck: real.filter((p) => p.stuck).length, robots: people.filter((p) => p.kind === "robot").length, tests: people.filter((p) => p.kind === "test").length };
}

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
export function filterPeople(people = [], { tab = "all", query = "", now = Date.now(), showBots = false, sort = "joined" } = {}) {
  const q = String(query || "").trim().toLowerCase();
  const today = istDay(now);
  const by = { joined: (a, b) => (b.joinedAt || 0) - (a.joinedAt || 0), oldest: (a, b) => (a.joinedAt || Infinity) - (b.joinedAt || Infinity), seen: (a, b) => (b.lastSeenAt || 0) - (a.lastSeenAt || 0) }[sort];
  return people.filter((p) => {
    if (p.robot && !(showBots && tab === "all")) return false;
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

/** The owner's friendly nudge to someone stuck (owner, 13 Nov: "can I WhatsApp them from within the app?"). */
export function nudgeMessage(p = {}) {
  const hi = p.name ? `Namaste ${p.name}!` : "Namaste!";
  return [
    `${hi} I saw you signed in to Apprec8. Thank you!`,
    `One small step is left: open Apprec8 → tap "Join your class" → pick your school and class. If you're a parent, tap "Add my child" instead.`,
    "Reply here if anything is confusing and I'll help.",
    `हिंदी: Apprec8 खोलें → "Join your class" → अपना स्कूल और क्लास चुनें।`,
  ].join("\n\n");
}

/** WhatsApp with the message ready; the owner picks the contact (the app has no phone numbers). */
export const whatsappNudgeUrl = (p) => `https://wa.me/?text=${encodeURIComponent(nudgeMessage(p))}`;

export const emailNudgeUrl = (p) =>
  p?.email ? `mailto:${p.email}?subject=${encodeURIComponent("Apprec8: one small step left")}&body=${encodeURIComponent(nudgeMessage(p))}` : null;

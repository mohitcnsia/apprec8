// utils/people.js: the People screen's filters and dates (pure; tests/peopleView.test.mjs). Rows come from
// functions/utils/people.js via the peopleList function.

export const KIND_LABEL = { teacher: "TEACHER", parent: "PARENT", student: "STUDENT", child: "CHILD", none: "NO ROLE YET" };

const HOUR = 3600e3;
const istDay = (t) => new Date(t + 5.5 * HOUR).toISOString().slice(0, 10);

/** tab: "new" (joined today, India time) | "stuck" | "all"; query matches name or email. */
export function filterPeople(people = [], { tab = "all", query = "", now = Date.now() } = {}) {
  const q = String(query || "").trim().toLowerCase();
  const today = istDay(now);
  return people.filter((p) => {
    if (tab === "new" && !(p.joinedAt && istDay(p.joinedAt) === today)) return false;
    if (tab === "stuck" && !p.stuck) return false;
    if (q && !`${p.name || ""} ${p.email || ""}`.toLowerCase().includes(q)) return false;
    return true;
  });
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

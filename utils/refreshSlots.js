// utils/refreshSlots.js: when other people's progress is read fresh (owner, 2026-11-10, card "progress-refresh-rules").
// Parents + teachers: twice a day, after 7:30 am and 7:30 pm (the phone's own clock); the screen says "Updated 8:05 pm".
// Kids' class board: hourly, with "Keep practising! Next update at 9 pm". Pure, so it is tested without a phone.

export const DAILY_SLOTS = [
  [7, 30],
  [19, 30],
];

/** The most recent slot time at or before `now` (ms). */
export function lastSlot(now = Date.now(), slots = DAILY_SLOTS) {
  const d = new Date(now);
  for (let back = 0; back < 2; back++) {
    const times = slots
      .map(([h, m]) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - back, h, m).getTime())
      .filter((t) => t <= now)
      .sort((a, b) => b - a);
    if (times.length) return times[0];
  }
  return now;
}

/** The next slot time after `now` (ms). */
export function nextSlot(now = Date.now(), slots = DAILY_SLOTS) {
  const d = new Date(now);
  for (let ahead = 0; ahead < 2; ahead++) {
    const times = slots
      .map(([h, m]) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + ahead, h, m).getTime())
      .filter((t) => t > now)
      .sort((a, b) => a - b);
    if (times.length) return times[0];
  }
  return now;
}

/** Data read at `fetchedAt` is still current if it was read after the latest slot. */
export const isFreshBySlot = (fetchedAt, now = Date.now(), slots = DAILY_SLOTS) =>
  Number.isFinite(fetchedAt) && fetchedAt >= lastSlot(now, slots) && fetchedAt <= now;

/** The start of the next clock hour (ms). */
export function nextHour(now = Date.now()) {
  const d = new Date(now);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() + 1, 0).getTime();
}

/** "7:30 am", "9 pm". */
export function clockText(ms) {
  const d = new Date(ms);
  const h = d.getHours();
  const m = d.getMinutes();
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}${m ? `:${String(m).padStart(2, "0")}` : ""} ${h < 12 ? "am" : "pm"}`;
}

const UPDATED_WORDS = { en: ["Updated", "yesterday"], hi: ["अपडेट", "कल"] };

/** "Updated 8:05 pm" (today) or "Updated yesterday 7:40 pm" or "Updated 9 Nov" (lang "hi": "अपडेट …"). */
export function updatedText(fetchedAt, now = Date.now(), lang = "en") {
  if (!Number.isFinite(fetchedAt)) return "";
  const [U, Y] = UPDATED_WORDS[lang] || UPDATED_WORDS.en;
  const a = new Date(fetchedAt);
  const n = new Date(now);
  const sameDay = (x, y) => x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate();
  if (sameDay(a, n)) return `${U} ${clockText(fetchedAt)}`;
  const y = new Date(n.getFullYear(), n.getMonth(), n.getDate() - 1);
  if (sameDay(a, y)) return `${U} ${Y} ${clockText(fetchedAt)}`;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${U} ${a.getDate()} ${months[a.getMonth()]}`;
}

/** Kids' board: "Keep practising! Next update at 9 pm", or "… in 5 minutes" when it is close. */
export function nextUpdateText(nextMs, now = Date.now()) {
  const min = Math.ceil((nextMs - now) / 60000);
  if (min <= 1) return "Keep practising! Next update in a minute";
  if (min <= 10) return `Keep practising! Next update in ${min} minutes`;
  return `Keep practising! Next update at ${clockText(nextMs)}`;
}

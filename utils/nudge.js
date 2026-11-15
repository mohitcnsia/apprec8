// utils/nudge.js
// Pure text formatting for teacher notes and reminders on the kid's Home.
// Handles kinds: "remind", "cheer", and default practice nudge.

export const nudgeText = (n = {}) => {
  if (n.kind === "remind") {
    const teacher = n.from || "Your teacher";
    const topic = n.topic || "your topic";
    const mistakes = n.mistakesLeft
      ? ` — ${n.mistakesLeft} ${n.mistakesLeft === 1 ? "mistake" : "mistakes"} to fix`
      : "";
    return `${teacher} reminded you: finish ${topic}${mistakes}`;
  }
  return n.kind === "cheer"
    ? `Keep going on ${n.topic || "your topic"}. You're getting there! 💪`
    : `Let's practise ${n.topic || "a little"} today. You can do it! 🌱`;
};

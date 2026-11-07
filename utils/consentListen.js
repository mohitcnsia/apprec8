// utils/consentListen.js
// Voice readout for parent consent notes (Join a class, Add a child, Link my child's own account).
// For parents who read little. Pure, testable.

export const SPEECH_LANG = {
  en: "en-IN",
  hi: "hi-IN",
};

/**
 * Text to read aloud for a consent note.
 * Combines title and body with appropriate sentence punctuation for the selected language.
 */
export function consentSpeechText(t, lang = "en") {
  if (!t) return "";
  if (typeof t === "string") return t.trim();
  const title = (t.title || "").trim();
  const body = (t.body || "").trim();
  if (title && body) {
    const sep = lang === "hi" ? "। " : ". ";
    return `${title}${sep}${body}`;
  }
  return title || body || "";
}

/**
 * Returns the button labels for idle and speaking states based on language.
 */
export function consentListenLabel(speaking, lang = "en") {
  if (speaking) {
    return lang === "hi" ? "⏹️ रोकें" : "⏹️ Stop";
  }
  return lang === "hi" ? "🔊 सुनें" : "🔊 Listen";
}

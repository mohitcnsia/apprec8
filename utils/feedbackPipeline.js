// utils/feedbackPipeline.js
// Pure functions and prompt definitions for the children's feedback pipeline (G66).
// Handles prompt selection, frequency guards, payload building, and privacy redaction for export.

export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const IDEA_PROMPTS = [
  {
    id: "other_apps",
    question: "What do you love in another app?",
    choices: [
      { id: "mini_games", text: "Mini-games & puzzles", emoji: "🎮" },
      { id: "badges_outfits", text: "Cool badges & avatar outfits", emoji: "🏆" },
      { id: "friend_challenges", text: "Playing & challenges with friends", emoji: "👥" },
      { id: "sound_voice", text: "Fun sound effects & voice read-aloud", emoji: "🎵" },
    ],
  },
  {
    id: "what_to_add",
    question: "What should we add to Apprec8?",
    choices: [
      { id: "funny_stories", text: "More funny stories & picture books", emoji: "📚" },
      { id: "science_experiments", text: "Science experiments to do at home", emoji: "🔬" },
      { id: "maths_riddles", text: "Maths riddles & daily puzzles", emoji: "🧠" },
      { id: "treasure_words", text: "More Treasure Words & vocabulary quests", emoji: "💎" },
    ],
  },
  {
    id: "whats_boring",
    question: "What's boring here?",
    choices: [
      { id: "too_much_text", text: "Too much text on one page", emoji: "😴" },
      { id: "quizzes_long", text: "Quizzes are too long", emoji: "⏱️" },
      { id: "more_animations", text: "Need more colours & animations", emoji: "🎨" },
      { id: "nothing_boring", text: "Nothing, I love it as it is!", emoji: "🌟" },
    ],
  },
];

/**
 * Returns the prompt for this week based on the week index or current timestamp.
 */
export function pickWeeklyPrompt({ now = Date.now(), index = null } = {}) {
  if (Number.isInteger(index) && index >= 0) {
    return IDEA_PROMPTS[index % IDEA_PROMPTS.length];
  }
  const weekNum = Math.floor(now / SEVEN_DAYS_MS);
  return IDEA_PROMPTS[Math.abs(weekNum) % IDEA_PROMPTS.length];
}

/**
 * Determines whether the weekly Home prompt should be displayed.
 * Frequency guard: once every 7 days.
 */
export function shouldShowWeeklyPrompt({ lastPromptAt = 0, now = Date.now(), minIntervalMs = SEVEN_DAYS_MS } = {}) {
  if (!lastPromptAt) return true;
  return now - Number(lastPromptAt) >= minIntervalMs;
}

/**
 * Builds the userFeedback document payload for an idea submitted by a child.
 * Pure function: testable without React or Firebase.
 */
export function buildIdeaPayload({
  userId,
  userName = null,
  userGrade = null,
  promptId = null,
  promptQuestion = "",
  choiceId = null,
  selectedChoice = "",
  choiceEmoji = "💡",
  note = "",
  entryPoint = "me_idea",
  clientTimestamp = new Date().toISOString(),
  appVersion = null,
} = {}) {
  if (!userId) throw new Error("userId is required to build an idea payload");

  return {
    userId,
    userName: userName ? String(userName).trim().split(" ")[0] : null, // first name only
    userGrade: Number.isInteger(userGrade) ? userGrade : null,
    feedbackType: "idea",
    entryPoint: entryPoint || "me_idea",
    promptId: promptId || null,
    promptQuestion: String(promptQuestion || "").trim(),
    choiceId: choiceId || null,
    selectedChoice: String(selectedChoice || "").trim(),
    choiceEmoji: choiceEmoji || "💡",
    feedbackText: String(note || "").trim().slice(0, 300),
    clientTimestamp,
    status: "new",
    archived: false,
    appVersion: appVersion || null,
  };
}

/**
 * Redacts feedback documents before writing to docs/agents/private/feedback.json.
 * Strict safety: strips user IDs, emails, and full names. First name & Class only.
 */
export function redactFeedbackForExport(doc = {}) {
  const isIdea = doc.feedbackType === "idea";
  const isReport = doc.feedbackType === "issue_report";
  const dateStr =
    doc.clientTimestamp ||
    (doc.createdAt?.toDate ? doc.createdAt.toDate().toISOString() : null) ||
    (typeof doc.createdAt === "string" ? doc.createdAt : null);

  return {
    id: doc.id || null,
    type: doc.feedbackType || (doc.entryPoint === "report_flag" ? "issue_report" : "general"),
    name: doc.userName ? String(doc.userName).trim().split(" ")[0] : "Student",
    class: Number.isInteger(doc.userGrade) ? doc.userGrade : null,
    prompt: doc.promptQuestion || doc.contentContext?.titlePreview || null,
    choice: doc.selectedChoice ? `${doc.choiceEmoji || ""} ${doc.selectedChoice}`.trim() : null,
    reason: doc.childReason || doc.issueCategory || null,
    note: doc.feedbackText ? String(doc.feedbackText).trim().slice(0, 300) : null,
    status: doc.status || "new",
    entryPoint: doc.entryPoint || null,
    createdAt: dateStr,
    // What Claude needs to fix a report (no personal data): which question/page, the options, the child's answer.
    contentId: doc.contentContext?.id || doc.contentId || null,
    quizId: doc.contentContext?.parentId || null,
    questId: doc.questId || null,
    nodeId: doc.nodeId || null,
    options: Array.isArray(doc.options) ? doc.options.slice(0, 6).map(String) : null,
    correctAnswer: doc.correctAnswer ?? null,
    chosen: doc.chosen ?? null,
    subject: doc.subject ? String(doc.subject).slice(0, 120) : null,
    appVersion: doc.appVersion || null,
  };
}


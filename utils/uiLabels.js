// utils/uiLabels.js: Hindi labels on Hindi content (owner, 17 Nov 2026: a grown-up learner could not follow "Next",
// "Continue", "OTP"). Owner's choice: simple everyday Hindi for actions; words people only know in English keep their
// spoken form in Hindi script ("OTP (ओटीपी)"). Step 1 = the learning screens a Hindi learner passes through (cards,
// आओ जानें map, quiz start, quiz, why-sheet, results). Step 2 (planned, mockup first): a language choice for the whole app.
// ONE list, so the owner reviews all the Hindi in one place. English values are the app's existing words (unchanged).
// Pure: tested in tests/uiLabels.test.mjs.

const DEVANAGARI = /[ऀ-ॿ]/;
const DEVANAGARI_G = /[ऀ-ॿ]/g;
const LATIN_G = /[A-Za-z]/g;

/** "hi" when most letters in the texts are Devanagari, else "en". */
export function langOf(...texts) {
  const s = texts.flat().filter((x) => typeof x === "string").join(" ");
  const hi = (s.match(DEVANAGARI_G) || []).length;
  const en = (s.match(LATIN_G) || []).length;
  return hi > 0 && hi >= en ? "hi" : "en";
}

/** Language of a set of Learn cards (title + what is on the cards). */
export function cardsLang(cards = [], title = "") {
  const parts = [title];
  for (const c of cards || []) parts.push(c?.title, c?.text, c?.question, c?.answer, c?.word, c?.meaning);
  return langOf(parts);
}

/** Read-aloud voice for a text: Hindi voice for Hindi text (the quiz used the English voice for everything). */
export function voiceFor(text, { rate } = {}) {
  return langOf(text) === "hi" ? { language: "hi-IN", rate: rate ?? 0.85 } : { language: "en-IN", rate: rate ?? 0.9 };
}

// English words inside Hindi text, with how people say them, in Hindi script. Shown once per text: "OTP (ओटीपी)".
export const HINDI_SPELLINGS = {
  OTP: "ओटीपी",
  PIN: "पिन",
  UPI: "यूपीआई",
  SMS: "एसएमएस",
  KYC: "केवाईसी",
  QR: "क्यूआर",
  ATM: "एटीएम",
  NPCI: "एनपीसीआई",
  WhatsApp: "व्हाट्सऐप",
  AnyDesk: "एनीडेस्क",
  DigiLocker: "डिजिलॉकर",
};

/**
 * Adds the Hindi spelling after the first English term in a Hindi text: "OTP किसी को न बताएँ" → "OTP (ओटीपी) किसी को
 * न बताएँ". English texts and texts that already spell it are left alone. Display only: answers are checked on the
 * original text, and read-aloud uses the original.
 */
export function glossHindi(text) {
  if (typeof text !== "string" || !DEVANAGARI.test(text)) return text;
  let out = text;
  for (const [term, hindi] of Object.entries(HINDI_SPELLINGS)) {
    if (out.includes(hindi)) continue;
    const re = new RegExp(`(^|[^A-Za-z])(${term})(?![A-Za-z])(?!\\s*\\()`);
    out = out.replace(re, `$1$2 (${hindi})`);
  }
  return out;
}

const EN = {
  // Learn cards
  next: "NEXT",
  done: "DONE",
  doneTick: "DONE ✓",
  tryQuiz: (n) => (Number.isInteger(n) && n > 0 ? `TRY ${n} QUESTIONS ▶` : "TRY THE QUIZ ▶"),
  backToQuestCaps: "BACK TO QUEST",
  skipToQuiz: "Skip to quiz ›",
  readCardsAgain: "Read the cards again",
  seeOnePage: "See everything on one page",
  moreLikeThis: "More like this ›",
  learnedTitle: (n) => `You learned ${n} ${n === 1 ? "thing" : "things"}`,
  learnedSpeech: "You learned: ",
  quickCheck: "QUICK CHECK ✋",
  checkRight: "Yes! 🎉 ",
  checkWrong: (a) => `It's "${a}". `,
  checkHint: "Just a check: no stars lost here.",
  readAloud: "Read aloud",
  previousCard: "Previous card",
  summary: "Summary",
  // Quiz start
  questLabel: "QUEST",
  training: "Training",
  trainingSub: "Hearts, and the reason after every answer.",
  exam: "Exam",
  examSub: "Like a real exam: answers at the end.",
  howToPlay: "HOW DO YOU WANT TO PLAY?",
  examOnlyNote: "EXAM STYLE: PASS IT TO OPEN WHAT'S NEXT",
  startExam: "START EXAM",
  startTraining: "START TRAINING",
  bestStars: (n) => `Best ${n} stars`,
  firstTry: "First try!",
  questionCount: (n) => ` · ${n} questions`,
  // Quiz
  leaveTitle: "Leave this quiz?",
  leaveMessage: (done, total) => `You've answered ${done}${total ? ` of ${total}` : ""}. If you leave now, you'll start this quiz again next time.`,
  keepPlaying: "Keep playing",
  leave: "Leave",
  outOfHearts: "Out of hearts!",
  mistakesHelp: "Don't worry, mistakes help you learn.",
  tryAgain: "Try again",
  quit: "Quit",
  goBack: "Go back",
  tapToCheck: "tap to check",
  pickAnswer: "pick an answer",
  checkMyAnswer: "Check my answer",
  brilliant: "Brilliant!",
  notQuite: "Not quite",
  seeWhyCaps: "SEE WHY",
  continueCaps: "CONTINUE",
  gotItCaps: "GOT IT",
  seeWhy: "See why",
  nextQuestion: "Next question",
  gotItNext: "Got it, next question",
  whyNot: (x) => `Why not '${x}'?`,
  whyNotOthers: "Why not the others?",
  readExplanation: "Read explanation aloud",
  stopReading: "Stop reading",
  listenQuestion: "Listen to the question",
  reviewAnswers: "Review your answers",
  questionN: (n) => `Question ${n}: `,
  submitExam: "SUBMIT EXAM",
  // Results
  quizComplete: "Quiz Complete!",
  greatEffort: "Great effort, {username}!",
  finalScore: "Final Score",
  playAgain: "Play Again",
  backToQuest: "Back to Quest",
  exit: "Exit",
  exitToStudy: "Exit to Study",
  progressSavedTick: "Progress saved ✓",
  tryThatAgain: "Let's try that again",
  goodEffort: "Good effort!",
  lowMessage: "Every mistake shows us what to practise, {username}. Read the reasons, then have another go. You can do it!",
  goodMessage: "Nice work, {username}! A little more practice and you'll have it.",
  toPractise: (n) => (n === 1 ? "1 question to practise" : `${n} questions to practise`),
  starsEarned: (n) => `+${n} ⭐ earned!`,
  progressSaved: "Progress saved!",
  somethingWrong: "Something wrong? Tell us ›",
  close: "Close",
  // Quest map
  myMistakes: "My mistakes",
  comingSoonTitle: "Coming soon!",
  comingSoonText: "This will be ready in a future update.",
  locked: "Locked",
  finishFirst: (t) => `Finish "${t}" first.`,
  passChallengeFirst: "Pass the challenge before this one to open it.",
  whatToDo: "What would you like to do?",
  readAgain: "Read again",
  quizAgain: "Quiz again",
  cancel: "Cancel",
  start: "Start",
  moreUnits: (n) => `${n} more ${n === 1 ? "unit" : "units"} ahead`,
  doneUnit: (a, b, open) => `${a}/${b} topics · ${open ? "Tap to hide" : "Tap to review"}`,
  comingSoon: "Coming soon",
  lockedUnit: (n, needs) => `${n} topics · Beat the ${needs || "Unit Boss"} to open`,
  comingSoonTopic: (t) => `Coming soon: ${t}`,
  noSteps: "This quest has no steps yet.",
};

const HI = {
  next: "आगे",
  done: "हो गया",
  doneTick: "हो गया ✓",
  tryQuiz: (n) => (Number.isInteger(n) && n > 0 ? `${n} सवाल करें ▶` : "सवाल करें ▶"),
  backToQuestCaps: "वापस नक्शे पर",
  skipToQuiz: "सीधे सवालों पर ›",
  readCardsAgain: "कार्ड फिर से पढ़ें",
  seeOnePage: "सब एक पेज पर देखें",
  moreLikeThis: "ऐसे और कार्ड ›",
  learnedTitle: (n) => (n === 1 ? "आपने 1 बात सीखी" : `आपने ${n} बातें सीखीं`),
  learnedSpeech: "आपने सीखा: ",
  quickCheck: "छोटा सवाल ✋",
  checkRight: "सही! 🎉 ",
  checkWrong: (a) => `सही जवाब: "${a}"। `,
  checkHint: "बस एक जाँच: इसमें कोई स्टार नहीं कटेगा।",
  readAloud: "सुनें",
  previousCard: "पिछला कार्ड",
  summary: "सारांश",
  questLabel: "सीखें",
  training: "अभ्यास",
  trainingSub: "हर जवाब के बाद उसका कारण दिखेगा।",
  exam: "परीक्षा",
  examSub: "असली परीक्षा जैसा: जवाब आखिर में।",
  howToPlay: "कैसे करना चाहेंगे?",
  examOnlyNote: "परीक्षा: पास करने पर आगे का हिस्सा खुलेगा",
  startExam: "परीक्षा शुरू करें",
  startTraining: "अभ्यास शुरू करें",
  bestStars: (n) => `अब तक सबसे अच्छा: ${n} स्टार`,
  firstTry: "पहली बार!",
  questionCount: (n) => ` · ${n} सवाल`,
  leaveTitle: "सवाल बीच में छोड़ें?",
  leaveMessage: (done, total) => `आपने ${total ? `${total} में से ` : ""}${done} सवाल किए हैं। अभी छोड़ा तो अगली बार ये सवाल शुरू से होंगे।`,
  keepPlaying: "जारी रखें",
  leave: "छोड़ें",
  outOfHearts: "दिल खत्म हो गए!",
  mistakesHelp: "चिंता न करें, गलतियों से ही हम सीखते हैं।",
  tryAgain: "फिर से कोशिश करें",
  quit: "बाहर निकलें",
  goBack: "वापस जाएँ",
  tapToCheck: "जाँचने के लिए दबाएँ",
  pickAnswer: "एक जवाब चुनें",
  checkMyAnswer: "मेरा जवाब जाँचें",
  brilliant: "शाबाश!",
  notQuite: "यह सही नहीं है",
  seeWhyCaps: "कारण देखें",
  continueCaps: "आगे",
  gotItCaps: "समझ गए",
  seeWhy: "कारण देखें",
  nextQuestion: "अगला सवाल",
  gotItNext: "समझ गए, अगला सवाल",
  whyNot: (x) => `"${x}" सही क्यों नहीं?`,
  whyNotOthers: "बाकी जवाब सही क्यों नहीं?",
  readExplanation: "कारण सुनें",
  stopReading: "सुनना बंद करें",
  listenQuestion: "सवाल सुनें",
  reviewAnswers: "अपने जवाब एक बार देख लें",
  questionN: (n) => `सवाल ${n}: `,
  submitExam: "परीक्षा जमा करें",
  quizComplete: "सवाल पूरे हुए!",
  greatEffort: "बहुत बढ़िया, {username}!",
  finalScore: "कुल अंक",
  playAgain: "फिर से करें",
  backToQuest: "वापस नक्शे पर",
  exit: "बाहर निकलें",
  exitToStudy: "बाहर निकलें",
  progressSavedTick: "प्रगति सेव हो गई ✓",
  tryThatAgain: "चलिए, एक बार फिर कोशिश करें",
  goodEffort: "अच्छी कोशिश!",
  lowMessage: "हर गलती बताती है कि किसका अभ्यास करना है, {username}। कारण पढ़ें और फिर कोशिश करें। आप कर सकते हैं!",
  goodMessage: "बढ़िया, {username}! थोड़ा और अभ्यास, और यह पक्का हो जाएगा।",
  toPractise: (n) => `${n} सवालों का अभ्यास बाकी`,
  starsEarned: (n) => `+${n} ⭐ मिले!`,
  progressSaved: "प्रगति सेव हो गई!",
  somethingWrong: "कुछ गलत लगा? हमें बताएँ ›",
  close: "बंद करें",
  myMistakes: "मेरी गलतियाँ",
  comingSoonTitle: "जल्द आ रहा है!",
  comingSoonText: "यह अगले अपडेट में आएगा।",
  locked: "अभी बंद है",
  finishFirst: (t) => `पहले "${t}" पूरा करें।`,
  passChallengeFirst: "इसे खोलने के लिए पहले वाली चुनौती पार करें।",
  whatToDo: "आप क्या करना चाहेंगे?",
  readAgain: "फिर से पढ़ें",
  quizAgain: "सवाल फिर से करें",
  cancel: "रहने दें",
  start: "शुरू",
  moreUnits: (n) => `आगे ${n} और हिस्से`,
  doneUnit: (a, b, open) => `${b} में से ${a} विषय · ${open ? "छिपाने के लिए दबाएँ" : "देखने के लिए दबाएँ"}`,
  comingSoon: "जल्द आ रहा है",
  lockedUnit: (n, needs) => `${n} विषय · खोलने के लिए ${needs || "पिछला हिस्सा"} पूरा करें`,
  comingSoonTopic: (t) => `जल्द: ${t}`,
  noSteps: "इसमें अभी कुछ नहीं है।",
};

export const LABELS = { en: EN, hi: HI };

/** The label set for a language ("en" when unknown). */
export const labelsFor = (lang) => (lang === "hi" ? HI : EN);

// data/csQuestData.js: Computer Science quest (owner, 17 Nov 2026). Unit 1 "AI: Your Smart Helper" follows the Class 8
// chapter Seema teaches at school (the owner shared it as AI_Chapter_Class8.pdf); kids practise from the week of 23 Nov.
// Questions are our own, written from the chapter's ideas. Quality rules: 4 options, a why-not on every wrong option, at
// least one near miss, exactly one defensible answer. Same helpers and rules as the other tile quests (docs/CONTENT_GUIDE.md).
//
// Class tags: Class 8 and up (owner 17 Nov: younger classes don't see it). Topics run in chapter order; a teacher's
// assignment opens a topic early.
// Content review 17 Nov: the chapter's "2026 popularity ranking" is left out (unverifiable, changes monthly). Claude wrote
// these questions and is one of the helpers named, so the helper topic sticks to checkable facts (who makes it, where you
// find it); there are no "which helper is best" questions.
//
// Mistake tags: ai-feelings-myth, ai-always-right, normal-program-mixup, exact-match-mixup, human-behind-mixup,
// random-guess-mixup, ai-example-mixup, robot-mixup, search-mixup, llm-mixup, genai-mixup, confident-means-right,
// training-data-mixup, stored-answer-mixup, copy-website-mixup, ai-intent-mixup, prompt-mixup, hardware-mixup,
// prediction-mixup, hallucination-mixup, bias-mixup, deepfake-mixup, self-check-mixup, blame-user-mixup,
// maker-mixup, company-assistant-mixup, helper-place-mixup, same-answer-mixup, popular-best-mixup, rules-differ-mixup,
// personal-info-mixup, unsafe-share, partial-share-mixup, fact-check-mixup, safe-letter-mixup, tell-adult-mixup,
// age-rule-mixup, forward-fake-mixup, looks-real-mixup, voice-clone-mixup, secrecy-sign-mixup, verify-with-caller-mixup,
// code-word-mixup, otp-mixup, helpline-mixup, scam-sign-mixup, weak-prompt, homework-machine, factqr-letter-mixup,
// improve-prompt-mixup, privacy-overdo-mixup, footprint-mixup, plagiarism-mixup, paraphrase-plagiarism, ai-friend-myth

import { q, study, quiz, unit, main, boss, forGrades } from "./englishQuest/helpers.js";

export const QUEST_ID = "cs-quest";

export const quest = {
  title: "Computer Science",
  description: "How computers and AI work, and how to use them safely, honestly and well.",
  image: null,
  version: 1,
  draft: true, // owner sees it first; Seema checks the English (review doc); then false + re-seed
};

export const tile = {
  title: "Computer Science",
  type: "QUEST",
  carouselGroup: quest.draft ? "quest_draft" : "quest",
  order: 5,
  image: null,
  questId: QUEST_ID,
  description: "AI, safety and smart computing",
};

const C8UP = [8, 9, 10, 11, 12];
const u1 = forGrades(unit("cs-u1", 1, "AI: Your Smart Helper"), C8UP);
const topic = (id, order, title) => forGrades(main(id, u1.id, order, title, [study(`${id}-study`), quiz(`${id}-quiz`)]), C8UP);

const what = topic("cs-ai-what", 1, "What is AI?");
const how = topic("cs-ai-how", 2, "How a Chatbot Answers");
const helpers = topic("cs-ai-helpers", 3, "Meet the AI Helpers");
const safe = topic("cs-ai-safe", 4, "Using AI Safely");
const scams = topic("cs-ai-scams", 5, "Fakes and Scams");
const prompts = topic("cs-ai-prompts", 6, "Talking to AI Well");
const honest = topic("cs-ai-honest", 7, "Honest and Healthy AI Use");

// A Learn page: idea cards + one check card (4 options), and a plain page for old app versions.
const page = (name, cards, check) => ({
  name,
  author: "Apprec8",
  cards: [...cards.map(([emoji, title, text, examples]) => ({ emoji, title, text, examples })), { kind: "check", ...check }],
  content: cards.map(([emoji, title, text, examples]) => `### ${emoji} ${title}\n\n${text}\n\n${examples.map((e) => `- ${e}`).join("\n")}`).join("\n\n"),
});

export const studyPages = {
  "cs-ai-what-study": page(
    "What is AI?",
    [
      ["🤖", "What is AI?", "Artificial Intelligence (AI) is software that does jobs which usually need human thinking: understanding language, recognising faces, learning from examples and giving suggestions.", ["A normal program follows fixed steps a programmer wrote", "An AI system learns from many examples, then handles new cases", "AI is not a robot with feelings: it finds patterns in data"]],
      ["📱", "AI is all around you", "You already use AI every day, often without noticing it.", ["Face unlock still knows you with new glasses or a haircut", "Maps picks the fastest road from live traffic", "YouTube suggests your next video", "Alexa, Siri and Google Assistant understand speech"]],
      ["💬", "Chatbots and LLMs", "A chatbot is a program you can talk to by typing or speaking. Modern chatbots run on a Large Language Model (LLM): a huge AI trained on an enormous amount of text.", ["The LLM is the engine; the chatbot is the car built around it", "Simple chatbots, like many app help chats, answer only a fixed set of questions", "Reading a lot is not the same as understanding"]],
      ["✨", "Generative AI", "Generative AI makes something new: text, pictures, music, voices, video or computer code. Other AI only sorts or recognises things that already exist.", ["Generative: \"Draw a cat in a school uniform\"", "Not generative: a spam filter sorting emails", "Every chatbot in this unit is generative AI: it writes a new answer each time"]],
    ],
    {
      question: "Which of these is generative AI?",
      answer: "An app that writes a poem about the monsoon",
      wrong: ["A spam filter sorting emails", "Face unlock on a phone", "Maps choosing the fastest road"],
      explain: "It creates something new. The others are AI too, but they sort, recognise or choose instead of creating.",
    }
  ),
  "cs-ai-how-study": page(
    "How a Chatbot Answers",
    [
      ["🔮", "It predicts, one word at a time", "You type a prompt. The AI breaks it into small pieces, looks for patterns it learned, then predicts the next word, again and again, until the answer is done.", ["Like your phone keyboard suggesting \"morning\" after \"Good\"", "It guesses likely words; it does not know things the way you do", "So it can sound sure and still be wrong"]],
      ["📚", "Training data", "Training data is everything an AI learned from before people use it: text, pictures and sounds. It is the AI's school and library.", ["Good, varied data gives better and fairer answers", "Little data about a topic gives thin or wrong answers", "Like a student who studied from only one old guide book"]],
      ["🌀", "Hallucination", "A hallucination is when AI makes up false information and says it confidently. It would rather fill a gap than say \"I don't know\".", ["A list of an author's books with one title they never wrote", "2023: a New York lawyer gave a court made-up cases from a chatbot and was fined", "Check important facts in your textbook"]],
      ["⚖️", "Bias", "Bias means unfair, one-sided results. In AI it happens when the training data is limited, unbalanced or carries unfair human opinions.", ["A voice assistant trained on one accent misunderstands other accents", "If it mostly saw men as doctors, it keeps showing that unfair picture", "Notice unfair answers: \"a machine said it\" is not a reason to accept it"]],
    ],
    {
      question: "A chatbot confidently gives a fact that it made up. What is this called?",
      answer: "A hallucination",
      wrong: ["Bias", "A prediction", "A deepfake"],
      explain: "Made-up information said confidently is a hallucination. Always check important facts.",
    }
  ),
  "cs-ai-helpers-study": page(
    "Meet the AI Helpers",
    [
      ["🏭", "Company and assistant", "A company builds the AI. The assistant is the product you chat with, like a car company and a car model.", ["OpenAI → ChatGPT · Anthropic → Claude", "Google → Gemini · Microsoft → Copilot", "xAI → Grok · Meta → Meta AI", "Perplexity AI → Perplexity"]],
      ["🧭", "Where you meet them", "Some helpers have their own website and app. Others live inside apps people already use.", ["Gemini: Google apps and many Android phones", "Copilot: Windows, Word, PowerPoint and Edge", "Meta AI: WhatsApp, Instagram and Facebook", "Grok: linked to the social media platform X"]],
      ["🔎", "Pick by what you need", "They all predict words from patterns, but each has its own maker, style and strengths. Choose the one that fits the job, not just the most popular one.", ["Research with sources you can check: Perplexity (still check the links)", "Slides or documents in Microsoft Office: Copilot", "Google Docs, Gmail or Search: Gemini", "Many people use two or more helpers"]],
      ["⚠️", "Same rules for every helper", "No AI is always right. Age rules differ (some tools need 13+, some 18+), so use AI with a parent or teacher, on an adult's account.", ["Never share private details, even inside WhatsApp", "New helpers arrive every year: names change, rules stay", "Others you may hear of: DeepSeek, Character.AI"]],
    ],
    {
      question: "Which company makes Gemini?",
      answer: "Google",
      wrong: ["Meta", "Microsoft", "OpenAI"],
      explain: "Google makes Gemini. Meta makes Meta AI, Microsoft makes Copilot and OpenAI makes ChatGPT.",
    }
  ),
  "cs-ai-safe-study": page(
    "Using AI Safely",
    [
      ["🔒", "Privacy", "Privacy is your right to keep your personal information safe and to decide who sees it. Chats with AI may be saved, and you can't be sure who reads them later.", ["You close the bathroom door and don't tell strangers your address", "Use a nickname and a general example", "Ask a parent to check the privacy settings"]],
      ["🪪", "Personal information", "Personal information is anything that could help a stranger recognise, find or contact you.", ["Full name, home address, phone number, photo", "School name and class section", "Passwords and OTPs: never, to anyone, including AI", "Say \"I am a Class 8 student\" instead"]],
      ["✅", "Fact-checking", "Fact-checking means confirming that something is true using trusted sources: textbooks, encyclopaedias, government websites or your teacher.", ["An AI said \"humans use only 10% of their brain\": that is a myth", "Check at least two trusted sources for anything important", "Ask the AI for its source, then check that source yourself"]],
      ["🛑", "Should I type this into AI?", "Before you type, ask three questions. Is it personal? Stop. Is it for cheating or hurting someone? Stop. Do I have an adult's permission? Then go ahead, and check the answer.", ["Be S.A.F.E.: Secrets stay secret", "Ask an adult when unsure", "Fact-check everything important", "Express it in your own words"]],
    ],
    {
      question: "Which is safe to type into a chatbot?",
      answer: "I am a Class 8 student and need help with fractions.",
      wrong: ["I am Riya from 8-B, Green Valley School. Help with fractions.", "My phone number is 98765 43210. Help with fractions.", "The OTP I just got is 4821. Help with fractions."],
      explain: "Your class level is enough for good help. Names, schools, phone numbers and OTPs stay private.",
    }
  ),
  "cs-ai-scams-study": page(
    "Fakes and Scams",
    [
      ["🎭", "Deepfakes", "A deepfake is a fake photo, audio or video made with AI, so that a real person seems to say or do something they never did.", ["A \"famous cricketer\" video promoting a money app", "Look for odd hands, teeth, shadows or text", "Fakes keep improving: check the source and ask an adult", "Don't believe or forward shocking videos at once"]],
      ["📞", "Voice cloning", "AI can copy a person's voice from just a few seconds of recording, for example a short video posted online.", ["\"I'm in trouble, send money now, don't tell Mummy!\"", "Three warning signs: urgency, secrecy, money", "Hang up and call back on the real number", "Keep a family code word"]],
      ["🎣", "Scams", "A scam is a trick to take your money, personal information or passwords, usually by pretending to be someone you trust. AI makes scam messages, voices and faces look real.", ["\"You won a free phone! Share the OTP to claim it\"", "An OTP lets a scammer take money from a bank account", "Never share an OTP, password or bank detail"]],
      ["🚨", "If a scam happens", "Tell an adult at once and keep the evidence: screenshots, numbers, messages. Call the National Cyber Crime Helpline 1930 or report at cybercrime.gov.in.", ["1930: online money fraud and cyber crime", "1098: Childline, for any child who needs help", "The sooner you report, the better the chance of stopping the money"]],
    ],
    {
      question: "What are the three warning signs of a voice-clone scam call?",
      answer: "Urgency, secrecy and a demand for money",
      wrong: ["A known voice, a known name and a polite tone", "A bad line, a long call and a late hour", "Questions about school, food and sleep"],
      explain: "\"Hurry, don't tell anyone, send money\": that mix means hang up and check with an adult.",
    }
  ),
  "cs-ai-prompts-study": page(
    "Talking to AI Well",
    [
      ["✍️", "Prompt", "A prompt is the question or instruction you give an AI. Good prompt in, good answer out.", ["Weak: \"volcano\" (the AI has to guess what you want)", "Strong: \"Explain how a volcano erupts to a Class 8 student in 5 simple points\"", "Like asking a shopkeeper for \"something to eat\" or for \"one packet of salted peanuts\""]],
      ["🎯", "Rules for a good prompt", "An effective prompt is clear and specific. It says what you need, who it is for and how the answer should look.", ["Give a role: \"Act as a friendly science teacher\"", "Say who it is for and the format: \"For Class 8, in 5 points\"", "Never add private details", "Not happy? Say \"make it simpler\" and ask again"]],
      ["🧩", "FACT-QR", "A six-part checklist before you press Enter: Function, Audience, Context, Task, Quality and format, Review.", ["F: \"You are a science teacher.\" A: \"For a Class 8 student.\"", "C: \"I find this topic confusing.\"", "T: \"Explain it step by step.\" Q: \"5 steps, under 120 words.\"", "R: \"End with 3 quiz questions.\" Now you practise, not just read"]],
      ["🤝", "A study buddy, not a homework machine", "Let AI explain and quiz you, but do the thinking yourself.", ["Maths: \"Explain 2x + 5 = 15 step by step. Don't just give the answer.\"", "English: \"Suggest 3 ways to improve my paragraph, but don't rewrite it.\"", "Revision: \"Quiz me on this chapter, one question at a time.\""]],
    ],
    {
      question: "In FACT-QR, what does the A stand for?",
      answer: "Audience",
      wrong: ["Answer", "Action", "Accuracy"],
      explain: "A = Audience: who the answer is for, like \"for a Class 8 student\".",
    }
  ),
  "cs-ai-honest-study": page(
    "Honest and Healthy AI Use",
    [
      ["👣", "Digital footprint", "Everything you type, post, search, click, like or chat online leaves a trail, on purpose or without noticing. It can stay for years.", ["A public photo in school uniform tells strangers where you study", "An angry comment can be seen years later", "Think before you type, post or share"]],
      ["📝", "Plagiarism", "Plagiarism is copying someone else's work, or an AI's, and presenting it as your own without giving credit. It is dishonest.", ["AI writes the whole essay and you hand it in: plagiarism", "Honest: use AI for ideas or a quiz, then write in your own words", "Say how it helped: \"I used AI for ideas and checked facts in my textbook\""]],
      ["💛", "AI is a tool, not a friend", "AI can sound friendly, but it has no feelings and is not a person. Talk about your feelings with family, teachers or the school counsellor.", ["Feeling low or unsafe? Tell a trusted adult", "Childline 1098 helps any child", "Tele-MANAS 14416: free support to talk about feelings"]],
      ["🕵️", "Myth or fact?", "\"If AI sounds confident, it must be correct.\" Myth! Sounding sure is not the same as being right.", ["DO: check facts, keep details private, write in your own words", "DO: say honestly how AI helped you", "DON'T: copy-paste, make fake photos or voices of others, cheat or bully"]],
    ],
    {
      question: "Rhea asks AI to write her whole essay and hands it in as her own. What is this?",
      answer: "Plagiarism",
      wrong: ["Fact-checking", "A digital footprint", "Good prompting"],
      explain: "Presenting AI's work as your own is plagiarism. Use AI for ideas, then write it yourself.",
    }
  ),
};

export const quizzes = {
  "cs-ai-what-quiz": [
    q("What can an AI system do that a normal program cannot?", "Learn from many examples to handle new cases", [
      ["Follow only the fixed steps that a programmer wrote", "normal-program-mixup", "That is what a normal program does. AI learns patterns from examples."],
      ["Feel happy or sad like a person", "ai-feelings-myth", "AI is software that finds patterns. It has no feelings."],
      ["Give answers that are never wrong", "ai-always-right", "AI can be wrong, often while sounding very sure."],
    ], "A normal program follows fixed steps. An AI system learns from examples, so it can deal with situations it has not seen before."),
    q("Your phone still unlocks with your face after a new haircut. Why?", "Its AI learned the pattern of your face", [
      ["It matches one saved photo exactly", "exact-match-mixup", "An exact match would fail after a haircut. The AI learned the pattern, so small changes are fine."],
      ["Someone at the phone company checks the camera", "human-behind-mixup", "No person watches. Software does it in a moment."],
      ["It guesses at random and was lucky", "random-guess-mixup", "It is not random. It compares your face with the pattern it learned."],
    ], "Face unlock is AI: it learned what your face looks like, so glasses, poor light or a new haircut don't fool it."),
    q("Which of these is NOT an example of AI?", "A torch that turns on when you press its button", [
      ["Maps choosing the fastest road from live traffic", "ai-example-mixup", "Maps studies live traffic to choose a road. That is AI."],
      ["YouTube suggesting the next video to watch", "ai-example-mixup", "YouTube learns what you like to suggest videos. That is AI."],
      ["A voice assistant understanding what you say", "ai-example-mixup", "Understanding speech needs AI."],
    ], "A torch just follows one fixed rule: button pressed, light on. It learns nothing, so it isn't AI."),
    q("What is a chatbot?", "A program you can talk with by typing or speaking", [
      ["A small robot that walks and talks", "robot-mixup", "A chatbot is software, not a robot body."],
      ["A person who answers chats for a company", "human-behind-mixup", "A chatbot is a program, not a person."],
      ["A search page that only shows you a long list of links", "search-mixup", "A search page lists links. A chatbot replies in sentences, like a person."],
    ], "A chatbot reads what you type or say and replies in normal language, the way a person might."),
    q("The chapter compares an LLM and a chatbot to a car. Which match is right?", "LLM = the engine, chatbot = the car", [
      ["LLM = the car, chatbot = the engine", "llm-mixup", "Backwards. The LLM does the language work inside; the chatbot is what you use."],
      ["LLM = the driver, chatbot = the road", "llm-mixup", "The LLM isn't a person steering. It is the engine inside the chatbot."],
      ["They are two names for the same thing", "llm-mixup", "They are different: you talk to the chatbot, and the LLM works behind it."],
    ], "You talk to the chatbot (the car). The LLM (the engine) does the language work behind it."),
    q("What does \"Large\" mean in Large Language Model?", "It learned from a huge amount of text", [
      ["It runs on a very big and powerful computer", "llm-mixup", "\"Large\" is about how much it learned and how many settings it has, not the size of a box."],
      ["It writes only long answers", "llm-mixup", "It can write short answers too."],
      ["It knows every language perfectly", "ai-always-right", "It does not know every language perfectly. \"Large\" is about its data."],
    ], "An LLM is trained on an enormous amount of text and has a huge number of internal settings (parameters)."),
    q("Which of these is AI, but NOT generative AI?", "A filter that sorts emails into spam and not spam", [
      ["A tool that draws a poster of the water cycle", "genai-mixup", "Drawing a new poster creates something, so it is generative AI."],
      ["A chatbot that writes a poem on the monsoon", "genai-mixup", "Writing a new poem is creating: generative AI."],
      ["An app that makes a new song from a tune idea", "genai-mixup", "Making a new song is creating: generative AI."],
    ], "A spam filter only sorts what already exists. Generative AI makes something new."),
    q("\"An LLM has read so much that it is always right.\" Is this true?", "No: reading a lot is not the same as understanding", [
      ["Yes: it has read far more than any person ever could", "ai-always-right", "Reading more does not make it always right. It can still be wrong."],
      ["Yes, as long as the answer sounds confident", "confident-means-right", "Sounding sure is not the same as being right."],
      ["No, because LLMs have not read anything", "training-data-mixup", "LLMs do learn from huge amounts of text. They can still be wrong."],
    ], "An LLM learns patterns from lots of text, but it doesn't truly understand, so it can make mistakes."),
  ],

  "cs-ai-how-quiz": [
    q("How does a chatbot build its answer?", "It predicts the next word, again and again", [
      ["It looks up one stored answer for each question", "stored-answer-mixup", "There is no store of ready answers. It writes a new answer each time by predicting words."],
      ["It thinks about the question the way a human does", "ai-intent-mixup", "AI predicts from patterns. It does not truly think or understand."],
      ["It copies the answer from one website", "copy-website-mixup", "It doesn't copy one site. It predicts words from patterns it learned."],
    ], "A chatbot predicts the most suitable next word, then the next, until the answer is complete."),
    q("You type \"Good\" and your phone keyboard suggests \"morning\". Which AI idea is this, on a small scale?", "Prediction", [
      ["Hallucination", "hallucination-mixup", "A hallucination is made-up false information. This is a guess of the next word."],
      ["Bias", "bias-mixup", "Bias is an unfair, one-sided result. This is guessing what comes next."],
      ["Privacy", "prediction-mixup", "Privacy is about keeping your information safe. This is guessing the next word."],
    ], "The keyboard guesses the most likely next word from patterns. Chatbots do the same on a much bigger scale."),
    q("Why can a chatbot sound sure and still be wrong?", "It predicts likely words but does not truly understand", [
      ["It wants to trick you on purpose", "ai-intent-mixup", "AI has no wishes. Wrong answers come from guessing patterns."],
      ["Its makers type every wrong answer by hand", "human-behind-mixup", "No one types the answers. The AI predicts them."],
      ["It only goes wrong when the internet connection is slow", "hardware-mixup", "A fast connection doesn't make it right. Mistakes come from prediction."],
    ], "Because it guesses likely words instead of knowing facts, a confident answer can still be wrong."),
    q("What is training data?", "What an AI learned from before people used it", [
      ["The question you type into a chatbot today", "prompt-mixup", "That is your prompt. Training data came much earlier."],
      ["How fast the computer running the AI is", "hardware-mixup", "Speed is about the machine. Training data is what the AI learned from."],
      ["A ready-made list of every answer the AI will ever give", "stored-answer-mixup", "There is no list of answers. The AI learns patterns from its data."],
    ], "Training data is the AI's school and library: the text, pictures and sounds it learned from."),
    q("An AI saw very little about village life in Uttarakhand. Its answers on this will most likely be…", "Thin or wrong", [
      ["Perfect, because AI knows everything", "ai-always-right", "AI only knows what was in its training data."],
      ["Better than a local person's answers", "training-data-mixup", "Someone who lives there knows far more than an AI with little data."],
      ["The same quality as on any other topic", "training-data-mixup", "Little data on a topic means weaker answers on that topic."],
    ], "An AI can only be as good as the data it learned from."),
    q("Priya asks a chatbot for five books by Ruskin Bond. One title in its list was never written by him. This is…", "A hallucination", [
      ["Bias", "bias-mixup", "Bias is an unfair, one-sided result. A made-up title is a hallucination."],
      ["A deepfake", "deepfake-mixup", "A deepfake is a fake photo, voice or video of a person."],
      ["Plagiarism", "hallucination-mixup", "Plagiarism is passing off someone's work as yours. Making up a title is a hallucination."],
    ], "When AI fills a gap with made-up details and says them confidently, it is hallucinating."),
    q("A voice assistant often misunderstands people with regional accents. What is the most likely cause?", "Its training data had few voices like theirs", [
      ["Those people are speaking wrongly", "blame-user-mixup", "No accent is wrong. The AI heard too few voices like theirs."],
      ["The phone's microphone is broken", "hardware-mixup", "It works for other voices, so the microphone is fine."],
      ["The assistant dislikes some people", "ai-intent-mixup", "AI has no likes or dislikes. Unbalanced data causes the unfair result."],
    ], "This is bias: unbalanced training data makes the AI better for some people and worse for others."),
    q("A chatbot gives you an important fact for your project. What should you do?", "Check it in your textbook or another trusted source", [
      ["Use it, because it sounded confident", "confident-means-right", "Sounding sure doesn't mean being right."],
      ["Ask the same chatbot again whether it is really sure", "self-check-mixup", "The same chatbot can repeat its own mistake. Check a separate trusted source."],
      ["Share it with friends before checking", "unsafe-share", "Sharing first can spread a wrong fact. Check first."],
    ], "Check important facts in a trusted source, separate from the AI that gave them."),
  ],

  "cs-ai-helpers-quiz": [
    q("Which company makes ChatGPT?", "OpenAI", [
      ["Google", "maker-mixup", "Google makes Gemini."],
      ["Microsoft", "maker-mixup", "Microsoft makes Copilot."],
      ["Anthropic", "maker-mixup", "Anthropic makes Claude."],
    ], "OpenAI is the company; ChatGPT is its assistant."),
    q("Which pair is written the right way round, company → assistant?", "Microsoft → Copilot", [
      ["Copilot → Microsoft", "company-assistant-mixup", "Backwards: Microsoft is the company, Copilot is the assistant."],
      ["Google → ChatGPT", "maker-mixup", "ChatGPT is made by OpenAI. Google makes Gemini."],
      ["Meta → Grok", "maker-mixup", "Grok is made by xAI. Meta makes Meta AI."],
    ], "A company builds the AI; the assistant is the product you chat with. Microsoft builds Copilot."),
    q("Which AI helper is built into Word, PowerPoint and Windows?", "Copilot", [
      ["Grok", "helper-place-mixup", "Grok is linked to the X platform."],
      ["Perplexity", "helper-place-mixup", "Perplexity is an AI search tool with its own website and app."],
      ["Meta AI", "helper-place-mixup", "Meta AI sits inside WhatsApp, Instagram and Facebook."],
    ], "Copilot is Microsoft's helper, so it is built into Microsoft tools."),
    q("Which helper is best known as an AI search tool that shows its sources as links?", "Perplexity", [
      ["Meta AI", "helper-place-mixup", "Meta AI is known for being inside chat apps like WhatsApp."],
      ["Grok", "helper-place-mixup", "Grok is known for its link to the X platform."],
      ["Character.AI", "helper-place-mixup", "Character.AI is for chatting with made-up characters, not research."],
    ], "Perplexity shows where its facts came from. You should still open the links and check them."),
    q("Where can you meet Meta AI without installing a new app?", "Inside WhatsApp, Instagram or Facebook", [
      ["Inside Word and PowerPoint", "helper-place-mixup", "That is Copilot, Microsoft's helper."],
      ["Inside Google Docs and Gmail", "helper-place-mixup", "That is Gemini, Google's helper."],
      ["Only on the X platform", "helper-place-mixup", "That is Grok, from xAI."],
    ], "Meta makes WhatsApp, Instagram and Facebook, so Meta AI sits inside them. Never share private details there either."),
    q("Grok is made by xAI. Which social media platform is it linked to?", "X", [
      ["Instagram", "helper-place-mixup", "Instagram has Meta AI inside it."],
      ["YouTube", "helper-place-mixup", "YouTube belongs to Google, whose helper is Gemini."],
      ["WhatsApp", "helper-place-mixup", "WhatsApp has Meta AI inside it."],
    ], "Grok, from xAI, is linked to X and has its own app too."),
    q("You give the same prompt to two different AI helpers. What usually happens?", "The two answers can be different", [
      ["Both give exactly the same words", "same-answer-mixup", "Different makers and models give different answers."],
      ["Only one of them is able to answer", "same-answer-mixup", "Both can answer; their answers just differ."],
      ["Both refuse, because the prompt was shared", "same-answer-mixup", "Using one prompt twice is fine. Comparing answers is a good habit."],
    ], "Each helper has its own maker, style and strengths, so answers differ. Comparing them helps you choose."),
    q("Which is true about choosing an AI helper?", "Choose by what you need; popular is not always best", [
      ["The most popular helper is always the best one for you", "popular-best-mixup", "Popular is not always best for your job."],
      ["Only one helper in the world is safe to use", "rules-differ-mixup", "No helper is always right or safe on its own. You keep the safety rules."],
      ["Safety rules are different for each helper", "rules-differ-mixup", "Names change, rules stay: the same safety rules apply to every helper."],
    ], "Pick the helper that fits the job, and follow the same safety rules with all of them."),
  ],

  "cs-ai-safe-quiz": [
    q("Which of these is personal information?", "Your school's name and class section", [
      ["Your favourite colour", "personal-info-mixup", "A favourite colour can't help a stranger find or contact you."],
      ["The chapter you are revising", "personal-info-mixup", "A chapter name says nothing about who or where you are."],
      ["The planet you like most", "personal-info-mixup", "A favourite planet can't help anyone find you."],
    ], "Your school and section tell a stranger where to find you, so they are personal information."),
    q("Which prompt keeps your privacy safe?", "I am a Class 8 student. Please explain fractions with an example.", [
      ["I am Kabir from 8-B, Sunrise School, Pune. Please explain fractions.", "personal-info-mixup", "Name, class section and school together tell a stranger where to find you."],
      ["Explain fractions. My home is at 14 Lake Road, Pune.", "personal-info-mixup", "Never type your address."],
      ["Explain fractions. My login password is kabir123.", "unsafe-share", "Passwords are never shared, not even with an AI."],
    ], "\"Class 8 student\" gets you the same help without telling anyone who or where you are."),
    q("A chat asks for the OTP sent to your mother's phone, \"to help with your homework\". What do you do?", "Don't share it, and tell an adult", [
      ["Share it, since it is for homework", "unsafe-share", "Homework never needs an OTP. Whoever asks is trying to trick you."],
      ["Share only the first three digits", "partial-share-mixup", "Even part of an OTP helps a scammer. Share none of it."],
      ["Ask the chatbot whether sharing is safe", "self-check-mixup", "Don't rely on a chat to judge itself. OTPs are never shared: tell an adult."],
    ], "OTPs and passwords are never shared with anyone, including an AI."),
    q("What does fact-checking mean?", "Confirming a statement with trusted sources", [
      ["Asking the same AI the question again", "self-check-mixup", "The same AI can repeat its mistake. Use a separate trusted source."],
      ["Believing whichever answer sounds most sure", "confident-means-right", "Sounding sure is not proof."],
      ["Counting how many facts an answer has", "fact-check-mixup", "Fact-checking is about whether facts are true, not how many there are."],
    ], "Check with textbooks, encyclopaedias, government websites or your teacher."),
    q("An AI told Aarav \"humans use only 10% of their brain\". What should he have done before putting it in his project?", "Checked the fact in his textbook", [
      ["Copied it, since the AI said it clearly", "confident-means-right", "Clear and confident is not the same as true. It is a myth."],
      ["Asked a friend to put it in too", "fact-check-mixup", "Two people copying a myth doesn't make it true."],
      ["Added more AI facts to make it longer", "fact-check-mixup", "More unchecked facts means more chances of mistakes."],
    ], "His textbook showed it is a myth. Checking one fact would have saved him from the mistake."),
    q("In S.A.F.E., what does F stand for?", "Fact-check everything important", [
      ["Follow whatever the AI says", "safe-letter-mixup", "The opposite: don't follow AI blindly."],
      ["Find a newer AI helper", "safe-letter-mixup", "F is about checking facts, not changing helpers."],
      ["Forward useful answers to friends", "safe-letter-mixup", "Forwarding unchecked answers can spread mistakes."],
    ], "S.A.F.E.: Secrets stay secret, Ask an adult when unsure, Fact-check everything important, Express it in your own words."),
    q("Something in a chatbot's answer scares or upsets you. What should you do?", "Stop and tell a trusted adult", [
      ["Keep chatting to find out more", "tell-adult-mixup", "Stop first. A trusted adult can help you make sense of it."],
      ["Hide it so no one finds out", "tell-adult-mixup", "You are not in trouble. Telling an adult is the brave, right step."],
      ["Show it to friends before anyone else", "tell-adult-mixup", "Friends may not know what to do. Go to a trusted adult first."],
    ], "If something scares you online, stop and tell a parent, teacher or the school counsellor."),
    q("Why should a Class 8 student use AI with a parent or teacher, on an adult's account?", "Age rules differ: some tools need 13+, some 18+", [
      ["AI only works on adults' phones", "age-rule-mixup", "AI works on any phone. The rule is about age and safety."],
      ["Children's questions cost extra money", "age-rule-mixup", "The reason is age rules and safety, not money."],
      ["An adult's account always gives the right answers", "ai-always-right", "No account makes AI always right."],
    ], "Each tool has its own age rule, so an adult helps you use AI safely and within the rules."),
  ],

  "cs-ai-scams-quiz": [
    q("What is a deepfake?", "A fake photo, voice or video made with AI", [
      ["A real video of a famous person", "deepfake-mixup", "A deepfake is fake: the person never said or did it."],
      ["A virus hidden inside a photo", "deepfake-mixup", "A deepfake fools your eyes and ears; it isn't a virus."],
      ["A blurry photo taken at night", "deepfake-mixup", "A bad photo is just a bad photo. A deepfake is made with AI to look real."],
    ], "A deepfake makes a real person seem to say or do something they never did."),
    q("A video shows a famous film star asking people to put money into a new app. What is the safest first step?", "Doubt it, check the source and ask an adult", [
      ["Put in a little money to test it", "scam-sign-mixup", "Even a little money can be lost. Check first."],
      ["Forward it to family so they know", "forward-fake-mixup", "Forwarding a possible fake spreads it."],
      ["Trust it, since the face looks real", "looks-real-mixup", "AI can make faces and voices look real."],
    ], "Fake celebrity adverts are a common deepfake scam. Check the source and talk to an adult."),
    q("How much recording can AI need to copy someone's voice?", "Just a few seconds", [
      ["At least ten hours", "voice-clone-mixup", "Far less is needed: a few seconds can be enough."],
      ["A full song sung by that person", "voice-clone-mixup", "A few seconds of speech, like a short video, can be enough."],
      ["None, because AI cannot copy voices", "voice-clone-mixup", "It can. That is why voice-clone scam calls happen."],
    ], "A short video posted online can be enough to clone a voice."),
    q("A call in your cousin's voice says: \"I'm in trouble. Send money now. Don't tell anyone!\" What do you do?", "Hang up, tell an adult, call back on the real number", [
      ["Send money quickly, since it is an emergency", "scam-sign-mixup", "Hurry plus money is exactly what scammers use."],
      ["Keep it secret, as they asked", "secrecy-sign-mixup", "Asking for secrecy is a warning sign. Tell an adult."],
      ["Ask the caller to prove it, then pay", "verify-with-caller-mixup", "A scammer can answer questions too. Check by calling the real number."],
    ], "Urgency, secrecy and money are the three warning signs. Check on the real number."),
    q("What is a family code word for?", "Checking that a caller really is family", [
      ["Unlocking the family's bank app", "code-word-mixup", "It is not a password. It is a secret word to check who is calling."],
      ["Getting free data from the phone company", "code-word-mixup", "It has nothing to do with data. It checks who is calling."],
      ["Sending money faster in an emergency", "code-word-mixup", "It is for checking the caller, not for paying."],
    ], "If a \"family member\" calls in trouble and can't say the code word, it may be a cloned voice."),
    q("\"You have won a free phone! Share the OTP we sent you to claim it.\" What will the scammer do with the OTP?", "Use it to take money from a bank account", [
      ["Use it to send you the phone", "otp-mixup", "There is no phone. Prizes never need an OTP."],
      ["Nothing: OTPs are harmless numbers", "otp-mixup", "An OTP is a key to an account. That is why it must stay secret."],
      ["Check that you are a real student", "otp-mixup", "OTPs aren't for checking students. They unlock accounts and payments."],
    ], "An OTP is a one-time key. Never share an OTP, password or bank detail with anyone."),
    q("Which number is India's National Cyber Crime Helpline?", "1930", [
      ["1098", "helpline-mixup", "1098 is Childline, which helps children in need."],
      ["112", "helpline-mixup", "112 is the all-in-one emergency number. For online fraud, call 1930."],
      ["14416", "helpline-mixup", "14416 is Tele-MANAS, for support with feelings."],
    ], "Call 1930 or report at cybercrime.gov.in, and tell an adult."),
    q("Why does AI make scams more dangerous?", "Scammers can write perfect messages and copy voices and faces", [
      ["AI makes scam messages full of spelling mistakes", "scam-sign-mixup", "The opposite: AI messages read smoothly, so spelling mistakes are no longer a sure sign."],
      ["AI can take money from you without you sharing anything at all", "scam-sign-mixup", "Scams still need you to share or pay. Don't share OTPs or send money."],
      ["AI tells scammers when you call 1930", "helpline-mixup", "It doesn't. Calling 1930 is always a good step."],
    ], "AI makes fakes look and sound real, so check the source and use a family code word."),
  ],

  "cs-ai-prompts-quiz": [
    q("Which is the most effective prompt?", "Give 5 simple facts about India's rivers for a Class 8 project", [
      ["tell me about India", "weak-prompt", "Too vague: the AI has to guess what you want."],
      ["rivers india facts", "weak-prompt", "Still vague: how many facts, for whom, how long?"],
      ["Write my whole India project for me", "homework-machine", "That asks AI to do your work. Ask for facts or ideas instead."],
    ], "It says what you need (5 facts), the topic (rivers) and who it is for (Class 8)."),
    q("In FACT-QR, what does F stand for?", "Function: who the AI should act as", [
      ["Facts: the answers you want", "factqr-letter-mixup", "F is Function, the role, like \"You are a science teacher\"."],
      ["Format: how long the answer is", "factqr-letter-mixup", "Format belongs to Q (Quality and format)."],
      ["Friend: the AI is your friend", "ai-friend-myth", "AI is a tool, not a friend. F is Function."],
    ], "F = Function: \"You are a friendly science teacher.\""),
    q("\"End with 3 quiz questions\" is which part of FACT-QR?", "R: Review", [
      ["T: Task", "factqr-letter-mixup", "Task is the main job, like \"Explain it step by step\"."],
      ["Q: Quality and format", "factqr-letter-mixup", "Quality and format is about length and style, like \"5 steps, under 120 words\"."],
      ["C: Context", "factqr-letter-mixup", "Context is your background, like \"I find this confusing\"."],
    ], "R = Review: how you will check yourself. It makes you practise, not just read."),
    q("\"I find photosynthesis confusing\" is which part of FACT-QR?", "C: Context", [
      ["A: Audience", "factqr-letter-mixup", "Audience is who it is for, like \"for a Class 8 student\"."],
      ["T: Task", "factqr-letter-mixup", "Task is what to do, like \"Explain it step by step\"."],
      ["F: Function", "factqr-letter-mixup", "Function is the role, like \"You are a science teacher\"."],
    ], "C = Context: the background, what you know and why you need help."),
    q("The AI's answer is too hard to understand. What is the best next step?", "Improve the prompt, for example \"Make it simpler\"", [
      ["Give up on the topic", "improve-prompt-mixup", "Don't give up. Change what you ask."],
      ["Copy the hard answer anyway", "homework-machine", "Copying something you don't understand teaches you nothing."],
      ["Type the same prompt again in capitals", "improve-prompt-mixup", "Capitals change nothing. Change the words of your prompt."],
    ], "Not happy with the answer? Improve the prompt and ask again."),
    q("Which prompt uses AI as a study buddy, not a homework machine?", "Explain 2x + 5 = 15 step by step. Don't just give the answer.", [
      ["Solve all of my maths homework and give me only the final answers", "homework-machine", "That gets answers without learning."],
      ["Write my essay so I can hand it in", "homework-machine", "Handing in AI's essay as yours is plagiarism."],
      ["Do all ten sums so I can copy them", "homework-machine", "Copying sums teaches nothing, and your teacher will see it."],
    ], "Let AI explain and quiz you, but do the thinking yourself."),
    q("Why is \"volcano\" a weak prompt?", "The AI has to guess what you want", [
      ["It is too long for AI to read", "weak-prompt", "It is one word: the problem is it's too short and vague."],
      ["AI does not know about volcanoes", "weak-prompt", "AI knows about volcanoes. It just doesn't know what you want to know."],
      ["One-word prompts are not allowed", "weak-prompt", "They are allowed, just not very useful."],
    ], "A strong prompt says what, for whom and how: \"Explain how a volcano erupts to a Class 8 student in 5 simple points.\""),
    q("Which detail should you never add to a prompt?", "Your home address", [
      ["Which class you are in", "privacy-overdo-mixup", "\"I am in Class 8\" helps AI pitch the answer, and doesn't say who you are."],
      ["The topic you find hard", "privacy-overdo-mixup", "That is useful context and isn't personal."],
      ["How long the answer should be", "privacy-overdo-mixup", "That is format, a good part of a prompt."],
    ], "Never add private details: name, address, phone, school, photos, passwords or OTPs."),
  ],

  "cs-ai-honest-quiz": [
    q("What is a digital footprint?", "The trail of information you leave online", [
      ["The number of steps your phone counts", "footprint-mixup", "A step counter counts steps. A digital footprint is what you leave online."],
      ["A photo of your shoes on the internet", "footprint-mixup", "It's not about shoes: it is everything you type, post, search and click."],
      ["The password to your account", "footprint-mixup", "A password is a secret key. A footprint is the trail you leave."],
    ], "Everything you type, post, search, click, like or chat leaves marks that can stay for years."),
    q("Which of these does NOT add to your digital footprint?", "Reading a paper book at home", [
      ["Liking a video", "footprint-mixup", "Likes are saved online."],
      ["Searching for a recipe", "footprint-mixup", "Searches are recorded online."],
      ["Chatting with an AI helper", "footprint-mixup", "Chats may be saved."],
    ], "A paper book leaves no online trail. Everything you do online can."),
    q("Why is posting a public photo in your school uniform risky?", "It can tell strangers where you study", [
      ["Posting uniform photos is against the law", "footprint-mixup", "It is not illegal, but it shares where you study."],
      ["It uses up too much phone storage", "footprint-mixup", "Storage isn't the issue. Your safety is."],
      ["Teachers lower your marks for it", "footprint-mixup", "Marks aren't the issue. Strangers learning your school is."],
    ], "Uniforms and school names show where you can be found. Keep such photos private."),
    q("What is plagiarism?", "Presenting someone else's or AI's work as your own", [
      ["Using AI to quiz yourself on a chapter", "plagiarism-mixup", "Quizzing yourself is honest use of AI."],
      ["Writing in your own words after reading", "plagiarism-mixup", "That is the honest way to learn."],
      ["Giving credit to a source you used", "plagiarism-mixup", "Giving credit is the opposite of plagiarism."],
    ], "Copying someone's or AI's work without credit, and saying \"I made this\", is dishonest."),
    q("Which is the honest way to use AI for an essay on \"My Village\"?", "Get ideas from AI, write it yourself, say how it helped", [
      ["Let AI write the whole essay, then change a few of its words", "paraphrase-plagiarism", "Changing a few words is still passing off AI's work as yours."],
      ["Let AI write it; nobody will find out", "plagiarism-mixup", "That is plagiarism, whether or not anyone finds out."],
      ["Copy a friend's essay instead of using AI", "plagiarism-mixup", "Copying a friend is plagiarism too."],
    ], "Use AI for ideas or a quiz, write in your own words and add: \"I used AI for ideas and checked facts in my textbook.\""),
    q("Is an AI chatbot a good friend to share your feelings with?", "No: AI is a tool, so talk to people who care", [
      ["Yes: it is always kind and always right", "ai-friend-myth", "AI can sound kind, but it has no feelings and can be wrong."],
      ["Yes: it knows you better than your family", "ai-friend-myth", "It doesn't know you. Family, teachers and counsellors do."],
      ["Yes, but only late at night when nobody else is awake", "ai-friend-myth", "Even then, Childline 1098 or Tele-MANAS 14416 has real people to talk to."],
    ], "AI is a tool, not a friend. Talk about feelings with family, teachers or the school counsellor."),
    q("\"If AI sounds confident, it must be correct.\" Myth or fact?", "Myth: always check", [
      ["Fact: confident answers are correct", "confident-means-right", "Sounding sure is not the same as being right."],
      ["Fact, if the answer is long", "confident-means-right", "Long answers can be wrong too."],
      ["Fact, but only for maths", "ai-always-right", "AI makes maths mistakes too."],
    ], "It's a myth. AI predicts words, so it can sound sure and still be wrong."),
    q("Which of these is a DON'T when using AI?", "Making a fake photo of a classmate", [
      ["Asking AI to quiz you on a chapter", "plagiarism-mixup", "That's a great way to revise."],
      ["Checking AI's facts in your textbook", "fact-check-mixup", "That's exactly what you should do."],
      ["Telling your teacher how AI helped you", "plagiarism-mixup", "Being honest about AI help is a DO."],
    ], "Never make fake photos or voices of others, and never use AI to cheat or bully."),
  ],

  // Unit Boss: 12 new mixed questions (assessment: never reused in practice).
  "cs-u1-test": [
    q("Which of these is AI in daily life?", "Maps choosing the fastest road using live traffic", [
      ["A ceiling fan turning on with a switch", "ai-example-mixup", "A switch follows one fixed rule; nothing is learned."],
      ["A wall clock showing the time", "ai-example-mixup", "A clock just ticks. It learns nothing."],
      ["A calculator adding 25 and 17", "normal-program-mixup", "A calculator follows fixed rules. That is a normal program."],
    ], "Maps learns from live traffic patterns to choose a road. That is AI."),
    q("A chatbot mainly works by…", "Predicting words from patterns it learned", [
      ["Thinking exactly like a human", "ai-intent-mixup", "It predicts; it does not truly think or understand."],
      ["Copying the answer from one website", "copy-website-mixup", "It writes a new answer by predicting words."],
      ["Waiting for a real person to type each answer", "human-behind-mixup", "No person types the answers."],
    ], "Chatbots predict the next word again and again from patterns in their training data."),
    q("Made-up facts that AI says confidently are called…", "Hallucinations", [
      ["Hacking", "hallucination-mixup", "Hacking is breaking into a computer or account."],
      ["Coding", "hallucination-mixup", "Coding is writing computer programs."],
      ["Bias", "bias-mixup", "Bias is unfair, one-sided results from unbalanced data."],
    ], "A hallucination sounds believable but is false. Check important facts."),
    q("Gemini is made by…", "Google", [
      ["Meta", "maker-mixup", "Meta makes Meta AI."],
      ["Microsoft", "maker-mixup", "Microsoft makes Copilot."],
      ["xAI", "maker-mixup", "xAI makes Grok."],
    ], "Google makes Gemini, which also works with Google apps like Docs and Gmail."),
    q("Which AI helper sits inside WhatsApp?", "Meta AI", [
      ["Copilot", "helper-place-mixup", "Copilot sits inside Microsoft tools."],
      ["Perplexity", "helper-place-mixup", "Perplexity has its own website and app."],
      ["Grok", "helper-place-mixup", "Grok is linked to X."],
    ], "Meta owns WhatsApp, so Meta AI sits inside it. Private details stay private there too."),
    q("In FACT-QR, which letter means \"who is the answer for?\"", "A: Audience", [
      ["F: Function", "factqr-letter-mixup", "Function is the role the AI plays."],
      ["C: Context", "factqr-letter-mixup", "Context is your background."],
      ["R: Review", "factqr-letter-mixup", "Review is how you'll check yourself."],
    ], "A = Audience: \"for a Class 8 student\"."),
    q("Which should you never share with anyone, including an AI?", "An OTP or password", [
      ["The topic you are revising", "privacy-overdo-mixup", "A topic is safe to share and helps the AI help you."],
      ["Your class level, like Class 8", "privacy-overdo-mixup", "A class level alone doesn't identify you."],
      ["The language you want the answer in", "privacy-overdo-mixup", "That is safe and useful."],
    ], "OTPs and passwords are keys to accounts. Never share them."),
    q("An AI heard very few voices with regional accents while learning. What can happen?", "It may misunderstand people with those accents", [
      ["It understands those accents best of all", "bias-mixup", "Less data means weaker, not better, results for those voices."],
      ["It stops working everywhere in India", "bias-mixup", "It still works, just unfairly for some people."],
      ["Nothing at all, because data never affects how AI works", "training-data-mixup", "AI is only as good as its training data."],
    ], "This is bias: unbalanced training data gives unfair results."),
    q("A message says: \"Your account closes TODAY! Click this link and share your OTP.\" Which warning signs does it show?", "Hurry, and a demand for your OTP", [
      ["Correct spelling and a polite tone", "scam-sign-mixup", "Good spelling proves nothing. AI writes perfect scam messages."],
      ["It is long and uses many words", "scam-sign-mixup", "Length isn't the sign. Hurry and asking for an OTP are."],
      ["None: banks often send such messages", "otp-mixup", "Banks never ask for your OTP."],
    ], "Urgency plus asking for an OTP means scam. Tell an adult; call 1930 if money is lost."),
    q("Which is the honest way to show AI helped with your homework?", "Write: \"I used AI for ideas and checked facts\"", [
      ["Say nothing, since AI is just a tool", "plagiarism-mixup", "Being honest about AI help is part of using it well."],
      ["Delete the chat so no one knows", "plagiarism-mixup", "Hiding AI help is dishonest."],
      ["Copy AI's answer and add your own name", "plagiarism-mixup", "That is plagiarism."],
    ], "Give credit: say how AI helped, and write the answer yourself."),
    q("A shocking video of a leader saying something strange is spreading. What should you do first?", "Don't forward it; check the source with an adult", [
      ["Forward it so friends can decide", "forward-fake-mixup", "Forwarding spreads it, even if it's a deepfake."],
      ["Believe it, since it is on video", "looks-real-mixup", "AI can make fake videos that look real."],
      ["Post an angry comment under it", "footprint-mixup", "Angry comments stay in your digital footprint, and the video may be fake."],
    ], "Shocking videos may be deepfakes. Pause, check the source and ask an adult."),
    q("Which statement about AI is true?", "AI is software that finds patterns in data", [
      ["AI is a robot with real feelings", "ai-feelings-myth", "AI has no feelings."],
      ["AI is always right if it sounds sure", "confident-means-right", "Sounding sure is not being right."],
      ["AI only works inside robots", "robot-mixup", "AI is in phones, apps and websites, not just robots."],
    ], "AI is software that learns patterns from data. It can be very useful, and it can be wrong."),
  ],
};

export const readings = {};
export const wordTables = {};

export const nodes = [
  u1,
  what,
  how,
  helpers,
  safe,
  scams,
  prompts,
  honest,
  boss(
    "cs-u1-boss",
    u1.id,
    "Unit 1 Boss",
    "cs-u1-test",
    "Oh no! The Glitch Bot is spreading made-up facts and fake voices around school. Use what you know about prompts, privacy, scams and fact-checking to stop it and keep everyone safe!"
  ),
];

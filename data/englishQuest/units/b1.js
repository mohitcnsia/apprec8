// data/englishQuest/units/b1.js: Grammar Pro 1, Tenses (Claude, 2026-11-05). Classes 9–10 only (Seema's Class 10 pilot).
// Board level (docs/exam/cbse10-english-pattern.md): perfect and perfect continuous tenses (present / past / future) and
// conditionals, in the board's style: real-life frames (messages, notices, reports, letters), "find the error and its
// correction" as options, "which happened first". Original questions only: board papers are a guide, nothing is copied.
// Ambiguity rules: never offer two tenses that both fit (e.g. simple past next to past perfect where both work), no
// optional backshift, error-correction options never include a second change that also fixes the sentence.
// Generated from scratchpad tables (see git history); edit here directly from now on.
import { q, study, quiz, unit, main, practice, gate, withSubtopic, endless, boss, forGrades } from "../helpers.js";

const t = (subtopic, question, correct, wrongs, explanation) => ({ subtopic, ...q(question, correct, wrongs, explanation) });
const GRADES = [9, 10];

const perfect = main("eq-b1-perfect", "eq-b1", 0, "Perfect Tenses", [study("eq-b1-perfect"), quiz("eq-b1-perfect-quiz")]);
const cont = main("eq-b1-cont", "eq-b1", 1, "Perfect Continuous", [study("eq-b1-cont"), quiz("eq-b1-cont-quiz")]);
const ifs = main("eq-b1-if", "eq-b1", 2, "Conditionals (If…)", [study("eq-b1-if"), quiz("eq-b1-if-quiz")]);

export default {
  studyPages: {
    "eq-b1-perfect": {
      name: "Perfect Tenses",
      author: "Apprec8",
      cards: [{"emoji": "✅", "title": "Present perfect: done, matters now", "text": "Use have/has + past participle for something finished whose result matters now, or a time that reaches up to now.", "examples": ["I have lost my keys. (still lost)", "She has lived here since 2019."]}, {"emoji": "🚫", "title": "Never with a finished time", "text": "With yesterday, last week, in 2019 or ago, use the simple past instead.", "examples": ["I saw it yesterday. (not: have seen)"]}, {"kind": "check", "question": "Which is correct? 'I ___ him last Monday.'", "answer": "met", "wrong": ["have met", "have meet", "had meet"], "explain": "LAST MONDAY is a finished time: simple past."}, {"emoji": "⏪", "title": "Past perfect: the earlier past", "text": "Two past actions? The one that happened FIRST takes had + past participle.", "examples": ["The film had started when we arrived."]}, {"emoji": "⏩", "title": "Future perfect: finished by then", "text": "Use will have + past participle for something complete before a future time. Look for BY.", "examples": ["By June, I will have finished the course."]}, {"kind": "check", "question": "By 8 p.m., we ___ dinner.", "answer": "will have eaten", "wrong": ["have eaten", "had eaten", "eat"], "explain": "BY + a future time → will have + past participle."}],
      content: "### ✅ Present perfect: done, matters now\n\nUse have/has + past participle for something finished whose result matters now, or a time that reaches up to now.\n\n- I have lost my keys. (still lost)\n- She has lived here since 2019.\n\n---\n\n### 🚫 Never with a finished time\n\nWith yesterday, last week, in 2019 or ago, use the simple past instead.\n\n- I saw it yesterday. (not: have seen)\n\n---\n\n### ⏪ Past perfect: the earlier past\n\nTwo past actions? The one that happened FIRST takes had + past participle.\n\n- The film had started when we arrived.\n\n---\n\n### ⏩ Future perfect: finished by then\n\nUse will have + past participle for something complete before a future time. Look for BY.\n\n- By June, I will have finished the course.",
    },
    "eq-b1-cont": {
      name: "Perfect Continuous",
      author: "Apprec8",
      cards: [{"emoji": "⏳", "title": "How long? Add -ing", "text": "Perfect continuous = have/had/will have + been + -ing. It shows how long an action goes on.", "examples": ["I have been waiting for an hour.", "She had been running.", "By June, he will have been working here for ten years."]}, {"emoji": "📍", "title": "Since or for?", "text": "SINCE + a starting point (since Monday, since 2018). FOR + a length of time (for two hours).", "examples": ["since morning", "for three weeks"]}, {"kind": "check", "question": "She has been dancing ___ she was five.", "answer": "since", "wrong": ["for", "from", "during"], "explain": "'She was five' is a starting point → since."}, {"emoji": "🧊", "title": "State verbs don't take -ing", "text": "Know, believe, own, love and understand don't take -ing. Use the present perfect instead.", "examples": ["I have known her for years. (not: have been knowing)"]}, {"emoji": "🚫", "title": "Not 'is … since'", "text": "A common board error: 'She is working here since 2018.' Correct it to 'has been working'.", "examples": ["is working since → has been working since"]}],
      content: "### ⏳ How long? Add -ing\n\nPerfect continuous = have/had/will have + been + -ing. It shows how long an action goes on.\n\n- I have been waiting for an hour.\n- She had been running.\n- By June, he will have been working here for ten years.\n\n---\n\n### 📍 Since or for?\n\nSINCE + a starting point (since Monday, since 2018). FOR + a length of time (for two hours).\n\n- since morning\n- for three weeks\n\n---\n\n### 🧊 State verbs don't take -ing\n\nKnow, believe, own, love and understand don't take -ing. Use the present perfect instead.\n\n- I have known her for years. (not: have been knowing)\n\n---\n\n### 🚫 Not 'is … since'\n\nA common board error: 'She is working here since 2018.' Correct it to 'has been working'.\n\n- is working since → has been working since",
    },
    "eq-b1-if": {
      name: "Conditionals (If\u2026)",
      author: "Apprec8",
      cards: [{"emoji": "☀️", "title": "Real: If + present, will", "text": "For a real possibility: If + present, will + verb. Never WILL in the if-part.", "examples": ["If it rains, we will stay in.", "If you heat ice, it melts. (always true)"]}, {"emoji": "💭", "title": "Imaginary now: If + past, would", "text": "For an imaginary situation now: If + past, would + verb. Use 'were' for every person.", "examples": ["If I were you, I would rest.", "If I had wings, I would fly."]}, {"kind": "check", "question": "If I ___ a car, I would drive to school.", "answer": "had", "wrong": ["have", "will have", "would have"], "explain": "Imaginary now: If + past (had), would + verb."}, {"emoji": "🕰️", "title": "Past that didn't happen", "text": "If + had + past participle, would have + past participle. Also: 'Had I known…' = 'If I had known…'.", "examples": ["If we had left earlier, we would have caught the train."]}, {"emoji": "🔁", "title": "Unless = if not", "text": "'Unless you hurry, you will miss it' = 'If you don't hurry, you will miss it.'", "examples": ["Unless it rains, we will play."]}],
      content: "### ☀️ Real: If + present, will\n\nFor a real possibility: If + present, will + verb. Never WILL in the if-part.\n\n- If it rains, we will stay in.\n- If you heat ice, it melts. (always true)\n\n---\n\n### 💭 Imaginary now: If + past, would\n\nFor an imaginary situation now: If + past, would + verb. Use 'were' for every person.\n\n- If I were you, I would rest.\n- If I had wings, I would fly.\n\n---\n\n### 🕰️ Past that didn't happen\n\nIf + had + past participle, would have + past participle. Also: 'Had I known…' = 'If I had known…'.\n\n- If we had left earlier, we would have caught the train.\n\n---\n\n### 🔁 Unless = if not\n\n'Unless you hurry, you will miss it' = 'If you don't hurry, you will miss it.'\n\n- Unless it rains, we will play.",
    },
  },
  quizzes: {
    "eq-b1-perfect-quiz": [
    t(
      "present-perfect",
      "Complete Riya's message to her coach: 'I ___ my practice for today, so I can join the team meeting now.'",
      "have finished",
      [
        ["had finished", "tense-mixup", "Past perfect needs an earlier past action, but this happened just now."],
        ["will finish", "tense-mixup", "Future tense means not yet finished, but she says she can join now."],
        ["finishing", "tense-mixup", "-ing cannot be the main verb without a helping verb like 'am'."],
      ],
      "Done just now and it matters now: present perfect (have finished)."
    ),
    t(
      "present-perfect",
      "She ___ in Pune since 2019.",
      "has lived",
      [
        ["lives", "tense-mixup", "Simple present is for habits or general facts, not for an action continuing from 2019."],
        ["lived", "tense-mixup", "Simple past means she no longer lives there, but 'since' shows it reaches now."],
        ["is living", "tense-mixup", "Present continuous doesn't pair with 'since' for duration; use present perfect."],
      ],
      "SINCE + a point in time that reaches up to now → present perfect: has lived."
    ),
    t(
      "past-perfect",
      "When we reached the cinema, the film ___.",
      "had already started",
      [
        ["has already started", "tense-mixup", "'Has started' is present perfect, but both events are in the past."],
        ["already starts", "tense-mixup", "Simple present doesn't fit a story set in the past."],
        ["will have started", "tense-mixup", "Future perfect is for future times, not past cinema visits."],
      ],
      "Two past actions: the earlier one (the film starting) takes HAD."
    ),
    t("past-perfect", "Which action happened FIRST? 'The farmer had sown the seeds before the rain came.'", "The farmer sowed the seeds.", [["The rain came.", "sequence-mixup"], ["Both happened together.", "sequence-mixup"], ["The sentence does not say.", "sequence-mixup"]], "HAD + past participle marks the earlier action: the sowing."),
    t("future-perfect", "By the time you arrive, I ___ dinner.", "will have cooked", [["had cooked", "tense-mixup"], ["have cooked", "tense-mixup"], ["was cooking", "tense-mixup"]], "BY + a future moment \u2192 future perfect: will have cooked."),
    t("future-perfect", "By next March, the workers ___ the new bridge.", "will have completed", [["have completed", "tense-mixup"], ["had completed", "tense-mixup"], ["completed", "tense-mixup"]], "Finished before a future time: will have completed."),
    t("present-perfect", "Find the error and its correction: 'I have seen that film last Sunday.'", "have seen \u2192 saw", [["that \u2192 this", "error-correction-mixup"], ["film \u2192 films", "error-correction-mixup"], ["Sunday \u2192 Sundays", "error-correction-mixup"]], "A finished time (last Sunday) takes the simple past, not the present perfect."),
    t("past-perfect", "Meera told us that she ___ her homework before dinner.", "had finished", [["has finished", "tense-mixup"], ["finishes", "tense-mixup"], ["will finish", "tense-mixup"]], "Earlier than another past action (told us): had finished."),
    ],
    "eq-b1-perfect-board": [
    t("present-perfect", "Complete the notice on the school board: 'The library ___ to the first floor. Please collect your books from there.'", "has moved", [["had moved", "tense-mixup"], ["will have moved", "tense-mixup"], ["moves", "tense-mixup"]], "The move is done and matters now: has moved."),
    t("past-perfect", "Complete the line from a newspaper report: 'The fire ___ out before the fire engines arrived.'", "had burnt", [["has burnt", "tense-mixup"], ["burns", "tense-mixup"], ["will burn", "tense-mixup"]], "The earlier of two past events takes HAD: had burnt out."),
    t("future-perfect", "Complete the letter: 'Dear Arjun, by the time this letter reaches you, we ___ to our new house.'", "will have moved", [["have moved", "tense-mixup"], ["had moved", "tense-mixup"], ["move", "tense-mixup"]], "Finished before a future moment (the letter arriving): will have moved."),
    t("present-perfect", "Find the error and its correction: 'Ravi has bought a new bicycle yesterday.'", "has bought \u2192 bought", [["new \u2192 newer", "error-correction-mixup"], ["bicycle \u2192 bicycles", "error-correction-mixup"], ["yesterday \u2192 tomorrow", "error-correction-mixup"]], "YESTERDAY is a finished time: simple past (bought)."),
    t("past-perfect", "Find the error and its correction: 'After she has finished the test, she checked every answer.'", "has finished \u2192 had finished", [["the test \u2192 a test", "error-correction-mixup"], ["she checked \u2192 she check", "error-correction-mixup"], ["every answer \u2192 every answers", "error-correction-mixup"]], "The finishing came before the checking (past): had finished."),
    t("future-perfect", "Which sentence shows an action that will be COMPLETE before a future time?", "By Friday, I will have read the whole book.", [["I will read the book on Friday.", "tense-mixup"], ["I am reading the book this week.", "tense-mixup"], ["I read a book every Friday.", "tense-mixup"]], "BY Friday + will have read = finished before Friday."),
    t("present-perfect", "This is the third time she ___ the prize.", "has won", [["won", "tense-mixup"], ["had won", "tense-mixup"], ["wins", "tense-mixup"]], "'This is the first/second/third time\u2026' takes the present perfect."),
    t("past-perfect", "I ___ such a beautiful sunset until I visited Kanyakumari.", "had never seen", [["have never seen", "tense-mixup"], ["never see", "tense-mixup"], ["will never see", "tense-mixup"]], "Up to a past moment (the visit): had never seen."),
    t("present-perfect", "Teacher: 'Why are your hands so oily?' Choose the best reply.", "I have just repaired my bicycle chain.", [["I will repair my bicycle chain.", "tense-mixup"], ["I had repaired my bicycle chain next week.", "tense-mixup"], ["I repair my bicycle chain tomorrow.", "tense-mixup"]], "Just done, and you can see the result now: have just repaired."),
    t("future-perfect", "The train ___ by the time we reach the station, so let's take a cab.", "will have left", [["has left", "tense-mixup"], ["had left", "tense-mixup"], ["leaves", "tense-mixup"]], "Gone before a future moment (our reaching): will have left."),
    ],
    "eq-b1-perfect-gate-pool": [
    t("present-perfect", "We ___ each other since we were in Class 1.", "have known", [["know", "tense-mixup"], ["knew", "tense-mixup"], ["are knowing", "tense-mixup"]], "SINCE + a past point up to now: have known. (KNOW is never used in the -ing form.)"),
    t("present-perfect", "Look! Someone ___ the window.", "has broken", [["had broken", "tense-mixup"], ["breaks", "tense-mixup"], ["will have broken", "tense-mixup"]], "You can see the result now: has broken."),
    t("present-perfect", "Find the error and its correction: 'She has visited Agra in 2019.'", "has visited \u2192 visited", [["Agra \u2192 Agra's", "error-correction-mixup"], ["in \u2192 on", "error-correction-mixup"], ["2019 \u2192 2019s", "error-correction-mixup"]], "IN 2019 is a finished time: simple past (visited)."),
    t("present-perfect", "I ___ my keys. Can you help me look for them?", "have lost", [["had lost", "tense-mixup"], ["lose", "tense-mixup"], ["will have lost", "tense-mixup"]], "Lost, and still missing now: have lost."),
    t("present-perfect", "Which sentence is correct?", "I have lived here for five years.", [["I have lived here since five years.", "since-for-mixup"], ["I am living here since five years.", "since-for-mixup"], ["I lived here since 2020.", "since-for-mixup"]], "FOR + a length of time; SINCE + a starting point; both with the present perfect."),
    t("past-perfect", "By the time the doctor came, the patient ___.", "had recovered", [["has recovered", "tense-mixup"], ["recovers", "tense-mixup"], ["will recover", "tense-mixup"]], "Recovered before the doctor came (past): had recovered."),
    t("past-perfect", "She thanked me for the gift I ___ her.", "had sent", [["have sent", "tense-mixup"], ["send", "tense-mixup"], ["will have sent", "tense-mixup"]], "The sending came before the thanking: had sent."),
    t("past-perfect", "Which happened FIRST? 'Arun couldn't enter the house because he had lost his key.'", "Arun lost his key.", [["Arun tried to enter the house.", "sequence-mixup"], ["Both happened together.", "sequence-mixup"], ["Arun found his key.", "sequence-mixup"]], "HAD LOST marks the earlier action."),
    t("past-perfect", "Find the error and its correction: 'The match already started when we reached the stadium.'", "already started \u2192 had already started", [["match \u2192 matches", "error-correction-mixup"], ["reached \u2192 reach", "error-correction-mixup"], ["stadium \u2192 stadiums", "error-correction-mixup"]], "The match started before we reached: had already started."),
    t("past-perfect", "If only I ___ harder last year!", "had worked", [["have worked", "tense-mixup"], ["will work", "tense-mixup"], ["work", "tense-mixup"]], "A wish about the past (last year) takes HAD + past participle."),
    t("future-perfect", "By 2030, I hope scientists ___ a cure for this disease.", "will have found", [["have found", "tense-mixup"], ["had found", "tense-mixup"], ["find", "tense-mixup"]], "Finished before a future year: will have found."),
    t("future-perfect", "Don't call at 10 p.m. I ___ to bed by then.", "will have gone", [["have gone", "tense-mixup"], ["had gone", "tense-mixup"], ["go", "tense-mixup"]], "BY THEN (a future time): will have gone."),
    t("future-perfect", "Which sentence shows an action FINISHED before a future time?", "By noon, the guests will have left.", [["At noon, the guests will leave.", "tense-mixup"], ["The guests are leaving at noon.", "tense-mixup"], ["The guests leave at noon every day.", "tense-mixup"]], "BY noon + will have left = gone before noon."),
    t("future-perfect", "'By next week, the painters will finish painting our house.' Which change shows the work will be complete before next week?", "will finish \u2192 will have finished", [["By \u2192 On", "error-correction-mixup"], ["next \u2192 last", "error-correction-mixup"], ["house \u2192 houses", "error-correction-mixup"]], "Complete before a future time: will have finished."),
    t("future-perfect", "Next June, my parents ___ married for twenty years.", "will have been", [["have been", "tense-mixup"], ["had been", "tense-mixup"], ["are", "tense-mixup"]], "Up to a future point (next June): will have been married."),
    ],
    "eq-b1-cont-quiz": [
    t("present-perfect-cont", "I ___ for the bus for twenty minutes. It's still not here.", "have been waiting", [["had been waiting", "tense-mixup"], ["will have been waiting", "tense-mixup"], ["was waiting", "tense-mixup"]], "Started in the past, still going on now: have been waiting."),
    t("present-perfect-cont", "'Why are your eyes red?' 'I ___ for my exams all night.'", "have been studying", [["will be studying", "tense-mixup"], ["have been study", "tense-mixup"], ["am studied", "tense-mixup"]], "An activity that has just been going on and explains what you see now."),
    t("past-perfect-cont", "She was tired because she ___ in the sun all afternoon.", "had been working", [["has been working", "tense-mixup"], ["will have been working", "tense-mixup"], ["is working", "tense-mixup"]], "Going on for a while BEFORE a past moment: had been working."),
    t("past-perfect-cont", "The roads were wet. It ___ all night.", "had been raining", [["has been raining", "tense-mixup"], ["will have been raining", "tense-mixup"], ["rains", "tense-mixup"]], "Before the past moment we saw the wet roads: had been raining."),
    t("future-perfect-cont", "By next June, Grandpa ___ in this village for fifty years.", "will have been living", [["has been living", "tense-mixup"], ["had been living", "tense-mixup"], ["is living", "tense-mixup"]], "How long up to a future time: will have been living."),
    t("future-perfect-cont", "By 6 p.m. tomorrow, the players ___ for three hours.", "will have been practising", [["have been practising", "tense-mixup"], ["had been practising", "tense-mixup"], ["practise", "tense-mixup"]], "BY + a future time + FOR how long: will have been practising."),
    t("present-perfect-cont", "Which sentence is correct?", "She has been learning Kathak for five years.", [["She has been learning Kathak since five years.", "since-for-mixup"], ["She is learning Kathak for five years.", "since-for-mixup"], ["She learning Kathak for five years.", "since-for-mixup"]], "FOR + a length of time with has been + -ing."),
    t("past-perfect-cont", "Find the error and its correction: 'They have been playing for an hour when it started to rain.'", "have been playing \u2192 had been playing", [["for \u2192 since", "error-correction-mixup"], ["started \u2192 starts", "error-correction-mixup"], ["rain \u2192 rains", "error-correction-mixup"]], "Before a past moment (it started to rain): had been playing."),
    ],
    "eq-b1-cont-board": [
    t("present-perfect-cont", "Complete Asha's message: 'Sorry for the late reply. I ___ on my science project since morning.'", "have been working", [["am working", "tense-mixup"], ["will have been working", "tense-mixup"], ["work", "tense-mixup"]], "SINCE morning and still going on: have been working (not 'am working since')."),
    t("past-perfect-cont", "Complete the line from a story: 'The children were out of breath. They ___ all the way from school.'", "had been running", [["have been running", "tense-mixup"], ["will have been running", "tense-mixup"], ["run", "tense-mixup"]], "Going on before a past moment: had been running."),
    t("future-perfect-cont", "Complete the letter from a company to its employee: 'This December, you ___ with our company for ten years.'", "will have been working", [["have been working", "tense-mixup"], ["had been working", "tense-mixup"], ["would be work", "tense-mixup"]], "How long, up to a future time: will have been working."),
    t("present-perfect-cont", "How long ___ the guitar?", "have you been playing", [["are you playing", "tense-mixup"], ["had you been playing", "tense-mixup"], ["will you have play", "tense-mixup"]], "From the past up to now, asking how long: have you been playing?"),
    t("past-perfect-cont", "Find the error and its correction: 'She was tired because she has been cooking since morning.'", "has been cooking \u2192 had been cooking", [["tired \u2192 tiring", "error-correction-mixup"], ["because \u2192 so", "error-correction-mixup"], ["morning \u2192 mornings", "error-correction-mixup"]], "The tiredness is in the past, so the cooking before it is had been cooking."),
    t("future-perfect-cont", "Which sentence tells how long an action will have gone on by a future time?", "By evening, she will have been painting for six hours.", [["She will paint in the evening.", "tense-mixup"], ["She has been painting since morning.", "tense-mixup"], ["She had been painting when I came.", "tense-mixup"]], "BY + future time + FOR how long: will have been painting."),
    t("present-perfect-cont", "'You look exhausted!' Choose the best reply.", "I have been cleaning the house all day.", [["I will be cleaning the house all day.", "tense-mixup"], ["I had cleaned the house tomorrow.", "tense-mixup"], ["I clean the house tomorrow.", "tense-mixup"]], "An activity that has been going on and explains how you look now."),
    t("past-perfect-cont", "When I met him, he ___ in Delhi for two years.", "had been living", [["has been living", "tense-mixup"], ["will have been living", "tense-mixup"], ["lives", "tense-mixup"]], "How long, up to a past moment (when I met him): had been living."),
    t("future-perfect-cont", "By 2027, she ___ for this newspaper for a decade.", "will have been writing", [["has been writing", "tense-mixup"], ["had been writing", "tense-mixup"], ["writes", "tense-mixup"]], "How long, up to a future year: will have been writing."),
    t("present-perfect-cont", "Which sentence is grammatically INCORRECT?", "I am knowing her for ten years.", [["I have known her for ten years.", "correct-sentence-chosen"], ["I have been waiting for ten minutes.", "correct-sentence-chosen"], ["She has been reading since lunch.", "correct-sentence-chosen"]], "KNOW is a state verb: never 'am knowing'. Say 'I have known her for ten years.'"),
    ],
    "eq-b1-cont-gate-pool": [
    t("present-perfect-cont", "It ___ since morning. Take an umbrella.", "has been raining", [["had been raining", "tense-mixup"], ["will have been raining", "tense-mixup"], ["rains", "tense-mixup"]], "Started in the morning, still going on: has been raining."),
    t("present-perfect-cont", "My neighbours ___ their house for weeks. The noise never stops!", "have been repairing", [["had been repairing", "tense-mixup"], ["will have been repairing", "tense-mixup"], ["repair", "tense-mixup"]], "Going on for weeks up to now: have been repairing."),
    t("present-perfect-cont", "How long have you ___ for me?", "been waiting", [["be waiting", "tense-mixup"], ["being waiting", "tense-mixup"], ["been wait", "tense-mixup"]], "Have + been + -ing: have you been waiting?"),
    t("present-perfect-cont", "Find the error and its correction: 'She is working in this bank since 2018.'", "is working \u2192 has been working", [["in \u2192 at", "error-correction-mixup"], ["bank \u2192 banks", "error-correction-mixup"], ["since \u2192 for", "error-correction-mixup"]], "SINCE 2018 and still now: has been working (not 'is working since')."),
    t("present-perfect-cont", "Which sentence is correct?", "They have been talking for an hour.", [["They have been talk for an hour.", "tense-mixup"], ["They are talking since an hour.", "tense-mixup"], ["They has been talking for an hour.", "tense-mixup"]], "They + have + been + talking, FOR + a length of time."),
    t("past-perfect-cont", "The ground was wet because it ___.", "had been raining", [["has been raining", "tense-mixup"], ["will have been raining", "tense-mixup"], ["is raining", "tense-mixup"]], "Before the past moment (the ground was wet): had been raining."),
    t("past-perfect-cont", "He ___ for an hour when the bus finally came.", "had been waiting", [["has been waiting", "tense-mixup"], ["will have been waiting", "tense-mixup"], ["waits", "tense-mixup"]], "How long, up to a past moment: had been waiting."),
    t("past-perfect-cont", "Find the error and its correction: 'I was tired because I have been walking for hours.'", "have been walking \u2192 had been walking", [["tired \u2192 tiring", "error-correction-mixup"], ["for \u2192 since", "error-correction-mixup"], ["hours \u2192 hour", "error-correction-mixup"]], "The tiredness is past, so the walking before it: had been walking."),
    t("past-perfect-cont", "The teacher noticed that the students ___ instead of studying.", "had been chatting", [["have been chatting", "tense-mixup"], ["will have been chatting", "tense-mixup"], ["chat", "tense-mixup"]], "Going on before the past moment the teacher noticed: had been chatting."),
    t("past-perfect-cont", "Which happened FIRST? 'Riya had been practising for weeks before the competition began.'", "Riya's practice", [["The competition", "sequence-mixup"], ["Both at once", "sequence-mixup"], ["The sentence does not say.", "sequence-mixup"]], "HAD BEEN practising came before the competition began."),
    t("future-perfect-cont", "Next month, I ___ in this school for three years.", "will have been studying", [["have been studying", "tense-mixup"], ["had been studying", "tense-mixup"], ["study", "tense-mixup"]], "How long, up to a future time (next month): will have been studying."),
    t("future-perfect-cont", "By the time you land, I ___ at the airport for two hours!", "will have been waiting", [["have been waiting", "tense-mixup"], ["had been waiting", "tense-mixup"], ["wait", "tense-mixup"]], "How long, up to a future moment: will have been waiting."),
    t("future-perfect-cont", "Choose the correct form: 'By Diwali, they ___ the house for a month.'", "will have been decorating", [["will have be decorating", "tense-mixup"], ["will had been decorating", "tense-mixup"], ["will been decorating", "tense-mixup"]], "Future perfect continuous = will + have + been + -ing."),
    t("future-perfect-cont", "Find the error and its correction: 'By evening, she will be cooking for five hours.'", "will be cooking \u2192 will have been cooking", [["By \u2192 In", "error-correction-mixup"], ["evening \u2192 evenings", "error-correction-mixup"], ["five \u2192 fifth", "error-correction-mixup"]], "BY + time + FOR how long: will have been cooking."),
    t("future-perfect-cont", "Which sentence uses the future perfect continuous?", "By June, he will have been teaching for ten years.", [["He will teach in June.", "tense-mixup"], ["He has been teaching for ten years.", "tense-mixup"], ["He had been teaching for ten years.", "tense-mixup"]], "will + have + been + -ing."),
    ],
    "eq-b1-if-quiz": [
    t("real-if", "If it rains tomorrow, we ___ the match.", "will postpone", [["would postpone", "conditional-form-error"], ["postponed", "conditional-form-error"], ["had postponed", "conditional-form-error"]], "A real possibility: If + present, will + verb."),
    t("real-if", "If you heat ice, it ___.", "melts", [["would melt", "conditional-form-error"], ["melted", "conditional-form-error"], ["had melted", "conditional-form-error"]], "Something always true: If + present, present (melts)."),
    t("imaginary-if", "If I ___ a bird, I would fly over the mountains.", "were", [["am", "conditional-form-error"], ["will be", "conditional-form-error"], ["have been", "conditional-form-error"]], "Imaginary now: If + were, would + verb."),
    t("imaginary-if", "If she had more time, she ___ a new language.", "would learn", [["will learn", "conditional-form-error"], ["learns", "conditional-form-error"], ["had learnt", "conditional-form-error"]], "If + past (had), would + verb."),
    t("past-if", "If we had left earlier, we ___ the train.", "would have caught", [["will catch", "conditional-form-error"], ["would catch", "conditional-form-error"], ["had caught", "conditional-form-error"]], "Past, didn't happen: If + had + past participle, would have + past participle."),
    t("past-if", "If he ___ harder, he would have passed.", "had studied", [["studied", "conditional-form-error"], ["has studied", "conditional-form-error"], ["would study", "conditional-form-error"]], "The if-part of a past condition takes HAD + past participle."),
    t("imaginary-if", "Which sentence is about an imaginary situation now?", "If I were rich, I would build a school.", [["If it rains, I will stay home.", "conditional-form-error"], ["If you heat water, it boils.", "conditional-form-error"], ["If I had known, I would have helped.", "conditional-form-error"]], "If + were/past, would + verb = imaginary present."),
    t("past-if", "Which sentence is about something that did NOT happen in the past?", "If you had called me, I would have come.", [["If you call me, I will come.", "conditional-form-error"], ["If you called me, I would come.", "conditional-form-error"], ["If you call me, I come at once.", "conditional-form-error"]], "Had + past participle \u2026 would have + past participle = an unreal past."),
    ],
    "eq-b1-if-board": [
    t("past-if", "If we had consulted a mechanic, we ___ this breakdown.", "would have avoided", [["would avoid", "conditional-form-error"], ["will avoid", "conditional-form-error"], ["had avoided", "conditional-form-error"]], "Unreal past: would have + past participle."),
    t("real-if", "Complete the exam notice: 'If you ___ late, you will not be allowed into the hall.'", "are", [["will be", "conditional-form-error"], ["were", "conditional-form-error"], ["had been", "conditional-form-error"]], "Real condition: If + present (are), will + verb."),
    t("imaginary-if", "If I ___ you, I would apologise to her.", "were", [["am", "conditional-form-error"], ["will be", "conditional-form-error"], ["had", "conditional-form-error"]], "Giving advice: If I were you\u2026"),
    t("past-if", "Find the error and its correction: 'If she would have asked me, I would have helped her.'", "would have asked \u2192 had asked", [["asked \u2192 ask", "error-correction-mixup"], ["helped \u2192 help", "error-correction-mixup"], ["her \u2192 she", "error-correction-mixup"]], "Never WOULD in the if-part: If she had asked\u2026"),
    t("real-if", "Find the error and its correction: 'If it will rain, the picnic will be cancelled.'", "will rain \u2192 rains", [["picnic \u2192 picnics", "error-correction-mixup"], ["be \u2192 been", "error-correction-mixup"], ["cancelled \u2192 cancel", "error-correction-mixup"]], "Never WILL in the if-part of a real condition: If it rains\u2026"),
    t("imaginary-if", "If he lived near the school, he ___ late every day.", "wouldn't be", [["won't be", "conditional-form-error"], ["isn't", "conditional-form-error"], ["hadn't been", "conditional-form-error"]], "Imaginary now: If + past, would (not) + verb."),
    t("past-if", "Riya missed the bus because she woke up late. Which sentence says this correctly?", "If Riya hadn't woken up late, she wouldn't have missed the bus.", [["If Riya doesn't wake up late, she won't miss the bus.", "conditional-form-error"], ["If Riya didn't wake up late, she wouldn't miss the bus.", "conditional-form-error"], ["If Riya hadn't woken up late, she won't miss the bus.", "conditional-form-error"]], "Past events that can't change: had (not) + p.p., would (not) have + p.p."),
    t("real-if", "Unless you water the plants, they ___.", "will die", [["would die", "conditional-form-error"], ["died", "conditional-form-error"], ["had died", "conditional-form-error"]], "UNLESS = if not; real condition: will die."),
    t("imaginary-if", "Which sentence is correct?", "If I had wings, I would fly.", [["If I have wings, I would fly.", "conditional-form-error"], ["If I had wings, I will fly.", "conditional-form-error"], ["If I would have wings, I fly.", "conditional-form-error"]], "Imaginary: If + past (had), would + verb."),
    t("past-if", "Had I known about the test, I ___ harder.", "would have studied", [["will study", "conditional-form-error"], ["would study", "conditional-form-error"], ["had studied", "conditional-form-error"]], "'Had I known\u2026' = 'If I had known\u2026': would have studied."),
    ],
    "eq-b1-if-gate-pool": [
    t("real-if", "If you mix red and white paint, you ___ pink.", "get", [["would get", "conditional-form-error"], ["got", "conditional-form-error"], ["had got", "conditional-form-error"]], "Always true: If + present, present."),
    t("real-if", "If the bus ___ late, we will take a taxi.", "is", [["will be", "conditional-form-error"], ["was", "conditional-form-error"], ["had been", "conditional-form-error"]], "Real condition: If + present (is), will + verb."),
    t("real-if", "Unless you hurry, you ___ the bus.", "will miss", [["would miss", "conditional-form-error"], ["missed", "conditional-form-error"], ["had missed", "conditional-form-error"]], "UNLESS = if not; real condition: will miss."),
    t("real-if", "Find the error and its correction: 'If you will practise daily, you will improve.'", "will practise \u2192 practise", [["daily \u2192 day", "error-correction-mixup"], ["improve \u2192 improved", "error-correction-mixup"], ["you \u2192 your", "error-correction-mixup"]], "No WILL in the if-part: If you practise daily\u2026"),
    t("real-if", "Plants die if they ___ water.", "don't get", [["won't get", "conditional-form-error"], ["didn't get", "conditional-form-error"], ["hadn't got", "conditional-form-error"]], "Always true: present in both parts."),
    t("imaginary-if", "If I ___ the Prime Minister, I would plant more trees.", "were", [["am", "conditional-form-error"], ["will be", "conditional-form-error"], ["have been", "conditional-form-error"]], "Imaginary: If I were\u2026, I would\u2026"),
    t("imaginary-if", "If we had a car, we ___ to the hills every weekend.", "would drive", [["will drive", "conditional-form-error"], ["drive", "conditional-form-error"], ["had driven", "conditional-form-error"]], "If + past (had), would + verb."),
    t("imaginary-if", "Find the error and its correction: 'If I knew her number, I will call her.'", "will call \u2192 would call", [["her \u2192 she", "error-correction-mixup"], ["number \u2192 numbers", "error-correction-mixup"], ["call \u2192 called", "error-correction-mixup"]], "If + past (knew) goes with WOULD, not will."),
    t("imaginary-if", "What would you do if you ___ a snake in your room?", "found", [["find", "conditional-form-error"], ["will find", "conditional-form-error"], ["have found", "conditional-form-error"]], "Imaginary: would \u2026 if + past (found)."),
    t("imaginary-if", "Which sentence talks about something imaginary or unlikely?", "If I won a lottery, I would travel the world.", [["If I win the match, I will celebrate.", "conditional-form-error"], ["If you press this button, the light comes on.", "conditional-form-error"], ["If he had come, I would have met him.", "conditional-form-error"]], "If + past, would + verb = imaginary now or in the future."),
    t("past-if", "If the goalkeeper had been alert, they ___ the match.", "wouldn't have lost", [["won't lose", "conditional-form-error"], ["wouldn't lose", "conditional-form-error"], ["hadn't lost", "conditional-form-error"]], "Unreal past: wouldn't have + past participle."),
    t("past-if", "If I ___ the instructions, I wouldn't have made this mistake.", "had read", [["read", "conditional-form-error"], ["have read", "conditional-form-error"], ["would read", "conditional-form-error"]], "The if-part of an unreal past: had + past participle."),
    t("past-if", "Find the error and its correction: 'If he had told me, I would help him.'", "would help \u2192 would have helped", [["had told \u2192 tells", "error-correction-mixup"], ["me \u2192 I", "error-correction-mixup"], ["him \u2192 his", "error-correction-mixup"]], "Had told (past) goes with would HAVE helped."),
    t("past-if", "They didn't book tickets, so they couldn't see the show. Which sentence means the same?", "If they had booked tickets, they could have seen the show.", [["If they book tickets, they can see the show.", "conditional-form-error"], ["If they booked tickets, they could see the show.", "conditional-form-error"], ["If they had booked tickets, they can see the show.", "conditional-form-error"]], "Past events that didn't happen: had booked \u2026 could have seen."),
    t("past-if", "___ she listened to her doctor, she would have recovered sooner.", "Had", [["Has", "conditional-form-error"], ["Would", "conditional-form-error"], ["Did", "conditional-form-error"]], "'Had she listened\u2026' = 'If she had listened\u2026'."),
    ],
    "eq-b1-test": [
    t("present-perfect", "This is the first time I ___ snow.", "have seen", [["saw", "tense-mixup"], ["had seen", "tense-mixup"], ["see", "tense-mixup"]], "'This is the first time\u2026' takes the present perfect."),
    t("past-perfect", "By the time the police arrived, the thieves ___.", "had escaped", [["have escaped", "tense-mixup"], ["escape", "tense-mixup"], ["will have escaped", "tense-mixup"]], "Before a past moment: had escaped."),
    t("future-perfect-cont", "By next month, my brother ___ in Canada for a year.", "will have been living", [["has been living", "tense-mixup"], ["had been living", "tense-mixup"], ["lives", "tense-mixup"]], "How long, up to a future time: will have been living."),
    t("imaginary-if", "If I were taller, I ___ join the basketball team.", "could", [["can", "conditional-form-error"], ["will", "conditional-form-error"], ["had", "conditional-form-error"]], "Imaginary now: could/would + verb."),
    t("present-perfect-cont", "Find the error and its correction: 'I am waiting here since 10 o'clock.'", "am waiting \u2192 have been waiting", [["here \u2192 there", "error-correction-mixup"], ["since \u2192 for", "error-correction-mixup"], ["o'clock \u2192 clock", "error-correction-mixup"]], "SINCE + a starting point, still going on: have been waiting."),
    t("past-if", "If you had told me earlier, I ___ you.", "would have helped", [["will help", "conditional-form-error"], ["would help", "conditional-form-error"], ["had helped", "conditional-form-error"]], "Unreal past: would have + past participle."),
    t("present-perfect-cont", "Which sentence is correct?", "She has been teaching here since 2015.", [["She is teaching here since 2015.", "tense-mixup"], ["She has been teaching here for 2015.", "tense-mixup"], ["She teaches here since 2015.", "tense-mixup"]], "SINCE + a starting point with has been + -ing."),
    t("past-perfect", "When I got home, my mother ___ dinner, so we ate at once.", "had cooked", [["has cooked", "tense-mixup"], ["cooks", "tense-mixup"], ["will have cooked", "tense-mixup"]], "Cooked before I got home: had cooked."),
    t("real-if", "Unless it ___, we will go for a walk.", "rains", [["will rain", "conditional-form-error"], ["rained", "conditional-form-error"], ["had rained", "conditional-form-error"]], "UNLESS (= if not) + present: unless it rains."),
    t("past-perfect", "Which happened FIRST? 'By the time the guests arrived, Neha had decorated the room.'", "Neha decorated the room.", [["The guests arrived.", "sequence-mixup"], ["Both happened together.", "sequence-mixup"], ["The sentence does not say.", "sequence-mixup"]], "HAD DECORATED marks the earlier action."),
    t("future-perfect", "Complete the message: 'Dear Kabir, by the time you read this, I ___ for Mumbai.'", "will have left", [["have left", "tense-mixup"], ["had left", "tense-mixup"], ["leave", "tense-mixup"]], "Gone before a future moment (your reading): will have left."),
    t("past-if", "If she ___ the alarm, she wouldn't have overslept.", "had set", [["set", "conditional-form-error"], ["has set", "conditional-form-error"], ["would set", "conditional-form-error"]], "The if-part of an unreal past: had + past participle."),
    ],
  },
  readings: {},
  // Every node carries the class tag (tests/content.test.mjs).
  nodes: [
    unit("eq-b1", 10, "Grammar Pro: Tenses"),

    perfect,
    withSubtopic(practice("eq-b1-perfect-p1", perfect, 1, "Board Style: Perfect Tenses", "hard", [quiz("eq-b1-perfect-board")]), "present-perfect"),
    gate("eq-b1-perfect-gate", perfect, "Perfect Tenses Challenge", "eq-b1-perfect-gate-pool", {
      "present-perfect": "Present perfect",
      "past-perfect": "Past perfect",
      "future-perfect": "Future perfect",
    }),
    endless(perfect),

    cont,
    withSubtopic(practice("eq-b1-cont-p1", cont, 1, "Board Style: Perfect Continuous", "hard", [quiz("eq-b1-cont-board")]), "present-perfect-cont"),
    gate("eq-b1-cont-gate", cont, "Perfect Continuous Challenge", "eq-b1-cont-gate-pool", {
      "present-perfect-cont": "Present perfect continuous",
      "past-perfect-cont": "Past perfect continuous",
      "future-perfect-cont": "Future perfect continuous",
    }),
    endless(cont),

    ifs,
    withSubtopic(practice("eq-b1-if-p1", ifs, 1, "Board Style: Conditionals", "hard", [quiz("eq-b1-if-board")]), "past-if"),
    gate("eq-b1-if-gate", ifs, "Conditionals Challenge", "eq-b1-if-gate-pool", {
      "real-if": "Real conditions (If + present)",
      "imaginary-if": "Imaginary now (If + past)",
      "past-if": "Past that didn't happen (If + had)",
    }),
    endless(ifs),

    boss(
      "eq-b1-boss",
      "eq-b1",
      "Grammar Pro Boss: Tenses",
      "eq-b1-test",
      "The Time Twister has scrambled every clock in the city: messages arrive before they are sent and trains leave before they arrive. Put each tense back in its place."
    ),
  ].map((n) => forGrades(n, GRADES)),
};

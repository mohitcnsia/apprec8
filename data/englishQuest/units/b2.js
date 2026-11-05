// data/englishQuest/units/b2.js: Grammar Pro 2, Modals (Gemini, 2026-11-05). Classes 9–10 only.
// Board level (docs/exam/cbse10-english-pattern.md): ability, permission, possibility, obligation,
// advice, deduction, and past modals in board style: real-life frames (school notices, lab rules,
// dialogs, reports), error-and-correction pairs. Original questions only.
import { q, study, quiz, unit, main, practice, gate, withSubtopic, endless, boss, forGrades } from "../helpers.js";

const t = (subtopic, question, correct, wrongs, explanation) => ({ subtopic, ...q(question, correct, wrongs, explanation) });
const GRADES = [9, 10];

const ability = main("eq-b2-ability", "eq-b2", 0, "Ability & Permission", [study("eq-b2-ability"), quiz("eq-b2-ability-quiz")]);
const obligation = main("eq-b2-obligation", "eq-b2", 1, "Obligation & Advice", [study("eq-b2-obligation"), quiz("eq-b2-obligation-quiz")]);
const deduction = main("eq-b2-deduction", "eq-b2", 2, "Deduction & Past Modals", [study("eq-b2-deduction"), quiz("eq-b2-deduction-quiz")]);

export default {
  studyPages: {
    "eq-b2-ability": {
      name: "Ability & Permission",
      author: "Apprec8",
      cards: [
        { emoji: "🏃", title: "Ability: Can and Could", text: "CAN shows present ability. COULD shows general past ability or a polite request.", examples: ["Priya can solve this algebra puzzle.", "By age seven, he could speak three languages."] },
        { emoji: "🙋", title: "Permission: May, Can, Could", text: "MAY is formal and polite. CAN is informal with friends. COULD is a polite request.", examples: ["May I enter the laboratory, sir?", "Could you lend me your dictionary, please?"] },
        { kind: "check", question: "Which is the most formal way to ask a teacher? '___ I submit my report tomorrow?'", answer: "May", wrong: ["Can", "Would", "Must"], explain: "MAY expresses formal permission with figures of authority." },
        { emoji: "🌦️", title: "Possibility: May vs Might", text: "MAY shows a strong or realistic possibility. MIGHT shows a weaker, remote possibility.", examples: ["Take a jacket; it may rain tonight.", "If we hurry, we might catch the earlier train."] },
        { emoji: "🚫", title: "Common Trap: Polite 'Could'", text: "COULD is not only for the past; use it for polite, gentle requests in the present.", examples: ["Could you repeat the question, please?"] }
      ],
      content: "### 🏃 Ability: Can and Could\n\nCAN shows present ability. COULD shows general past ability or a polite request.\n\n- Priya can solve this algebra puzzle.\n- By age seven, he could speak three languages.\n\n---\n\n### 🙋 Permission: May, Can, Could\n\nMAY is formal and polite. CAN is informal with friends. COULD is a polite request.\n\n- May I enter the laboratory, sir?\n- Could you lend me your dictionary, please?\n\n---\n\n### 🌦️ Possibility: May vs Might\n\nMAY shows a realistic possibility. MIGHT shows a weaker, remote possibility.\n\n- Take a jacket; it may rain tonight.\n- If we hurry, we might catch the earlier train."
    },
    "eq-b2-obligation": {
      name: "Obligation & Advice",
      author: "Apprec8",
      cards: [
        { emoji: "📜", title: "Must vs Have to", text: "MUST shows personal conviction or strict duty. HAVE TO shows an external rule or law.", examples: ["I must finish this book tonight.", "All students have to wear formal school uniforms."] },
        { emoji: "🛑", title: "Mustn't vs Needn't", text: "MUSTN'T means strictly forbidden. NEEDN'T or DON'T HAVE TO means optional.", examples: ["You mustn't run near the swimming pool.", "You needn't bring paper; worksheets are provided."] },
        { kind: "check", question: "Find the error and correction: 'Visitors mustn't pay; entry is free today.'", answer: "mustn't → needn't", wrong: ["pay → pays", "entry → entries", "free → freely"], explain: "Entry is optional/free, so payment is unnecessary (needn't), not a forbidden crime." },
        { emoji: "💡", title: "Should & Ought to", text: "SHOULD gives sensible advice. OUGHT TO highlights moral duty or social responsibility.", examples: ["You should sleep at least eight hours.", "We ought to protect public property."] },
        { emoji: "⚖️", title: "Duty vs Prohibition", text: "Never confuse absence of obligation (needn't) with prohibition (mustn't).", examples: ["You needn't shout. (unnecessary)", "You mustn't shout. (prohibited)"] }
      ],
      content: "### 📜 Must vs Have to\n\nMUST shows personal conviction or strict duty. HAVE TO shows an external rule or law.\n\n- I must finish this book tonight.\n- All students have to wear formal school uniforms.\n\n---\n\n### 🛑 Mustn't vs Needn't\n\nMUSTN'T means strictly forbidden. NEEDN'T means optional or unnecessary.\n\n- You mustn't run near the swimming pool.\n- You needn't bring paper; worksheets are provided.\n\n---\n\n### 💡 Should & Ought to\n\nSHOULD gives sensible advice. OUGHT TO highlights moral duty or social responsibility.\n\n- You should sleep at least eight hours.\n- We ought to protect public property."
    },
    "eq-b2-deduction": {
      name: "Deduction & Past Modals",
      author: "Apprec8",
      cards: [
        { emoji: "🔍", title: "Certainty: Must be vs Can't be", text: "MUST BE shows logical certainty. CAN'T BE shows that something is logically impossible.", examples: ["His shoes are wet; it must be raining outside.", "The lights are off; they can't be inside."] },
        { emoji: "⏪", title: "Regret: Should have done", text: "SHOULD HAVE + past participle expresses regret about an action that was not done.", examples: ["I should have checked the timetable before leaving home."] },
        { kind: "check", question: "Arun failed because he didn't revise. Complete: 'He ___ revised properly.'", answer: "should have", wrong: ["must have", "can have", "would have"], explain: "SHOULD HAVE expresses regret or sensible past advice that was neglected." },
        { emoji: "⚡", title: "Lost Opportunity: Could have", text: "COULD HAVE + past participle shows an ability or chance in the past that was not taken.", examples: ["She could have won the debate, but she missed the deadline."] },
        { emoji: "🕰️", title: "Past Habit: Would and Used to", text: "WOULD describes repeated past habits or routines. USED TO describes past habits and past states.", examples: ["During holidays, we would swim in the village stream every morning."] }
      ],
      content: "### 🔍 Certainty: Must be vs Can't be\n\nMUST BE shows logical certainty. CAN'T BE shows logical impossibility.\n\n- His shoes are wet; it must be raining outside.\n- The lights are off; they can't be inside.\n\n---\n\n### ⏪ Regret: Should have done\n\nSHOULD HAVE + past participle expresses regret about an unfulfilled past action.\n\n- I should have checked the timetable before leaving home.\n\n---\n\n### ⚡ Lost Opportunity: Could have\n\nCOULD HAVE + past participle shows a past chance that was not used.\n\n- She could have won the debate, but she missed the deadline."
    }
  },
  quizzes: {
    "eq-b2-ability-quiz": [
      t("can-could", "Complete the science teacher's comment: 'Ananya ___ explain complex physics concepts with great clarity.'", "can", [["may", "modal-meaning-mixup"], ["ought", "modal-form-error"], ["shall", "modal-meaning-mixup"]], "CAN expresses natural present ability: she can explain."),
      t("can-could", "When Vikram was only ten years old, he ___ run five kilometres without feeling breathless.", "could", [["can", "modal-tense-mixup"], ["may", "modal-meaning-mixup"], ["might", "modal-meaning-mixup"]], "COULD expresses general physical ability in the past."),
      t("permission", "Student to the librarian: '___ I borrow this reference encyclopaedia for one evening, sir?'", "May", [["Would", "modal-meaning-mixup"], ["Must", "modal-meaning-mixup"], ["Should", "modal-meaning-mixup"]], "MAY is the standard formal modal for asking permission from an authority figure."),
      t("permission", "Complete Rohit's casual request to his classmate: '___ I use your black gel pen for the heading?'", "Can", [["Shall", "modal-meaning-mixup"], ["Must", "modal-meaning-mixup"], ["Ought", "modal-form-error"]], "CAN is natural and polite for friendly, informal permission between peers."),
      t("possibility", "The sky looks grey and overcast; it ___ drizzle before our football match begins.", "may", [["must", "modal-meaning-mixup"], ["need", "modal-meaning-mixup"], ["ought", "modal-form-error"]], "MAY expresses a realistic present possibility based on clear signs."),
      t("possibility", "If we take the narrow bypass route, we ___ bypass the traffic jam, but it is risky.", "might", [["must", "modal-meaning-mixup"], ["will have", "tense-mixup"], ["ought", "modal-form-error"]], "MIGHT expresses a weaker, uncertain possibility: we might bypass."),
      t("can-could", "Find the error and its correction: 'Ten years ago, my grandfather can walk ten miles each day.'", "can → could", [["walk → walked", "error-correction-mixup"], ["each → every", "error-correction-mixup"], ["ago → before", "error-correction-mixup"]], "General ability in the past requires COULD, not CAN."),
      t("permission", "Teacher to class: 'Those who have completed their laboratory records ___ leave for the library.'", "may", [["shall", "modal-meaning-mixup"], ["might", "modal-meaning-mixup"], ["need", "modal-meaning-mixup"]], "MAY grants formal permission to students.")
    ],
    "eq-b2-ability-board": [
      t("can-could", "Complete the school sports notice: 'Only registered athletes ___ participate in the trial events tomorrow.'", "can", [["might", "modal-meaning-mixup"], ["could", "modal-tense-mixup"], ["ought", "modal-form-error"]], "CAN indicates present capability and eligibility under the stated rules."),
      t("can-could", "Before she injured her ankle, Meera ___ execute three consecutive ballet spins effortlessly.", "could", [["can", "modal-tense-mixup"], ["may", "modal-meaning-mixup"], ["will", "modal-tense-mixup"]], "Past ability before a specific past event takes COULD."),
      t("permission", "Complete the student's request to the Principal: '___ we visit the planetarium on Friday, ma'am?'", "May", [["Must", "modal-meaning-error"], ["Ought", "modal-form-error"], ["Would", "modal-meaning-error"]], "MAY is the polite, formal way to ask for permission."),
      t("permission", "Which request is most polite when speaking to a stranger on the bus?", "Could you please open the side window?", [["Can you open the window right now?", "modal-meaning-mixup"], ["May you please open the window?", "modal-form-error"], ["Must you open the window for me?", "modal-meaning-mixup"]], "COULD + please forms a gentle, polite request when addressing strangers."),
      t("possibility", "Read the dialogue: 'Where is Neha?' 'I am not certain, but she ___ be in the music room.'", "might", [["must", "modal-meaning-mixup"], ["will", "modal-meaning-mixup"], ["shall", "modal-meaning-mixup"]], "Uncertainty with 'not certain' calls for MIGHT, indicating remote possibility."),
      t("can-could", "Find the error and its correction: 'She can to speak four languages fluently.'", "can to speak → can speak", [["four → fourth", "error-correction-mixup"], ["languages → language", "error-correction-mixup"], ["fluently → fluent", "error-correction-mixup"]], "A modal is followed by the base verb without 'to': can speak."),
      t("can-could", "As a child, Karan ___ solve a Rubik's cube in under a minute.", "could", [["can", "modal-tense-error"], ["may", "modal-meaning-error"], ["shall", "modal-meaning-error"]], "General ability in the past: could."),
      t("permission", "Find the error and its correction: 'Visitors may to park only in the marked area.'", "may to park → may park", [["only → lonely", "error-correction-mixup"], ["marked → marking", "error-correction-mixup"], ["area → areas", "error-correction-mixup"]], "A modal is followed by the base verb without 'to': may park."),
      t("possibility", "Which sentence shows the WEAKEST possibility of rain?", "It might rain this evening.", [["It may rain this evening.", "modal-meaning-mixup"], ["It will rain this evening.", "modal-meaning-mixup"], ["It must rain this evening.", "modal-meaning-mixup"]], "MIGHT expresses the lowest degree of likelihood among possibility modals."),
      t("can-could", "Complete the student council report: 'At yesterday's assembly, thanks to the new microphones, the speakers ___ be heard clearly in every corner.'", "could", [["can", "modal-tense-error"], ["may", "modal-meaning-error"], ["must", "modal-meaning-error"]], "Ability in the past (yesterday): could."),
    ],
    "eq-b2-ability-gate-pool": [
      t("can-could", "Because of the blinding snow, the rescue team ___ reach the stranded hikers until morning.", "could not", [["cannot", "modal-tense-error"], ["may not", "modal-meaning-error"], ["must not", "modal-meaning-error"]], "Inability on a past occasion: could not."),
      t("can-could", "Human eyes ___ distinguish several million distinct shades of colour in daylight.", "can", [["could", "modal-tense-mixup"], ["may", "modal-meaning-mixup"], ["might", "modal-meaning-mixup"]], "General physiological capability in the present takes CAN."),
      t("can-could", "Until she attended swimming classes, Tanvi ___ float in deep water without panic.", "could not", [["cannot", "modal-tense-mixup"], ["may not", "modal-meaning-mixup"], ["must not", "modal-meaning-mixup"]], "Past inability before learning takes COULD NOT."),
      t("can-could", "Modern telescopes ___ detect distant galaxies billions of light years away from Earth.", "can", [["could", "modal-tense-mixup"], ["might", "modal-meaning-mixup"], ["shall", "modal-meaning-mixup"]], "Present technological capability requires CAN."),
      t("can-could", "Find the error and its correction: 'Two centuries ago, people can travel between continents only on sailing ships.'", "can → could", [["between → among", "error-correction-mixup"], ["sailing → sailed", "error-correction-mixup"], ["only → strictly", "error-correction-mixup"]], "Historical ability two centuries ago requires the past modal COULD."),
      t("permission", "Passenger to flight attendant: '___ I have a glass of warm water before take-off?'", "May", [["Will", "modal-meaning-mixup"], ["Must", "modal-meaning-mixup"], ["Should", "modal-meaning-mixup"]], "MAY expresses polite formal request for permission on official services."),
      t("permission", "School notice: 'Candidates ___ use simple calculators during the chemistry practical examination.'", "may", [["shall", "modal-meaning-mixup"], ["might", "modal-meaning-mixup"], ["would", "modal-meaning-mixup"]], "Official permission granted by examination authorities uses MAY."),
      t("permission", "Which question asks for permission in an informal, friendly manner?", "Can I sit beside you at lunch?", [["May I sit beside you at lunch?", "modal-meaning-mixup"], ["Must I sit beside you at lunch?", "modal-meaning-mixup"], ["Ought I to sit beside you at lunch?", "modal-meaning-mixup"]], "CAN is standard for relaxed, informal permission among friends."),
      t("permission", "Complete the laboratory rule: 'Students ___ not handle concentrated acids without teacher supervision.'", "must", [["need", "modal-meaning-mixup"], ["might", "modal-meaning-mixup"], ["would", "modal-meaning-mixup"]], "Formal safety rules prohibiting student actions take MUST NOT."),
      t("permission", "Find the error and its correction: 'May you lend me your bicycle for ten minutes, please?'", "May you → Could you", [["lend → borrow", "error-correction-mixup"], ["minutes → minute", "error-correction-mixup"], ["for → during", "error-correction-mixup"]], "MAY is not used with second person 'you' for requests; use COULD YOU or WOULD YOU."),
      t("possibility", "Do not discard those cardboard boxes; we ___ need them for our science model exhibition.", "might", [["must", "modal-meaning-mixup"], ["will have", "tense-mixup"], ["ought", "modal-form-error"]], "MIGHT indicates a cautious, tentative future possibility."),
      t("possibility", "The weather forecast warned that hail ___ damage ripe wheat crops across Punjab tonight.", "may", [["need", "modal-meaning-mixup"], ["must", "modal-meaning-mixup"], ["shall", "modal-meaning-mixup"]], "MAY expresses an impending, realistic possibility based on meteorological data."),
      t("possibility", "With proper guidance and practice, your chess game ___ improve significantly this term.", "may", [["must", "modal-meaning-mixup"], ["shall", "modal-meaning-mixup"], ["ought", "modal-form-error"]], "Realistic outcome under positive conditions uses MAY."),
      t("possibility", "She hasn't replied to my letter; the mail carrier ___ delivered it to the wrong address.", "might have", [["can have", "modal-form-error"], ["shall have", "modal-tense-mixup"], ["must to have", "modal-form-error"]], "Speculating tentatively about past possibility requires MIGHT HAVE."),
      t("possibility", "Which sentence indicates that a situation is POSSIBLE, but not certain?", "The flight may arrive early.", [["The flight must arrive early.", "modal-meaning-mixup"], ["The flight will arrive early.", "modal-meaning-mixup"], ["The flight cannot arrive early.", "modal-meaning-mixup"]], "MAY expresses realistic possibility without claiming absolute certainty.")
    ],
    "eq-b2-obligation-quiz": [
      t("must-have-to", "Notice in the examination hall: 'All candidates ___ submit their answer booklets before leaving.'", "must", [["might", "modal-meaning-mixup"], ["can", "modal-meaning-mixup"], ["may", "modal-meaning-mixup"]], "MUST expresses an absolute and mandatory institutional obligation."),
      t("must-have-to", "Because my train departs at 5 a.m., I ___ wake up before dawn tomorrow.", "have to", [["ought", "modal-form-error"], ["may", "modal-meaning-mixup"], ["can", "modal-meaning-mixup"]], "External schedule constraints outside personal control take HAVE TO."),
      t("should-ought", "Doctor's advice to a patient: 'You ___ reduce your daily sugar intake to prevent diabetes.'", "should", [["must to", "modal-form-error"], ["may", "modal-meaning-mixup"], ["might", "modal-meaning-mixup"]], "SHOULD gives sensible medical and lifestyle advice."),
      t("should-ought", "Citizens ___ honour the national flag and respect public institutions.", "ought to", [["ought", "modal-form-error"], ["should to", "modal-form-error"], ["have", "modal-form-error"]], "OUGHT TO expresses moral and civic responsibility: ought to honour."),
      t("prohibition-neednt", "Laboratory safety sign: 'You ___ touch exposed wires under any circumstances.'", "must not", [["need not", "modal-meaning-mixup"], ["may not to", "modal-form-error"], ["do not have", "modal-form-error"]], "Strict prohibition where an action is dangerous requires MUST NOT."),
      t("prohibition-neednt", "Admission is complimentary for school students, so you ___ purchase an entry ticket.", "need not", [["must not", "modal-meaning-mixup"], ["ought not", "modal-form-error"], ["cannot to", "modal-form-error"]], "NEED NOT indicates lack of obligation or necessity (free admission)."),
      t("must-have-to", "Find the error and its correction: 'In India, motorists must to carry a valid driving licence.'", "must to carry → must carry", [["valid → validating", "error-correction-mixup"], ["motorists → motorist", "error-correction-mixup"], ["licence → license", "error-correction-mixup"]], "Modal verbs like MUST are followed by bare infinitive without 'to'."),
      t("should-ought", "You look exhausted after rugby practice; you ___ rest your legs for an hour.", "should", [["ought", "modal-form-error"], ["shall to", "modal-form-error"], ["must to", "modal-form-error"]], "SHOULD conveys friendly, helpful advice.")
    ],
    "eq-b2-obligation-board": [
      t("must-have-to", "Complete the library circular: 'Borrowers ___ return overdue books within seven days to avoid fines.'", "must", [["might", "modal-meaning-mixup"], ["could", "modal-meaning-mixup"], ["may", "modal-meaning-mixup"]], "MUST conveys strict institutional command to prevent penalties."),
      t("must-have-to", "My eye doctor told me that I ___ wear spectacles while reading small print.", "have to", [["may", "modal-meaning-mixup"], ["might", "modal-meaning-mixup"], ["ought", "modal-form-error"]], "External medical instructions imposed by a doctor use HAVE TO."),
      t("should-ought", "Complete the student editorial: 'We ___ speak out against bullying whenever we witness it in our corridors.'", "ought to", [["ought", "modal-form-error"], ["must to", "modal-form-error"], ["may", "modal-meaning-mixup"]], "OUGHT TO captures moral obligation and collective ethical duty."),
      t("should-ought", "Find the error and its correction: 'You ought follow the guidelines printed on the back of the ticket.'", "ought follow → ought to follow", [["printed → printing", "error-correction-mixup"], ["guidelines → guideline", "error-correction-mixup"], ["back → front", "error-correction-mixup"]], "OUGHT is always followed by a to-infinitive: ought to follow."),
      t("prohibition-neednt", "Museum regulation: 'Visitors ___ photograph the ancient manuscripts with flash enabled.'", "must not", [["need not", "modal-meaning-mixup"], ["ought not", "modal-form-error"], ["dare not to", "modal-form-error"]], "Flash photography is strictly forbidden because it degrades ancient pigments."),
      t("prohibition-neednt", "Complete the host's remark: 'We have cooked plenty of rice, so you ___ cook anything tonight.'", "needn't", [["mustn't", "modal-meaning-mixup"], ["oughtn't", "modal-form-error"], ["can't to", "modal-form-error"]], "NEEDN'T shows that an action is completely unnecessary because it is handled."),
      t("must-have-to", "Find the error and its correction: 'Every citizen has to paying taxes regularly according to law.'", "has to paying → has to pay", [["regularly → regular", "error-correction-mixup"], ["citizen → citizens", "error-correction-mixup"], ["law → laws", "error-correction-mixup"]], "HAVE TO / HAS TO is followed by the base form of the verb: has to pay."),
      t("prohibition-neednt", "Which sentence expresses that an action is UNNECESSARY rather than forbidden?", "You don't have to bring lunch today.", [["You mustn't bring lunch today.", "modal-meaning-mixup"], ["You may not bring lunch today.", "modal-meaning-mixup"], ["You cannot bring lunch today.", "modal-meaning-mixup"]], "DON'T HAVE TO expresses lack of necessity, whereas the others forbid it."),
      t("should-ought", "Teacher to class: 'You ___ revise your formulas daily if you want good scores in mathematics.'", "should", [["may", "modal-meaning-mixup"], ["might", "modal-meaning-mixup"], ["ought", "modal-form-error"]], "SHOULD provides constructive academic guidance."),
      t("must-have-to", "Complete the hostel warden's announcement: 'Hostellers ___ report back to campus before 8:00 p.m.'", "must", [["might", "modal-meaning-mixup"], ["could", "modal-meaning-mixup"], ["may", "modal-meaning-mixup"]], "Strict hostel regulations take MUST.")
    ],
    "eq-b2-obligation-gate-pool": [
      t("must-have-to", "To qualify for the national science championship, teams ___ pass the regional elimination test.", "must", [["might", "modal-meaning-mixup"], ["can", "modal-meaning-mixup"], ["may", "modal-meaning-mixup"]], "Absolute criteria and mandatory prerequisites take MUST."),
      t("must-have-to", "Because our school bus broke down yesterday, we ___ walk two miles in the morning heat.", "had to", [["must", "modal-tense-mixup"], ["ought", "modal-form-error"], ["should to", "modal-form-error"]], "Past necessity caused by external circumstance requires HAD TO."),
      t("must-have-to", "Employees ___ swipe their security cards each time they enter the server room.", "have to", [["ought", "modal-form-error"], ["may", "modal-meaning-mixup"], ["might", "modal-meaning-mixup"]], "Workplace procedural rules established externally take HAVE TO."),
      t("must-have-to", "You ___ wash your hands thoroughly before handling sterile laboratory instruments.", "must", [["might", "modal-meaning-mixup"], ["could", "modal-meaning-mixup"], ["may", "modal-meaning-mixup"]], "Strict safety and hygiene protocols require MUST."),
      t("must-have-to", "Find the error and its correction: 'Applicants must to submit three passport photographs with their form.'", "must to submit → must submit", [["with → by", "error-correction-mixup"], ["photographs → photograph", "error-correction-mixup"], ["their → there", "error-correction-mixup"]], "MUST is followed directly by the bare infinitive submit."),
      t("should-ought", "We ___ plant more native saplings along our roads to counter rising urban pollution.", "ought to", [["ought", "modal-form-error"], ["should to", "modal-form-error"], ["must to", "modal-form-error"]], "Moral obligation and environmental duty are expressed by OUGHT TO."),
      t("should-ought", "Before signing any contract, you ___ read every clause with extreme caution.", "should", [["might to", "modal-form-error"], ["ought", "modal-form-error"], ["may", "modal-meaning-mixup"]], "SHOULD offers prudent professional and personal advice."),
      t("should-ought", "Children ___ respect the opinions and feelings of their elderly grandparents.", "ought to", [["ought", "modal-form-error"], ["should to", "modal-form-error"], ["have", "modal-form-error"]], "Moral duty towards elders calls for OUGHT TO."),
      t("should-ought", "Find the error and its correction: 'You should to check tyre pressure before embarking on a highway trip.'", "should to check → should check", [["tyre → tire", "error-correction-mixup"], ["pressure → pressures", "error-correction-mixup"], ["before → after", "error-correction-mixup"]], "SHOULD takes the base verb check without 'to'."),
      t("should-ought", "Which sentence conveys sensible ADVICE rather than an enforceable rule?", "You should drink sufficient water.", [["You must carry your identity card.", "modal-meaning-mixup"], ["You have to pay the entrance fee.", "modal-meaning-mixup"], ["You cannot park your vehicle here.", "modal-meaning-mixup"]], "SHOULD provides beneficial guidance without statutory enforcement."),
      t("prohibition-neednt", "Railway safety notice: 'Passengers ___ cross railway tracks while the red warning signal is flashing.'", "must not", [["need not", "modal-meaning-mixup"], ["cannot to", "modal-form-error"], ["may not to", "modal-form-error"]], "High-risk prohibited actions affecting life safety require MUST NOT."),
      t("prohibition-neednt", "We already have plenty of milk in the refrigerator, so you ___ purchase any more today.", "needn't", [["mustn't", "modal-meaning-mixup"], ["oughtn't", "modal-form-error"], ["can't to", "modal-form-error"]], "Action is entirely optional and superfluous: needn't buy."),
      t("prohibition-neednt", "Find the error and its correction: 'You mustn't bring your textbook tomorrow; the teacher will distribute printed sheets.'", "mustn't → needn't", [["bring → bringing", "error-correction-mixup"], ["distribute → distributing", "error-correction-mixup"], ["printed → print", "error-correction-mixup"]], "Bringing the textbook is merely unnecessary, not a forbidden violation."),
      t("prohibition-neednt", "Zoo warning sign: 'Visitors ___ feed the wild animals under penalty of a heavy fine.'", "must not", [["need not", "modal-meaning-mixup"], ["ought not to have", "modal-tense-mixup"], ["do not need", "modal-meaning-mixup"]], "Strict prohibition backed by punitive penalties requires MUST NOT."),
      t("prohibition-neednt", "Since tomorrow is a gazetted national holiday, we ___ attend morning assembly.", "don't have to", [["must not", "modal-meaning-mixup"], ["ought not", "modal-form-error"], ["cannot to", "modal-form-error"]], "DON'T HAVE TO indicates that attendance is not required on holidays.")
    ],
    "eq-b2-deduction-quiz": [
      t("deduction", "People are coming in with wet umbrellas; it ___ be raining outside.", "must", [["can't", "modal-meaning-error"], ["shall", "modal-meaning-error"], ["ought", "modal-form-error"]], "Strong deduction from what we can see: must be."),
      t("deduction", "Arjun only departed from Kolkata an hour ago; he ___ be in New Delhi already.", "can't", [["must", "modal-meaning-mixup"], ["would", "modal-meaning-mixup"], ["shouldn't", "modal-meaning-mixup"]], "CAN'T expresses logical impossibility given flight travel times."),
      t("past-modals", "The team lost the tournament because their defence collapsed. They ___ practised harder.", "should have", [["must have", "modal-meaning-mixup"], ["would have", "modal-meaning-mixup"], ["can have", "modal-form-error"]], "SHOULD HAVE expresses regret over a neglected past duty."),
      t("past-modals", "Kavita was capable of solving the calculus problem, but she left it blank. She ___ solved it.", "could have", [["must have", "modal-meaning-mixup"], ["would had", "modal-meaning-mixup"], ["can have", "modal-form-error"]], "COULD HAVE refers to past ability or opportunity that was not utilized."),
      t("past-habits", "When we resided in Nainital, my grandfather ___ take us for long mountain walks every Sunday.", "would", [["must", "modal-meaning-mixup"], ["shall", "modal-meaning-mixup"], ["might", "modal-meaning-mixup"]], "WOULD expresses regular past habitual actions."),
      t("deduction", "Her bicycle is parked outside the library; she ___ be studying for her chemistry test inside.", "must", [["can't", "modal-meaning-mixup"], ["ought", "modal-meaning-mixup"], ["shall", "modal-meaning-mixup"]], "Logical deduction based on seeing her bicycle parked outside uses MUST."),
      t("past-modals", "Find the error and its correction: 'You should have inform me before cancelling the group reservation.'", "inform → informed", [["before → after", "error-correction-mixup"], ["cancelling → cancel", "error-correction-mixup"], ["group → groups", "error-correction-mixup"]], "Modal perfect forms require have + past participle: should have informed."),
      t("past-habits", "In ancient times, village elders ___ assemble under the sacred banyan tree to resolve local disputes.", "would", [["should", "modal-meaning-mixup"], ["must", "modal-meaning-mixup"], ["may", "modal-meaning-mixup"]], "WOULD portrays regular customary actions in the past.")
    ],
    "eq-b2-deduction-board": [
      t("deduction", "Complete the police report: 'The front door was bolted from the inside; the intruder ___ entered through the skylight.'", "must have", [["can't have", "modal-meaning-mixup"], ["should have", "modal-meaning-mixup"], ["would have", "modal-meaning-mixup"]], "Logical certainty about past evidence requires MUST HAVE."),
      t("deduction", "That woman cannot walk without support; she ___ run a ten-kilometre marathon yesterday.", "can't have", [["must have", "modal-meaning-mixup"], ["should have", "modal-meaning-mixup"], ["would have", "modal-meaning-mixup"]], "CAN'T HAVE expresses logical impossibility concerning a past event."),
      t("past-modals", "Find the error and its correction: 'We knew the storm was coming; we should warned the villagers earlier.'", "should warned → should have warned", [["knew → know", "error-correction-mixup"], ["was coming → came", "error-correction-mixup"], ["earlier → early", "error-correction-mixup"]], "Expressing unfulfilled past duty requires SHOULD HAVE + past participle."),
      t("past-modals", "Rahul had sufficient savings to buy the laptop, but he delayed. He ___ bought it last week.", "could have", [["must have", "modal-meaning-mixup"], ["need to have", "modal-meaning-mixup"], ["shall have", "modal-tense-mixup"]], "COULD HAVE denotes an available past possibility that was not realized."),
      t("past-habits", "Whenever the monsoon broke, the children ___ splash through the overflowing muddy streams.", "would", [["should", "modal-meaning-mixup"], ["must", "modal-meaning-mixup"], ["could to", "modal-form-error"]], "WOULD portrays habitual, nostalgic childhood actions."),
      t("deduction", "Find the error and its correction: 'He hasn't eaten for twenty-four hours; he can't be starving.'", "can't → must", [["eaten → ate", "error-correction-mixup"], ["hours → hour", "error-correction-mixup"], ["for → since", "error-correction-mixup"]], "Someone who hasn't eaten for a day logically MUST be starving, not can't."),
      t("past-modals", "Which sentence expresses REGRET about a past mistake?", "I should have listened to your advice.", [["I could have solved that question.", "modal-meaning-mixup"], ["I must have left my keys at home.", "modal-meaning-mixup"], ["I would visit my cousins every year.", "modal-meaning-mixup"]], "SHOULD HAVE conveys regret over an action not taken."),
      t("past-habits", "Complete the memoir excerpt: 'In summer evenings, my mother ___ sit on the verandah and hum folk melodies.'", "would", [["should", "modal-meaning-mixup"], ["ought", "modal-form-error"], ["can", "modal-tense-mixup"]], "WOULD captures routine past pastimes in reflective writing."),
      t("deduction", "The laboratory lights are switched off and the main gate is locked. The staff ___ gone home.", "must have", [["can't have", "modal-meaning-mixup"], ["should have", "modal-meaning-mixup"], ["could not", "modal-meaning-mixup"]], "Physical evidence confirms logical certainty about past departure: must have gone."),
      t("past-modals", "You ___ left your jacket in the school auditorium; go check the lost-and-found bin.", "might have", [["should have", "modal-meaning-mixup"], ["can have", "modal-form-error"], ["would have", "modal-meaning-mixup"]], "Tentative past possibility is expressed using MIGHT HAVE.")
    ],
    "eq-b2-deduction-gate-pool": [
      t("deduction", "The ground is completely dry; it ___ rained heavily here last night.", "can't have", [["must have", "modal-meaning-mixup"], ["should have", "modal-meaning-mixup"], ["could have", "modal-meaning-mixup"]], "Dry ground makes heavy rain logically impossible: can't have rained."),
      t("deduction", "Rohan has scored top marks in every mock test; he ___ be thrilled with his progress.", "must", [["can't", "modal-meaning-mixup"], ["ought", "modal-meaning-mixup"], ["shall", "modal-meaning-mixup"]], "Logical certainty deduced from continuous success uses MUST."),
      t("deduction", "She possesses keys to the office; she ___ the person who unlocked the archives.", "must have been", [["can't have been", "modal-meaning-mixup"], ["should have been", "modal-meaning-mixup"], ["would be", "modal-meaning-mixup"]], "Logical past deduction supported by key access takes MUST HAVE BEEN."),
      t("deduction", "Find the error and its correction: 'Aman is only fourteen; he must be a certified neurosurgeon already.'", "must be → can't be", [["only → just", "error-correction-mixup"], ["certified → certifying", "error-correction-mixup"], ["already → yet", "error-correction-mixup"]], "A fourteen-year-old child cannot logically be a qualified brain surgeon."),
      t("deduction", "Which sentence expresses LOGICAL CERTAINTY rather than permission or advice?", "He must be the author of this manuscript.", [["He must submit his manuscript by Monday.", "modal-meaning-mixup"], ["He should write another manuscript soon.", "modal-meaning-mixup"], ["He may revise the manuscript if needed.", "modal-meaning-mixup"]], "Deductive certainty identifies the author based on evidential proof."),
      t("past-modals", "The bus arrived on time, but Anish arrived five minutes late. He ___ left his home earlier.", "should have", [["can have", "modal-meaning-mixup"], ["must have", "modal-meaning-mixup"], ["would have", "modal-meaning-mixup"]], "SHOULD HAVE expresses neglect of past sensible planning."),
      t("past-modals", "With her exceptional sprinting speed, Deepa ___ won the gold medal, but her hamstring seized.", "could have", [["must have", "modal-meaning-mixup"], ["can have", "modal-meaning-mixup"], ["would have to", "modal-form-error"]], "COULD HAVE refers to genuine past capability thwarted by circumstance."),
      t("past-modals", "The patient developed acute complications. The doctor ___ administered antibiotics much sooner.", "should have", [["can have", "modal-form-error"], ["might to have", "modal-form-error"], ["would have to", "modal-form-error"]], "Medical evaluation of past neglect calls for SHOULD HAVE."),
      t("past-modals", "Find the error and its correction: 'We could of won the quiz if our buzzer had worked properly.'", "could of → could have", [["won → win", "error-correction-mixup"], ["worked → work", "error-correction-mixup"], ["properly → proper", "error-correction-mixup"]], "'Could of' is a phonetic error; the standard grammatical construction is COULD HAVE."),
      t("past-modals", "Nikhil ___ informed his parents about the school trip, but he completely forgot.", "ought to have", [["must to have", "modal-form-error"], ["can have", "modal-form-error"], ["should to have", "modal-form-error"]], "OUGHT TO HAVE highlights an unfulfilled moral and family obligation."),
      t("past-habits", "During cold winter evenings, our family ___ gather around the hearth to share folktales.", "would", [["must", "modal-meaning-mixup"], ["should", "modal-meaning-mixup"], ["could to", "modal-form-error"]], "WOULD portrays warm and repetitive past family traditions."),
      t("past-habits", "Every summer vacation, we ___ build treehouses using fallen timber from the orchard.", "would", [["must", "modal-meaning-mixup"], ["should", "modal-meaning-mixup"], ["shall", "modal-meaning-mixup"]], "WOULD denotes recurring childhood activities in the past."),
      t("past-habits", "Before the highway was constructed, villagers ___ cross the wide river by wooden ferry.", "used to", [["would to", "modal-form-error"], ["must have", "modal-meaning-mixup"], ["should have", "modal-meaning-mixup"]], "USED TO expresses discontinued past habits and past physical states."),
      t("past-habits", "Find the error and its correction: 'My brother would loves listening to classical sitar concerts.'", "would loves → would love", [["listening → listen", "error-correction-mixup"], ["classical → classic", "error-correction-mixup"], ["concerts → concert", "error-correction-mixup"]], "The modal WOULD must always be accompanied by bare infinitive love."),
      t("past-habits", "Which sentence describes a REPEATED past habit?", "In the mornings, she would feed the sparrows.", [["She fed the sparrows once yesterday.", "modal-meaning-mixup"], ["She should feed the sparrows daily.", "modal-meaning-mixup"], ["She may feed the sparrows tomorrow.", "modal-meaning-mixup"]], "WOULD + base verb describes customary, repeated past behavior.")
    ],
    "eq-b2-test": [
      t("can-could", "Despite being visually impaired, Suraj ___ play intricate ragas on the flute with unmatched mastery.", "can", [["may", "modal-meaning-mixup"], ["ought", "modal-form-error"], ["shall", "modal-meaning-mixup"]], "CAN indicates personal talent and present musical ability."),
      t("permission", "Complete the formal request to the headmaster: '___ we host the inter-school science symposium on Friday, sir?'", "May", [["Can", "modal-meaning-mixup"], ["Will", "modal-meaning-mixup"], ["Must", "modal-meaning-mixup"]], "MAY is the standard formal modal when requesting institutional approval."),
      t("possibility", "The sky has darkened and thunder rumbles; heavy hail ___ strike the valley shortly.", "may", [["must", "modal-meaning-mixup"], ["ought", "modal-form-error"], ["shall", "modal-meaning-mixup"]], "MAY expresses an impending realistic possibility based on atmospheric conditions."),
      t("must-have-to", "Complete the museum advisory: 'Visitors ___ not touch the preserved terracotta sculptures under any pretext.'", "must", [["might", "modal-meaning-mixup"], ["need", "modal-meaning-mixup"], ["could", "modal-meaning-mixup"]], "MUST NOT establishes strict and non-negotiable prohibition."),
      t("prohibition-neednt", "Because our school library provides digital dictionaries, you ___ purchase a bulky paper copy.", "needn't", [["mustn't", "modal-meaning-mixup"], ["oughtn't", "modal-form-error"], ["cannot to", "modal-form-error"]], "NEEDN'T demonstrates lack of necessity (optional expenditure)."),
      t("should-ought", "As responsible citizens, we ___ preserve our natural water bodies and forested hills.", "ought to", [["ought", "modal-form-error"], ["should to", "modal-form-error"], ["have", "modal-form-error"]], "OUGHT TO conveys moral, environmental, and civic responsibility."),
      t("deduction", "Her laboratory lights are extinguished and her bag is gone; she ___ departed for the station.", "must have", [["can't have", "modal-meaning-mixup"], ["should have", "modal-meaning-mixup"], ["would be", "modal-meaning-mixup"]], "MUST HAVE represents logical certainty drawn from observational evidence."),
      t("deduction", "Pranav was present in Chennai all afternoon; he ___ witnessed the robbery in Chandigarh.", "can't have", [["must have", "modal-meaning-mixup"], ["should have", "modal-meaning-mixup"], ["might have", "modal-meaning-mixup"]], "Physical presence in Chennai makes presence in Chandigarh impossible: can't have."),
      t("past-modals", "Sita forgot to set her alarm and arrived late. She ___ set it before going to sleep.", "should have", [["must have", "modal-meaning-mixup"], ["can have", "modal-meaning-mixup"], ["would have", "modal-meaning-mixup"]], "SHOULD HAVE expresses hindsight regret over a neglected precaution."),
      t("past-modals", "Karan had sufficient stamina to win the race, but he stopped early. He ___ won the silver medal.", "could have", [["must have", "modal-meaning-mixup"], ["would to have", "modal-meaning-mixup"], ["can have", "modal-form-error"]], "COULD HAVE denotes unexercised past ability."),
      t("past-habits", "Whenever the monsoon broke over our coastal village, we ___ race paper boats along the gutters.", "would", [["must", "modal-meaning-mixup"], ["should", "modal-meaning-mixup"], ["shall", "modal-meaning-mixup"]], "WOULD characterizes recurring seasonal childhood habits."),
      t("must-have-to", "Find the error and its correction: 'In residential areas, motorists must not sounding horn unnecessarily.'", "sounding → sound", [["motorists → motorist", "error-correction-mixup"], ["unnecessarily → unnecessary", "error-correction-mixup"], ["areas → area", "error-correction-mixup"]], "Modal verbs require the bare infinitive verb form: sound.")
    ]
  },
  readings: {},
  nodes: [
    unit("eq-b2", 11, "Grammar Pro: Modals"),

    ability,
    withSubtopic(practice("eq-b2-ability-p1", ability, 1, "Board Style: Ability & Permission", "hard", [quiz("eq-b2-ability-board")]), "can-could"),
    gate("eq-b2-ability-gate", ability, "Ability & Permission Challenge", "eq-b2-ability-gate-pool", {
      "can-could": "Ability (Can & Could)",
      "permission": "Permission (May & Can)",
      "possibility": "Possibility (May & Might)",
    }),
    endless(ability),

    obligation,
    withSubtopic(practice("eq-b2-obligation-p1", obligation, 1, "Board Style: Obligation & Advice", "hard", [quiz("eq-b2-obligation-board")]), "must-have-to"),
    gate("eq-b2-obligation-gate", obligation, "Obligation & Advice Challenge", "eq-b2-obligation-gate-pool", {
      "must-have-to": "Must vs Have to",
      "should-ought": "Should & Ought to",
      "prohibition-neednt": "Mustn't vs Needn't",
    }),
    endless(obligation),

    deduction,
    withSubtopic(practice("eq-b2-deduction-p1", deduction, 1, "Board Style: Deduction & Past Modals", "hard", [quiz("eq-b2-deduction-board")]), "deduction"),
    gate("eq-b2-deduction-gate", deduction, "Deduction Challenge", "eq-b2-deduction-gate-pool", {
      "deduction": "Deduction (Must be & Can't be)",
      "past-modals": "Past Modals (Should have & Could have)",
      "past-habits": "Past Habits (Would & Used to)",
    }),
    endless(deduction),

    boss(
      "eq-b2-boss",
      "eq-b2",
      "Grammar Pro Boss: Modals",
      "eq-b2-test",
      "The Rule Master has scrambled the school rulebook and student notices. Choose the exact modal for every duty, rule, and possibility to restore order."
    ),
  ].map((n) => forGrades(n, GRADES)),
};

// data/academyQuestData.js
// Apprec8 Academy (owner idea, 2026-11-09): a team quest so the owner, the co-owner and future partners learn every
// role by doing. Source: docs/product/WHO_DOES_WHAT.md. Draft = only testers (the owner) see the tile for now;
// a "team" visibility for admins (Seema) comes with G81's visibility helper.
// Every fact here was checked in the code on 2026-11-09. Planned features are not taught as if they exist.
// Explanations say why the other options are wrong (owner rule, 2026-11-09).

import { q, study, quiz, unit, main } from "./englishQuest/helpers.js";

export const QUEST_ID = "apprec8-academy";

export const quest = {
  title: "Apprec8 Academy",
  description: "For the Apprec8 team: learn every role by doing it. Schools, teachers, families, notes, updates and safety.",
  image: null,
  version: 1,
  draft: true, // testers only (the owner) until the team visibility lands
};

export const tile = {
  title: "Apprec8 Academy",
  type: "QUEST",
  carouselGroup: quest.draft ? "quest_draft" : "quest",
  order: 9,
  image: null,
  questId: QUEST_ID,
  description: "For the team: master the app",
};

// ---------- Learn cards ----------
export const studyPages = {
  "ac-schools-study": {
    name: "Schools, classes and teachers",
    author: "Apprec8",
    cards: [
      {
        emoji: "🏫",
        title: "Who makes a school?",
        text: "The owner and co-owner (and any school admin they add) create schools and classes. Teachers can't make their own school yet, so if a teacher joins and has nobody to teach, an admin sets it up.",
        examples: ["Me → Admin tools → Schools → + New school", "Open the school → Add a class"],
      },
      {
        emoji: "✉️",
        title: "Bringing a teacher in",
        text: "Open the class and tap Invite a teacher. That makes a one-time code. Send it to the teacher; she types it in Me → Join as a teacher.",
        examples: ["Invite code = for one teacher, once", "Class code = for students"],
      },
      {
        emoji: "🧑‍🏫",
        title: "A tutor with no school",
        text: "Today: create a 'school' with the tutor's name and a class for her students, then invite her. A 'Start my own class' option with the owner's approval is planned.",
        examples: ["School name: the tutor's or coaching centre's name"],
      },
      {
        kind: "check",
        question: "A teacher joined but has no class to share. What do you do?",
        answer: "Create her school and class, then invite her",
        wrong: ["Tell her to create a school herself", "Ask students to join without a code"],
        explain: "Only admins create schools and classes; students always need a class code.",
      },
    ],
  },
  "ac-notes-study": {
    name: "Notes, decisions and updates",
    author: "Apprec8",
    cards: [
      {
        emoji: "📥",
        title: "One place for every note",
        text: "Children's 🚩 reports, ideas, Chamku's questions and 'Tell us what you think' all land in Admin tools → Ideas & reports. Claude reads them every session and groups the same problem from different people.",
        examples: ["You send your own notes the same way", "No WhatsApp chains"],
      },
      {
        emoji: "🗳️",
        title: "Decisions",
        text: "Claude asks only what needs you: money, safety, big product choices. Answer in Me → Decisions with Yes, No, More details or Later.",
        examples: ["Later hides a card for a day"],
      },
      {
        emoji: "🔄",
        title: "Three kinds of change",
        text: "Content (questions, Learn cards) goes live when an admin re-seeds it. Screens and fixes go over the air: phones get them the next time the app opens. New libraries need a new build on the Play Store.",
        examples: ["Re-seed: Admin tools → seed button", "Over the air: no Play Store update"],
      },
      {
        emoji: "🧯",
        title: "If an update breaks something",
        text: "Tell Claude at once. Claude sends the last good version back to phones (they get it on the next open), then fixes and tests on the emulator before trying again.",
        examples: ["Every update is tested on the emulator first"],
      },
      {
        kind: "check",
        question: "Claude fixed a wrong answer in Grammar Pro. What makes it reach children?",
        answer: "The update, then an admin re-seeds English",
        wrong: ["A new Play Store build", "Nothing: phones fix it alone"],
        explain: "Questions are content: they need a re-seed after the update. No new build is needed.",
      },
    ],
  },
  "ac-teacher-study": {
    name: "A teacher's week",
    author: "Apprec8",
    cards: [
      {
        emoji: "📣",
        title: "Share the class code",
        text: "Progress → the class → SHARE CODE sends it on WhatsApp. Parents type it in the app with their child, and a parent says yes inside the app.",
        examples: ["English or हिंदी consent"],
      },
      {
        emoji: "✅",
        title: "Let students in",
        text: "New students wait under 'Waiting for you'. The teacher approves only children she knows.",
        examples: ["Progress → the class → Waiting for you → Approve"],
      },
      {
        emoji: "🎯",
        title: "Assign, then reteach",
        text: "Assign a topic with a due date. A topic the teacher assigns opens for her students even if their map hasn't reached it. Later the class shows who practised, how well, and the weakest topic to teach again.",
        examples: ["Progress → the class → Assign a topic"],
      },
      {
        kind: "check",
        question: "A student typed the class code but isn't in the class. Why?",
        answer: "The teacher hasn't approved them yet",
        wrong: ["The code only works on Mondays", "The parent must email the school"],
        explain: "Every student waits for the teacher's approval. Codes work any day, and nothing goes by email.",
      },
    ],
  },
  "ac-family-study": {
    name: "Families",
    author: "Apprec8",
    cards: [
      {
        emoji: "👪",
        title: "Add or link a child",
        text: "New child: Me → My children → Add a child. A child with a login: the parent gets a code from 'Link my child's own account' (once, 24 hours); the child types it in Link to my parent.",
        examples: ["Pratha: link, don't add (adding makes an empty profile)"],
      },
      {
        emoji: "🔒",
        title: "Play as, lock and time",
        text: "A parent sets a 4-number PIN, then 'Play as' switches the phone to the child. The lock (Android pinning) keeps YouTube out; when time is up, only the parent's PIN switches back. Today this switch needs the internet.",
        examples: ["Leaving the lock: the phone's own PIN or pattern"],
      },
      {
        emoji: "🔑",
        title: "Forgot the parent PIN?",
        text: "On the child's profile: Me → Sign out, then sign in with the parent's own Google or email account, and Me → Change parent PIN.",
        examples: ["The child can't do this without the parent's password"],
      },
      {
        kind: "check",
        question: "Pratha already has an account with progress. How does Papa see it?",
        answer: "Link her account with a code",
        wrong: ["Add a child named Pratha", "Sign in as Pratha on Papa's phone"],
        explain: "Adding makes a new, empty profile. Linking keeps her login and progress and shows her week to Papa.",
      },
    ],
  },
  "ac-privacy-study": {
    name: "What we keep and who sees it",
    author: "Apprec8",
    cards: [
      {
        emoji: "🛡️",
        title: "Small on purpose",
        text: "Other children see only a first name and class. No ads, no chat: children can't message anyone. A parent says yes in the app before a child joins a class.",
        examples: ["Leaderboard: first name + class"],
      },
      {
        emoji: "🗑️",
        title: "Delete means delete",
        text: "Me → Delete my account removes progress, answers, stars, classes and sign-in. Profiles a parent made are deleted too; children with their own login keep theirs. Only a record that consent was given stays, without names.",
        examples: ["Type DELETE MY ACCOUNT to confirm"],
      },
      {
        kind: "check",
        question: "What can another child see about Pratha?",
        answer: "Her first name and class",
        wrong: ["Her email and school", "Her full name and photo"],
        explain: "We show only a first name and class to other children; email and full names stay private.",
      },
    ],
  },
  "ac-help-study": {
    name: "When a child needs help",
    author: "Apprec8",
    cards: [
      {
        emoji: "💚",
        title: "Need help is on every Me screen",
        text: "A child who feels sad or scared, or is being hurt, taps Need help: Childline 1098, Tele-MANAS 14416 and 112 for emergencies.",
        examples: ["1098 Childline", "14416 Tele-MANAS", "112 emergency"],
      },
      {
        emoji: "🤝",
        title: "Tell Seema",
        text: "Seema leads safeguarding for Apprec8 (she heads her school's POCSO committee). If anything worries you about a child, tell her.",
        examples: ["Never handle a safety worry alone"],
      },
      {
        kind: "check",
        question: "A child writes in a note that someone is hurting them. First step?",
        answer: "Tell Seema and point the child to Need help",
        wrong: ["Reply to the child in the app", "Wait for the weekly summary"],
        explain: "The app has no chat, and a safety worry can't wait a week: tell Seema now; Need help gives the helplines.",
      },
    ],
  },
};

// ---------- Quizzes (scenarios) ----------
export const quizzes = {
  "ac-schools-quiz": [
    q("A tutor has no school in the app. Who sets up her class?", "The owner or co-owner",
      [["The tutor herself, from Me → Join as a teacher", "role-mixup"], ["Her students, when they type a class code", "role-mixup"], ["Claude, from the decisions inbox", "role-mixup"]],
      "Admins create schools and classes. A tutor can't yet (planned with the owner's approval); students and Claude don't."),
    q("Where does an admin create a new school?", "Admin tools → Schools",
      [["Progress → My classes", "place-mixup"], ["Me → Join as a teacher", "place-mixup"], ["Home → Your quests", "place-mixup"]],
      "Schools are made in Me → Admin tools → Schools. Join as a teacher is for a teacher typing her invite code."),
    q("What does 'Invite a teacher' give you?", "A one-time code for one teacher",
      [["A class code that all her students can type", "code-mixup"], ["A web link that parents open to say yes", "code-mixup"], ["A new school with the teacher as its admin", "code-mixup"]],
      "The invite code brings one teacher in, once. Students use the class code; parents say yes inside the app."),
    q("Seema typed her invite code. Where did she type it?", "Me → Join as a teacher",
      [["Me → Link to my parent", "place-mixup"], ["Me → Join a class", "place-mixup"], ["Admin tools → Schools", "place-mixup"]],
      "Teachers use Join as a teacher. Join a class is for students; Link to my parent is for a child's own account."),
    q("A coaching centre wants its own space today. What's the quickest way?", "A 'school' named after the centre",
      [["Wait for a new app build", "process-mixup"], ["Use the Demo School", "process-mixup"], ["Each student makes a class", "process-mixup"]],
      "Today an admin creates a school with the centre's name. The Demo School is fake and resets; students can't make classes."),
  ],
  "ac-notes-quiz": [
    q("Where do children's 🚩 reports and ideas arrive?", "Admin tools → Ideas & reports",
      [["The owner's WhatsApp, sent by the app", "place-mixup"], ["Me → Messages, under each child's name", "place-mixup"], ["The Play Store reviews page", "place-mixup"]],
      "All notes land in one place in the app; Claude reads them every session. WhatsApp scatters them."),
    q("A question has a wrong answer. Claude fixed it. What else is needed?", "Publish, then an admin re-seeds",
      [["A new Play Store build, after Google approves it", "release-mixup"], ["Nothing: phones correct the question by themselves", "release-mixup"], ["Each child reinstalls the app", "release-mixup"]],
      "Questions are content: after the update, a re-seed sends them to phones. No build or reinstall is needed."),
    q("A screen was fixed with no new library. How do phones get it?", "Over the air, on the next app open",
      [["Only after a Play Store build", "release-mixup"], ["Only after a re-seed", "release-mixup"], ["Only on Wi-Fi at midnight", "release-mixup"]],
      "Code-only fixes go over the air and arrive the next time the app opens. New libraries are what need a build."),
    q("What should Claude bring to the owner as a decision card?", "A choice about money or safety",
      [["Which test Gemini should run first on the emulator", "remit-mixup"], ["How to name a variable in the code", "remit-mixup"], ["A spelling fix in one Learn card", "remit-mixup"]],
      "Claude decides engineering and content-quality calls and tells the owner after. Money, safety, legal and big product choices go to the owner."),
    q("An update made the app crash. What happens first?", "The last good version goes back",
      [["Wait for the weekly summary", "process-mixup"], ["Ask users to reinstall", "process-mixup"], ["Delete the newest content", "process-mixup"]],
      "Claude republishes the last good update so phones recover on the next open, then fixes and tests on the emulator."),
  ],
  "ac-teacher-quiz": [
    q("How do students join a teacher's class?", "Class code, then a parent's yes",
      [["With the teacher's invite code", "code-mixup"], ["By searching the school name", "process-mixup"], ["By email to the teacher", "process-mixup"]],
      "The class code is for students and a parent agrees in the app. The invite code is only for teachers; there's no search or email."),
    q("Who approves a student who wants to join?", "The class teacher",
      [["The student's friend", "role-mixup"], ["Claude", "role-mixup"], ["Nobody, it's automatic", "role-mixup"]],
      "Students wait under 'Waiting for you' until the teacher approves them: only children she knows."),
    q("A teacher assigns a topic the map hasn't reached. What happens?", "It opens for her students",
      [["It stays locked until the Boss", "assign-mixup"], ["Only the teacher can open it", "assign-mixup"], ["It deletes earlier progress", "assign-mixup"]],
      "Assigned topics open even if the path hasn't reached them; nothing is deleted."),
    q("Where does Seema see who practised and the weakest topic?", "Progress → her class",
      [["Admin tools → Schools", "place-mixup"], ["Fun tab", "place-mixup"], ["Me → Messages", "place-mixup"]],
      "The class view in Progress shows each student's week and the weakest topic to reteach."),
    q("Where is the class code shared from?", "Progress → the class → SHARE CODE",
      [["Me → Join as a teacher", "place-mixup"], ["The Play Store page", "place-mixup"], ["Admin tools → Decisions", "place-mixup"]],
      "SHARE CODE sends it on WhatsApp in one tap. Join as a teacher is where a teacher types her invite."),
  ],
  "ac-family-quiz": [
    q("A parent forgot the PIN and the child's profile is on. What works?", "Sign out, sign in as the parent, change PIN",
      [["Uninstall the app and install it again", "pin-mixup"], ["Keep guessing numbers until it opens", "pin-mixup"], ["Ask the child, who saw the PIN typed", "pin-mixup"]],
      "The parent signs in with their own account and sets a new PIN in Me. Guessing locks for 15 minutes after 5 tries."),
    q("What must a parent do before 'Play as' works?", "Set a 4-number parent PIN",
      [["Join a class", "setup-mixup"], ["Turn off the internet", "setup-mixup"], ["Make a school", "setup-mixup"]],
      "Play as asks for a PIN first; that PIN brings the phone back. Today it needs the internet, not the opposite."),
    q("How long does a 'link my child' code work?", "Once, for 24 hours",
      [["Forever, many times", "code-mixup"], ["One minute", "code-mixup"], ["Until the child turns 18", "code-mixup"]],
      "The code works once, for 24 hours, typed on the child's own phone."),
    q("What keeps YouTube out during Play as?", "The lock (Android app pinning)",
      [["The parent's email", "lock-mixup"], ["Dark mode", "lock-mixup"], ["The leaderboard", "lock-mixup"]],
      "Pinning keeps the phone in Apprec8; leaving needs the phone's own PIN or pattern."),
    q("A child already has a login and progress. What should the parent do?", "Link the child's own account",
      [["Add a child with the same name", "link-mixup"], ["Delete the child's account", "link-mixup"], ["Make a new email", "link-mixup"]],
      "Linking keeps the login and progress. Adding makes a new, empty profile."),
  ],
  "ac-privacy-quiz": [
    q("What do other children see on the leaderboard?", "First name and class",
      [["Full name and school", "privacy-mixup"], ["Email address", "privacy-mixup"], ["Photo and phone number", "privacy-mixup"]],
      "Only a first name and class are shown to others."),
    q("Can a child send messages to other children?", "No, there's no chat",
      [["Yes, in Messages", "privacy-mixup"], ["Only to classmates", "privacy-mixup"], ["Only on weekends", "privacy-mixup"]],
      "There is no chat at all; children tap only. Messages are from the app, not from other people."),
    q("A family deletes their account. What stays?", "Only a record that consent was given",
      [["All answers, kept for statistics and reports", "delete-mixup"], ["Stars and streaks, in case they come back", "delete-mixup"], ["Their email address, for news and offers", "delete-mixup"]],
      "Everything goes except a nameless record that consent was given."),
    q("When does a parent say yes for a child?", "In the app, before the child joins a class",
      [["On a paper form the school sends home", "consent-mixup"], ["Never: children don't need a parent's yes", "consent-mixup"], ["By email, about a week after joining", "consent-mixup"]],
      "Consent is in the app (English or हिंदी), before joining a class. No paper forms."),
  ],
  "ac-help-quiz": [
    q("Which number is Childline?", "1098",
      [["14416", "helpline-mixup"], ["112", "helpline-mixup"], ["100", "helpline-mixup"]],
      "1098 is Childline. 14416 is Tele-MANAS (mental health) and 112 is for emergencies."),
    q("Where does a child find the helplines?", "Me → Need help",
      [["Fun tab", "place-mixup"], ["Progress → Quests", "place-mixup"], ["Admin tools", "place-mixup"]],
      "Need help sits on every child's Me screen; Admin tools is only for admins."),
    q("Who leads safeguarding for Apprec8?", "Seema",
      [["Claude", "role-mixup"], ["Gemini", "role-mixup"], ["Any class teacher", "role-mixup"]],
      "Seema leads safeguarding (she heads her school's POCSO committee). Tell her about any worry."),
    q("A note shows a child may be unsafe. When do you act?", "Now: tell Seema",
      [["In the weekly summary", "urgency-mixup"], ["After the pilot", "urgency-mixup"], ["Only if it happens twice", "urgency-mixup"]],
      "Safety can't wait: tell Seema at once and point the child to Need help."),
  ],
};

export const readings = {};
export const wordTables = {};

// ---------- The map ----------
const u1 = unit("ac-u1", 1, "Run Apprec8");
const schools = main("ac-schools", u1.id, 1, "Schools, classes and teachers", [study("ac-schools-study"), quiz("ac-schools-quiz")]);
const notes = main("ac-notes", u1.id, 2, "Notes, decisions and updates", [study("ac-notes-study"), quiz("ac-notes-quiz")]);
const u2 = unit("ac-u2", 2, "Teachers and families");
const teacher = main("ac-teacher", u2.id, 1, "A teacher's week", [study("ac-teacher-study"), quiz("ac-teacher-quiz")]);
const family = main("ac-family", u2.id, 2, "Families", [study("ac-family-study"), quiz("ac-family-quiz")]);
const u3 = unit("ac-u3", 3, "Safety and privacy");
const privacy = main("ac-privacy", u3.id, 1, "What we keep and who sees it", [study("ac-privacy-study"), quiz("ac-privacy-quiz")]);
const help = main("ac-help", u3.id, 2, "When a child needs help", [study("ac-help-study"), quiz("ac-help-quiz")]);

export const nodes = [u1, schools, notes, u2, teacher, family, u3, privacy, help];

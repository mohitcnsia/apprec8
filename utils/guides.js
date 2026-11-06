// utils/guides.js
// Guide quests, learn by doing (mockup row W, owner-approved 2026-11-05). Pure: the steps of each guide and which step
// is done, worked out from facts the app already reads (schools, classes, members, assignments) plus a few "marks" the
// app saves on this phone when something happens that leaves no data behind (an invite code made, a code shared).
//
// facts = { schools, classes, members, teaching, assignments, marks } (counts / booleans, see guideFacts.js)

export const GUIDES = [
  {
    id: "admin-school",
    icon: "🏫",
    title: "Set up a school",
    who: "You (admin)",
    adminOnly: true,
    steps: [
      {
        id: "school",
        title: "Create the school",
        why: "One school holds all its classes and teachers.",
        hint: "Tap + NEW SCHOOL at the bottom. Type the school's name and town, then Create.",
        go: { screen: "Schools" },
        done: (f) => f.schools > 0,
      },
      {
        id: "class",
        title: "Create a class",
        why: "Name it like the school does (10-B), pick the class level and the subjects. You get a code to share.",
        hint: "Under your school, tap Add a class. Name it (e.g. 10-B), tap the class level, tick the subjects, then Create.",
        go: { screen: "Schools" },
        done: (f) => f.classes > 0,
      },
      {
        id: "invite",
        title: "Invite the teacher",
        why: "You get a one-time code. Send it to the teacher on WhatsApp; she types it in her app.",
        hint: "Tap your class, then Invite a teacher. Pick her subjects, make the code and share it.",
        go: { screen: "Schools" },
        done: (f) => !!f.marks["admin.invite"] || f.teachers > 0,
      },
      {
        id: "approve-teacher",
        title: "Approve the teacher",
        why: "After she types the code, she waits for you. Only you can let a teacher into a class.",
        hint: "Tap your class. Under Waiting for you, tap Approve next to the teacher's name.",
        go: { screen: "Schools" },
        done: (f) => f.teachers > 0,
      },
      {
        id: "test-student",
        title: "Let a test student join",
        why: "See what parents and children do. Use a second phone (or Pratha's): Me → Join a class → the class code.",
        hint: "Tap your class: when the test student appears under Waiting for you, tap Approve.",
        go: { screen: "Schools" },
        done: (f) => f.approvedKids > 0,
      },
    ],
  },
  {
    id: "teacher-class",
    icon: "👩‍🏫",
    title: "Start your class",
    who: "Teachers",
    steps: [
      {
        id: "join",
        title: "Join as a teacher",
        why: "Type the code your school admin sent you. The admin then approves you.",
        waiting: "Code sent. Waiting for the admin to approve you.",
        hint: "Type the code from your school admin, then tap Join.",
        go: { screen: "JoinAsTeacher" },
        done: (f) => f.teaching > 0,
      },
      {
        id: "share",
        title: "Share the class code",
        why: "Send it to 2 students' parents first. They type it in the app with their child.",
        hint: "Under My classes, tap your class, then SHARE CODE. Pick WhatsApp or SMS.",
        go: { tab: "Stats" },
        done: (f) => !!f.marks["teacher.share"] || f.kids > 0,
      },
      {
        id: "approve",
        title: "Approve your students",
        why: "You know your students: approve only children you know. Their parent agreed when they joined.",
        hint: "Tap your class. Under Waiting for you, tap Approve for children you know.",
        go: { tab: "Stats" },
        done: (f) => f.approvedKids > 0,
      },
      {
        id: "assign",
        title: "Assign one topic",
        why: "Pick a topic and a due date. It opens on your students' maps.",
        hint: "Tap your class. Under Assign a topic, pick a topic and a due date, then tap ASSIGN.",
        go: { tab: "Stats" },
        done: (f) => f.assignments > 0,
      },
      {
        id: "progress",
        title: "See their progress",
        why: "Each student's week: questions, accuracy and weak topics.",
        hint: "Tap your class: each student's week, accuracy and weak topics are listed under it.",
        go: { tab: "Stats" },
        done: (f) => !!f.marks["teacher.progress"],
      },
    ],
  },
];

// Owner 2026-11-06: "a great app difficult to use is a waste". Three more guides (row W design, approved 2026-11-05):
// a tour for grown-ups (you, Seema, parents, teachers), the parents' guide and the children's first day. A "visit"
// step ticks once its screen was opened from the guide (mark `${guideId}.${stepId}.visited`, saved by GuideScreen).
const visited = (guideId, stepId) => (f) => !!f.marks[`${guideId}.${stepId}.visited`];

GUIDES.unshift({
  id: "tour",
  icon: "🗺️",
  title: "Tour of Apprec8",
  who: "Grown-ups",
  adultOnly: true,
  steps: [
    {
      id: "home",
      title: "Home: the quests",
      why: "Each tile is a quest: English, Science, Word Power, Treasure Words. ▶ opens where the child left off. Reminders for tests sit on top.",
      hint: "This is Home. Each tile is a quest; ▶ continues it. Then tap Guide ›.",
      go: { tab: "Apprec8", screen: "HomeScreen" },
      done: visited("tour", "home"),
    },
    {
      id: "map",
      title: "A quest map",
      why: "One path of topics. Each topic: Learn cards first, then practice. A Boss at the end of a unit opens the next one. A lock means \"not yet\".",
      hint: "Scroll the path. Tap any open circle to see Learn cards and practice. Then tap Guide ›.",
      go: { tab: "Apprec8", screen: "EnglishQuestMap", params: { questId: "english-quest" } },
      done: visited("tour", "map"),
    },
    {
      id: "mistakes",
      title: "My mistakes",
      why: "Every wrong answer comes back here until the child gets it right twice. The button sits at the bottom of each quest map.",
      hint: "This is My mistakes: wrong answers wait here until they're right twice. Then tap Guide ›.",
      go: { tab: "Apprec8", screen: "EnglishQuestMap", params: { questId: "english-quest", openMistakes: true } },
      done: visited("tour", "mistakes"),
    },
    {
      id: "progress",
      title: "Progress",
      why: "Stars, streaks, time spent, strong topics and one topic to practise. Parents see each child; teachers see their classes.",
      hint: "This is Progress. Parents: tap a child. Teachers: tap a class. Then tap Guide ›.",
      go: { tab: "Stats", screen: "ProgressScreen", params: {} },
      done: visited("tour", "progress"),
    },
    {
      id: "help",
      title: "Need help?",
      why: "For a child who is sad, scared or hurt: national helplines (1098, 14416, 112), always one tap away on Me.",
      hint: "Tap the green \"Need help? Talk to someone\" row to see what a child sees. Then tap Guide ›.",
      go: { screen: "ProfileScreen" },
      done: visited("tour", "help"),
    },
    {
      id: "children",
      title: "Children on your phone",
      why: "Each child gets their own profile, stars and a play-time timer on your phone. The parents' guide shows how.",
      hint: "Under My children: Add a child, then Play as. Then tap Guide ›.",
      go: { screen: "ProfileScreen" },
      done: visited("tour", "children"),
    },
  ],
});

GUIDES.push(
  {
    id: "parent",
    icon: "👪",
    title: "For parents",
    who: "Parents",
    adultOnly: true,
    steps: [
      {
        id: "add",
        title: "Add your child",
        why: "Their first name and class. You agree for them once, as their parent or guardian. No email needed.",
        hint: "Type your child's first name, pick the class, read the short note and agree.",
        go: { screen: "AddChild" },
        done: (f) => f.children > 0,
      },
      {
        id: "play",
        title: "Let them play on your phone",
        why: "Play as your child: their own stars and progress. Set a play time if you like; your PIN brings you back.",
        hint: "Under My children, tap your child, then Play as. Pick a play time, or none.",
        go: { screen: "ProfileScreen" },
        done: visited("parent", "play"),
      },
      {
        id: "week",
        title: "See their week",
        why: "Days practised, time spent, strong topics and one thing to do at home together.",
        hint: "Tap your child's name to see their week. Then tap Guide ›.",
        go: { tab: "Stats", screen: "ProgressScreen", params: { view: "family" } },
        done: visited("parent", "week"),
      },
      {
        id: "summary",
        title: "Get the Sunday summary",
        why: "One notification on Sunday evening with each child's week. Turn it off any time.",
        hint: "On Progress, find Weekly summary and turn it on.",
        go: { tab: "Stats", screen: "ProgressScreen", params: { view: "family" } },
        done: (f) => !!f.pushParent,
      },
    ],
  },
  {
    id: "kid-first-day",
    icon: "⭐",
    title: "Your first day",
    who: "You",
    kidOnly: true,
    steps: [
      {
        id: "start",
        title: "Start a quest",
        why: "Pick English or Science on Home. Your path of topics opens.",
        hint: "Tap ▶ on a quest tile.",
        go: { tab: "Apprec8", screen: "HomeScreen" },
        done: (f) => f.questsStarted > 0,
      },
      {
        id: "topic",
        title: "Finish one topic",
        why: "Read the Learn cards, then answer. Every answer tells you why. You win stars!",
        hint: "Tap the glowing circle. Read the cards, then answer the questions.",
        go: { tab: "Apprec8", screen: "HomeScreen" },
        done: (f) => f.topicsDone > 0,
      },
      {
        id: "mistakes",
        title: "Fix a mistake",
        why: "Wrong answers wait in My mistakes. Get them right twice and they're gone.",
        hint: "Tap My mistakes at the bottom of your quest map.",
        go: { tab: "Apprec8", screen: "EnglishQuestMap", params: { questId: "english-quest", openMistakes: true } },
        done: visited("kid-first-day", "mistakes"),
      },
      {
        id: "stars",
        title: "See your stars",
        why: "Progress shows your stars, your streak and the topics you're great at.",
        hint: "This is your Progress. Look for your streak 🔥. Then tap Guide ›.",
        go: { tab: "Stats", screen: "ProgressScreen", params: {} },
        done: visited("kid-first-day", "stars"),
      },
    ],
  }
);

export const guideById = (id) => GUIDES.find((g) => g.id === id) || null;

/** Guides this person sees. Children (and students with a class) see the kids' guide; grown-ups the rest; admins all. */
export function guidesFor({ isAdmin = false, isChild = false } = {}) {
  if (isAdmin) return GUIDES; // the owner tries them all
  if (isChild) return GUIDES.filter((g) => g.kidOnly);
  return GUIDES.filter((g) => !g.kidOnly && !g.adminOnly);
}

const EMPTY = { schools: 0, classes: 0, teachers: 0, kids: 0, approvedKids: 0, teaching: 0, assignments: 0, children: 0, pushParent: false, questsStarted: 0, topicsDone: 0, marks: {} };

/**
 * Step states in order: "done" | "now" | "next". The first not-done step is "now".
 * A step can be done before an earlier one (e.g. a teacher added directly); that's fine.
 */
export function guideState(guide, facts = {}) {
  const f = { ...EMPTY, ...facts, marks: facts.marks || {} };
  let nowSet = false;
  const steps = guide.steps.map((s, i) => {
    const done = !!s.done(f);
    let state = done ? "done" : "next";
    if (!done && !nowSet) {
      state = "now";
      nowSet = true;
    }
    const waiting = state === "now" && s.waiting && f.marks[`${guide.id}.${s.id}.sent`] ? s.waiting : null;
    return { ...s, n: i + 1, state, waiting };
  });
  const doneCount = steps.filter((s) => s.state === "done").length;
  return { steps, doneCount, total: steps.length, now: steps.find((s) => s.state === "now") || null, finished: doneCount === steps.length };
}

/** Steps that became done since the last look (for the "Step 2 done!" card). */
export function newlyDone(before = [], after = []) {
  const was = new Set(before);
  return after.filter((id) => !was.has(id));
}

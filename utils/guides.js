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
        hint: "Tap your class below, then Share code. Pick WhatsApp or SMS.",
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

export const guideById = (id) => GUIDES.find((g) => g.id === id) || null;

/** Guides this person sees: admins see all; other adults see the teacher guide; children none (yet). */
export function guidesFor({ isAdmin = false, isChild = false } = {}) {
  if (isChild) return [];
  return GUIDES.filter((g) => !g.adminOnly || isAdmin);
}

const EMPTY = { schools: 0, classes: 0, teachers: 0, kids: 0, approvedKids: 0, teaching: 0, assignments: 0, marks: {} };

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

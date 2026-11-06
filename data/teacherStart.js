// data/teacherStart.js: the teachers' one-pager (owner 2026-11-06: "add this one pager for Seema in the app; I should
// also see it or share it"). Same words as https://claude.ai/artifact/PCE2qk5THfuR22SKXehBr5. Plain words, no jargon.
// Shown in Me → Guides → "For teachers: start here" (screens/guides/TeacherStartScreen.js); SHARE sends TEACHER_START_SHARE.

export const TEACHER_START_MD = `# You only need 4 things

Your students practise English grammar at home. You see who practised and which topic to teach again. Everything else in the app is for other people.

## Your 4 jobs

**1. Join as a teacher (once)**
The school admin sends you a code. Type it in, and they let you in.
→ *Me → Join as a teacher*

**2. Share your class code**
One tap sends it on WhatsApp. Parents type it in the app with their child.
→ *Progress → your class → SHARE CODE*

**3. Let your students in**
Each student waits for you. Approve only children you know.
→ *Progress → your class → Waiting for you → Approve*

**4. Give one topic a week**
Pick a Grammar Pro topic (tenses, modals, reported speech…) and a due date. Later the same screen shows who practised, how well, and the weakest topic: teach that one again in class.
→ *Progress → your class → Assign a topic → ASSIGN*

The app can do these with you: **Me → Guides → Start your class**. Each step opens the real screen and shows what to tap.

## The legal part: the app handles it

- When a child joins your class, a **parent says yes inside the app** (English or हिंदी). The app keeps that record. No paper form.
- The app keeps only what it needs: first name, class, answers and time spent.
- No ads and no chat. Children can't message anyone. Other children see only first names and class.
- Any family can delete their account and its data from the app, at any time.
- If a child seems upset: **Me → Need help** shows Childline 1098, Tele-MANAS 14416 and 112.

**Your one job here: approve only children you know.**

## You can ignore

Fun tab · quests for young children · guides for parents and schools · admin tools.

## Try it first, safely

The Demo School is a made-up school with made-up students and 6 weeks of practice. Sign in as its teacher and tap anything: nothing you do there reaches a real child. Ask the school admin for the login.

## Your first week

- **Day 1:** approve your students. Assign one Grammar Pro topic, due in 3 days.
- **Day 3:** open your class: who practised, and the weakest topic. Reteach it in class.
- **Day 7:** assign the next topic.

Something confusing? Tell us in your own words: anything that confuses you will confuse other teachers too, so it gets fixed.`;

/** WhatsApp-friendly text for the SHARE button (*bold* works in WhatsApp). */
export const TEACHER_START_SHARE = [
  "*Apprec8 for teachers: you only need 4 things*",
  "",
  "1. *Join as a teacher* (once): Me → Join as a teacher → type the code from the school admin.",
  "2. *Share your class code*: Progress → your class → SHARE CODE.",
  "3. *Let your students in*: Progress → your class → Waiting for you → Approve (only children you know).",
  "4. *Give one topic a week*: Progress → your class → Assign a topic → ASSIGN. Later: who practised and the weakest topic.",
  "",
  "The app does these with you: Me → Guides → Start your class.",
  "",
  "*The legal part is handled by the app*: a parent says yes inside the app when the child joins (English or हिंदी). It keeps only first name, class and answers. No ads, no chat. Families can delete their data any time. Your one job: approve only children you know.",
  "",
  "Get the app: https://play.google.com/store/apps/details?id=com.mohitchilkoti.apprec8",
].join("\n");

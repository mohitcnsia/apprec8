# Handoff for a fresh chat (Claude, 2026-11-10 night)

Read this first, then CLAUDE.md. The owner started a fresh chat because the old one became too long and the work too slow.

## How the owner wants us to work (10 Nov, gap review comments)
- **One thing at a time:** decide → build → owner tests on his phone → move on. No parallel threads, no long lists.
- **Talk less, deliver working things.** Plain words, no codes or jargon (not "B4", "DR-29", "stale address").
- **Testers = the owner and Seema only.** No real families until the app works for them. No legal or store work now.
- Feedback (in-app or chat) → a decision card with my view → agree → build. Never build straight from feedback.
- No emulator. Before a publish: `npm test` + bundle check + plain phone test steps at the top of docs/qa/OWNER_TESTING.md.

## Live tonight (published + deployed 10 Nov)
- Teachers waiting show on Home ("Needs you") and as "waiting" on the Schools list.
- Progress for parents/teachers: "Updated 8:05 pm", fresh after 7:30 am / 7:30 pm; pull down = now. Kids' class board hourly.
- Not yet confirmed on a phone. The owner tests next.

## The owner's decisions in the gap review (docs: https://claude.ai/artifact/MrWrmXPMAj1Ev67KB2C3pz)
- Yes: app asks teachers/admins for alerts by itself + re-registers the phone on every start (he wants more details first),
  kid sees "waiting for your teacher" / "You're in 10-A!", one-tap "which answer is right?" report, crash reporting with
  the next build, G87 (assignment done = mistakes fixed + results by name), G89 two-way cards, G96 offline stars, G97 remove a kid.
- **Stop:** all Progress-tab and weekly-report work (G92, G103). The owner finds the Progress tab and the report poor.
  Next is a talk about what each person (kid, parent, teacher) needs to see and why, then the owner decides.
- Dropped for now: getting 100 families in, legal/store, Hindi check, premium.

## The one next step
1. Owner approves Seema (Home → Needs you) and tests tonight's update on his phone; Seema walks the real app in class 10-T.
2. Fix only what they report, one by one.
3. Then the Progress talk (no code until the owner decides).

## Gemini
Out of quota until later on 10 Nov. G104 (test app) waits for the testers' emails. Queue after that: G87, G89, G96, G97.
The owner may use Gemini for brainstorming and todo lists.

# Pilot scope (owner + Claude, step by step, from 2026-11-09)

Steps: 1 who + jobs → 2 edge cases → 3 pilot-now vs later → 4 tasks. Each step agreed before the next.
Nothing is built until step 3 is agreed (Gemini's board is on HOLD).

## Step 1 — agreed 2026-11-09
- **Classes:** Seema's **10-A** and **5-A** (not 7-A). Admin: Mohit.
- **Phones:** mixed. Some students have their own phone (own login); some use a parent's phone (a child profile the parent
  makes, played with "Play as").
- **One person = one login.** Roles (teacher, parent, admin) live on that account inside the app; no email linking.

| Who | Must be able to |
|---|---|
| Students (10-A, 5-A) | sign in, practise at their class level, see mistakes come back, see progress |
| Parents | say yes once in the app; on their phone: add the child and hand over the phone safely |
| Seema | get students in, give a topic a week, see who practised + the weakest topic, tell us what's wrong |
| Mohit (admin) | set up school + classes, see what waits for him, read all feedback |
| Pratha | test as a student, tell us what's boring or broken |

## Step 2 — edge cases (draft for the owner; "today" = checked in code or on the emulator 2026-11-09)

### Student on their own phone (mostly 10-A)
1. **No Google account** → today: email + password sign-up works.
2. **Signs in with a second email by mistake** → today: a new, empty account, nothing says so (Seema's case).
3. **Wrong level** → today: a Class 10 child starts at "What is a sentence?"; Grammar Pro is locked behind ~60 topics.
4. **Joining the class** → today: Me → Join a class; a parent must be next to them to say yes on that phone.
5. **Waiting for approval** → today: the child waits; Seema gets no signal (she must open the class to see it).
6. **No internet** → today: unclear errors; most of the app needs internet.

### Student on a parent's phone (mostly 5-A)
7. **Parent has no account yet** → today: the parent signs up first (Google), then Me → My children → Add a child.
8. **Child joins Seema's class** → today: from the child profile, Me → Join a class, the parent says yes on the same phone.
9. **Two children, one phone** → today: add both; "Play as" each.
10. **Child plays without "Play as"** → today: the stars and progress go to the PARENT's account.
11. **Parent forgets the PIN** → today: Sign out → parent signs in → change PIN (works).
12. **Internet drops during the child's turn** → today: "Time's up" can't close until the internet is back.

### Parents
13. **Consent** → today: in the app, English or हिंदी, with Listen; no paper. **But (owner test, 2026-11-09): on a child's
    own phone the child can say "yes" for the parent** — not real consent. Options: (a) the parent says yes on their own
    phone via a WhatsApp link to a simple page, no app (design already approved: "the parent's yes page", never built);
    (b) the teacher approves only when she knows a parent agreed; (c) a text-message code (costs per message).
    Claude suggests a + b for the pilot.
    **Owner (2026-11-09):** parent must be onboarded and the child linked to them; the teacher approves. Asked: make the app
    grown-up only? **Claude: no (the learners are children; their data still needs a parent's yes), but "parent-first":**
    only the parent's own account gives consent, once, when adding or linking the child; the child plays via Play as or
    "Code from my parent"; joining a class = class code + teacher approval, no consent screen; a child who signed up
    alone can practise but can't join a class until a parent is linked. (Waiting for the owner's OK.)
    **Sign-up flow (owner idea, Claude's draft, needs a mockup):** "Who's setting up?" grown-up | student → student:
    "Whose phone?" parent's → "hand the phone to your parent" (parent signs in, Add a child, Play as); own → name + class,
    practise now, card "to join your class a parent needs to say yes" + SEND TO MY PARENT (WhatsApp: install, sign in,
    type code = linked = consent). No parent details typed by the child (unverifiable, extra data).
14. **A parent wants to see the child's progress** → today: only if the child is on their account (profile) or linked.

### Seema
15. **Two accounts** → fixed 2026-11-09: her daily account now teaches 10-A and 5-A (the morning account still does too; remove later). The cause (a second login by mistake) stays an edge case.
16. **Class setup** → done 2026-11-09: 7-A removed, 5-A created (renamed from "A": class names can't be edited in the app).
17. **Doesn't notice students waiting** → today: no signal anywhere.
18. **Assigning a topic** → today: works per class; the list is the whole English quest (all levels).
19. **Telling us what's wrong** → today: "Tell us what you think" sent nothing (fixed, not yet published).
20. **App too complicated** → today: a teacher lands on the children's Home; her classes are in Progress → My classes.

### Mohit (admin)
21. **Teacher approvals hidden** inside each class → no signal.
22. **Reading feedback** → today: Ideas & reports needs the rules change (G77, running); Claude reads it anyway.

## Step 3 — pilot now vs later
(to fill in together after step 2 is agreed)

Candidate first item (owner, 2026-11-09): **test vs real** — a separate test Firebase project, a preview update channel
for the team, real users get tested updates on a schedule (e.g. twice a week, evenings), urgent fixes only in between.

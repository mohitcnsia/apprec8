# Launch checklist (updated 2026-11-11)

Two steps: **A. Seema's class pilot** → **B. public release**. Done steps and old notes: docs/history/LAUNCH_CHECKLIST_LOG.md.

## 📍 Where we are (12 Nov)
- **How students join (Seema's guide, messages to paste, Class 7):** https://claude.ai/artifact/RaQCrzE8k1ZPghSz1TXkRt
- **Sign-up and consent, server side:** the 38-check emulator test passes (parent join, consent record, student join, no approval without the parent's yes, Not sure, follow-up list). The phone side is tested in the E2E test (steps 3–5).
- **Your tests are cards now:** Me → Decisions (YES works · NO broke, say which step · MORE DETAILS · LATER).
- **Test next:** a student joins Seema's class from the class link, on your second phone (brand-new Google account, 15-year-old birthday).
- **Ready to publish (say "publish"):** word and fact of the day on kids' Home · Owner extras off by default · you always see every quest.
- **Agreed, not built yet:** Simpler Home, Progress and Me (https://claude.ai/artifact/RWQn8euh8aakH6LJhjzJks). First build: topic levels + one summary per class.
- **Next full app build:** 5 pm word reminder + crash reporting.
- **Your phone gets no alerts yet:** Me → Decisions → "Notify me on this phone".

## 🅿️ Parked (agreed, not built yet; review together once joining works)
Core flow now: deploy → publish → walk on the phone (kids join a class in the app, learn at once; classmates after the teacher confirms).
1. **Deletion (owner, 12 Nov):** no automatic deletion. "Delete my account" → kept 90 days, a pending decision on your Home, erased only by your tap. Delete scripts locked today.
2. **Class 7 exam 15 Nov:** Paper 3 + more topic questions (Papers 1–2 are live).
3. **Empty screens say why** (Fable): "Pick your class to see your quests", "Your class course opens once…".
4. **Kids can't type:** the student join form still asks a roll number + parent's mobile. Keep, shorten or drop?
5. **Parents' yes for kids on their own phone:** Seema confirms in one batch later (consent record).
6. **People screen** (owner, 12 Nov: "who joined, who they are, what they did"): search, Stuck list, person page with Help buttons; nothing deletes. Mockup in the sign-ups doc, waiting for your answers. Next after the walk.
7. **Full name on "Join your class" (owner, 12 Nov):** only on that form, never at sign-up. Wording: "Your full name, so {Teacher's name} (Teacher) knows it's you. Required to join the class." Last name kept only on the join request (teacher-only), removed when the teacher confirms or removes the child, or after 30 days. Plus a one-time "What should we call you?" card for older accounts with no first name (they show as "Learner").
8. **Fable plan:** delete the old code screens; retire V1 quizzes + old Space path; apply for production after 14 days (you).

## 📥 From the reports review (13 Nov: 62 items read, all closed in Ideas & reports)
Fixed already or today: Pratha's grammar flags (IEO fixes), reading options invisible, mistakes count stuck at 5, "Send E-mail Coming
Soon", reports row in View as, practice explanation text bigger (15 → 17). Answers checked and right: digestion finishes in the
small intestine, a seed needs water, cheetah "!", "I wonder…" = statement, horse–mare (explanation names the stallion too).
To do (small, next walk):
- Dashboard (Progress → Kids): pull down to refresh doesn't reload (owner 10 Nov) — check on the phone; likely the list sits inside another scroll.
- Gender practice: "48/50, 33 in a row" keeps counting past 50 (owner 9 Nov) — say what the number means, or stop at the goal.
- Practice paper list: highlight the paper in progress, not Paper 1 (walk 13 Nov).
- New parent's Home: "Add your child" card on top (walk 13 Nov).
- Kid's Me: "My class" row wraps badly (walk 13 Nov).
- View as: Home scrolls to the top when switching (walk 13 Nov).
- Stars earned today / last 24 h on Progress (owner 13 Nov).
Content (Seema / Claude):
- Science Class 5: more on rabi and kharif crops (Pratha 10 Nov: "not enough content").
- English Grammar Pro: "Time and Place Shifts" card (reported speech) marked confusing (9 Nov) — Seema to look.
Waiting for decisions (cards in your inbox): Home tidy-up (mockup), delete our own test accounts from People.
Already planned: see what happened to my feedback = two-way cards (G89).
Closed without a change: May–June reports on old quizzes (hidden for everyone but you), test notes, emoji-only notes.

## 🌏 Owner's ideas, 14 Nov (parked; plan + mockup before building)
- **Hindi everywhere ("a massive success factor")**: app text, notifications and the WhatsApp/Email nudges in Hindi, picked
  on first run (English · हिंदी). Start with what grown-ups read (first run, join, parent screens, nudges), then kids' UI.
- **Quests for Indian elders (roots and history)**: Ramayana, Mahabharata, Gita, Indian history and festivals, in Hindi with
  read-aloud. Books like Gita Press and Ami Ganatra's are inspiration only: their translations and text are copyrighted, so
  every line and question is written fresh (the Sanskrit originals themselves are public domain). Kamla and Mohan
  (no English) are the first users to test with.
- **Stuck-person nudge**: when someone who picked nothing opens the app, one easy question (in their language) → a star →
  "Who are you? Student · Parent · Teacher". Push needs a phone token, which stuck people don't have yet, so until then
  the WhatsApp button (People) is the way.
- **"What do you want to learn most?" (owner 14 Nov)**: one card, English · हिंदी, tap any: English, Science, General
  knowledge, Stories to read, Book summaries, Our scriptures & history (+ later Maths). Asked once on Home after the first
  practice, not at sign-up (learning first, 2-tap budget); changeable on Me. Saved as `users.interests` (a short list only).
  Used to (1) put those tiles first on Home, (2) show us what to build next: options we don't have yet say "coming soon"
  and count as votes. Kids and grown-ups get their own list (grown-ups: scriptures, history, stories for their child).
- **भारत और समझ shelf (owner 15 Nov):** one Explore tile → small quests (साइबर सुरक्षा, रामायण, महाभारत, योजनाएं, धरोहर,
  परंपरा-सेहत), each its own progress + a "ऐसे और विषय चाहिए? 👍/👎" card at the end.
- **Send a quest by push (owner 15 Nov):** People → a person → "Send quest" → a notification that opens that quest's
  first screen. Needs every signed-in phone that allows notifications to save its token; falls back to WhatsApp.
- **Stars = 1 per correct answer (+1–2 for reading/finishing)**, app-wide, earned stars kept; server change.
- **Stars buy fun minutes, looks, challenge entries; never learning.** **Diamonds** (later, after legal research):
  scarce, scored on the server, may turn into real value at year end. Not a priority.
- **Word games in the right place (owner 15 Nov, corrected):** Vocab Builder inside Word Power; Word Inspector inside
  the English quest, also as new rounds like "highlight every synonym of <word>". Owner: "we really need to be creative
  to keep the kids learning while enjoying the sessions." Discuss with a mockup alongside Word Power step 2 (after G121).
- **"Word Drill" look in the app (owner 15 Nov: "I loved the theme too"):** the IEO Word Drill page's style
  (https://claude.ai/artifact/2okXMGS3A6FUqeNNWiqzxs): calm blue-grey cards, highlighter-marker under key words,
  Atkinson Hyperlegible for reading text (made for easy reading), Bricolage Grotesque headings, green/amber answer states,
  every option's meaning shown after answering. Fonts ship as app assets (OTA-able). Mockup first, then a theme option.
- **Push notifications + WhatsApp messages look poor (owner 16 Nov: "should be fun, catchy and professional"):** after
  star rules phase 1 (G125). One doc: every push text and WhatsApp template today → rewritten in one voice (short,
  warm, a little playful; parents addressed as adults) + phone mockups before/after, owner approves, then a text change.
- **Parent tips (\"For you today\", owner 16 Nov):** 30 draft tips by Claude in data/parentTips.js (everyday habits only).
  Seema reviews every tip (as counsellor); the owner writes/checks all Hindi (Hindi was his major) before the public release.
- **Team tasks (owner 16 Nov idea):** the admin assigns role tasks to staff (Seema: school admin, teacher, counsellor),
  e.g. "Review the parent tips + add Hindi". Like assigning to students: shows on her Home + a notification, she marks it
  done, the owner sees status. First task once built: the parent tips review.
- **Delete-account screen in dark mode (walk 16 Nov):** the title is hard to read (light on light). Fix with the wording item above.
- **आओ जानें content (owner 17 Nov):** (1) a 4th option + "why not" for the 52 questions that have 3 (one review page for
  the owner; then a content test so no question goes live with fewer than 4); (2) picture plan: one picture per topic,
  one illustrated style (Nano Banana), Claude writes a brief per topic (what to show / avoid), 3 samples first, hosted in
  mohitcnsia/images; (3) Panchatantra card 2 (Claude's line) waits for the owner's Hindi check.
- **Redesign built for 20.0.33 (16 Nov night):** buttons A/B/C + hand, Home top, Learn tab, Me panel, Progress, faces,
  tablet column, ∞ notification icon. Next: quiz two-part tablet view; notification buttons (Start / Later) and the round
  picture need the app to draw notifications itself (data messages + a display handler): plan it, test it hard ("we
  can't miss alerts ever"), next build.
- **Button system (owner 16 Nov, mockup "Apprec8 buttons"):** one shared Button with skins A/B/C (default A, pick in
  Me → Look), left/right-hand setting, icons over words. Same build: tablet layout (today it stretches). Owner: consistent
  look but don't waste space. So the same buttons/sizes everywhere, and the width is used: quiz = question + answers left,
  helper panel right (why, word parts, today); Home cards in 2 columns; other screens a wider column. Push mockup
  ("Apprec8 push notifications"): teacher-card look; round picture + Start/Later need this build, colour + words don't.
- **⭐ BEFORE SHOWING THE SCHOOL ADMINISTRATION (owner 16 Nov): Home top + Progress redesign.** The top of Home looks poor:
  the greeting breaks on small phones, long parent names get cut off next to the "Play as" chip. Owner likes Calm's home.
  Mockup first: greeting, thought-of-the-day carousel (keep its nice look), then Progress ("I abhor the progress UI").
  **Agreed 16 Nov** (mockup "Apprec8 Home and Progress"): tabs Home · Learn · Fun · Progress (quests/papers → Learn,
  Home = today only); Me = side panel from the face (Need help first); thought picture fills the top and fades to white,
  moves every 30 s until touched; "Who's learning?"; due soon = amber; Progress pills swipeable, one per child up to 4.
  Main buttons come from the button styles (A/B/C). Same build as the button system.
- **Delete-account wording (walk 16 Nov):** the screen says "permanent and cannot be undone", then the sheet says "nothing is
  lost: sign in again to keep using it". Align with A15 (30 days to undo).
- **Face at the top left (owner 16 Nov):** child picks one of our characters as their face (synced, teachers see it);
  optional real photo kept only on that phone, never uploaded. Needs an image picker = next build.
- **Leave a class (owner 16 Nov: couldn't leave his own class):** students "Leave this class", teachers "Stop teaching
  this class". Needs a server function (rules don't let the phone change classIds/teacherIds) + deploy. Small task.
- **Fun tab layout (owner 15 Nov):** Pratha prefers the older carousel style with nice images over today's Fun tab.
  Collect more feedback (Pratha + other kids) and discuss before changing anything.
- **Chess board colours** (owner: ignore for now).

## Road to production (open steps)
| # | Step | State |
|---|---|---|
| C10 | 12+ testers opted in for 14 days | 11 Nov: you opted in, 3 testers added, 15 family adults invited. Under-13s can't be testers |
| C11 | Closed testing 20.0.30 | approved; then Dashboard → Apply for production after the 14 days |
| C7 | Store screenshots | before public release: redo Home (0 stars, empty card) and Me (shows the test email) |

## A. Seema's Class 10 pilot (closed testing on Play)
| # | Item | Who | State |
|---|---|---|---|
| A1 | **Class 9–10 English content** (CBSE): tenses, modals, subject–verb agreement, determiners, reported speech, active/passive, editing & omission, gap filling, case-based reading. Seema names the topics + order; Claude writes; Seema reviews. Hide English Quest Units 0–2 from Classes 9–10. | Seema → Claude | **done**: Grammar Pro 1–6 (666 Qs, Classes 9–10), live after the English re-seed |
| A2 | ~~Class 10 practice papers~~ dropped (owner: grammar only for the pilot) | — | dropped |
| A3 | **Teacher dry run**: Seema creates the school + class (Admin tools → Schools & classes), 2 test students join with the code, she approves, assigns a topic, sees progress + class leaderboard | Seema + owner | **through guide quests** (mockup row W): owner and Seema learn by doing |
| A4 | **Parent consent**: students are under 18. In-app consent at "Join a class" (EN/HI) is the consent: no paper form (owner 2026-11-06: principals won't do it). Optional: Hindi voice note in a parents' WhatsApp group; 🔊 Listen on the consent note (inbox question) | Seema / school | in-app ready |
| A5 | **"Need help?" sheet** (mockup P1–P2: 1098, Tele-MANAS 14416) before teens use it; Seema finalises the wording | Seema → Claude | **built 2026-11-05** (Me tab, everyone); Seema refines words later |
| A6 | **Distribution** (steps + form answers: [release/PLAY_CONSOLE.md](release/PLAY_CONSOLE.md)): start on internal testing (≤100, works today); in parallel Play Console → Closed testing → testers = the 50 students' Google accounts (or a Google Group) → opt-in link. Upload the latest build there | Owner | not done |
| A7 | **Privacy policy page + "delete my account" web page** (public URLs; Play asks for both) | owner | **exists** (owner 2026-11-05); Claude to check it mentions classes, teachers, parent consent, attempts |
| A8 | Remote Config `update_url_android` → the Play link the students use (today: internal-testing link) | Owner | pending |
| A10 | **Demo School** (fake class for Seema to try the teacher screens + Play reviewer login): generator done; server function, filters, Admin button after Gemini's review; deploy by Gemini/owner | Claude → Gemini | in progress |
| A11 | **Assignment done = mistakes fixed**; teacher sees results **by name** with **Accuracy**; **Remind** a child (owner 2026-11-09) | Gemini (G87, G84b) → Claude review | todo (Check-up by topic with names: done 10 Nov) |
| A13 | **Seema's 6 decisions** (pilot plan doc): consent rule, assigned work first, pilot switch, check-up | Claude (G90, G91) | **done, published 10 Nov**; weekly report G92 + two-way cards G89: Gemini |
| A12 | ⭐ **Class report for school management, pilot week 2 (owner: don't forget)**: active kids, Accuracy start vs now per topic, mistakes fixed, printable | Mockup → owner → Gemini (G88) | todo, week 2 |
| A14 | ⭐ **Learning-only until the family link is approved (owner, 13 Nov; was B9)**: kids join on a parent's Gmail. A student account with no approved parent link sees learning only (quests, practice, class, own Progress, Need help); Add a child, parent codes, a child's week wait for the link. "I'm the parent on this phone": grown-up check (year of birth 18+) → the child's progress moves into a child profile → parent agrees in the app. Server refuses child profiles / parent codes from student accounts. Spec: sign-ups doc, "Added 13 Nov: learning-only" | Claude spec → owner → build | spec written, 3 questions in Decisions |
| A15 | **DPDP deletion (owner, 13 Nov: agreed)**: "Delete my account" → 30 days to undo ("erased on <date> · Keep my account"), then erased by the server unless the owner keeps it; owner still sees each request and can erase sooner. Then privacy policy text (parked, owner publishes): section 8 window + what is kept; section 5 pilot WhatsApp YES; section 4 teacher sees waiting child's first name + roll no. | Claude spec → build; owner publishes policy | todo |
| A9 | Cost check: 50 students ≈ 15,000 reads/day at most (free tier 50,000), writes far below 20,000. Budget alert in place | done | ok |
| A16 | ⭐ **Computer Science quest, Unit 1 "AI: Your Smart Helper" (owner, 17 Nov)**: Seema teaches the Class 8 AI chapter now; kids practise **from the week of 23 Nov**. 7 topics (Learn cards + 8 questions each, 4 options, a why-not on every wrong one) + Unit Boss. Class 8 and up. Draft first (owner sees it) → Seema checks the English in a review doc → open → walk → publish (no build) | Claude → Seema → owner | **draft seeded 17 Nov** (68 questions, testers only); next: Seema's review doc |
| A17 | ⭐ **Class 8 kids can get in before 23 Nov**: Seema's Class 8 class in the app with subject **Computer**, kids install (tester group link on a parent's Gmail), kid's class set to 8, they find the quest under Learn. Needs the new "Computer" subject (code + owner deploys schoolActions/pushActions) | Claude (subject) → owner deploy → Seema (class + link) | todo |
| A18 | ⭐ **Science olympiad (now "ISO", was NSO) prep in Science Quest (owner 17 Nov: next target, plan carefully)**: Level 1 dates 30 Oct / 19 Nov / 3 Dec 2026 (check sofworld.org). Today: Class 3 (8 topics), 4 (17), 5 (18), 7 (13); none for 6 or 8+. Owner's order: Class 5 (Pratha) → 7 + 8 → 6. Class 7 SOF book (12 chapters = new NCERT Class 7, MCQ + Achievers + answers, scanned images) in docs/exam/papers/class7/iso; our 13 Class 7 topics miss 4 chapters (World of Science, Metals & Non-metals, Adolescence (owner: no extra review, it's in the book kids already use), Earth Moon & Sun). Plan https://claude.ai/artifact/5GrheovRHncDQhzQe1bski | Claude + Gemini (G126) | in progress |
| A19 | **Hindi labels step 1 (owner 17 Nov report)**: Hindi buttons on Hindi cards / आओ जानें / quiz / results; OTP etc. in Hindi script; Hindi voice. Built + tests + bundle OK (commit aef1933), **not published: needs a phone walk** (not during exams). Same walk/publish carries: alerts for grown-up learners (Pushpa got none), 22 space facts made standalone, Science Quest not empty for Class 8 / the owner. sendCard deployed by the owner 17 Nov (honest push count + 'alerts off'). Space facts: 76 of 165 rewritten (standalone, corrected, no repeats); owner reviews in https://claude.ai/artifact/DnTuNneD4Go1yaDyPXRuPe. Step 2 (planned, mockup first; owner 17 Nov): people choose Hindi: an occasional card on Home offers it and says where to change it later (Me panel); Hindi then covers sign-up, Home, Me panel, star reasons from the server; English terms spelled in Hindi script every time (done in step 1). Pushpa (grown-up, Hindi only, first time 17 Nov) used a card end to end: this is the way in for non-tech Hindi users | Claude → owner walk | built |
| A20 | **Progress tab (owner 17 Nov)**: swipe between pills broken (Android: the scrolling list takes the touch, so the swipe never ends; the Kids view has no swipe at all) → one swipe handler that claims sideways moves. Pills always ONE row. Proposal: Kids + Reports + This week leave Progress → their own rows in the side panel (admin only), so Progress is only Me / children / My classes | Claude | todo |
| A21 | **Settings redesign (owner 17 Nov, not urgent)**: with the side panel in place, simplify All settings; mockup first | Claude mockup → owner | later |
| A22 | **Next native build: Play's Android 15/16 warnings (17 Nov)**: (1) edge-to-edge: stop setting status/navigation bar colours (StatusBar backgroundColor / immersive bar → edge-to-edge); (2) remove the portrait-only lock (`orientation: "portrait"` in app.config.js) so tablets/foldables can rotate, check the tablet column in landscape. Warnings only, not blockers | Claude | next build |
| A23 | **Star celebration vanishes too fast (report 16 Nov)**: keep it longer, but never block the buttons | Claude | todo |
| A24 | **"Did you know?" (owner 17 Nov, idea)**: one label for the daily fact instead of science/space facts; science + general knowledge (India, history, nature). Current affairs NOT in the daily fact (goes stale, needs dates checked): send those as cards. Hindi version for grown-ups with the language choice (A19 step 2; owner checks Hindi) | Claude | parked: after ISO prep |
| A25 | **Words from the facts (owner 17 Nov, idea)**: ~50 words from the space facts (aurora, nebula, orbit, eclipse, comet…) with kid meanings, added to the daily word for Class 6+ | Claude | parked: after ISO prep |
| A26 | ⭐ **Exam-style diagrams drawn by code (owner 17 Nov: "might be the best feature")**: Venn groupings, yes/no keys, experiment set-ups. No AI images: SVG built from the question's own data (like utils/figures.js), themed, tested so picture and answer agree. Mockup (3 phone screens): https://claude.ai/artifact/9m5uvAP5nchCHhqp11vZ4s. Build: quest questions get `figure` (QuestionPrompt renders it with SvgXml; react-native-svg is in the build, so OTA), `utils/diagrams.js` (venn, key, lab kit: tube, beaker, bottle, flask, thermometer, bulb, cell, wire, nail, leaf) | Claude | mockup → owner OK → build |
| A27 | **Full-screen app mode (owner 17 Nov)**: hide system status bar (time, mobile signals, battery icon) across the app for an immersive, distraction-free experience | Claude / Gemini | todo |
| A28 | **Home greeting responsiveness (owner 17 Nov)**: un-pile header on 6"+ screens: avatar + greeting on left, streak/stars with date & time on right; fallback for < 380dp | Claude mockup → owner | todo |
| A29 | **Progress Kids UX: Recent Activity feed (owner 17 Nov)**: selecting a kid shows last 3–5 completed items (subject, node, score, time) instead of an empty screen with collapsed menus | Claude | todo |
| A30 | **Home reminder card fixes (owner 17 Nov)**: add 'See Details' & 'Mark Done' actions; fix bug where completed items keep showing as overdue | Claude | todo |
| A31 | **Speech button toggle (owner 17 Nov)**: 1st click starts reading from beginning, 2nd click stops (Speech.stop), 3rd click restarts; no accidental overlapping restarts | Claude / Gemini | todo |
| A32 | **Strip redundant screen headers (owner 17 Nov)**: remove 'Learn' title on Learn tab, 'Aao Jaanein' title on quest map, and duplicate headers where context is already clear | Claude | todo |
| A33 | **Chess game list performance & app audit (owner 17 Nov)**: lazy parse PGN moves/evals only on tap (headers only on list mount); audit synchronous JSON bottlenecks app-wide | Gemini / Claude | todo |
| A34 | **Learn content audit & Psychology course (owner 17 Nov)**: prune low-quality legacy learn quizzes to save DB space; add Psychology course for Seema's board exam students (stress, memory, focus) | Claude / Seema | plan |
| A35 | **High-engagement reading quests & AI images (owner 17 Nov)**: deep reading quests on Dogs (Pratha's fav), Dragons, Dinosaurs, Human Body, Animals, Plants + AI image generation pipeline for kids 8–16 | Claude / Gemini | plan |

## B. Public release (after the pilot)
| # | Item | Who |
|---|---|---|
| B1 | **Families policy** (the app is for children): check every SDK we ship (Firebase etc.) is allowed in Families apps; no ads | Gemini G11 research → Claude |
| B2 | Play Console: Data safety form, content rating, target audience (age groups), App access (a demo login for reviewers), store listing (screenshots, short text) | Owner (Claude drafts text) |
| B3 | **DPDP Act (India)**: verifiable parental consent for under-18s, data minimum, deletion on request, a grievance contact. Our parent-first + consent records follow it; get a short legal check before scale | Owner (+ lawyer once) |
| B4 | **Safeguarding plan (RB-8)**: who reads reports, how fast, when to call parents / 1098 | Seema leads |
| B9 | (moved to the pilot as A14, 13 Nov) ⭐ **Grown-up check before public release (owner, 2026-11-10: "don't miss this")**: today a child with their own login who isn't linked to a parent can still add a child profile or make a link code, and so pass "no parent = no class". Fix: "Are you a grown-up?" / year of birth (Spec X) and only grown-ups get parent features; server rules too (createChildProfile, createParentLinkCode) | Claude spec → owner → build |
| B11 | ⭐ **Parent's consent in the app, not WhatsApp (owner, 2026-11-11)**: for the Class 10 pilot, Seema collects YES in the parents' WhatsApp group and ticks "parent said yes" when approving (`consentBy: "teacher-confirmed"`). Before more classes or public release: every parent gives consent themselves in the app or on the no-install web page ("Simpler sign-up" doc, stage 6), stored server-side with name, relation, form version and time. Then ask the pilot parents to confirm once in the app, so their WhatsApp YES is replaced by a stored record | Claude build (stage 6) → owner |
| B10 | ⭐ **Progress reads only what changed (G103, owner: do soon)**: one class summary doc per class so teachers read 1 doc, not 33+, before more schools join | Claude spec → owner → build + deploy |
| B5 | Sign-up policy: today anyone can register (email / Google). Decision from 2026-11-04 was invite-only; keep open for the pilot or switch? | Owner |
| B6 | Production build from `main` (merge `feat/quiz-redesign` after the pilot), `check-aab.sh` PASS, release notes | Claude builds, owner uploads |
| B7 | Crash reporting: none today (we only hear from users). Add before public | Claude |
| B8 | **Money, later** (owner 2026-11-06: competitions with fees + scholarships, sponsors for children): when fees start → Play "trader" status = yes (ideally a business entity, so its address shows, not home); in-app fees need Google Play Billing + a parent gate (children's app), or collect outside the app (website / school); contests with fees and prizes need a Play policy + Indian law check; donations/sponsorship best via a website or trust, outside the app. Today: "not a trader" (no sales) | Owner (+ CA/lawyer once) |

Not blockers: My mistakes for picture / reading questions, English Units 10+, Science Unit 7, Paper 2–4 for Science (Gemini G35).

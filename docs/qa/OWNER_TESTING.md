# Testing on your phone

## ⭐ Class 7 Science (12 Nov, exam on 15 Nov)
**After "publish", seed once:** Me → Admin tools → **Update Science Quest** (writes the 13 Class 7 topics; a few cents of reads
as phones re-download Science once). Then, on a Class 7 account:
1. Home → **Science Quest** tile → the map shows only Class 7 units (Life Processes · Matter & Energy · Thinking Skills),
   and **every topic is open** (no locks). Open "Heat" → Learn cards → warm-up.
2. Home → **Practice paper** → "Class 7 · Paper 1" (50 questions, 60 min) → finish → topic list → "Practise this" opens that topic.
3. A Class 5 account still sees its own Science map, unlocking in order, and doesn't see the Class 7 paper.

## ⭐⭐ END-TO-END TEST with Seema (13 Nov) — do these in order
Each step is also a card in **Me → Decisions** ("E2E 1" … "E2E 14"): **YES** = worked · **NO** = failed (say which step,
voice typing is fine) · **MORE DETAILS** = unclear · **LATER** = skipped. Add a note whenever something looked odd.
**Phones:** A = yours (owner + parent of Pratha) · B = Seema's (teacher + counsellor) · C = second phone (a "student", new Google
account with a 15-year-old's birthday) · D = Pratha's (optional). Close and reopen the app twice on every phone first.

**E2E 1 · Get ready (you, Mac).** `firebase deploy --only functions:recordMood --project apprec8-ca229` (Excited / Tired taps) ·
`node scripts/admin/setCounsellor.cjs <Seema's email> --apply` · phones A and B: Me → bottom line shows today's update code.
**E2E 2 · Class link (B).** Progress → My classes → the test class → **SHARE CLASS LINK** → WhatsApp → send to A and C.
**E2E 3 · Parent asks to join (A).** Tap the link → "Your child's class…" → OPEN APPREC8 → **+ Another child** "Test Riya",
roll 23, your mobile, Mother/Father, tick the form → **JOIN** → Yes → "Request sent". Home: Test Riya's card says
"Class: waiting for the teacher to approve"; Me → MY CHILDREN shows "waiting for the teacher".
**E2E 4 · Student asks to join (C).** Join the testers group → Become a tester → install → Continue with Google → first name,
Class 10 → tap the link → roll number + parent's mobile → **ASK TO JOIN** → Yes → "Request sent". Me → MY CLASS:
"… · waiting for your teacher".
**E2E 5 · Seema approves both (B).** Alert or Home → Needs you → the class: **Waiting for you** is at the top →
**Approve several at once ›** → **Tick all** → WhatsApp → **APPROVE 2** → confirm. C: Me says "You're in …".
**E2E 6 · Assign + START (B, C).** B: Assign a topic for tomorrow. C: Home shows one big card **FROM YOUR TEACHER** with **START**
(+ "Then: …" lines) → START → do the quiz; get **3 wrong in a row** once → after Continue: "Take a breath? 🌿" →
Take a breath → Calm corner → back → quiz goes on.
**E2E 7 · Mood + counsellor (C, B).** C: Home → THIS WEEK, 5 Chamku faces → **Sad** → **For a while** → **Let the counsellor know**.
B (later, or after a pull-down): Home → Needs you "1 kid to see today (well-being)" → the name, "asked to talk" → **Talked, okay**.
**E2E 8 · Topic view, Appreciate, Nudge (B).** After C (and Test Riya on A, via Let Test Riya play on this phone) did a quiz:
Progress → My classes → the class → **TOPICS · WORST FIRST** → tap a topic → names per group → **Appreciate** on Learned or
**Nudge** on New. Levels need a few quizzes over 2 days, so at first most kids are "New"/"Practising": that's expected.
**E2E 9 · What the kids see (C, A).** Nudge → C's Home: "FROM SEEMA · Let's practise …" with Practise now. Appreciate on
Test Riya → **A gets an alert** "🌟 Test Riya was appreciated …"; Me (as Test Riya) → MY STICKERS.
**E2E 10 · Assignment names (B).** The class → "3 · ASSIGNMENT": Done / Started / Not started names → **Nudge N not started**.
**E2E 11 · Parent tonight (A).** Home → Pratha's (or Test Riya's) card → 5 questions with See answer, Right / Needs help → the
praise line matches how it went → I praised … → thank-you, then the card leaves Home for today.
**E2E 12 · Kid screens (C or D).** Home: WORD OF THE DAY (Hear, Close) and SCIENCE/SPACE FACT (Learn more); Progress → Me: a cheer,
the near goal, Needs practice / Learned / Doing well by subject, Make it Learned; Me: profile, MY CLASS, More ▼; Fun: Calm corner.
**E2E 13 · You see everything (A).** C taps 🚩 on a question → A: Home → Needs you "1 new report from a kid" → opens Ideas &
reports. Progress → **This week**: kids, learning, questions to check, well-being totals. Alerts: with the app open, a banner.
**E2E 14 · Clean up.** C: Me → More → Delete my account. A: Test Riya → remove. Tell Claude anything that felt confusing.


Each test below is also a card in **Me → Decisions**: **YES** = it works · **NO** = something broke (say which step, voice typing is fine)
· **MORE DETAILS** · **LATER**. Your answer closes the card and comes back to Claude. Older tests: docs/history/OWNER_TESTING_LOG.md.

## ⭐ Pilot helpers: approve many, assignment names, new reports on your Home (12 Nov)
After the next publish. Nothing to deploy.
1. **Seema, 2+ students waiting:** Progress → My classes → the class → "Waiting for you" → **Approve several at once ›** → tick names
   (or **Tick all**) → the parents said yes on **WhatsApp / Slip / Phone** → **APPROVE 12** → confirm. Each is approved with that note.
2. **Assignment card** ("3 · ASSIGNMENT"): names under Done / Started / Not started; **Nudge 15 not started** and
   **Appreciate 12 done** (parents of the appreciated kids get the alert).
3. **You:** Home → Needs you → **"3 new reports from kids"** (🚩 reports, feedback, ideas since you last opened the list) →
   opens Admin tools → Ideas & reports. Opening the list clears the row; mark each one done there.

## ⭐ Your weekly "Is it working?" (12 Nov, DR-37)
After the deploy (ownerWeekly) + publish. Progress → **This week** (only you).
1. **KIDS:** "N kids practised, up from M last week", how many came back on 2+ days.
2. **LEARNING:** topics learned this week, still remembered, slipping; answers and % right.
3. **QUESTIONS TO CHECK:** questions strong kids keep getting wrong (text, the app's answer, the most picked wrong answer).
4. **WELL-BEING · TOTALS ONLY:** mood taps by face, how many are on the counsellor's list; appreciations.
5. **NOT COLLECTED YET** says so (talks at home, teachers' "saved me time"); Cost opens Firebase usage. **Refresh** recomputes.

## ⭐ "Take a breath?" during practice (12 Nov)
After the next publish. In any practice quiz (not Exam mode):
1. Get **3 answers wrong in a row** → after CHECK, tap Continue → "That was a tricky run. Take a breath? 🌿 · "I can handle difficult things.""
   → **Take a breath 🌿** opens the Calm corner (back = the quiz goes on) · **Keep going** carries on.
2. Or practise for **20 minutes** (across quizzes) → "20 minutes of practice. Great effort! Take a short break?".
3. It asks at most once every 30 minutes.

## ⭐ Mood taps, lists by subject, Calm corner in Fun (12 Nov)
After the deploy (recordMood) + publish.
1. **Home mood card:** 5 taps: 😀 Happy · 🤩 Excited · 🙂 Okay · 😴 Tired · 😢 Sad, each with its own line. Calm corner link inside the card.
2. **Progress:** Needs practice and Doing well are split into **English** / **Science**, 3 each + "+N more in Science ›".
   Doing well topics have **Make it Learned** (practice on that topic). Learned shows "English: …" / "Science: …".
3. **Fun tab:** a **Calm corner** tile first in Games.

## ⭐ Appreciate, Nudge, Cheer on + stickers (12 Nov)
After the deploy + publish. Needs a teacher with kids who have done quizzes since the levels started.
1. **Teacher:** Progress → My classes → a class → TOPICS · WORST FIRST → tap a topic. Each group has a button:
   Slipping / New → **Nudge**, Practising → **Cheer on**, Learned → **Appreciate**. Tap → "Sent ✓ 3".
2. **Kid (Nudge / Cheer on):** Home shows "FROM SEEMA · Let's practise Tenses today. You can do it! 🌱" with Practise now › and ✕.
   Only that kid sees it; gone after 3 days or ✕.
3. **Kid (Appreciate):** Me → MY STICKERS · 1 with a sticker, "From Seema: great work on Tenses!".
4. **Class board** (Progress → Leaderboard → My class): "🌟 Appreciated this week: Meera, Arjun". One sticker per kid per topic per week.
5. **Parent:** an alert "🌟 Pratha was appreciated · Seema appreciated Pratha for great work on Tenses. Tell Pratha you're proud!"
   (the parent opens the app once first, so their phone is saved; Nudge / Cheer on never alert parents).

## ⭐ Kid's Home: one next thing (11 Nov)
After the next publish. Accounts with a class that don't teach (a kid; you see it if you don't teach a class).
1. **Home:** one big card: FROM YOUR TEACHER (overdue first) → else TODAY'S PRACTICE → else FIX YOUR MISTAKES → else KEEP GOING,
   with a big **START** at the bottom of the card.
2. Under it, up to two small "Then: …" lines (tap = open that one) and "+2 more ›".
3. The separate "From your teacher", "Today's practice" and "mistakes to fix" cards are gone for kids (teachers/parents keep theirs).

## ⭐ Me, redesigned (11 Nov)
After the next publish. Every row is something you do; the rest folds under **More**.
1. **You:** a line under your picture ("Your children, your classes, and help"), then **Decisions for you** + **Admin tools**,
   **Need help? Talk to someone**, MY CHILDREN (See Pratha's week / Let … play on this phone, Add a child), MY CLASSES
   (Open my classes), **Tell us what you think**, then **More: look, guides, reminders, sign out ▼**.
2. **More** opens: How to use Apprec8, Guides, idea, Reminders, Messages, Look (theme), Join as a teacher, link/PIN rows,
   Owner extras, Sign out, Delete my account. Nothing is gone, only folded.
3. **A kid:** MY CLASS shows "You're in 10-A" or "10-A · waiting for your teacher".

## ⭐ Kid's Progress, redesigned (11 Nov)
After the next publish. Progress → Me (your account has a class, so you see the kid's side).
1. **Top:** a cheer, e.g. "12 more right than last week! 🎉" or "3 days in a row. Keep it going!", then "78% accuracy this week"
   (Class 5 and below: "45 right this week"), stars + streak, the week's dots. A worse week is never pointed out.
2. **Near goal:** "3 more right answers to pass Aman this week" (kids in a class) → See › opens the leaderboard.
3. **Needs practice:** slipping topics first ("You knew this. A quick practice brings it back."), each with **Practise**.
4. **Learned ✓** (⭐ = still remembered a week later) and **Doing well**. The quest list and the 3 number tiles are gone.

## ⭐ Parent's Home: tonight with each child (11 Nov)
After the next publish. Needs an account with a linked child (you: Pratha).
1. **Home:** a card per child, e.g. "Pratha · Practised today ✓ / Not yet today", "3 of 7 days this week".
2. **TONIGHT · ASK PRATHA · 1 OF 5:** a question she practised. Ask her; tap **See answer** to check; tap **Right ✓** or **Needs help** → next.
3. After 5: "Tell Pratha one thing they did well today." with a ready line → **I praised Pratha** → "Thank you!…" for a few seconds, then the card leaves Home for today.
4. Tomorrow it starts again with new questions.

## ⭐ Topic view for teachers (11 Nov, DR-35)
After the deploy (functions + rules) + publish. Levels fill in as kids do quizzes from now on (older answers count as Practising).
1. **Seema (or you as a teacher):** Progress → My classes → open the class → card **TOPICS · WORST FIRST** at the top:
   "<topic> needs you most: 2 of 30 have learned it", a coloured bar per topic.
2. Tap a topic → names under Slipping / New / Practising / Learned.
3. It opens fast: one read for the whole class.

## ⭐ Mood check + Calm corner (11 Nov, DR-34)
After the deploy + publish. Your account has a class, so you see the kid's side too.
1. **Home:** a card "THIS WEEK · How are you feeling?" with 😀 🙂 😢. Tap 🙂 → "Okay days are normal too…" → Thanks. It comes back in 7 days.
2. **Sad (second phone, or the next week):** 😢 → "Just today, or for a while?" → **Just today** → Try something calming → Calm corner. **For a while** → Let the counsellor know → Done.
3. **Calm corner** (link on Home "🌿 Calm corner"): Take deep breaths → START (circle + voice, 3 rounds); Use your 5 senses → START → NEXT.
4. **Kids to see:** after a "Let the counsellor know", Home → Needs you shows "1 kid to see today (well-being)" for you (no counsellor set yet)
   → tap → the kid's name, class, "asked to talk" → **Talked, okay** removes it. After Seema is set as counsellor, it goes to her instead.

## ⭐ Alerts you can't miss (11 Nov, DR-33)
After the deploy + publish, close and reopen the app once (it saves your phone for alerts by itself). Do Not Disturb off.
1. **App closed:** tell Claude "ready" → a test alert arrives on the phone.
2. **App open (any screen):** tell Claude → a banner slides in at the top with **Open ›** and ✕; Open goes to Decisions.
3. **Seema:** reopen the app once; a parent asks to join her class → she gets an alert (closed) or the banner (open).

## ⭐ Word and fact of the day (11 Nov): a small card on a kid's Home
After the next publish and an app restart. Use an account with a class set (Me → your class).
1. **Home:** under "Today's practice" there is a card **WORD OF THE DAY** with a word, its meaning and **🔊 Hear**.
   Class 3–5: a **SCIENCE FACT** below it; Class 6–10: a **SPACE FACT** (some with a small picture); Class 1–2: word only.
2. Tap **🔊 Hear**: the phone says the word, then "It means: …".
3. Tap **New for me** → it turns purple + "Nice! A new word for your collection." Tap **I knew it** → "Great, you knew it!"
4. Tap **✕** → the card goes away. Close and reopen the app: it stays away today. Tomorrow a new word and fact appear.
5. Two phones in the same class show the same word on the same day.
Not in this version: the star for opening (needs a server change), My words in Me (comes with the Me redesign), the 5 pm alert (next app build).

## ⭐ Seema's Class 10 (11 Nov): students join from their own phones; Seema confirms the parent's yes
After DR-32 (CODE_REVIEW.md) and an app restart. Try it first with one student (or your own second Google account).
1. **Student, own phone (13+):** groups.google.com/g/apprec8-testers → Join group → play.google.com/apps/testing/com.mohitchilkoti.apprec8
   → Become a tester → Install → sign in with Google → first name + Class 10.
2. **Seema:** Progress → My classes → the class → SHARE CLASS LINK → the students' WhatsApp group.
3. **Student:** taps the link → Apprec8 opens on **Join a class** (student screen) → roll number + parent's mobile →
   ASK TO JOIN → "Is this your parent's number?" → Yes → Request sent.
4. **Seema:** posts in the parents' group "Reply YES" (or a slip). The student's card says "parent's yes: ask them",
   with Call / WhatsApp. **Approve** → "Did …'s parent say yes?" → Yes, on WhatsApp → the student is in.
5. "Not yet" leaves the card waiting; "Not sure" moves it to the follow-up list.

## ⭐ On your phone: sign-up without codes, stage 1 (11 Nov) — class link + parent's one screen
First the deploy (DR-31 in CODE_REVIEW.md), then close and reopen the app. Use a NEW test child; delete it afterwards.
1. **Seema (teacher):** Progress → My classes → open the test class → **SHARE CLASS LINK** → WhatsApp → send it to you.
2. **You (parent), on your phone:** tap the link in WhatsApp → page "Your child's class is on Apprec8" → **OPEN APPREC8**.
   Apprec8 opens on **Join a class** with the class name and Seema's name. (Not signed in? Sign in; it opens after.)
3. Fill the one screen: **+ Another child** → "Test Riya", roll 23, your mobile, Mother/Father, tick the form → **JOIN**
   → "Is this your number?" → Yes → **Request sent ✓**.
4. **Seema:** the class shows a card: Test Riya · Roll 23, your name, your number with **Call** and **WhatsApp** (try both).
   Tap **Not sure** → the card moves to **Follow up · not sure**. Then **Approve** → Test Riya is in the class.
5. **Seema:** "Forwarded too far? New link" → New link. Tap the OLD link again on your phone: "This link didn't work".
6. Tap the link on a phone **without Apprec8**: the button opens the Play Store (after installing, tap the link again).
7. Clean up: Me → My children → Test Riya → delete. Anything odd → 🚩 or Me → Tell us what you think.

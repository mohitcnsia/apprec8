# Testing on your phone

Each test below is also a card in **Me → Decisions**: **YES** = it works · **NO** = something broke (say which step, voice typing is fine)
· **MORE DETAILS** · **LATER**. Your answer closes the card and comes back to Claude. Older tests: docs/history/OWNER_TESTING_LOG.md.

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

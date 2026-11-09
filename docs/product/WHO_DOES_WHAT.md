# Who does what: real situations and who fixes them (Claude, 2026-11-09)

The source for the "Apprec8 Academy" team quest (owner idea, 2026-11-09): each situation becomes a step to practise.
Marked **(today)** = works now; **(planned)** = not built yet, with the task.

## The people
- **Owner (Mohit)** and **co-owner (Seema)**: admins. Create schools and classes, approve teachers, read every note, decide.
- **School admin**: someone the owner adds to a school; manages that school's classes and teachers.
- **Teacher**: runs classes: shares the class code, approves students, assigns topics, sees progress.
- **Parent**: says yes for their child, adds children, plays "Play as" on their phone, sees the child's week.
- **Student**: learns. Has their own login, or plays on a parent's phone.
- **Claude**: fixes, content, reviews, publishes updates after testing, sends the owner one weekly summary of notes.
- **Gemini**: builds from Claude's specs and tests every change on the emulator before it is called done.

## Situations

| # | Situation | Who acts | What they do |
|---|---|---|---|
| 1 | A teacher joined but can't add students: her school isn't in the app | **Owner or co-owner** | Me → Admin tools → Schools → + New school → Add a class → Invite a teacher → send her the code; she types it in Me → Join as a teacher; approve her. **(today)** |
| 2 | A tutor or coaching owner has no school at all | **Owner or co-owner** | Same as 1, with the tutor's name as the "school" **(today)**; later "Start my own class" with the owner's approval **(planned, decision card)** |
| 3 | Students typed the class code but don't appear in the class | **Teacher** | Progress → the class → Waiting for you → Approve (only children she knows) **(today)** |
| 4 | A parent wants to see a child who already uses the app (e.g. Pratha) | **Parent + child** | Parent: Me → My children → Link my child's own account → code; child: Me → Link to my parent → type it. Progress stays. **(today)** |
| 5 | A parent forgot the parent PIN while the child's profile is on the phone | **Parent** | Me → Sign out → sign in with the parent's own Google/email → Me → Change parent PIN **(today)**; a "Locked out?" help on the PIN screen **(planned, G55)** |
| 6 | "Play as" fails or Time's up won't close with no internet | **Parent** | Turn on data/Wi-Fi; the phone's own PIN unpins **(today)**; clear "No internet" message + PIN works offline **(planned, G78)** |
| 7 | A child finds a wrong question or a mistake on a reading page | **Child → Claude** | Child taps 🚩; it reaches Admin tools → Ideas & reports; Claude fixes, publishes, the owner re-seeds **(today)** |
| 8 | A teacher or parent wants to say something is broken, confusing or useless | **Anyone → Claude** | Me → Tell us what you think **(fixed 2026-11-09, ships with the next tested update)**; a button on every screen + weekly summary **(planned, decision card)** |
| 9 | The app crashes or shows a blank screen after an update | **Owner → Claude** | Tell Claude at once; Claude republishes the last good update (phones get it on next open), then fixes and tests **(today)** |
| 10 | A Class 10 child sees topics that are far too easy | **Claude + Seema** | Tag every topic with its classes; older children start at their level **(planned, decision card)** |
| 11 | A teacher wants her own syllabus and order | **Owner + Claude** | A teacher course tile over the shared questions, only her class sees it **(planned: Seema's Class 10 first)** |
| 12 | A teacher shares her own worksheets | **Teacher → Claude → teacher** | Claude writes original questions at the same level; Gemini checks; the teacher ticks a sample; into the shared bank with her credit **(planned)** |
| 13 | A family asks to delete their data | **The family** (or the owner on their behalf) | Me → Delete my account (everything goes; a parent can delete a child profile they made) **(today)** |
| 14 | A child seems upset, scared or unsafe | **Anyone who sees it; Seema leads safeguarding** | Me → Need help (Childline 1098, Tele-MANAS 14416, 112) **(today)**; tell Seema (POCSO lead) |
| 15 | Someone new joins the team (co-owner, school partner) | **Owner** | Apprec8 Academy quest: learn every role by doing it in the Demo School **(planned, decision card)** |
| 16 | A new account is stuck on the first screen ("couldn't save your profile") | **User → Claude** | "Not you? Use a different account" or tell us; Claude checks the account **(today)** |

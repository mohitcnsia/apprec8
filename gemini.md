# Gemini Engineering Log

## Project Ground Rules & Architecture
1. **Media Asset Management:** All images must be hosted on the `data/media_backup` GitHub repository to save space, and accessed via `cdn.jsdelivr.net` links (e.g., `https://cdn.jsdelivr.net/gh/mohitcnsia/media_backup@main/[filename]`). Avoid direct Wikimedia links as they are prone to breaking or rate-limiting.
2. **Release Strategy:** Differentiate between dynamic data updates (updating `space_olympiad_data.json` and seeding Firestore via the "Update Quest Map" button) which do NOT require an app update, versus native/UI changes (like bumping `expo-image` or adding `react-native-image-zoom-viewer`) which DO require a production build.
3. **Database Seeding:** Any new Quest Map Nodes or Study Content must have BOTH their `quest_nodes` entry and their `study_content`/`categories`/`topics` payload added to the seeding script (`components/quiz/SeedQuestNodesButton.js`) so they can be pushed to Firestore without causing blank screens.
4. **Target Audience (Kids):** The content is designed for kids (Space Olympiad). All answers, images, and reading materials (like the biographies) must be engaging, highly visual, and kid-friendly.

## 2026-09-08 (Current Session)
- **Goal:** Automate Wikipedia image downloading for 100 new ISRO Space Olympiad questions, and fix quest map progression blockers.
- **Steps:**
  1. Developed Python/JS scripts to map 100 ISRO question answers to specific Wikipedia subjects, fetch their images using Wikipedia's API, and download them to `data/media_backup/`.
  2. Replaced the `image` URLs in `space_olympiad_data.json` to point to the CDN paths for the 100 downloaded images.
  3. Fixed a progression bug where `study-node-6` through `study-node-10` were blocking quest progression by injecting missing rich markdown content and new CDN images into `SeedQuestNodesButton.js`.
  4. Clarified release strategy: dynamic content (like Space Olympiad nodes) only needs to be seeded into Firestore, while native updates require a prod release.

## 2026-09-06 (Previous Session)
- **Goal:** Fix emulator crashes related to `expo-image`, configure Remote Config hard updates, and polish the Apprec8Reader UI.
- **Steps:**
  1. Identified the root cause of the Kotlin `AnyTypeCache` error as a mismatched `expo-image` version and resolved it via `npx expo install expo-image`.
  2. Updated `hooks/useInAppMessaging.js` to implement native version checking for `hard_update` messages (comparing native version vs. Remote Config `min_version`).
  3. UI Polish for `Apprec8ReaderV2.js`:
     - Changed image scaling to `contentFit="contain"` and removed fixed heights so images use layout space effectively and never clip.
     - Built a native full-screen image viewer to enable pinch-to-zoom for reading small text. Migrated from `ScrollView` to `react-native-image-zoom-viewer` to guarantee pinch-to-zoom support natively on Android, and fixed flexbox alignment to allow full screen expansion.
     - Added a pill-shaped, thumb-friendly close button anchored to the bottom.
  4. Confirmed `android/app/build.gradle` and `app.config.js` are updated to version `20.0.21` (matching the new minimum requirement) for production building.

## Session: 2026-09-02 (Integration of Games and Study Nodes into Quest Map)
- **Goal:** Expand Quest screen to include Study, VocabBuilder, and SpellingBee nodes between Quiz nodes, ensuring players play independently.
- **Completed Steps:**
  1. Updated `SeedQuestNodesButton.js` to seed 19 nodes in the `quest_nodes` collection, which includes quizzes (Levels 1-10), study modules, and games, as well as seeded the corresponding `study_content` collection.
  2. Modified `QuestScreen.js` to correctly route to `VocabBuilder`, `SpellingBeeGame`, and `Apprec8Reader` based on the node's `type` field.
  3. Added correct icons to `QuestScreen.js` for these nodes.
  4. Updated `Apprec8Reader.js`, `VocabBuilder.js`, and `SpellingBeeGame.js` to accept `completedQuizId` from the route parameters.
  5. Implemented "Continue Quest" or "Finish & Continue Quest" buttons in these modules to mark them as completed and return the user to the Quest map when the requirement is met (e.g. at least 1 word in SpellingBee, completing a category in VocabBuilder, or reaching the end of the reader).
- **How to test:** 
  1. Launch the Android emulator via `npm run android`.
  2. Go to the Quiz/Quest screen and press "Update Quest Map to Full Space Olympiad" to seed the new nodes.
  3. Verify the Quest map now shows Games and Study Nodes interspersed with Levels.
  4. Play a Study Node, Vocab Builder, or Spelling Bee node and test the "Continue Quest" button which should unlock the next level and show confetti.

## Session: 2026-09-02 (Final Polish & Bug Fixes for Space Olympiad Expansion)
- **Goal:** Fix bugs related to the new Game/Study nodes not properly routing back, layout issues, and configuration of game topics based on map location.
- **Completed Steps:**
  1. Updated routing path from `"Quest"` to `"QuestMap"` in `Apprec8Reader.js`, `VocabBuilder.js`, and `SpellingBeeGame.js`.
  2. Fixed a layout bug in `VocabBuilder.js` where the category list was unscrollable and overlapping by wrapping it in a `ScrollView`.
  3. Added `contentId` to `VocabBuilder` and `SpellingBeeGame` nodes in `SeedQuestNodesButton.js` (e.g. `vocab-space-basics`, `bee-1`).
  4. Updated `QuestScreen.js` to pass `contentId` in route parameters.
  5. Updated `VocabBuilder.js` and `SpellingBeeGame.js` to auto-start the specific category/puzzle corresponding to the `contentId` (bypassing their selection menus).
  6. Successfully deployed `firestore.rules` to resolve write permissions for game categories.
- **How to test:** 
  1. Press "Update Quest Map to Full Space Olympiad" (ensure `firebase deploy --only firestore:rules` was run so writes succeed).
  2. Open any Vocab Builder or Spelling Bee node from the map. They will immediately start the puzzle specific to that node.
  3. Win the puzzle and press "Finish & Continue Quest". It should seamlessly redirect back to the map.

## Future TODOs
- **Study Content Revamp:** Study content is hardcoded and very poor. We need to add significant content with at least 2-3 images and possibly a YouTube video. Add a 1000-word kid-friendly biography of all prominent space scientists and astronauts. Cover their early life, struggles, how they studied despite their limited resources, and made it big for their country.
- **Image Optimization:** Use Squoosh (or a similar tool) to compress all images. Keep large images for a zoomed-in view when kids click on them, but use compressed versions by default to speed things up and save bandwidth.
- **Reading Nodes Creation:** Use the new images (Apollo launch, Isaac Newton, etc.) to write fun articles as reading nodes. Create lots of good reading material and quizzes around topics like "Best space scientist every kid should know", "Most famous astronauts", "Most successful space missions", and "Famous rockets".
- **Daily Challenges (End-Game):** Send a push notification with a random mix of 10 questions to users who have finished the quest map to maintain engagement and a daily streak.
- **Role-Based Progress Dashboard:** Implement deep analytics and tracking dashboards for different roles:
  - **Parents:** View the progress and stats of their children.
  - **Teachers:** Track the progress and quiz scores of all students in their class.
  - **Admins:** Global view of all users and overall engagement metrics.
- **Zen Mode / Guided Access:** Once the app is opened, ask the user to enter Zen Mode. In this mode, apart from the app, nothing else should work on the device without an admin password (parent or admin passcode). Also, download educational videos and host them on GitHub or a CDN to keep them ad-free and prevent kids from drifting to YouTube.

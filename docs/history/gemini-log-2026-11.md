# Gemini log (archive), November 2026
Moved out of `gemini.md` to keep it under 24 KB (Antigravity reads only the first 24 KB).

## 2026-11-04 (covers 2026-10-31 → 2026-11-04)
- **Goal:** ship English Quest to Play as 20.0.23 and push the update to kids.
- **Completed Steps:**
  1. "My mistakes", rewards, admin dashboard v0, RB-5c/5b, 5 new gate challenges (owner approved all 75 questions), the permanent-gate-lock fix. Gemini merged `feat/gate-pools` (`c9afd4b`). Details in `CODE_REVIEW.md`.
  2. **Release 20.0.23** (`9c9ac56`): built locally and verified (version, signature). Uploaded to Play by the owner. DR-5 deployed (Gemini), re-seed done (owner, via the emulator). Roles written down in `docs/TEAM.md`.
  3. **Update push:** Remote Config v30 (owner): `active_message` = hard update `update_20_0_23`, `min_version` 20.0.23. `update_url_android` stays the internal-testing link: the public store link showed Google's "13 or older" page on a kid's account. Rollback: Remote Config version 29.
  4. Owner played English Quest on a OnePlus 9 Pro (20.0.23): works.
  5. **Bug found:** no 📊 Dashboard for the owner in the Play build, because the admin ID lived only in `.env`. Fixed on `fix/admin-uid` (`5ecd6c4`): the ID is in code, plus `tests/releaseConfig.test.mjs` and `scripts/release/check-aab.sh`. Ships in 20.0.24.
  6. **Backup:** `feat/tile-quests` pushed to GitHub (it existed only on the laptop). GitHub `main` is an unrelated 2025 initial commit; owner: don't merge into it.
  7. **Admin endpoints:** they're protected by Cloud IAM (tokenless call → 403), so Finding 12 was downgraded to MEDIUM. DR-6 makes them private in code (`499f7f4`); deploy pending (Gemini/owner).
  8. **QA run by Claude** (`CODE_REVIEW.md`): found and fixed **Finding 19 (HIGH)**: ♾️ Keep practising never saved an attempt since 20.0.23. Version bumped to **20.0.24** (`f0d8d27`); built `build-1793737167228.aab`, check script PASS.
- **How to test:** `scripts/release/check-aab.sh build-1793723069242.aab 20.0.23` → ❌ admin ID (the bug). After 20.0.24: the same script → PASS; on the phone, signed in as the owner, Profile → 📊 Dashboard lists Pratha's English Quest results.


## 2026-11-04 (part 2): app redesign + Science Quest groundwork, branch `feat/quiz-redesign` (Claude)
- **Goal:** finish the owner-approved redesign (quiz, Home + tabs) and prepare NSO (Science Quest) for 19 Nov.
- **Completed Steps:** (details + commit ids in `CODE_REVIEW.md`, entries dated 2026-11-04)
  1. Quiz screens redesigned (mockups A–D); answers sit in the thumb zone above CHECK.
  2. Tabs Home · Fun · Progress · Me. Study tab gone (its screens are in the Home stack); Space quest = hidden tab opened from Home. Reminders (= Tasks, max 5 per kid) in Home's Coming up. Progress merges Stats + Dashboard; Me replaces Profile, seed buttons in Admin tools.
  3. Leaderboard shows first name + class (Class 1–12 in Edit profile, set once). DR-8 + Finding 22 wait for deploy (G10).
  4. Multi-quest: `data/quests/index.js`, generic `SeedTileQuestButton`, class filter `utils/gradeFilter.js` (`grades` on nodes), Dashboard quest switch, Home/Progress show every quest. Science Quest draft (`data/scienceQuestData.js`, 1 sample topic) visible to testers only (`quest_draft`).
- **How to test:** `npm test` (all suites); then `docs/qa/OWNER_TESTING.md`, newest sections first (G8, G9, G13). Nothing is deployed or seeded.

(Older session: 2026-10-31 → 2026-11-04 release work, moved to `docs/history/gemini-log-2026-11.md`.)


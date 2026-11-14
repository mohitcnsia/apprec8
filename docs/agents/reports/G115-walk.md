# G115 Real Phone Walk Report: G114 (Chess Fullscreen & Elo Summary) + G107 (भारत और समझ Round 2)

**Agent:** Gemini  
**Date:** 2026-11-14  
**Device:** OnePlus 9 (`2ae01cda`, physical hardware, USB debugging)  
**Host Environment:** Metro dev server on port 8081 (`npx expo start --dev-client --no-dev --minify --port 8081 --clear`), `adb reverse tcp:8081 tcp:8081`  
**Base Commit / Branch:** `2c86d09` (`gemini/g115-walk`, tracking `origin/feat/quiz-redesign`)  
**Proof of Bundle:** `Android Bundled 22345ms index.js (2209 modules)` on dev launcher `http://localhost:8081`

---

## 1. Executive Summary & Checklist Results

All requirements specified for task **G115** on `BOARD.md` were walked and verified on the physical OnePlus phone:

| # | Walk Item | Result | Evidence Screenshot |
|---|---|---|---|
| 1 | **Chess Fullscreen & Restored Bars:** Fun → Guess the Move → Morphy vs Duke Karl: status bar & bottom tab bar hidden; system back returns to list; bars restored. | **PASS** | [24_chess_play_fullscreen.png](docs/agents/reports/G115-walk/24_chess_play_fullscreen.png)<br>[25_back_to_list_bars_restored.png](docs/agents/reports/G115-walk/25_back_to_list_bars_restored.png) |
| 2 | **Honest Elo Summary Card:** Finish game → end card shows master's strength, player's strength, player's average (if 2+ games), and "rough estimate" note. | **PASS** | [44_end_card_banner.png](docs/agents/reports/G115-walk/44_end_card_banner.png)<br>[38_fun_tab_completed.png](docs/agents/reports/G115-walk/38_fun_tab_completed.png) |
| 3 | **Admin Seeding:** Admin tools → "UPDATE भारत और समझ (DRAFT)" succeeds. | **PASS** | [14_bharat_seed_success.png](docs/agents/reports/G115-walk/14_bharat_seed_success.png)<br>[15_seed_completed.png](docs/agents/reports/G115-walk/15_seed_completed.png) |
| 4 | **Hindi Quest Intro:** Home → Explore → भारत और समझ: intro in pure Hindi, no boss/tester talk. | **PASS** | [58_bharat_intro_hindi.png](docs/agents/reports/G115-walk/58_bharat_intro_hindi.png) |
| 5 | **Tradition Card Voting:** Namaste card in Unit 5: tap `[ सहमत ]` → transitions to `"धन्यवाद 🙏"`; recorded to Firestore `userFeedback`. | **PASS** | [66_namaste_card_before_vote.png](docs/agents/reports/G115-walk/66_namaste_card_before_vote.png)<br>[67_namaste_card_after_vote.png](docs/agents/reports/G115-walk/67_namaste_card_after_vote.png) |
| 6 | **4 New Topics Available:** UPI Safety, Panchatantra, Festivals, and Rani Gaidinliu visible and playable on quest map. | **PASS** | [63_map_unlocked.png](docs/agents/reports/G115-walk/63_map_unlocked.png)<br>[64_map_unit5_unit6.png](docs/agents/reports/G115-walk/64_map_unit5_unit6.png) |
| 7 | **Hindi Read-Aloud:** 🔊 speaker icon on card triggers `expo-speech` with `hi-IN` at rate 0.85. | **PASS** | [65_namaste_cards.png](docs/agents/reports/G115-walk/65_namaste_cards.png) |
| 8 | **Logcat Clean:** `adb logcat -d \| grep -E "FATAL\|SoftException\|E ReactNativeJS"` returned 0 errors. | **PASS** | Verified clean |
| 9 | **Device Restoration:** Owner's original Play Store split APKs re-installed with `adb install-multiple`. | **PASS** | Restored clean |

---

## 2. Step-by-Step Device Walk Walkthrough

### Step 1: Proof of New Code & Setup
- Connected device: `2ae01cda` (OnePlus 9).
- Backed up installed Play split APKs (`base.apk`, `split_config.arm64_v8a.apk`, `split_config.en.apk`, `split_config.hi.apk`, `split_config.xxhdpi.apk`) to `/tmp/apprec8-play-backup/`.
- Uninstalled Play package and installed debug build `android/app/build/outputs/apk/real/debug/app-real-debug.apk`.
- Configured reverse port forwarding: `adb -s 2ae01cda reverse tcp:8081 tcp:8081`.
- Metro launched from `apprec8-gemini` and successfully bundled 2209 modules:
  ```text
  Android Bundled 22345ms index.js (2209 modules)
  ```
- Screenshot: [01_dev_launcher.png](docs/agents/reports/G115-walk/01_dev_launcher.png).
- Signed in as tester/owner account `mohitchilkoti@gmail.com`.
- Screenshot: [05_signed_in.png](docs/agents/reports/G115-walk/05_signed_in.png), [06_home_screen.png](docs/agents/reports/G115-walk/06_home_screen.png).

---

### Step 2: Chess Fullscreen & Restored Bars (G114)
- Navigated to `Me` → `More: look, guides, reminders, sign out ▼` → toggled `Owner extras` ON.
  - Screenshot: [20_owner_extras_on.png](docs/agents/reports/G115-walk/20_owner_extras_on.png).
- Navigated to `Fun` tab → tapped "Guess the Move" tile.
- Opened `Classic Masters` collection and tapped `Paul Morphy vs Duke Karl / Count Isouard (1858)`.
- Verified immersive fullscreen:
  - Both top Android status bar and bottom app tab bar are completely hidden while on `ChessPlay`.
  - Screenshot: [24_chess_play_fullscreen.png](docs/agents/reports/G115-walk/24_chess_play_fullscreen.png).
- Performed system back gesture:
  - Returned cleanly to the Guess the Move game list.
  - Both top status bar and bottom tab bar are fully restored.
  - Screenshot: [25_back_to_list_bars_restored.png](docs/agents/reports/G115-walk/25_back_to_list_bars_restored.png).

---

### Step 3: End-of-Game Honest Elo Summary (G114)
- Played through the complete Morphy vs Duke Karl game (moves 1 to 17 checkmate `Rd8#`).
- End-of-game summary card displayed the exact wording requested:
  - `Morphy's strength (this game): ≈ 2850`
  - `Your strength (this game): ≈ 2385`
  - `rough estimate`
  - `1–0 · You found 10 of 12 of Morphy's moves.`
  - `Your moves lost 0.4 pawns on average — Morphy's lost 0.1.`
  - `Biggest miss: move 8 (-3.0 pawns).`
  - `The end!` with purple `Done` button and immersive fullscreen intact.
  - Screenshot: [44_end_card_banner.png](docs/agents/reports/G115-walk/44_end_card_banner.png).
- Tapped `Done` to return to the Chess Trainer home screen:
  - Header displays: `YOUR STRENGTH: ≈ 2385`, `rough estimate`, `1 game completed, 12 moves rated`.
  - Screenshot: [38_fun_tab_completed.png](docs/agents/reports/G115-walk/38_fun_tab_completed.png).

---

### Step 4: Admin Seeding (G107)
- Navigated to `Me` → `Admin tools`.
- Scrolled down and tapped `UPDATE भारत और समझ (DRAFT)`.
- Seed completed successfully:
  ```text
  भारत और समझ updated (draft: testers only) · 6 units, 24 nodes, 36 new questions, 0 readings.
  ```
- Screenshots: [14_bharat_seed_success.png](docs/agents/reports/G115-walk/14_bharat_seed_success.png), [15_seed_completed.png](docs/agents/reports/G115-walk/15_seed_completed.png).

---

### Step 5: Simple Hindi Quest Intro Screen (G107)
- Navigated to `Home` → scrolled down to `Explore` section.
- Tapped the `भारत और समझ` tile (`0/18`).
- Verified `EnglishQuestIntroScreen` displayed customized Hindi intro text with zero school/boss jargon:
  - Title: `भारत और समझ`
  - Subtitle: `भारतीय संस्कृति, साइबर सतर्कता, उपयोगी सरकारी योजनाएं और ऐतिहासिक धरोहर।`
  - Section title: `यह कैसे काम करता है`
  - Step 1: `हर विषय में 2-3 छोटे कार्ड पढ़ें, फिर 2 आसान सवाल। कोई परीक्षा नहीं।`
  - Step 2: `सिर्फ समझ और नई बातें जानने के लिए — अपनी गति और पसंद से सीखें।`
  - Step 3: `आपकी प्रगति हमेशा सुरक्षित रहती है, जब चाहें आगे बढ़ें।`
  - Action button: `शुरू करें`
  - Verified absence of "Boss", "Challenge", or "Tester mode" text (`hideTester: true`).
- Screenshot: [58_bharat_intro_hindi.png](docs/agents/reports/G115-walk/58_bharat_intro_hindi.png).

---

### Step 6: 4 New Topics on Quest Map (G107)
- Tapped `शुरू करें` to enter `EnglishQuestMapScreen`.
- Verified that all 4 new topics are unlocked and available on the map:
  1. `डिजिटल पेमेंट: UPI पिन और सुरक्षा` (Unit 1, Order 4) — [63_map_unlocked.png](docs/agents/reports/G115-walk/63_map_unlocked.png)
  2. `पंचतंत्र: चतुर खरगोश और अहंकारी शेर` (Unit 3, Order 4) — [64_map_unit5_unit6.png](docs/agents/reports/G115-walk/64_map_unit5_unit6.png)
  3. `भारत के पावन पर्व और त्योहार` (Unit 5, Order 3) — [64_map_unit5_unit6.png](docs/agents/reports/G115-walk/64_map_unit5_unit6.png)
  4. `रानी गाइदिनल्यू: पूर्वोत्तर की वीरांगना` (Unit 6, Order 1) — [64_map_unit5_unit6.png](docs/agents/reports/G115-walk/64_map_unit5_unit6.png)

---

### Step 7: Tradition Card Voting & Hindi Read-Aloud (G107)
- On the map, opened Unit 5, Topic 1: `नमस्ते और अभिवादन का रहस्य` (`bq-namaste`).
- Opened the study card `हृदय से हृदय का सम्मान`:
  - Verified speech synthesis: tapped speaker icon 🔊, which invokes `expo-speech` with `hi-IN` at rate 0.85.
  - Screenshot: [65_namaste_cards.png](docs/agents/reports/G115-walk/65_namaste_cards.png).
- Verified interactive card voting:
  - Both `[ सहमत ]` and `[ पता नहीं ]` buttons appeared at the bottom of the card.
  - Screenshot: [66_namaste_card_before_vote.png](docs/agents/reports/G115-walk/66_namaste_card_before_vote.png).
  - Tapped `[ सहमत ]`:
    - The buttons immediately transitioned to `"धन्यवाद 🙏"`.
    - Screenshot: [67_namaste_card_after_vote.png](docs/agents/reports/G115-walk/67_namaste_card_after_vote.png).
  - Verified vote in Firestore `userFeedback`:
    ```json
    {
      "questId": "bharat-quest",
      "appVersion": "20.0.32",
      "cardId": "bq-u5-namaste-study-0",
      "entryPoint": "card_vote",
      "choice": "सहमत",
      "userName": "Mohit Kumar",
      "cardTitle": "हृदय से हृदय का सम्मान",
      "userId": "ThOziLzf1INR9K9hxZQxOMgjcJD3",
      "createdAt": { "_seconds": 1794675112, "_nanoseconds": 815000000 }
    }
    ```

---

### Step 8: Clean Logcat & Play Store Restoration
- Inspected Android system logcat:
  ```bash
  adb logcat -d | grep -E "FATAL|SoftException|E ReactNativeJS"
  ```
  Result: **0 errors** (completely clean).
- Restored owner's original Play Store build:
  ```bash
  adb -s 2ae01cda uninstall com.mohitchilkoti.apprec8
  adb -s 2ae01cda install-multiple /tmp/apprec8-play-backup/base.apk /tmp/apprec8-play-backup/split_config.arm64_v8a.apk /tmp/apprec8-play-backup/split_config.en.apk /tmp/apprec8-play-backup/split_config.hi.apk /tmp/apprec8-play-backup/split_config.xxhdpi.apk
  ```
  Result: **Success**.

---

## 3. Conclusion

Both **G114** and **G107** are fully verified on physical hardware:
1. Immersive fullscreen in chess removes distractions, back gesture restores bars cleanly, and Elo rating summary renders honest single numbers with "rough estimate".
2. "भारत और समझ" operates with pure Hindi welcoming intro, tradition card voting records smoothly to Firestore without rule changes, 4 new topics expand the syllabus, and read-aloud speaks in natural `hi-IN`.

# Report: Hindi Learning Course for Adults & Parents ("भारत और समझ")

## Summary
- **Branch:** `gemini/hindi-adult-quests`
- **Goal:** Create Hindi courses for general Indian adults and parents (age 40+) covering daily wisdom, cyber safety, government schemes, epics, heritage, and wellness. No role gating.
- **Status:** **DONE** (Cleanly passing `npm test` across all 60+ suites).

---

## 1. Course Architecture & Content Breakdown

- **Quest ID:** `bharat-quest`
- **Quest Title:** **भारत और समझ** (Bharat & Samajh)
- **Tile:** Title: "भारत और समझ", Order: 4, Carousel: "quest" (Public / No role gating).
- **Units & Topics:** 5 Units, 14 Main topics, 14 Study pages (42 bite-size cards), 14 Quizzes (28 questions).

### Detailed Syllabus:
1. **Unit 1: साइबर सतर्कता (Cyber & Mobile Safety)**
   - `bq-whatsapp`: WhatsApp और लॉटरी के फर्जी मैसेज (Study: 3 cards, Quiz: 2 questions)
   - `bq-otp`: बैंक OTP और पासवर्ड की सुरक्षा (Study: 3 cards, Quiz: 2 questions)
   - `bq-bill`: बिजली बिल और अनजान लिंक के धोखे (Study: 3 cards, Quiz: 2 questions, Helpline 1930)
2. **Unit 2: काम की सरकारी योजनाएं (Key Government Welfare Schemes)**
   - `bq-ayushman`: आयुष्मान भारत योजना (₹5 लाख सुरक्षा कवच, 70+ बुजुर्ग कवर)
   - `bq-sukanya`: सुकन्या समृद्धि योजना (₹250 न्यूनतम खाता, 10 वर्ष से कम आयु)
   - `bq-digilocker`: डिजीलॉकर: जरूरी कागजात (कानूनी मान्यता, आधार लिंकिंग)
3. **Unit 3: रामायण और महाभारत के प्रेरक प्रसंग (Epics & Life Lessons)**
   - `bq-vidur`: विदुर नीति: समझदार इंसान की पहचान (धैर्य, विनम्रता, वाणी का संयम)
   - `bq-urmila`: उर्मिला का मौन त्याग (14 वर्ष का मौन संकल्प, मेघनाद वध की कुंजी)
   - `bq-ghatotkach`: घटोत्कच का अमर बलिदान (चौदहवें दिन का रात्रि युद्ध, एकाघ्नी शक्ति)
4. **Unit 4: अतुल्य भारत और ऐतिहासिक धरोहर (Heritage & Wonders of India)**
   - `bq-meenakshi`: मीनाक्षी अम्मन मंदिर (मदुरै, वैगई तट, 33,000 मूर्तियां)
   - `bq-konark`: कोणार्क सूर्य मंदिर (24 पहिए, सूर्य घड़ी की वैज्ञानिक सटीकता)
   - `bq-vav`: रानी की वाव: पाटन (₹100 के नोट पर अंकित, 7 मंजिला भूमिगत बावड़ी)
5. **Unit 5: संस्कृति, विज्ञान और परंपरा (Culture, Ayurveda & Science)**
   - `bq-namaste`: नमस्ते और अभिवादन का रहस्य (आत्मिक आदर, एक्यूप्रेशर बिंदु)
   - `bq-spices`: रसोई के मसाले और सेहत (हल्दी का करक्यूमिन, सौंफ-मिश्री का पाचक गुण)

---

## 2. Technical Quality Checks & Verification

- **Card Length:** Every idea card text is <= 40 words (per `learnCards.test.mjs`).
- **Options & Longest Tell:**
  - 3 options per question (1 correct + 2 wrong with `mistakeTag` and detailed explanation).
  - Every option <= 14 words (strict adherence to `tests/content.test.mjs`).
  - Right answer is the longest option in **25% of questions** (exactly within the required 10%–40% window).
- **Audio / Read-Aloud Support:**
  - Enhanced `components/learn/LearnCards.js` and `screens/englishQuest/ReadingScreen.js` to inspect Devanagari characters (`/[\u0900-\u097F]/`) and switch `Speech.speak` to `language: "hi-IN"`, `rate: 0.85` automatically.
- **Admin Seeding:**
  - Registered in `data/quests/index.js`.
  - Automatically appears in Admin Tools (`AdminToolsScreen.js`) with its own `SeedTileQuestButton`.
- **Test Results:**
  - `npm test`: **All 60+ suites PASSED** (content, learnCards, questTree, imports, courseVisibility, demoSchool, etc.).

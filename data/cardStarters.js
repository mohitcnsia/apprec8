// data/cardStarters.js: starter cards for "Send a card" (owner, 16 Nov 2026). The owner edits them before sending.
// Owner: "2-3 reading cards and at least 2-5 questions. Total 5 minutes of activity and a few stars win." Pages are
// study cards (idea + one-tap questions, utils/learnCards.js); each new question answered right pays a star (server).
// Facts kept to well-known, checkable ones: 1930 = India's national cyber-crime helpline; cybercrime.gov.in = the
// government reporting site; banks never ask for an OTP or PIN; the Moon's phases repeat about every 29.5 days and the same
// side always faces the Earth; Eklavya and Arjuna's "bird's eye" are well-known Mahabharata stories.
export const CARD_STARTERS = [
  {
    id: "safety",
    label: "Safety",
    card: {
      kind: "safety",
      title: "ऑनलाइन ठगी से कैसे बचें",
      text: "5 मिनट: आम ठगी के तरीके पहचानिए और 4 सवालों के जवाब देकर स्टार जीतिए।",
      cards: [
        { kind: "idea", title: "OTP किसी को न बताएँ", text: "बैंक, पुलिस या कोई कंपनी कभी फ़ोन या मैसेज पर OTP, PIN या पासवर्ड नहीं माँगती। जो माँगे, वह ठग है।" },
        { kind: "idea", title: "ठग कैसे फँसाते हैं", text: "\"आपका खाता बंद हो जाएगा\", \"आपने लॉटरी जीती है\", \"KYC अभी अपडेट करें\": ठग डर या लालच से जल्दी करवाते हैं। अनजान लिंक न खोलें, खुद बैंक के असली नंबर पर पूछें।" },
        { kind: "idea", title: "ठगी हो जाए तो", text: "तुरंत 1930 पर कॉल करें या cybercrime.gov.in पर शिकायत करें। जितनी जल्दी, पैसा बचने की उम्मीद उतनी ज़्यादा।" },
        { kind: "check", question: "कोई \"बैंक से\" बोलकर फ़ोन पर OTP माँगे, तो?", answer: "फ़ोन काटकर खुद बैंक को कॉल करें", wrong: ["OTP बता दें", "बाद में बता दें"], explain: "बैंक कभी OTP नहीं माँगता।" },
        { kind: "check", question: "मैसेज आया: \"KYC अपडेट करें वरना खाता बंद, इस लिंक पर जाएँ\"। आप?", answer: "लिंक नहीं खोलेंगे, बैंक से पूछेंगे", wrong: ["तुरंत लिंक खोलेंगे", "मैसेज आगे भेजेंगे"], explain: "डराकर जल्दी करवाना ठगी का आम तरीका है।" },
        { kind: "check", question: "\"आपने 25 लाख की लॉटरी जीती, पहले 5,000 फ़ीस भेजें\"। यह?", answer: "ठगी है", wrong: ["सच्चा इनाम है", "सरकारी योजना है"], explain: "असली इनाम के लिए पहले पैसा नहीं माँगा जाता।" },
        { kind: "check", question: "ऑनलाइन ठगी की शिकायत के लिए कौन-सा नंबर?", answer: "1930", wrong: ["100", "1098"], explain: "1930 राष्ट्रीय साइबर अपराध हेल्पलाइन है।" },
      ],
      moreQuestId: "bharat-quest",
    },
  },
  {
    id: "story",
    label: "Story",
    card: {
      kind: "story",
      title: "महाभारत से: लगन और ध्यान",
      text: "5 मिनट: एकलव्य और अर्जुन की दो छोटी कहानियाँ, फिर 3 सवाल।",
      cards: [
        { kind: "idea", title: "एकलव्य का अभ्यास", text: "एकलव्य धनुष चलाना सीखना चाहता था। उसने गुरु द्रोणाचार्य की मिट्टी की मूर्ति बनाई और रोज़ उसके सामने अभ्यास करके बहुत अच्छा धनुर्धर बना।" },
        { kind: "idea", title: "चिड़िया की आँख", text: "द्रोणाचार्य ने पेड़ पर बैठी चिड़िया पर निशाना लगाने को कहा और पूछा, \"क्या दिख रहा है?\" बाकी शिष्यों ने पेड़, पत्ते, चिड़िया बताए। अर्जुन ने कहा, \"सिर्फ़ चिड़िया की आँख।\"" },
        { kind: "idea", title: "आज की सीख", text: "रोज़ थोड़ा अभ्यास और एक चीज़ पर पूरा ध्यान। आज अपने बच्चे से पूछिए: \"तुम रोज़ किस चीज़ का अभ्यास करना चाहोगे?\"" },
        { kind: "check", question: "एकलव्य ने किसके सामने अभ्यास किया?", answer: "द्रोणाचार्य की मिट्टी की मूर्ति", wrong: ["राजा के महल में", "एक किताब के साथ"], explain: "उसने गुरु की मूर्ति बनाकर रोज़ अभ्यास किया।" },
        { kind: "check", question: "अर्जुन को निशाना लगाते समय क्या दिखा?", answer: "सिर्फ़ चिड़िया की आँख", wrong: ["पूरा पेड़", "पत्ते और आसमान"], explain: "पूरा ध्यान एक ही चीज़ पर।" },
        { kind: "check", question: "दोनों कहानियाँ क्या सिखाती हैं?", answer: "रोज़ अभ्यास और पूरा ध्यान", wrong: ["जल्दी हार मान लेना", "सिर्फ़ किस्मत पर भरोसा"], explain: "लगन और ध्यान से हुनर बढ़ता है।" },
      ],
      moreQuestId: "bharat-quest",
    },
  },
  {
    id: "fact",
    label: "Fact",
    card: {
      kind: "fact",
      title: "Why does the Moon change shape?",
      text: "5 minutes: three short pages, then 4 questions to win stars.",
      cards: [
        { kind: "idea", title: "The Moon has no light of its own", text: "Half of the Moon is always lit by the Sun, like a ball held near a lamp. Moonlight is sunlight bouncing off the Moon." },
        { kind: "idea", title: "We see more or less of the lit half", text: "As the Moon goes around the Earth, we see more or less of its lit half. From one full moon to the next takes about 29.5 days." },
        { kind: "idea", title: "Always the same face", text: "The Moon turns once while it goes around the Earth once, so the same side always faces us." },
        { kind: "check", question: "Where does moonlight come from?", answer: "The Sun", wrong: ["The Moon itself", "The Earth"], explain: "The Moon only reflects sunlight." },
        { kind: "check", question: "How long from one full moon to the next?", answer: "About 29.5 days", wrong: ["About 7 days", "About 365 days"], explain: "That's roughly one month." },
        { kind: "check", question: "At new moon, why can't we see the Moon?", answer: "Its lit half faces away from us", wrong: ["It goes out like a bulb", "Clouds always cover it"], explain: "The Sun lights the far side, so the side facing us is dark." },
        { kind: "check", question: "Do we always see the same side of the Moon?", answer: "Yes", wrong: ["No, it changes every night"], explain: "It turns once each time it goes around the Earth." },
      ],
      moreQuestId: "science-quest",
    },
  },
  {
    id: "task",
    label: "Task",
    card: {
      kind: "task",
      title: "Review the parent tips",
      text: "30 short tips for parents' Home. Change anything that isn't right (Mohit does the Hindi).",
      cards: [],
      moreQuestId: null,
      hat: "counsellor",
    },
  },
];

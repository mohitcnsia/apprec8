// data/cardStarters.js: starter cards for "Send a card" (owner, 16 Nov 2026). The owner edits them before sending.
// Pages are study cards (idea + one-tap questions, utils/learnCards.js). Facts kept to well-known, checkable ones:
// 1930 = India's national cyber-crime helpline; cybercrime.gov.in = the government reporting site; banks never ask for an
// OTP or PIN; the Moon's phases repeat about every 29.5 days; Eklavya practised before a clay image of Drona (Mahabharata).
export const CARD_STARTERS = [
  {
    id: "safety",
    label: "Safety",
    card: {
      kind: "safety",
      title: "ऑनलाइन ठगी से कैसे बचें",
      text: "कोई OTP माँगे तो कभी न बताएँ। 2 मिनट में जानिए आम ठगी के तरीके।",
      cards: [
        { kind: "idea", title: "OTP किसी को न बताएँ", text: "बैंक, पुलिस या कोई कंपनी कभी फ़ोन या मैसेज पर OTP, PIN या पासवर्ड नहीं माँगती। जो माँगे, वह ठग है।" },
        { kind: "check", question: "फ़ोन पर कोई \"बैंक से\" बोलकर OTP माँगे, तो आप क्या करेंगे?", answer: "फ़ोन काटकर खुद बैंक को कॉल करेंगे", wrong: ["OTP बता देंगे", "बाद में बता देंगे"], explain: "बैंक कभी OTP नहीं माँगता। खुद बैंक के असली नंबर पर कॉल करें।" },
        { kind: "idea", title: "ठगी हो जाए तो", text: "तुरंत 1930 पर कॉल करें या cybercrime.gov.in पर शिकायत करें। जितनी जल्दी, उतना अच्छा।" },
      ],
      moreQuestId: "bharat-quest",
    },
  },
  {
    id: "story",
    label: "Story",
    card: {
      kind: "story",
      title: "महाभारत से: एकलव्य का अभ्यास",
      text: "एक बच्चा जिसने खुद मेहनत से धनुष चलाना सीखा।",
      cards: [
        { kind: "idea", title: "एकलव्य", text: "महाभारत में एकलव्य नाम का एक लड़का धनुष चलाना सीखना चाहता था। उसने गुरु द्रोणाचार्य की मिट्टी की मूर्ति बनाई और रोज़ उसके सामने अभ्यास किया।" },
        { kind: "check", question: "एकलव्य ने धनुष चलाना कैसे सीखा?", answer: "रोज़ खुद अभ्यास करके", wrong: ["एक दिन में", "किताब पढ़कर"], explain: "रोज़ थोड़ा-थोड़ा अभ्यास बड़ा फ़र्क लाता है।" },
        { kind: "idea", title: "आज की सीख", text: "आज अपने बच्चे से पूछिए: \"तुम रोज़ किस चीज़ का अभ्यास करना चाहोगे?\"" },
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
      text: "It doesn't really. We just see a different part of its sunny side.",
      cards: [
        { kind: "idea", title: "The Moon has no light of its own", text: "Half of the Moon is always lit by the Sun. As it goes around the Earth, we see more or less of that lit half." },
        { kind: "check", question: "Where does moonlight come from?", answer: "The Sun", wrong: ["The Moon itself", "The Earth's lamps"], explain: "The Moon only reflects sunlight." },
        { kind: "idea", title: "About 29.5 days", text: "From one full moon to the next takes about 29.5 days. Tonight, look up and guess: is the lit part growing or shrinking?" },
      ],
      moreQuestId: "science-quest",
    },
  },
  {
    id: "task",
    label: "Task",
    card: {
      kind: "task",
      title: "Review the parent tips and add Hindi",
      text: "30 short tips for parents' Home. Change anything that isn't right.",
      cards: [],
      moreQuestId: null,
      hat: "counsellor",
    },
  },
];

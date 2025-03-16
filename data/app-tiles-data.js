import AppTile from "../models/tile";

export const olympiadTiles = [
  new AppTile(
    "imo",
    "Mathematics",
    require("../assets/images/olympiad/imo.png"),
    "30 min",
    "Quiz",
    "Mohit Kumar Chilkoti",
    "QUIZ"
  ),
  new AppTile(
    "nso",
    "Mathematics",
    require("../assets/images/olympiad/nso.png"),
    "30 min",
    "Quiz",
    "Sir Issac Newton",
    "QUIZ"
  ),
  new AppTile(
    "ieo",
    "Mathematics",
    require("../assets/images/olympiad/ieo.png"),
    "30 min",
    "Quiz",
    "Pratha Chilkoti",
    "QUIZ"
  ),
  new AppTile("iho", "Hindi", null, "60 min", "Quiz", "Pandit Ji", "QUIZ"),
];

export const myClassrooms = [
  new AppTile(
    "psy",
    "Psychology",
    // "https://www.simplypsychology.org/wp-content/uploads/psychology.jpeg",
    "https://www.bolton.ac.uk/assets/Is-Psychology-a-science-Bolton-University__ResizedImageWzYwMCw0MDld.jpg",
    "30 min",
    "Questionnaire",
    "Seema Joshi",
    "STUDY"
  ),
  new AppTile(
    "sysd1",
    "System Design",
    "https://cdn.pixabay.com/photo/2024/04/04/10/46/ai-generated-8674827_1280.jpg",
    "30 min",
    "Study",
    "Mohit Chilkoti",
    "STUDY"
  ),
];

export const storyTiles = [
  new AppTile(
    "akbb1",
    "Akbar Birbal",
    require("../assets/images/stories/akbar-birbal1.png"),
    "5 min",
    "Story",
    "Raja Birbal",
    "STUDY"
  ),
  new AppTile(
    "bgh1",
    "Gautam Buddha - The Enlightened",
    require("../assets/images/stories/buddha.png"),
    "7 min",
    "Story",
    "Gautam Buddha",
    "STUDY"
  ),
  new AppTile(
    "pct1",
    "Smart Rabbit",
    require("../assets/images/stories/panchatarntar1.png"),
    "4 min",
    "Story",
    "Seema Joshi",
    "Vishnu Sharma",
    "STUDY"
  ),
];

// Let's see if this structure works too
export const bookSummaryTiles = [
  {
    id: "bfg",
    name: "The BFG",
    image: require("../assets/images/book-summaries/bfg.png"),
    duration: "10 min",
    type: "Book Summary",
    author: "Seema Joshi",
    category: "STUDY",
  },
  {
    id: "tgwdtm",
    name: "The Girl Who Drank The Moon",
    image: require("../assets/images/book-summaries/girlDrankTheMoon.png"),
    duration: "20 min",
    type: "Book Summary",
    author: "Mohit Chilkoti",
    category: "STUDY",
  },
  {
    id: "harry1",
    name: "Harry Potter & The Philosopher's Stone",
    image: require("../assets/images/book-summaries/harry-1.png"),
    duration: "15 min",
    type: "Book Summary",
    author: "Pratha Chilkoti",
    category: "STUDY",
  },
  {
    id: "matilda",
    name: "Matilda",
    image: require("../assets/images/book-summaries/matilda.png"),
    duration: "18 min",
    type: "Book Summary",
    author: "Pratha Chilkoti",
    category: "STUDY",
  },
];

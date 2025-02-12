import Category from "../models/category";
import Topic from "../models/quiz/topic";

export const CATEGORIES = [
  new Category("ieo", "IEO", "#f5428d"),
  new Category("nso", "NSO", "#f54242"),
  new Category("imo", "IMO", "#f5a442"),
  new Category("reasoning", "Reasoning", "#f5d142"),
  new Category("iho", "IHO", "#368dff"),
  new Category("igko", "IGKO", "#41d95d"),
  new Category("icso", "Cyber", "#9eecff"),
  new Category("fun", "Fun", "#b9ffb0"),
];

export const TOPICS = [
  new Topic(
    "ieo",
    "International English Olympiad",
    "The International English Olympiad (IEO) is an English language and Grammar competition for students of class 1 to class 12. It is conducted by Science Olympiad Foundation (SOF) in collaboration with British Council. The content of the tests is designed to focus on communication and use of English language, rather than rote learning and correct grammar only. Participants of IEO are ranked on the basis of marks obtained in 1st Level. After taking the first level of the test, students can judge themselves academically at four different levels - within the school, at city level, at state level and above all at International level."
  ),
  new Topic(
    "nso",
    "International Science Olympiad",
    "International Science Olympiad"
  ),
  new Topic(
    "imo",
    "International Mathematics Olympiad",
    "International Mathematics Olympiad"
  ),
  new Topic("reasoning", "Reasoning", "Reasoning"),
  new Topic(
    "iho",
    "International Hindi Olympiad",
    "International Hindi Olympiad"
  ),
  new Topic(
    "igko",
    "International General Knowledge Olympiad",
    "International General Knowledge Olympiad"
  ),
  new Topic(
    "icso",
    "International Computer Science Olympiad",
    "International Computer Science Olympiad"
  ),
  new Topic("fun", "Fun Corner", "Pratha's Fun Corner"),
];

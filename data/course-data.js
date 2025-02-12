import Category from "../models/category";
import Meal from "../models/meal";
import Topic from "../models/topic";

export const CATEGORIES = [
  new Category("ieo", "IEO", "#f5428d"),
  new Category("nso", "NSO", "#f54242"),
  new Category("imo", "IMO", "#f5a442"),
  new Category("iro", "Reasoning", "#f5d142"),
  new Category("iho", "IHO", "#368dff"),
  new Category("igko", "IGKO", "#41d95d"),
  new Category("icso", "Cyber", "#9eecff"),
  new Category("fun", "Fun", "#b9ffb0"),
  new Category("vocab", "Vocabulary", "#ffc7ff"),
  new Category("settings", "Settings", "#47fced"),
];

export const TOPICS = [
  new Topic(
    "ieo",
    "International English Olympiad",
    "The International English Olympiad (IEO) is an English language and Grammar competition for students of class 1 to class 12. It is conducted by Science Olympiad Foundation (SOF) in collaboration with British Council. The content of the tests is designed to focus on communication and use of English language, rather than rote learning and correct grammar only. Participants of IEO are ranked on the basis of marks obtained in 1st Level. After taking the first level of the test, students can judge themselves academically at four different levels - within the school, at city level, at state level and above all at International level."
  ),
];

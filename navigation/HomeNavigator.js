// navigation/HomeNavigator.js
// Home tab stack. Since the Home + tabs redesign (2026-11-04) it also holds every screen the old
// Study tab had (quests, quizzes, readers), so Home's tiles open inside this stack and the
// Android back gesture returns to Home. Screen names are unchanged, so old links keep working.

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/home/HomeScreen";
import Apprec8Reader from "../components/common/reader/Apprec8Reader";
import TopicOverviewScreen from "../screens/quiz/TopicOverviewScreen";
import LinksScreen from "../screens/LinksScreen";
import DummyScreen from "../screens/DummyScreen";
import WordInspectorScreen from "../screens/WordInspectorScreen";
import QuizScreen from "../screens/quiz/QuizScreen";
import QuizResultScreen from "../screens/quiz/QuizResultScreen";
import EnglishQuestIntroScreen from "../screens/englishQuest/EnglishQuestIntroScreen";
import EnglishQuestMapScreen from "../screens/englishQuest/EnglishQuestMapScreen";
import ReadingScreen from "../screens/englishQuest/ReadingScreen";
import EndlessPracticeScreen from "../screens/englishQuest/EndlessPracticeScreen";
import QuizDetailsScreen from "../screens/quiz/QuizDetailsScreen";
import QuizScreenV2 from "../screens/quiz/QuizScreenV2";
import ExplanationScreen from "../screens/quiz/ExplanationScreen";
import ResultsScreen from "../screens/common/ResultsScreen";
import ClockPracticeGenerator from "../components/ClockPracticeGenerator";
import SudokuGame from "../components/SudokuGame";
import Minesweeper from "../components/Minesweeper";
import VocabBuilder from "../components/VocabBuilder";
import SpellingBeeGame from "../components/SpellingBeeGame";
import TaskEditor from "../screens/task/TaskEditor";
import Tasks from "../screens/task/Tasks";
import TaskDetails from "../screens/task/TaskDetails";
import PracticePaperScreen from "../screens/paper/PracticePaperScreen";
import DecisionsScreen from "../screens/admin/DecisionsScreen";
import ClassDetailScreen from "../screens/admin/ClassDetailScreen";

const Stack = createStackNavigator();

const HomeNavigator = () => (
  <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    {/* Old Study tab screens */}
    <Stack.Screen name="LinkScreen" component={LinksScreen} />
    <Stack.Screen name="Overview" component={TopicOverviewScreen} />
    <Stack.Screen name="Apprec8Reader" component={Apprec8Reader} />
    <Stack.Screen name="Quiz" component={QuizScreen} />
    <Stack.Screen name="WordInspector" component={WordInspectorScreen} />
    <Stack.Screen name="QuizResult" component={QuizResultScreen} />
    <Stack.Screen name="DummyScreen" component={DummyScreen} />
    {/* Tile-based quests (English Quest) */}
    <Stack.Screen name="EnglishQuestIntro" component={EnglishQuestIntroScreen} />
    <Stack.Screen name="EnglishQuestMap" component={EnglishQuestMapScreen} />
    <Stack.Screen name="ReadingScreen" component={ReadingScreen} />
    <Stack.Screen name="EndlessPractice" component={EndlessPracticeScreen} />
    <Stack.Screen name="QuizDetails" component={QuizDetailsScreen} />
    <Stack.Screen name="QuizScreenV2" component={QuizScreenV2} />
    <Stack.Screen name="Explanation" component={ExplanationScreen} />
    <Stack.Screen name="ResultsScreen" component={ResultsScreen} />
    {/* Games (also in the Fun tab), in case a content tile opens one */}
    <Stack.Screen name="ClockPracticeGenerator" component={ClockPracticeGenerator} />
    <Stack.Screen name="SudokuGame" component={SudokuGame} />
    <Stack.Screen name="Minesweeper" component={Minesweeper} />
    <Stack.Screen name="VocabBuilder" component={VocabBuilder} />
    <Stack.Screen name="SpellingBeeGame" component={SpellingBeeGame} />
    {/* Reminders (= the kid's tasks), from Home's "Coming up" */}
    <Stack.Screen name="TaskEditor" component={TaskEditor} />
    <Stack.Screen name="Tasks" component={Tasks} />
    <Stack.Screen name="TaskDetails" component={TaskDetails} />
    {/* Practice paper (mockup Q), from Home's Explore tile */}
    <Stack.Screen name="PracticePaper" component={PracticePaperScreen} />
    <Stack.Screen name="Decisions" component={DecisionsScreen} />
    <Stack.Screen name="ClassDetail" component={ClassDetailScreen} />
  </Stack.Navigator>
);

export default HomeNavigator;

// navigation/FunNavigator.js
// Fun tab stack (Home + tabs redesign, 2026-11-04): games, stories, book summaries, popular reads.

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import FunScreen from "../screens/fun/FunScreen";
import Apprec8Reader from "../components/common/reader/Apprec8Reader";
import TopicOverviewScreen from "../screens/quiz/TopicOverviewScreen";
import LinksScreen from "../screens/LinksScreen";
import DummyScreen from "../screens/DummyScreen";
import WordInspectorScreen from "../screens/WordInspectorScreen";
import QuizScreen from "../screens/quiz/QuizScreen";
import QuizResultScreen from "../screens/quiz/QuizResultScreen";
import ClockPracticeGenerator from "../components/ClockPracticeGenerator";
import SudokuGame from "../components/SudokuGame";
import Minesweeper from "../components/Minesweeper";
import VocabBuilder from "../components/VocabBuilder";
import SpellingBeeGame from "../components/SpellingBeeGame";

const Stack = createStackNavigator();

const FunNavigator = () => (
  <Stack.Navigator initialRouteName="FunScreen" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FunScreen" component={FunScreen} />
    <Stack.Screen name="ClockPracticeGenerator" component={ClockPracticeGenerator} />
    <Stack.Screen name="SudokuGame" component={SudokuGame} />
    <Stack.Screen name="Minesweeper" component={Minesweeper} />
    <Stack.Screen name="VocabBuilder" component={VocabBuilder} />
    <Stack.Screen name="SpellingBeeGame" component={SpellingBeeGame} />
    <Stack.Screen name="Apprec8Reader" component={Apprec8Reader} />
    <Stack.Screen name="LinkScreen" component={LinksScreen} />
    <Stack.Screen name="Overview" component={TopicOverviewScreen} />
    <Stack.Screen name="Quiz" component={QuizScreen} />
    <Stack.Screen name="QuizResult" component={QuizResultScreen} />
    <Stack.Screen name="WordInspector" component={WordInspectorScreen} />
    <Stack.Screen name="DummyScreen" component={DummyScreen} />
  </Stack.Navigator>
);

export default FunNavigator;

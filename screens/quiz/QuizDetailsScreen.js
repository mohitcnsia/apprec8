// screens/quiz/QuizDetailsScreen.js
// The quiz start screen (mockup F, owner 2026-11-04: "too many hops"). One screen: title, what it's for, the kid's
// stars and best score, Training or Exam, and one big START button in the thumb zone (docs/DESIGN_RULES.md).
// It opens the quiz with `autoStart`, so the quiz's own "Start" page is skipped. Used by English Quest and the Space quest.

import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import Mascot from "../../components/quiz/Mascot";
import { listenToUserQuizAttempt } from "../../services/firestoreContentApi";

const MODES = [
  { id: "training", icon: "🎯", title: "Training", sub: "Hearts, and the reason after every answer." },
  { id: "exam", icon: "📝", title: "Exam", sub: "Like a real exam: answers at the end." },
];

const QuizDetailsScreen = ({ route, navigation }) => {
  const { quiz, questContext } = route.params; // questContext: set by English Quest so results are recorded
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(P, insets), [P, insets]);

  const [attempt, setAttempt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState("training");

  // The kid's progress on this quiz
  useEffect(() => {
    const unsubscribe = listenToUserQuizAttempt(
      quiz.id,
      (attemptData) => {
        setAttempt(attemptData);
        setIsLoading(false);
      },
      (error) => {
        console.error(error);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, [quiz.id]);

  const onStart = () => {
    navigation.navigate("QuizScreenV2", {
      quiz,
      mode,
      isFirstAttempt: !attempt,
      questContext,
      autoStart: true, // skip the quiz's own start page (this screen is the start page)
    });
  };

  const masteryLevel = Math.max(0, Math.min(3, attempt?.masteryLevel || 0));
  const highScore = attempt?.highestScore || 0;
  const count = quiz?.config?.questionCount;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {questContext ? <Text style={styles.label}>QUEST</Text> : null}
        <Text style={styles.title}>{quiz.title}</Text>
        {quiz.description ? <Text style={styles.soft}>{quiz.description}</Text> : null}

        <View style={styles.statsCard}>
          <Mascot size={44} />
          <View style={{ flex: 1 }}>
            {isLoading ? (
              <ActivityIndicator color={P.label} />
            ) : (
              <>
                <Text style={styles.stars} accessibilityLabel={`${masteryLevel} of 3 stars`}>
                  {"⭐".repeat(masteryLevel)}
                  {"☆".repeat(3 - masteryLevel)}
                </Text>
                <Text style={styles.soft}>
                  {attempt ? `Best ${highScore} stars` : "First try!"}
                  {count ? ` · ${count} questions` : ""}
                </Text>
              </>
            )}
          </View>
        </View>

        <Text style={[styles.label, { marginTop: 8 }]}>HOW DO YOU WANT TO PLAY?</Text>
        {MODES.map((m) => {
          const on = mode === m.id;
          return (
            <Pressable
              key={m.id}
              onPress={() => setMode(m.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${m.title}: ${m.sub}`}
              style={[styles.modeCard, on && styles.modeOn]}
            >
              <Text style={[styles.modeTitle, on && { color: P.selectedText }]}>
                {m.icon} {m.title}
              </Text>
              <Text style={styles.soft}>{m.sub}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Thumb zone: the one main button (design rule 2) */}
      <View style={styles.footer}>
        <Pressable onPress={onStart} accessibilityRole="button" style={styles.startButton}>
          <Text style={styles.startText}>{mode === "exam" ? "START EXAM" : "START TRAINING"}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const makeStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg },
    content: { paddingTop: insets.top + 24, paddingHorizontal: 20, paddingBottom: 20, gap: 12 },
    label: { fontSize: 13, letterSpacing: 1.2, fontFamily: "nunitoBold", color: P.label },
    title: { fontSize: 28, lineHeight: 34, fontFamily: "nunitoBold", color: P.text },
    soft: { fontSize: 15, lineHeight: 21, fontFamily: "nunitoBold", color: P.textSoft },
    statsCard: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 20, backgroundColor: P.selectedBg, marginTop: 6 },
    stars: { fontSize: 22, letterSpacing: 2, color: P.text },
    modeCard: { padding: 14, borderRadius: 18, borderWidth: 2, borderBottomWidth: 5, borderColor: P.border, backgroundColor: P.card, gap: 2 },
    modeOn: { borderColor: P.selectedBorder, backgroundColor: P.selectedBg },
    modeTitle: { fontSize: 18, fontFamily: "nunitoBold", color: P.text },
    footer: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: Math.max(22, insets.bottom + 14) },
    startButton: {
      height: 58,
      borderRadius: 18,
      backgroundColor: P.primary,
      borderBottomWidth: 5,
      borderBottomColor: P.primaryShadow,
      alignItems: "center",
      justifyContent: "center",
    },
    startText: { color: P.onPrimary, fontSize: 18, fontFamily: "nunitoBold", letterSpacing: 1 },
  });

export default QuizDetailsScreen;

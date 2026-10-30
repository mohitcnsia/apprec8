// components/quiz/ListenButtons.js
// RB-5b ear training: 🔊 reads the question aloud; 👂 reads the sentence with each answer filled in.
// Use ONLY in practice (practice leaves in Training, ♾️, My mistakes). Never in gates / Boss / Exam.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Speech from "expo-speech";
import { useTheme } from "../../context/ThemeContext";
import { canTryAnswers, tryEachAnswerLines, speakableQuestion } from "../../utils/listen";

const VOICE = { language: "en-IN", rate: 0.9 };

export default function ListenButtons({ questionId, questionText, options = [], color }) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme, color), [theme, color]);
  const [speaking, setSpeaking] = useState(null); // "question" | "answers" | null
  const runId = useRef(0);

  // Stop when the question changes or the screen closes.
  useEffect(() => {
    return () => {
      runId.current += 1;
      Speech.stop();
    };
  }, [questionId]);

  const stop = () => {
    runId.current += 1;
    Speech.stop();
    setSpeaking(null);
  };

  const speakLines = (lines, kind) => {
    stop();
    const id = runId.current;
    setSpeaking(kind);
    const next = (i) => {
      if (id !== runId.current) return;
      if (i >= lines.length) return setSpeaking(null);
      Speech.speak(lines[i], { ...VOICE, onDone: () => setTimeout(() => next(i + 1), 450), onError: () => setSpeaking(null) });
    };
    next(0);
  };

  const showTry = canTryAnswers(questionText);

  return (
    <View style={styles.row}>
      <TouchableOpacity
        hitSlop={8}
        style={styles.button}
        accessibilityLabel={speaking === "question" ? "Stop reading" : "Listen to the question"}
        onPress={() => (speaking === "question" ? stop() : speakLines([speakableQuestion(questionText)], "question"))}
      >
        <Ionicons name={speaking === "question" ? "stop-circle" : "volume-high"} size={20} color={color || theme.textPrimaryOnGradient} />
      </TouchableOpacity>
      {showTry ? (
        <TouchableOpacity
          hitSlop={8}
          style={[styles.button, styles.tryButton]}
          accessibilityLabel={speaking === "answers" ? "Stop reading" : "Listen to each answer in the sentence"}
          onPress={() => (speaking === "answers" ? stop() : speakLines(tryEachAnswerLines(questionText, options), "answers"))}
        >
          <Ionicons name={speaking === "answers" ? "stop-circle" : "ear"} size={18} color={color || theme.textPrimaryOnGradient} />
          <Text style={styles.tryText}>Hear each</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const makeStyles = (theme, color) =>
  StyleSheet.create({
    row: { flexDirection: "row", alignItems: "center", gap: 6 },
    button: { padding: 4, flexDirection: "row", alignItems: "center", gap: 4 },
    tryButton: { borderWidth: 1, borderColor: color || theme.border, borderRadius: 14, paddingHorizontal: 8 },
    tryText: { fontSize: 12, fontFamily: "nunitoBold", color: color || theme.textPrimaryOnGradient },
  });

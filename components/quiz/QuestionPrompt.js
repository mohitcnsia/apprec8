// components/quiz/QuestionPrompt.js
// The question at the top of the quiz (redesign mockups A/B, 2026-11-04):
// small instruction label ("FILL IN THE BLANK"), Chamak the mascot + a speech bubble with the question.
// A one-blank sentence shows the chosen answer inside the blank. Questions with a picture, audio or
// video keep the existing QuestionCard.

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "./quizPalette";
import Mascot from "./Mascot";
import QuestionCard from "./QuestionCard";
import { splitInstruction } from "../../utils/quizText";

export default function QuestionPrompt({ question, mood = "happy", chosenText = null }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const q = question?.question || { type: "text", content: "" };
  const hasMedia = (q.type && q.type !== "text") || q.mediaUrl;

  if (hasMedia) {
    return (
      <View style={{ gap: 10 }}>
        <Mascot mood={mood} size={52} />
        <QuestionCard question={question} />
      </View>
    );
  }

  const split = splitInstruction(q.content || "");
  const label = split.body ? split.label : null;
  const body = split.body || q.content || "";
  const parts = body.split(/_{2,}/);
  const oneBlank = parts.length === 2;

  return (
    <View style={styles.wrap}>
      {label ? <Text style={[styles.label, { color: P.label }]}>{label}</Text> : null}
      <View style={styles.row}>
        <Mascot mood={mood} size={68} />
        <View style={[styles.bubble, { borderColor: P.border, backgroundColor: P.card }]}>
          {oneBlank ? (
            <Text style={[styles.sentence, { color: P.text }]}>
              {parts[0]}
              <Text
                style={[
                  styles.blank,
                  chosenText
                    ? { color: P.selectedText, backgroundColor: P.selectedBg }
                    : { color: P.dimText, backgroundColor: P.track },
                ]}
              >
                {chosenText ? ` ${chosenText} ` : " _____ "}
              </Text>
              {parts[1]}
            </Text>
          ) : (
            <Text style={[styles.sentence, { color: P.text }]}>{body}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  label: { fontSize: 13, letterSpacing: 1.4, fontFamily: "nunitoBold" },
  row: { flexDirection: "row", alignItems: "flex-end", gap: 10 },
  bubble: { flex: 1, borderWidth: 2, borderRadius: 18, paddingVertical: 14, paddingHorizontal: 16 },
  sentence: { fontSize: 21, lineHeight: 31, fontFamily: "nunitoBold" },
  blank: { fontFamily: "nunitoBold", borderRadius: 8 },
});

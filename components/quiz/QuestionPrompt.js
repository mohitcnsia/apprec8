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

  // Mockup E (owner 2026-11-04): the instruction is a small label next to Chamak; the thing to look at sits in its own
  // big card, so the two never look the same.
  const sentenceStyle = [label ? styles.sentenceBig : styles.sentence, { color: P.text }];
  return (
    <View style={styles.wrap}>
      <View style={styles.headRow}>
        <Mascot mood={mood} size={label ? 44 : 56} />
        {label ? <Text style={[styles.label, { color: P.label }]}>{label}</Text> : null}
      </View>
      <View style={[styles.card, label ? { backgroundColor: P.selectedBg, borderColor: P.selectedBorder } : { backgroundColor: P.card, borderColor: P.border }]}>
        {label ? <Text style={[styles.quoteMark, { color: P.label }]}>“</Text> : null}
        {oneBlank ? (
          <Text style={sentenceStyle}>
            {parts[0]}
            <Text
              style={[
                styles.blank,
                chosenText
                  ? { color: P.selectedText, backgroundColor: label ? P.card : P.selectedBg }
                  : { color: P.dimText, backgroundColor: P.track },
              ]}
            >
              {chosenText ? ` ${chosenText} ` : " _____ "}
            </Text>
            {parts[1]}
          </Text>
        ) : (
          <Text style={sentenceStyle}>{body}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  headRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  label: { flex: 1, fontSize: 14, letterSpacing: 1.2, fontFamily: "nunitoBold" },
  card: { borderWidth: 2, borderRadius: 22, paddingVertical: 18, paddingHorizontal: 18 },
  quoteMark: { fontSize: 44, lineHeight: 30, fontFamily: "nunitoBold", marginBottom: -4 },
  sentence: { fontSize: 21, lineHeight: 31, fontFamily: "nunitoBold" },
  sentenceBig: { fontSize: 26, lineHeight: 36, fontFamily: "nunitoBold" },
  blank: { fontFamily: "nunitoBold", borderRadius: 8 },
});

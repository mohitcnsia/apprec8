// components/quiz/FeedbackSheet.js
// Green / red sheet that slides up after Check (quiz redesign mockup A, 2026-11-04).
// Shows the result, a short explanation (if any), "Why not?" options (G82) and one big button.

import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Speech from "expo-speech";
import { quizPalette } from "./quizPalette";
import { useTheme } from "../../context/ThemeContext";
import { buildOthersSpeechText } from "../../utils/whyNot";

export default function FeedbackSheet({
  correct,
  title,
  text,
  buttonLabel,
  onPress,
  bottomInset = 0,
  extra = null,
  whyNot = null,
}) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const slide = useRef(new Animated.Value(1)).current;
  const [othersOpen, setOthersOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    Animated.timing(slide, { toValue: 0, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    return () => {
      Speech.stop();
    };
  }, [slide]);

  const bg = correct ? P.correctBg : P.wrongBg;
  const fg = correct ? P.correctText : P.wrongText;
  const accent = correct ? P.correctBorder : P.wrongBorder;
  const shadow = correct ? P.correctButtonShadow : P.wrongButtonShadow;

  const wrongWhy = whyNot?.wrongWhy ?? null;
  const otherWhys = whyNot?.otherWhys ?? [];

  const handlePress = () => {
    Speech.stop();
    setSpeaking(false);
    if (onPress) onPress();
  };

  const getSpeechToRead = () => {
    if (!correct) {
      if (wrongWhy) {
        return `Why not ${wrongWhy.option}? ${wrongWhy.why}.${text ? " " + text : ""}`;
      }
      return text || "";
    }
    // Correct
    const base = text || "";
    if (othersOpen && otherWhys.length > 0) {
      return (base ? base + ". " : "") + buildOthersSpeechText(otherWhys);
    }
    return base;
  };

  const toggleSpeech = () => {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }
    const speech = getSpeechToRead();
    if (!speech) return;
    setSpeaking(true);
    Speech.speak(speech, {
      language: "en-IN",
      rate: 0.9,
      onDone: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  const hasSpeech = Boolean(text || wrongWhy || (correct && otherWhys.length > 0));

  return (
    <Animated.View
      style={[
        styles.sheet,
        { backgroundColor: bg, paddingBottom: Math.max(22, bottomInset + 14) },
        { transform: [{ translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [0, 320] }) }] },
      ]}
      accessibilityLiveRegion="polite"
    >
      <View style={styles.titleRow}>
        <View style={[styles.icon, { backgroundColor: accent }]}>
          <Ionicons name={correct ? "checkmark" : "close"} size={26} color="#FFFFFF" />
        </View>
        <Text style={[styles.title, { color: fg }]}>{title}</Text>
        {hasSpeech ? (
          <TouchableOpacity
            onPress={toggleSpeech}
            hitSlop={8}
            style={styles.speakerButton}
            accessibilityRole="button"
            accessibilityLabel={speaking ? "Stop reading" : "Read explanation aloud"}
          >
            <Ionicons name={speaking ? "stop-circle" : "volume-high"} size={24} color={fg} />
          </TouchableOpacity>
        ) : null}
        {extra}
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Wrong answer: show "Why not '<chosen>'?" + why first */}
        {!correct && wrongWhy ? (
          <View style={styles.whyBlock}>
            <Text style={[styles.whyHeading, { color: fg }]}>{wrongWhy.heading}</Text>
            <Text style={[styles.text, { color: fg }]}>{wrongWhy.why}</Text>
          </View>
        ) : null}

        {/* Main explanation */}
        {text ? <Text style={[styles.text, { color: fg }]}>{text}</Text> : null}

        {/* Right answer: folded "Why not the others?" */}
        {correct && otherWhys.length > 0 ? (
          <View style={styles.othersContainer}>
            <TouchableOpacity
              onPress={() => setOthersOpen(!othersOpen)}
              activeOpacity={0.7}
              style={styles.foldButton}
              accessibilityRole="button"
              accessibilityLabel={othersOpen ? "Hide why not the others" : "Why not the others"}
            >
              <Ionicons name={othersOpen ? "chevron-up" : "chevron-down"} size={18} color={fg} />
              <Text style={[styles.foldTitle, { color: fg }]}>Why not the others?</Text>
            </TouchableOpacity>
            {othersOpen ? (
              <View style={styles.othersList}>
                {otherWhys.map((item, idx) => (
                  <View key={idx} style={styles.otherRow}>
                    <Text style={[styles.text, { color: fg }]}>
                      <Text style={styles.otherOptionHighlight}>'{item.option}'</Text>: {item.why}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={buttonLabel}
        style={[styles.button, { backgroundColor: accent, borderBottomColor: shadow }]}
      >
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // In the layout (not floating), so it never covers the right answer: the answers scroll above it.
  sheet: {
    paddingTop: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 12,
    elevation: 16,
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  icon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  title: { flex: 1, fontSize: 24, fontFamily: "nunitoBold" },
  speakerButton: { padding: 6 },
  scrollArea: { maxHeight: 220 },
  scrollContent: { gap: 10 },
  whyBlock: { gap: 4 },
  whyHeading: { fontSize: 17, lineHeight: 24, fontFamily: "nunitoBold", textDecorationLine: "underline" },
  text: { fontSize: 17, lineHeight: 25, fontFamily: "nunitoBold" },
  othersContainer: { marginTop: 4, gap: 8 },
  foldButton: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 4 },
  foldTitle: { fontSize: 17, fontFamily: "nunitoBold", textDecorationLine: "underline" },
  othersList: { gap: 8, paddingLeft: 6, borderLeftWidth: 2, borderLeftColor: "rgba(0,0,0,0.15)" },
  otherRow: { gap: 2 },
  otherOptionHighlight: { fontFamily: "nunitoBold" },
  button: { height: 58, borderRadius: 18, borderBottomWidth: 5, alignItems: "center", justifyContent: "center", marginTop: 4 },
  buttonText: { color: "#FFFFFF", fontSize: 18, fontFamily: "nunitoBold", letterSpacing: 1 },
});

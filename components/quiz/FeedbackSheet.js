// components/quiz/FeedbackSheet.js
// Green / red sheet that slides up after Check (quiz redesign mockup A, 2026-11-04).
// Shows the result, a short explanation (if any) and one big button.

import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { quizPalette } from "./quizPalette";
import { useTheme } from "../../context/ThemeContext";

export default function FeedbackSheet({ correct, title, text, buttonLabel, onPress, bottomInset = 0, extra = null }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const slide = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(slide, { toValue: 0, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [slide]);

  const bg = correct ? P.correctBg : P.wrongBg;
  const fg = correct ? P.correctText : P.wrongText;
  const accent = correct ? P.correctBorder : P.wrongBorder;
  const shadow = correct ? P.correctButtonShadow : P.wrongButtonShadow;

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
        {extra}
      </View>
      {text ? <Text style={[styles.text, { color: fg }]}>{text}</Text> : null}
      <TouchableOpacity
        onPress={onPress}
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
  text: { fontSize: 17, lineHeight: 25, fontFamily: "nunitoBold" },
  button: { height: 58, borderRadius: 18, borderBottomWidth: 5, alignItems: "center", justifyContent: "center", marginTop: 4 },
  buttonText: { color: "#FFFFFF", fontSize: 18, fontFamily: "nunitoBold", letterSpacing: 1 },
});

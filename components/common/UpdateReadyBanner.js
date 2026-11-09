// components/common/UpdateReadyBanner.js: "New version ready · Tap to refresh" (owner 2026-11-09: no second restart).
// Shown when an over-the-air update finished downloading after the app had already opened. One tap reloads into it;
// it never reloads by itself, so a child is never interrupted mid-lesson.
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../quiz/quizPalette";

export default function UpdateReadyBanner({ onPress }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="A new version of Apprec8 is ready. Tap to refresh."
      style={[s.banner, { top: insets.top + 8, backgroundColor: P.card, borderColor: P.selectedBorder }]}
    >
      <Text style={[s.text, { color: P.text }]}>✨ New version ready</Text>
      <Text style={[s.action, { color: P.selectedText }]}>Tap to refresh</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  banner: { position: "absolute", left: 16, right: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, minHeight: 48, borderRadius: 16, borderWidth: 2, elevation: 6, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 6 },
  text: { fontSize: 15, fontFamily: "nunitoBold" },
  action: { fontSize: 15, fontFamily: "nunitoBold", textDecorationLine: "underline" },
});

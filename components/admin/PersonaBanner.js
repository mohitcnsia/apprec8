// components/admin/PersonaBanner.js: while the owner views the app as a kid, parent or teacher (Admin tools → View as),
// this line sits at the top of Home, Progress and Me with "Back to owner", so the owner can never get stuck.
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../quiz/quizPalette";
import { usePersona, setPersona } from "../../services/persona";
import { personaLabel, OWNER } from "../../utils/persona";

export default function PersonaBanner() {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const persona = usePersona();
  if (persona.role === "owner") return null;
  return (
    <View style={[s.wrap, { backgroundColor: P.selectedBg, borderColor: P.selectedBorder }]}>
      <Text style={[s.text, { color: P.selectedText }]} numberOfLines={1}>
        👁 Viewing as {personaLabel(persona)}
      </Text>
      <Pressable onPress={() => setPersona(OWNER)} accessibilityRole="button" style={s.back} hitSlop={8}>
        <Text style={[s.backText, { color: P.label }]}>Back to owner</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 8, paddingLeft: 14, paddingRight: 6, minHeight: 44, borderRadius: 14, borderWidth: 1.5, marginBottom: 12 },
  text: { flex: 1, fontSize: 14, fontFamily: "nunitoBold" },
  back: { minHeight: 40, paddingHorizontal: 10, justifyContent: "center" },
  backText: { fontSize: 14, fontFamily: "nunitoBold" },
});

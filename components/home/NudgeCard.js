// components/home/NudgeCard.js: a teacher's private note on the kid's Home (Nudge / Cheer on, 2026-11-11).
// Only this kid sees it; it lasts 3 days or until closed. Kind words only, never "you are behind".
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authInstance } from "../../config/firebaseConfig";

const key = () => `nudgeClosed.v1.${authInstance.currentUser?.uid || "guest"}`;

export const nudgeText = (n) =>
  n.kind === "cheer"
    ? `Keep going on ${n.topic || "your topic"}. You're getting there! 💪`
    : `Let's practise ${n.topic || "a little"} today. You can do it! 🌱`;

export default function NudgeCard({ nudge, P, onPractise }) {
  const [closedAt, setClosedAt] = useState(undefined);
  useEffect(() => {
    AsyncStorage.getItem(key())
      .then((v) => setClosedAt(Number(v) || 0))
      .catch(() => setClosedAt(0));
  }, []);
  if (!nudge?.at || closedAt === undefined || closedAt >= nudge.at || Date.now() > (nudge.until || 0)) return null;
  const close = () => {
    setClosedAt(nudge.at);
    AsyncStorage.setItem(key(), String(nudge.at)).catch(() => {});
  };
  return (
    <View style={[s.card, { backgroundColor: P.card, borderColor: P.border }]} accessibilityLabel={`From ${nudge.from}`}>
      <View style={s.row}>
        <Text style={[s.label, { color: P.label }]}>FROM {String(nudge.from || "your teacher").toUpperCase()}</Text>
        <Pressable onPress={close} hitSlop={12} accessibilityRole="button" accessibilityLabel="Close">
          <Text style={{ color: P.textSoft, fontSize: 16 }}>✕</Text>
        </Pressable>
      </View>
      <Text style={[s.body, { color: P.text }]}>{nudgeText(nudge)}</Text>
      {onPractise ? (
        <Pressable onPress={() => (close(), onPractise())} accessibilityRole="button" style={[s.btn, { borderColor: P.selectedBorder }]}>
          <Text style={[s.btnText, { color: P.selectedText }]}>Practise now ›</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  card: { padding: 14, borderRadius: 18, borderWidth: 1, gap: 6 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 12, fontFamily: "nunitoBold", letterSpacing: 1 },
  body: { fontSize: 16, fontFamily: "nunitoBold", lineHeight: 22 },
  btn: { alignSelf: "flex-start", paddingHorizontal: 14, minHeight: 40, borderRadius: 20, borderWidth: 1.5, justifyContent: "center" },
  btnText: { fontSize: 14, fontFamily: "nunitoBold" },
});

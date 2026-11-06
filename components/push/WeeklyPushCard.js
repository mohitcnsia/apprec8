// components/push/WeeklyPushCard.js
// "🔔 Weekly summary" on/off for parents (Sunday evening) and teachers (Monday morning). Hidden on builds without
// the notifications library. The on/off state comes from the user doc (pushOptIn), written by the server.

import React, { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { pushAvailable, turnOnWeekly, turnOffWeekly } from "../../services/push";
import { showAlert } from "../../services/dialog";

const WHEN = { parent: "every Sunday evening", teacher: "every Monday morning" };

export default function WeeklyPushCard({ role, on, lang = "en", P }) {
  const [busy, setBusy] = useState(false);
  if (!pushAvailable()) return null;
  const toggle = async () => {
    setBusy(true);
    try {
      const r = on ? await turnOffWeekly(role) : await turnOnWeekly(role, lang);
      if (!r.ok) showAlert("Weekly summary", r.reason);
    } catch (e) {
      showAlert("Weekly summary", e?.message || String(e));
    }
    setBusy(false);
  };
  return (
    <View style={[s.card, { borderColor: P.border, backgroundColor: P.card }]}>
      <Text style={{ fontSize: 22 }}>🔔</Text>
      <View style={{ flex: 1 }}>
        <Text style={[s.title, { color: P.text }]}>Weekly summary</Text>
        <Text style={[s.soft, { color: P.textSoft }]}>{on ? `On · ${WHEN[role]}` : `A short note ${WHEN[role]}`}</Text>
      </View>
      <Pressable onPress={toggle} disabled={busy} accessibilityRole="button" style={[s.btn, { borderColor: on ? P.border : P.selectedBorder, backgroundColor: on ? "transparent" : P.selectedBg }]}>
        {busy ? <ActivityIndicator color={P.selectedText} /> : <Text style={[s.btnText, { color: on ? P.textSoft : P.selectedText }]}>{on ? "Turn off" : "Turn on"}</Text>}
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 18, borderWidth: 2 },
  title: { fontSize: 16, fontFamily: "nunitoBold" },
  soft: { fontSize: 13, fontFamily: "nunitoBold" },
  btn: { minHeight: 44, paddingHorizontal: 14, borderRadius: 14, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  btnText: { fontSize: 15, fontFamily: "nunitoBold" },
});

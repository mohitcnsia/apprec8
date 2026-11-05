// components/safety/HelpSheet.js
// "Need help? Talk to someone" (mockups P1–P2, owner OK 2026-11-05). Call opens the phone's dialer with the number
// ready (the child still presses the green button). Nothing here is logged or saved: no analytics, no Firestore.

import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Sheet from "../common/Sheet";
import { HELPLINES, HELP_TEXT } from "../../data/helplines";

/** The calm green row for the Me tab (P1). */
export function NeedHelpRow({ onPress, P }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [s.row, { backgroundColor: P.correctBg, borderColor: P.correctBorder }, pressed && { opacity: 0.8 }]}>
      <View style={[s.heart, { backgroundColor: P.card }]}>
        <Ionicons name="heart-outline" size={24} color={P.correctText} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[s.rowTitle, { color: P.text }]}>Need help? Talk to someone</Text>
        <Text style={[s.rowSub, { color: P.correctText }]}>Sad, scared or someone is hurting you</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={P.correctText} />
    </Pressable>
  );
}

export default function HelpSheet({ visible, onClose, P }) {
  const call = (n) => Linking.openURL(`tel:${n}`).catch(() => {});
  return (
    <Sheet visible={visible} onClose={onClose} title={`🙂 ${HELP_TEXT.title}`} subtitle={HELP_TEXT.intro} P={P}>
      {HELPLINES.map((h) => (
        <View key={h.id} style={[s.card, { borderColor: h.call ? P.correctBorder : P.border, backgroundColor: P.bg }]}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[s.name, { color: P.text }]}>
              {h.name} · {h.number}
            </Text>
            <Text style={[s.when, { color: P.textSoft }]}>{h.when}</Text>
          </View>
          {h.call ? (
            <Pressable onPress={() => call(h.number)} accessibilityRole="button" accessibilityLabel={`Call ${h.name} ${h.number}`} style={[s.callBtn, { backgroundColor: P.correctBg, borderColor: P.correctBorder }]}>
              <Text style={[s.callText, { color: P.correctText }]}>Call</Text>
            </Pressable>
          ) : null}
        </View>
      ))}
      <Text style={[s.note, { color: P.textSoft }]}>{HELP_TEXT.callNote}</Text>
      <Text style={[s.tell, { color: P.text }]}>{HELP_TEXT.tell}</Text>
      <Text style={[s.note, { color: P.dimText }]}>{HELP_TEXT.privacy}</Text>
      <Pressable onPress={onClose} accessibilityRole="button" style={[s.close, { borderColor: P.border }]}>
        <Text style={[s.callText, { color: P.text }]}>Close</Text>
      </Pressable>
    </Sheet>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 14, minHeight: 72, padding: 16, borderRadius: 20, borderWidth: 2 },
  heart: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  rowTitle: { fontSize: 18, fontFamily: "nunitoBold" },
  rowSub: { fontSize: 14, fontFamily: "nunitoBold" },
  card: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 18, borderWidth: 2 },
  name: { fontSize: 17, fontFamily: "nunitoBold" },
  when: { fontSize: 14, lineHeight: 20, fontFamily: "nunitoBold" },
  callBtn: { minWidth: 72, minHeight: 48, borderRadius: 14, borderWidth: 2, alignItems: "center", justifyContent: "center", paddingHorizontal: 14 },
  callText: { fontSize: 16, fontFamily: "nunitoBold" },
  note: { fontSize: 13, lineHeight: 19, fontFamily: "nunitoBold" },
  tell: { fontSize: 15, lineHeight: 22, fontFamily: "nunitoBold" },
  close: { minHeight: 52, borderRadius: 16, borderWidth: 2, alignItems: "center", justifyContent: "center" },
});

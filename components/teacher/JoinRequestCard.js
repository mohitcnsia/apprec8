// components/teacher/JoinRequestCard.js: one child waiting to join a class (mockup "Teacher approves", screen 1;
// doc "Simpler sign-up: one WhatsApp link", 2026-11-11). Shows what lets a teacher recognise the family without photos:
// first name + roll number, the parent's name and relation, the parent's mobile with Call / WhatsApp.
// Approve · Not sure · Decline. On the follow-up list (status "unsure") only Approve · Decline remain.
import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { formatMobile, telUrl, whatsappUrl } from "../../utils/joinLink";
import { showAlert } from "../../services/dialog";

const RELATION = { mother: "Mother", father: "Father", guardian: "Guardian" };

/** A student who asked from their own phone: the teacher confirms the parent said yes (owner, 2026-11-11). */
export const needsParentYes = (k) => k?.consentBy === "teacher-confirms";
export function askParentYes(name, onYes) {
  showAlert(`Did ${name}'s parent say yes?`, "Ask in your class parents' WhatsApp group (\"Reply YES\"), with a slip, or call them.", [
    { text: "Not yet", style: "cancel" },
    { text: "Yes, by phone", onPress: () => onYes("call") },
    { text: "Yes, on a slip", onPress: () => onYes("slip") },
    { text: "Yes, on WhatsApp", onPress: () => onYes("whatsapp") },
  ]);
}

export default function JoinRequestCard({ k, P, onApprove, onNotSure, onDecline }) {
  const s = makeStyles(P);
  const name = k.firstName || "Child";
  const who = [name, k.rollNo ? `Roll ${k.rollNo}` : `Class ${k.grade || "?"}`].join(" · ");
  const parent = k.parentName
    ? [k.parentName, RELATION[k.relation]].filter(Boolean).join(", ")
    : needsParentYes(k)
      ? "Asked from their own phone · parent's yes: ask them"
      : "Parent: linked account ✓";
  // onApprove(method): method = how the parent said yes, when the teacher had to ask.
  const approve = () => (needsParentYes(k) ? askParentYes(name, (method) => onApprove(method)) : onApprove(null));
  const decline = () =>
    showAlert(`Decline ${name}?`, "They can still learn on their own. The parent can ask again.", [
      { text: "Cancel", style: "cancel" },
      { text: "Decline", style: "destructive", onPress: onDecline },
    ]);
  return (
    <View style={[s.card, k.status === "unsure" && s.cardQuiet]}>
      <Text style={s.name}>{who}</Text>
      <Text style={s.soft}>{parent}</Text>
      {k.parentMobile ? (
        <View style={s.row}>
          <Text style={[s.line, { flex: 1 }]}>{formatMobile(k.parentMobile)}</Text>
          <Pressable onPress={() => Linking.openURL(telUrl(k.parentMobile)).catch(() => {})} style={s.pill} hitSlop={6} accessibilityRole="button" accessibilityLabel={`Call ${k.parentName || "the parent"}`}>
            <Text style={s.pillText}>Call</Text>
          </Pressable>
          <Pressable onPress={() => Linking.openURL(whatsappUrl(k.parentMobile)).catch(() => {})} style={s.pill} hitSlop={6} accessibilityRole="button" accessibilityLabel={`WhatsApp ${k.parentName || "the parent"}`}>
            <Text style={s.pillText}>WhatsApp</Text>
          </Pressable>
        </View>
      ) : null}
      <Pressable onPress={approve} style={s.approve} accessibilityRole="button">
        <Text style={s.approveText}>Approve</Text>
      </Pressable>
      <View style={s.row}>
        {k.status !== "unsure" && onNotSure ? (
          <Pressable onPress={onNotSure} style={[s.pill, s.half]} accessibilityRole="button">
            <Text style={s.pillText}>Not sure</Text>
          </Pressable>
        ) : null}
        <Pressable onPress={decline} style={[s.pill, s.half]} accessibilityRole="button">
          <Text style={[s.pillText, { color: P.textSoft }]}>Decline</Text>
        </Pressable>
      </View>
    </View>
  );
}

const makeStyles = (P) =>
  StyleSheet.create({
    card: { padding: 14, borderRadius: 16, borderWidth: 1.5, borderColor: P.selectedBorder, backgroundColor: P.selectedBg, gap: 8 },
    cardQuiet: { borderWidth: 1, borderColor: P.border, backgroundColor: P.card },
    name: { fontSize: 17, fontFamily: "nunitoBold", color: P.text },
    soft: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft },
    line: { fontSize: 15, fontFamily: "nunitoBold", color: P.text },
    row: { flexDirection: "row", alignItems: "center", gap: 8 },
    pill: { minHeight: 40, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: P.border, alignItems: "center", justifyContent: "center" },
    pillText: { fontSize: 14, fontFamily: "nunitoBold", color: P.text },
    half: { flex: 1 },
    approve: { minHeight: 44, borderRadius: 22, backgroundColor: P.primary, alignItems: "center", justifyContent: "center" },
    approveText: { fontSize: 15, fontFamily: "nunitoBold", color: P.onPrimary },
  });

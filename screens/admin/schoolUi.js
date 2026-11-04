// screens/admin/schoolUi.js
// Shared look for the Schools & classes screens (mockups L1–L4, owner-approved 2026-11-05): chips, inputs, the one big
// button in the thumb zone. Colours come from quizPalette, like the rest of the redesign.

import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput } from "react-native";

export const makeSchoolStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg },
    content: { paddingTop: insets.top + 20, paddingHorizontal: 18, paddingBottom: 20, gap: 14 },
    label: { fontSize: 13, letterSpacing: 1.2, fontFamily: "nunitoBold", color: P.label },
    h1: { fontSize: 26, fontFamily: "nunitoBold", color: P.text },
    title: { fontSize: 20, fontFamily: "nunitoBold", color: P.text },
    text: { fontSize: 16, fontFamily: "nunitoBold", color: P.text },
    soft: { fontSize: 15, lineHeight: 21, fontFamily: "nunitoBold", color: P.textSoft },
    small: { fontSize: 14, lineHeight: 20, fontFamily: "nunitoBold", color: P.textSoft },
    dim: { fontSize: 14, lineHeight: 20, fontFamily: "nunitoBold", color: P.dimText },
    card: { backgroundColor: P.card, borderWidth: 2, borderColor: P.border, borderRadius: 20, padding: 16, gap: 12 },
    listCard: { backgroundColor: P.card, borderWidth: 2, borderColor: P.border, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 4 },
    row: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 56, paddingVertical: 8 },
    divider: { height: 1, backgroundColor: P.border },
    classRow: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 56, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, borderWidth: 2, borderColor: P.selectedBorder, backgroundColor: P.selectedBg },
    pill: { fontSize: 13, fontFamily: "nunitoBold", color: "#241027", backgroundColor: P.gold, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, overflow: "hidden" },
    link: { flexDirection: "row", alignItems: "center", gap: 8, minHeight: 44 },
    linkText: { fontSize: 16, fontFamily: "nunitoBold", color: P.selectedText },
    input: { height: 52, borderRadius: 14, borderWidth: 2, borderColor: P.border, backgroundColor: P.bg, color: P.text, paddingHorizontal: 14, fontSize: 17, fontFamily: "nunitoBold" },
    chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    gradeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    chip: { minHeight: 44, paddingHorizontal: 14, borderRadius: 999, borderWidth: 2, borderColor: P.border, alignItems: "center", justifyContent: "center" },
    chipOn: { borderColor: P.selectedBorder, backgroundColor: P.selectedBg },
    chipText: { fontSize: 15, fontFamily: "nunitoBold", color: P.text },
    chipTextOn: { color: P.selectedText },
    gradeChip: { width: 48, height: 44, borderRadius: 12, borderWidth: 2, borderColor: P.border, alignItems: "center", justifyContent: "center" },
    smallButton: { minHeight: 44, paddingHorizontal: 14, borderRadius: 14, borderWidth: 2, borderColor: P.selectedBorder, backgroundColor: P.selectedBg, alignItems: "center", justifyContent: "center" },
    smallButtonText: { fontSize: 15, fontFamily: "nunitoBold", color: P.selectedText },
    iconButton: { width: 44, height: 44, borderRadius: 14, borderWidth: 2, borderColor: P.border, alignItems: "center", justifyContent: "center" },
    codeCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderRadius: 20, borderWidth: 2, borderColor: P.selectedBorder, backgroundColor: P.selectedBg },
    code: { fontSize: 30, letterSpacing: 6, fontFamily: "nunitoBold", color: P.selectedText },
    bubble: { backgroundColor: "#173A2A", borderRadius: 16, borderBottomLeftRadius: 4, padding: 14 },
    bubbleText: { fontSize: 15, lineHeight: 22, fontFamily: "nunitoBold", color: "#E6F5EC" },
    footer: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: Math.max(18, insets.bottom + 12), gap: 6, backgroundColor: P.bg },
    main: { height: 58, borderRadius: 18, backgroundColor: P.primary, borderBottomWidth: 5, borderBottomColor: P.primaryShadow, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 10 },
    mainText: { color: P.onPrimary, fontSize: 18, fontFamily: "nunitoBold", letterSpacing: 1 },
  });

export function Chip({ label, on, onPress, styles, grade }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: !!on }} style={[grade ? styles.gradeChip : styles.chip, on && styles.chipOn]}>
      <Text style={[styles.chipText, on && styles.chipTextOn]}>{label}</Text>
    </Pressable>
  );
}

export function MainButton({ label, onPress, busy, styles, P, disabled }) {
  return (
    <Pressable onPress={onPress} disabled={busy || disabled} accessibilityRole="button" accessibilityState={{ disabled: !!(busy || disabled) }} style={[styles.main, (busy || disabled) && { opacity: 0.6 }]}>
      {busy ? <ActivityIndicator color={P.onPrimary} /> : <Text style={styles.mainText}>{label}</Text>}
    </Pressable>
  );
}

export function Field({ label, styles, P, ...props }) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor={P.dimText} style={styles.input} {...props} />
    </>
  );
}

// components/quiz/ReportQuestionButton.js
// 🚩 Report a problem with a question (Spec B). One tap → reason chips → optional note → Send.
// Shows "✓ Reported" after sending (one report per kid per question) and
// "🔧" when the question is already a known issue (nothing is sent).

import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, TextInput, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../context/ThemeContext";
import { authInstance } from "../../config/firebaseConfig";
import { REPORT_REASONS, hasReported, submitQuestionReport } from "../../services/reportApi";

export default function ReportQuestionButton({
  questionId,
  questionText,
  options,
  quizId,
  chosen = null,
  mode,
  questContext,
  knownStatus, // "known" | "hidden" | undefined
  color,
}) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [reported, setReported] = useState(false);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    let alive = true;
    setReported(false);
    if (questionId) hasReported(questionId).then((r) => alive && setReported(r));
    return () => {
      alive = false;
    };
  }, [questionId]);

  if (!authInstance.currentUser || !questionId) return null; // guests can't send reports
  const iconColor = color || theme.textPrimaryOnGradient;

  if (knownStatus === "known" || knownStatus === "hidden") {
    return (
      <TouchableOpacity
        hitSlop={10}
        onPress={() => Alert.alert("🔧 Already known", "We know about this one and we're fixing it. Thanks!")}
        style={styles.chip}
      >
        <Text style={[styles.chipText, { color: iconColor }]}>🔧</Text>
      </TouchableOpacity>
    );
  }
  if (reported) {
    return (
      <View style={styles.chip}>
        <Text style={[styles.chipText, { color: iconColor }]}>✓ Reported</Text>
      </View>
    );
  }

  const send = () => {
    if (!reason) return;
    submitQuestionReport({ questionId, questionText, options, quizId, chosen, reason, note, questContext, mode });
    setOpen(false);
    setReported(true);
    setReason(null);
    setNote("");
    Alert.alert("Thanks! 🙌", "We'll check it.");
  };

  return (
    <>
      <TouchableOpacity hitSlop={10} onPress={() => setOpen(true)} style={styles.chip} accessibilityLabel="Report a problem">
        <Ionicons name="flag-outline" size={22} color={iconColor} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.title}>What's wrong with this question?</Text>
            <View style={styles.reasons}>
              {REPORT_REASONS.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  onPress={() => setReason(r.id)}
                  style={[styles.reason, reason === r.id && styles.reasonSelected]}
                >
                  <Text style={[styles.reasonText, reason === r.id && styles.reasonTextSelected]}>{r.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Tell us more (optional)"
              placeholderTextColor={theme.placeholder}
              maxLength={300}
              multiline
              style={styles.input}
            />
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => setOpen(false)} style={styles.cancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={send} disabled={!reason} style={[styles.send, !reason && { opacity: 0.4 }]}>
                <Text style={styles.sendText}>Send</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    chip: { paddingHorizontal: 6, paddingVertical: 4, justifyContent: "center" },
    chipText: { fontSize: 13, fontFamily: "nunitoBold" },
    backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
    sheet: { backgroundColor: theme.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 32, gap: 14 },
    title: { fontSize: 18, fontFamily: "nunitoBold", color: theme.textPrimary },
    reasons: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    reason: { borderWidth: 2, borderColor: theme.border, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14 },
    reasonSelected: { backgroundColor: theme.primary, borderColor: theme.primary },
    reasonText: { fontSize: 15, fontFamily: "nunito", color: theme.textPrimary },
    reasonTextSelected: { color: theme.textOnPrimary || "#FFFFFF", fontFamily: "nunitoBold" },
    input: {
      minHeight: 60,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 10,
      fontSize: 15,
      fontFamily: "nunito",
      color: theme.textPrimary,
      backgroundColor: theme.inputBackground || theme.cardBackground,
      textAlignVertical: "top",
    },
    actions: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
    cancel: { paddingVertical: 10, paddingHorizontal: 16 },
    cancelText: { fontSize: 16, fontFamily: "nunitoBold", color: theme.textSecondary },
    send: { backgroundColor: theme.primary, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 24 },
    sendText: { fontSize: 16, fontFamily: "nunitoBold", color: theme.textOnPrimary || "#FFFFFF" },
  });

// components/quiz/ReportStudyButton.js
// 🚩 Report a problem on a study page or learn card (G65).
// Creates the same kind of report as the quiz 🚩 button, writing to userFeedback.
// Children tap reasons only; adults/supervised may add a note.

import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../context/ThemeContext";
import { authInstance } from "../../config/firebaseConfig";
import { STUDY_REPORT_REASONS, studyReportId, hasReported, submitStudyReport } from "../../services/reportApi";
import { showAlert } from "../../services/dialog";
import { useCanWriteFreeText } from "../../context/FreeTextContext";
import { ASK_A_GROWN_UP } from "../../utils/freeText";

export default function ReportStudyButton({
  contentId,
  cardIndex = null,
  section = null,
  cardTitle = "",
  cardText = "",
  questContext = null,
  color,
}) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [reported, setReported] = useState(false);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(null);
  const [note, setNote] = useState("");
  const canWrite = useCanWriteFreeText(); // children: reason chips only

  const targetId = useMemo(
    () => studyReportId({ contentId, cardIndex, section }),
    [contentId, cardIndex, section]
  );

  useEffect(() => {
    let alive = true;
    setReported(false);
    if (targetId) {
      hasReported(targetId).then((r) => {
        if (alive) setReported(r);
      });
    }
    return () => {
      alive = false;
    };
  }, [targetId]);

  if (!authInstance.currentUser || !contentId) return null; // guests cannot report
  const iconColor = color || theme.textSecondary || theme.textPrimaryOnGradient;

  if (reported) {
    return (
      <View style={styles.chip}>
        <Text style={[styles.chipText, { color: iconColor }]}>✓ Reported</Text>
      </View>
    );
  }

  const send = () => {
    if (!reason) return;
    submitStudyReport({
      contentId,
      cardIndex,
      section,
      title: cardTitle,
      text: cardText,
      reason,
      note: canWrite ? note : "",
      questContext,
    });
    setOpen(false);
    setReported(true);
    setReason(null);
    setNote("");
    showAlert("Thanks! 🙌", "We'll check it.");
  };

  return (
    <>
      <TouchableOpacity
        hitSlop={10}
        onPress={() => setOpen(true)}
        style={styles.chip}
        accessibilityLabel="Something's wrong here"
        accessibilityRole="button"
      >
        <Ionicons name="alert-circle-outline" size={22} color={iconColor} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.title}>Something's wrong here</Text>
            {cardTitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {cardTitle}
              </Text>
            ) : null}

            <View style={styles.reasons}>
              {STUDY_REPORT_REASONS.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  onPress={() => setReason(r.id)}
                  style={[styles.reason, reason === r.id && styles.reasonSelected]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: reason === r.id }}
                >
                  <Text style={[styles.reasonText, reason === r.id && styles.reasonTextSelected]}>
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {canWrite ? (
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Tell us more (optional). 🎤 Tap the keyboard mic to speak"
                placeholderTextColor={theme.placeholder}
                maxLength={300}
                multiline
                style={styles.input}
              />
            ) : (
              <Text style={styles.hint}>{ASK_A_GROWN_UP}</Text>
            )}

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => setOpen(false)} style={styles.cancel} accessibilityRole="button">
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={send}
                disabled={!reason}
                style={[styles.send, !reason && { opacity: 0.4 }]}
                accessibilityRole="button"
              >
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
    sheet: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      paddingBottom: 32,
      gap: 14,
    },
    title: { fontSize: 18, fontFamily: "nunitoBold", color: theme.textPrimary },
    subtitle: { fontSize: 14, fontFamily: "nunito", color: theme.textSecondary, marginTop: -6 },
    hint: { fontSize: 14, fontFamily: "nunito", color: theme.textSecondary },
    reasons: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    reason: {
      borderWidth: 2,
      borderColor: theme.border,
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 14,
    },
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
    send: {
      backgroundColor: theme.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 12,
    },
    sendText: { fontSize: 16, fontFamily: "nunitoBold", color: theme.textOnPrimary || "#FFFFFF" },
  });


// components/feedback/IdeaModal.js
// Kid-friendly modal for sharing ideas with the Apprec8 team (G66).
// Tap-only choices for all children; supervised accounts may add a note. (Stars for ideas come later from the server.)

import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, TextInput, ScrollView } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useCanWriteFreeText } from "../../context/FreeTextContext";
import { ASK_A_GROWN_UP } from "../../utils/freeText";
import { IDEA_PROMPTS } from "../../utils/feedbackPipeline";
import { submitChildIdea } from "../../services/ideaApi";
import { showAlert } from "../../services/dialog";

export default function IdeaModal({
  visible,
  onClose,
  initialPromptIndex = 0,
  entryPoint = "me_idea",
  userGrade = null,
}) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const canWrite = useCanWriteFreeText();

  const [promptIdx, setPromptIdx] = useState(initialPromptIndex % IDEA_PROMPTS.length);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const activePrompt = IDEA_PROMPTS[promptIdx];

  const handleSend = async () => {
    if (!selectedChoice) return;
    await submitChildIdea({
      promptId: activePrompt.id,
      promptQuestion: activePrompt.question,
      choiceId: selectedChoice.id,
      selectedChoice: selectedChoice.text,
      choiceEmoji: selectedChoice.emoji,
      note: canWrite ? note : "",
      entryPoint,
      userGrade,
    });

    setSubmitted(true);
    showAlert("Thank you! 🎉", "Chamku loved your idea! You're helping make Apprec8 better for every child.");
    setTimeout(() => {
      setSubmitted(false);
      setSelectedChoice(null);
      setNote("");
      onClose();
    }, 400);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.topRow}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={{ fontSize: 28 }}>⭐</Text>
              <Text style={styles.title}>Chamku wants to know</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={10} style={styles.closeBtn} accessibilityRole="button">
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Prompt Selector Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptPills}>
            {IDEA_PROMPTS.map((p, idx) => (
              <TouchableOpacity
                key={p.id}
                onPress={() => {
                  setPromptIdx(idx);
                  setSelectedChoice(null);
                }}
                style={[styles.pill, promptIdx === idx && styles.pillActive]}
                accessibilityRole="button"
              >
                <Text style={[styles.pillText, promptIdx === idx && styles.pillTextActive]}>
                  {idx === 0 ? "Other apps 🎮" : idx === 1 ? "What to add 📚" : "What's boring 😴"}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Active Question Bubble */}
          <View style={styles.bubble}>
            <Text style={styles.questionText}>"{activePrompt.question}"</Text>
          </View>

          {/* 4 Tap Choices */}
          <View style={styles.choicesGrid}>
            {activePrompt.choices.map((c) => {
              const isSelected = selectedChoice?.id === c.id;
              return (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => setSelectedChoice(c)}
                  style={[styles.choiceBtn, isSelected && styles.choiceBtnSelected]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text style={{ fontSize: 26 }}>{c.emoji}</Text>
                  <Text style={[styles.choiceText, isSelected && styles.choiceTextSelected]}>{c.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Free-text for supervised accounts only */}
          {canWrite ? (
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Tell us in your own words (optional). 🎤 Tap keyboard mic to speak"
              placeholderTextColor={theme.placeholder}
              maxLength={300}
              multiline
              style={styles.input}
            />
          ) : (
            <Text style={styles.hint}>{ASK_A_GROWN_UP}</Text>
          )}

          {/* Bottom Actions */}
          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn} accessibilityRole="button">
              <Text style={styles.cancelText}>Not now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSend}
              disabled={!selectedChoice || submitted}
              style={[styles.sendBtn, (!selectedChoice || submitted) && { opacity: 0.45 }]}
              accessibilityRole="button"
            >
              <Text style={styles.sendText}>Send my idea</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingBottom: 34,
      gap: 14,
      maxHeight: "90%",
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 20,
      fontFamily: "nunitoBold",
      color: theme.textPrimary,
    },
    closeBtn: {
      padding: 6,
    },
    closeText: {
      fontSize: 20,
      fontFamily: "nunitoBold",
      color: theme.textSecondary,
    },
    promptPills: {
      flexDirection: "row",
      gap: 8,
      paddingVertical: 4,
    },
    pill: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 16,
      backgroundColor: theme.cardBackground || "rgba(127,127,127,0.12)",
      borderWidth: 1,
      borderColor: theme.border,
    },
    pillActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    pillText: {
      fontSize: 13,
      fontFamily: "nunitoBold",
      color: theme.textSecondary,
    },
    pillTextActive: {
      color: theme.textOnPrimary || "#FFFFFF",
    },
    bubble: {
      backgroundColor: theme.selectedBg || "rgba(127,127,127,0.08)",
      padding: 14,
      borderRadius: 16,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    },
    questionText: {
      fontSize: 17,
      fontFamily: "nunitoBold",
      color: theme.textPrimary,
    },
    choicesGrid: {
      gap: 8,
    },
    choiceBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: theme.border,
      backgroundColor: theme.cardBackground,
    },
    choiceBtnSelected: {
      borderColor: theme.primary,
      backgroundColor: theme.selectedBg || "rgba(127,127,127,0.1)",
    },
    choiceText: {
      fontSize: 15,
      fontFamily: "nunitoBold",
      color: theme.textPrimary,
      flex: 1,
    },
    choiceTextSelected: {
      color: theme.primary,
    },
    hint: {
      fontSize: 13,
      fontFamily: "nunito",
      color: theme.textSecondary,
      textAlign: "center",
    },
    input: {
      minHeight: 54,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 10,
      fontSize: 14,
      fontFamily: "nunito",
      color: theme.textPrimary,
      backgroundColor: theme.inputBackground || theme.cardBackground,
      textAlignVertical: "top",
    },
    actions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: 12,
      marginTop: 4,
    },
    cancelBtn: {
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    cancelText: {
      fontSize: 15,
      fontFamily: "nunitoBold",
      color: theme.textSecondary,
    },
    sendBtn: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 14,
    },
    sendText: {
      fontSize: 15,
      fontFamily: "nunitoBold",
      color: theme.textOnPrimary || "#FFFFFF",
    },
  });


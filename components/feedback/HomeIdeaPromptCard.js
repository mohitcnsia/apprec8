// components/feedback/HomeIdeaPromptCard.js
// Sticky note card appearing once a week on HomeScreen (G66).
// Tapping opens the IdeaModal to answer in Chamku's poll; awards +5 ⭐.

import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { pickWeeklyPrompt, shouldShowWeeklyPrompt } from "../../utils/feedbackPipeline";
import { getLastIdeaPromptTime, dismissIdeaPrompt } from "../../services/ideaApi";
import IdeaModal from "./IdeaModal";

export default function HomeIdeaPromptCard({ userGrade = null }) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    getLastIdeaPromptTime().then((lastTime) => {
      if (alive && shouldShowWeeklyPrompt({ lastPromptAt: lastTime })) {
        setVisible(true);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!visible) return null;

  const prompt = pickWeeklyPrompt();

  const handleDismiss = async () => {
    setVisible(false);
    await dismissIdeaPrompt();
  };

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setVisible(false); // once answered or closed from inside, hide home prompt
  };

  return (
    <>
      <View style={styles.card} accessibilityRole="region" accessibilityLabel="Weekly idea prompt from Chamku">
        <View style={styles.tape} />
        <View style={styles.topRow}>
          <View style={styles.badge}>
            <Text style={{ fontSize: 18 }}>⭐</Text>
            <Text style={styles.badgeText}>Chamku asks · +5 ⭐</Text>
          </View>
          <TouchableOpacity onPress={handleDismiss} hitSlop={10} style={styles.dismissBtn} accessibilityRole="button">
            <Text style={styles.dismissText}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.questionText}>{prompt.question}</Text>

        <TouchableOpacity onPress={handleOpen} style={styles.actionBtn} accessibilityRole="button">
          <Text style={styles.actionBtnText}>Tell Chamku ›</Text>
        </TouchableOpacity>
      </View>

      <IdeaModal
        visible={modalOpen}
        onClose={handleModalClose}
        entryPoint="home_idea_prompt"
        userGrade={userGrade}
      />
    </>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.cardBackground || "#FFF9D6",
      borderRadius: 18,
      borderWidth: 2,
      borderColor: theme.border || "#F0E2A1",
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    tape: {
      position: "absolute",
      top: -8,
      alignSelf: "center",
      width: 70,
      height: 16,
      backgroundColor: "rgba(255,255,255,0.4)",
      borderRadius: 4,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: theme.selectedBg || "rgba(220,181,27,0.18)",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    badgeText: {
      fontSize: 13,
      fontFamily: "nunitoBold",
      color: theme.textPrimary,
    },
    dismissBtn: {
      padding: 4,
    },
    dismissText: {
      fontSize: 16,
      fontFamily: "nunitoBold",
      color: theme.textSecondary,
    },
    questionText: {
      fontSize: 17,
      fontFamily: "nunitoBold",
      color: theme.textPrimary,
      lineHeight: 23,
      marginBottom: 12,
    },
    actionBtn: {
      backgroundColor: theme.primary,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignItems: "center",
    },
    actionBtnText: {
      fontSize: 15,
      fontFamily: "nunitoBold",
      color: theme.textOnPrimary || "#FFFFFF",
    },
  });

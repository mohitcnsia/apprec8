// screens/englishQuest/EnglishQuestIntroScreen.js
// Intro screen opened from a QUEST tile: shows what the quest is, the kid's
// progress, and a big Start / Continue button. Asks guests to sign in, because
// progress is saved per account (teachers and parents track it).

import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { authInstance } from "../../config/firebaseConfig";
import {
  listenToQuest,
  listenToQuestTreeNodes,
  listenToQuestProgress,
} from "../../services/englishQuestApi";
import { buildQuestTree } from "../../utils/questTree";
import { useTheme } from "../../context/ThemeContext";

const HOW_IT_WORKS = [
  { icon: "trophy", text: "Each unit ends with a unit test. Pass it to climb to the next unit." },
  { icon: "leaf", text: "Branches are practice. The further out a leaf is, the harder it gets." },
  { icon: "star", text: "Score well to earn up to 3 stars on every quiz." },
];

export default function EnglishQuestIntroScreen({ route, navigation }) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { questId } = route.params || {};
  const insets = useSafeAreaInsets();
  const user = authInstance.currentUser;

  const [quest, setQuest] = useState(null);
  const [nodes, setNodes] = useState(null);
  const [progress, setProgress] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!questId) {
      setError("This quest could not be found.");
      return undefined;
    }
    const onError = (e) => {
      console.error("EnglishQuestIntro:", e);
      setError("Could not load the quest. Please check your internet and try again.");
    };
    const unsubs = [
      listenToQuest(questId, setQuest, onError),
      listenToQuestTreeNodes(questId, setNodes, onError),
      listenToQuestProgress(questId, setProgress, () => {}),
    ];
    return () => unsubs.forEach((u) => u());
  }, [questId]);

  const tree = useMemo(
    () => (nodes ? buildQuestTree(nodes, progress) : null),
    [nodes, progress]
  );

  const hasStarted = Object.keys(progress || {}).length > 0;
  const currentUnit = tree?.units.find((u) => u.id === tree.currentUnitId);

  const renderBody = () => {
    if (error) {
      return <Text style={styles.message}>{error}</Text>;
    }
    if (!quest || !tree) {
      return <ActivityIndicator size="large" color={theme.textPrimaryOnGradient} style={{ marginTop: 40 }} />;
    }
    return (
      <>
        {quest.image ? (
          <Image source={{ uri: quest.image }} style={styles.hero} contentFit="cover" cachePolicy="disk" />
        ) : null}
        <Text style={styles.title}>{quest.title}</Text>
        {quest.description ? <Text style={styles.description}>{quest.description}</Text> : null}

        {user ? (
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>
              {hasStarted ? "Your progress" : "Ready to start?"}
            </Text>
            <Text style={styles.progressText}>
              Units passed: {tree.stats.unitsDone} of {tree.stats.unitsTotal}
              {"   ·   "}Steps done: {tree.stats.leavesDone}
            </Text>
            {currentUnit ? (
              <Text style={styles.progressText}>You are on: {currentUnit.title}</Text>
            ) : null}
          </View>
        ) : (
          <View style={styles.progressCard}>
            <Ionicons name="person-circle-outline" size={36} color={theme.gold} />
            <Text style={styles.progressTitle}>Please sign in to play</Text>
            <Text style={styles.progressText}>
              Your progress is saved to your account, so you can continue on any phone and your
              teacher or parent can see how you are doing.
            </Text>
          </View>
        )}

        <View style={styles.howCard}>
          <Text style={styles.howTitle}>How it works</Text>
          {HOW_IT_WORKS.map((item) => (
            <View key={item.icon} style={styles.howRow}>
              <Ionicons name={item.icon} size={20} color={theme.gold} />
              <Text style={styles.howText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </>
    );
  };

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="arrow-back" size={26} color={theme.textPrimaryOnGradient} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>{renderBody()}</ScrollView>

      {/* Guests: take them to the Profile tab, which shows the sign-in screen for guests. */}
      {!user && !error ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity
            style={styles.startButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Profile")}
          >
            <Ionicons name="log-in-outline" size={22} color={theme.textOnPrimary} />
            <Text style={styles.startText}>Sign in to play</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Big button in the thumb zone */}
      {user && tree && !error ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity
            style={styles.startButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("EnglishQuestMap", { questId })}
          >
            <Text style={styles.startText}>{hasStarted ? "Continue" : "Start the Quest"}</Text>
            <Ionicons name="arrow-forward" size={22} color={theme.textOnPrimary} />
          </TouchableOpacity>
        </View>
      ) : null}
    </LinearGradient>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 8 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  hero: { width: "100%", aspectRatio: 16 / 9, borderRadius: 16, marginBottom: 16 },
  title: { fontSize: 30, fontFamily: "nunitoBold", color: theme.textPrimaryOnGradient, marginBottom: 6 },
  description: { fontSize: 16, fontFamily: "nunito", color: theme.textSecondaryOnGradient, lineHeight: 22 },
  message: { fontSize: 16, fontFamily: "nunito", color: theme.textPrimaryOnGradient, textAlign: "center", marginTop: 40 },
  progressCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: theme.cardBackground,
    alignItems: "flex-start",
    gap: 6,
  },
  progressTitle: { fontSize: 18, fontFamily: "nunitoBold", color: theme.textPrimaryOnGradient },
  progressText: { fontSize: 15, fontFamily: "nunito", color: theme.textSecondaryOnGradient, lineHeight: 21 },
  howCard: { marginTop: 16, padding: 16, borderRadius: 16, backgroundColor: theme.cardBackground, gap: 10 },
  howTitle: { fontSize: 18, fontFamily: "nunitoBold", color: theme.textPrimaryOnGradient },
  howRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  howText: { flex: 1, fontSize: 15, fontFamily: "nunito", color: theme.textSecondaryOnGradient, lineHeight: 21 },
  footer: { paddingHorizontal: 20, paddingTop: 12 },
  startButton: {
    backgroundColor: theme.primary,
    borderRadius: 30,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  startText: { fontSize: 20, fontFamily: "nunitoBold", color: theme.textOnPrimary },
});

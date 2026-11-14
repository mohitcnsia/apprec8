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
  Switch,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { authInstance } from "../../config/firebaseConfig";
import {
  listenToQuestProgress,
} from "../../services/englishQuestApi";
import { buildQuestPath } from "../../utils/questTree";
import { nodesForGrade } from "../../utils/gradeFilter";
import { listenToUserDocument } from "../../services/firestoreContentApi";
import { getQuest, getQuestNodes } from "../../services/contentCache";
import { isTesterView } from "../../services/ownerView";
import { useTesterMode, setTesterMode } from "../../services/testerMode";
import { resetMyQuestProgress } from "../../services/englishQuestApi";
import { useTheme } from "../../context/ThemeContext";
import useImmersiveStatusBar from "../../hooks/useImmersiveStatusBar";
import { showAlert } from "../../services/dialog";

const HOW_IT_WORKS = [
  { icon: "book", text: "Each topic starts with a short Learn page and a warm-up quiz." },
  { icon: "shield-checkmark", text: "Pass the topic's Challenge to open the next topic. Practice leaves are optional and help you get ready." },
  { icon: "trophy", text: "Beat the Unit Boss to open the next unit." },
  { icon: "star", text: "Score 100% on a quiz or reading to earn stars ⭐" },
];

export default function EnglishQuestIntroScreen({ route, navigation }) {
  useImmersiveStatusBar(); // no time/signal/battery while in a quest (owner 2026-11-05)
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { questId } = route.params || {};
  const insets = useSafeAreaInsets();
  const user = authInstance.currentUser;
  const isTester = isTesterView(user);
  const tester = useTesterMode();

  const [quest, setQuest] = useState(null);
  const [nodes, setNodes] = useState(null);
  const [progress, setProgress] = useState({});
  const [grade, setGrade] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    return listenToUserDocument(
      (d) => setGrade(Number.isInteger(d?.grade) ? d.grade : null),
      () => {}
    );
  }, []);

  useEffect(() => {
    if (!questId) {
      setError("This quest could not be found.");
      return undefined;
    }
    const onError = (e) => {
      console.error("EnglishQuestIntro:", e);
      setError("Could not load the quest. Please check your internet and try again.");
    };
    // Content comes from the local cache (Spec v2 Step 3): one read of the quest doc per visit,
    // nodes reused from the phone while contentVersion matches. Progress stays live.
    let alive = true;
    const load = async (force) => {
      try {
        const q = await getQuest(questId, { force });
        if (!alive) return;
        setQuest(q);
        const n = q ? await getQuestNodes(questId, q.contentVersion) : [];
        if (alive) setNodes(n || []);
      } catch (e) {
        if (alive) onError(e);
      }
    };
    load(false);
    const unsubProgress = listenToQuestProgress(questId, setProgress, () => {});
    return () => {
      alive = false;
      unsubProgress();
    };
  }, [questId]);

  const unlockAll = !!(isTester && tester?.unlockAll);
  const visibleNodes = useMemo(
    () => (nodes ? (unlockAll ? nodes : nodesForGrade(nodes, grade)) : null),
    [nodes, grade, unlockAll]
  );

  const tree = useMemo(
    () => (visibleNodes ? buildQuestPath(visibleNodes, progress, { unlockAll }) : null),
    [visibleNodes, progress, unlockAll]
  );

  const hasStarted = Object.keys(progress || {}).length > 0;
  const currentNode = tree?.path.find((p) => p.id === tree.currentPathId);

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
              {hasStarted
                ? quest?.intro?.progressStarted || "Your progress"
                : quest?.intro?.progressReady || "Ready to start?"}
            </Text>
            <Text style={styles.progressText}>
              {quest?.intro?.statsTemplate
                ? quest.intro.statsTemplate.replace(/\{(\w+)\}/g, (m, k) => String(tree.stats[k] ?? ""))
                : `Units passed: ${tree.stats.unitsDone} of ${tree.stats.unitsTotal}   ·   Steps done: ${tree.stats.stepsDone}`}
            </Text>
            {currentNode && hasStarted ? (
              <Text style={styles.progressText}>
                {quest?.intro?.currentPrefix || "You are on: "}
                {currentNode.title}
              </Text>
            ) : null}
          </View>
        ) : (
          <View style={styles.progressCard}>
            <Ionicons name="person-circle-outline" size={36} color={theme.gold} />
            <Text style={styles.progressTitle}>
              {quest?.intro?.signInTitle || "Please sign in to play"}
            </Text>
            <Text style={styles.progressText}>
              {quest?.intro?.signInText ||
                "Your progress is saved to your account, so you can continue on any phone and your teacher or parent can see how you are doing."}
            </Text>
          </View>
        )}

        {isTester && !quest?.intro?.hideTester ? (
          <View style={styles.howCard}>
            <Text style={styles.howTitle}>🧪 Tester mode</Text>
            <Text style={styles.howText}>Only visible to tester accounts. Resets when the app restarts.</Text>
            <View style={styles.testerRow}>
              <Text style={styles.howText}>🔓 Unlock everything (view only)</Text>
              <Switch
                value={tester.unlockAll}
                onValueChange={(v) => setTesterMode({ unlockAll: v })}
                accessibilityLabel={`Unlock everything, ${tester.unlockAll ? "on" : "off"}`}
              />
            </View>
            <View style={styles.testerRow}>
              <Text style={styles.howText}>⚡ Short quizzes (3 questions)</Text>
              <Switch
                value={tester.shortQuizzes}
                onValueChange={(v) => setTesterMode({ shortQuizzes: v })}
                accessibilityLabel={`Short quizzes, ${tester.shortQuizzes ? "on" : "off"}`}
              />
            </View>
            <TouchableOpacity
              accessibilityLabel="Reset my progress"
              style={styles.resetButton}
              onPress={() =>
                showAlert("Reset my progress?", `This deletes YOUR ${quest?.title || "quest"} progress only.`, [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Reset",
                    style: "destructive",
                    onPress: () => resetMyQuestProgress(questId).catch((e) => showAlert("Reset failed", e.message)),
                  },
                ])
              }
            >
              <Text style={styles.resetText}>🔄 Reset my progress</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.howCard}>
          <Text style={styles.howTitle}>{quest?.intro?.title || "How it works"}</Text>
          {(quest?.intro?.steps || HOW_IT_WORKS).map((item, idx) => (
            <View key={item.icon || idx} style={styles.howRow}>
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
      {/* No back button: Android back gesture/button, as in the Space quest. */}
      <View style={{ height: insets.top + 16 }} />

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
            <Text style={styles.startText}>{quest?.intro?.signInButton || "Sign in to play"}</Text>
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
            <Text style={styles.startText}>
              {hasStarted
                ? quest?.intro?.continueText || "Continue"
                : quest?.intro?.startText || "Start the Quest"}
            </Text>
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
  testerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  resetButton: { alignSelf: "flex-start", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: theme.warning || "#c86c62" },
  resetText: { fontSize: 14, fontFamily: "nunitoBold", color: theme.warning || "#c86c62" },
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

// screens/englishQuest/EnglishQuestMapScreen.js
// English Quest map (Spec v2, gemini.md): Space-quest style winding path that starts
// at the bottom, in the app theme. One main node per branch on the path (left half),
// with its side row (practice leaves → gate → keep practising) to the right.
// On open, the current node is scrolled to the lower-left (left-thumb zone).
// Unlock rules live in utils/questTree.js.

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Svg, Path, Circle } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../../context/ThemeContext";
import { authInstance } from "../../config/firebaseConfig";
import { isTesterUser } from "../../config/appConfig";
import { useTesterMode } from "../../services/testerMode";
import { getQuest, getQuestNodes, prefetchUnit } from "../../services/contentCache";
import {
  listenToQuestProgress,
  markStudyNodeCompleted,
} from "../../services/englishQuestApi";
import {
  buildQuestPath,
  DEFAULT_PRACTICE_PASS_PERCENT,
  DEFAULT_GATE_PASS_PERCENT,
  DEFAULT_BOSS_PASS_PERCENT,
} from "../../utils/questTree";

// --- Layout (fixed row heights keep the path and auto-scroll predictable, like the Space quest) ---
const ROW_HEIGHT = 150;
const MAIN_SIZE = 72;
const BOSS_SIZE = 84;
const LEAF_SIZE = 46;
const PAD_TOP = 40;
const PAD_BOTTOM = 90;
const THUMB_ZONE = 0.7; // current node ends up ~70% down the visible map

// Difficulty colours (visual only, Spec v2)
const DIFFICULTY = { easy: "#58CC02", medium: "#FFB020", hard: "#FF4B4B" };
const STEP_ICONS = { study: "book", quiz: "create", reading: "document-text" };
// Locked/coming-soon circles use the theme's light grey background in BOTH themes,
// so their icons need a fixed dark grey to stay visible (theme.textSecondary is the same grey in dark mode).
const LOCKED_ICON = "#5A5A5A";

// Main nodes weave gently along the left half, so the right half is free for side rows.
const nodeX = (indexFromStart, width) => width * (indexFromStart % 2 === 0 ? 0.17 : 0.3);

const ProgressRing = ({ size, progress, color, track }) => {
  const stroke = 4;
  const r = size / 2 + 5;
  const c = 2 * Math.PI * r;
  const box = size + 14;
  return (
    <Svg width={box} height={box} style={StyleSheet.absoluteFill}>
      <Circle cx={box / 2} cy={box / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
      {progress > 0 ? (
        <Circle
          cx={box / 2}
          cy={box / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${c * progress} ${c}`}
          strokeLinecap="round"
          rotation="-90"
          origin={`${box / 2}, ${box / 2}`}
        />
      ) : null}
    </Svg>
  );
};

export default function EnglishQuestMapScreen({ route, navigation }) {
  const { questId, completedNodeId } = route.params || {};
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  // Tester mode (Spec A): only for tester accounts; view-only unlock + short quizzes.
  const testerSettings = useTesterMode();
  const isTester = isTesterUser(authInstance.currentUser);
  const unlockAll = isTester && testerSettings.unlockAll;
  const shortQuizzes = isTester && testerSettings.shortQuizzes;

  const [quest, setQuest] = useState(null);
  const [nodes, setNodes] = useState(null);
  const [progress, setProgress] = useState({});
  const [error, setError] = useState(null);
  const [viewportHeight, setViewportHeight] = useState(0);

  const scrollRef = useRef(null);
  const lastScrolledTo = useRef(null);
  const pendingScrollY = useRef(null); // re-applied when content size is known (slow devices)

  useEffect(() => {
    const onError = (e) => {
      console.error("EnglishQuestMap:", e);
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
    // Coming back to the map (e.g. after a quiz): re-check the quest doc for new known issues.
    const unsubFocus = navigation.addListener("focus", () => load(false));
    const unsubProgress = listenToQuestProgress(questId, setProgress, onError);
    return () => {
      alive = false;
      unsubFocus();
      unsubProgress();
    };
  }, [questId, navigation]);

  // A study page was finished: mark that step as completed.
  useEffect(() => {
    if (completedNodeId) {
      markStudyNodeCompleted(questId, completedNodeId).catch((e) =>
        console.error("markStudyNodeCompleted failed:", e)
      );
      navigation.setParams({ completedNodeId: undefined });
    }
  }, [completedNodeId, questId, navigation]);

  const tree = useMemo(
    () => (nodes ? buildQuestPath(nodes, progress, { unlockAll }) : null),
    [nodes, progress, unlockAll]
  );
  const count = tree?.path.length || 0;

  // Pre-download the current unit's quizzes and pages (instant + offline next steps).
  const currentUnitId = tree?.path.find((p) => p.id === tree.currentPathId)?.unitId;
  useEffect(() => {
    if (nodes && currentUnitId && quest?.contentVersion != null) {
      prefetchUnit(nodes, currentUnitId, quest.contentVersion);
    }
  }, [nodes, currentUnitId, quest?.contentVersion]);
  const contentHeight = PAD_TOP + count * ROW_HEIGHT + PAD_BOTTOM;

  // Row geometry: path[0] (the start) is the bottom row.
  const rowTop = (i) => PAD_TOP + (count - 1 - i) * ROW_HEIGHT;
  const centerOf = (i) => {
    const size = tree.path[i].kind === "boss" ? BOSS_SIZE : MAIN_SIZE;
    return { x: nodeX(i, width), y: rowTop(i) + size / 2 + 8 };
  };

  const pathD = useMemo(() => {
    if (!tree || count < 2) return "";
    const pts = tree.path.map((_, i) => centerOf(i));
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      d += ` C ${a.x} ${a.y - 60}, ${b.x} ${b.y + 60}, ${b.x} ${b.y}`;
    }
    return d;
  }, [tree, count, width]);

  // Auto-scroll: put the current node in the lower-left thumb zone (re-runs when the current node changes).
  useEffect(() => {
    if (!tree || !viewportHeight || !tree.currentPathId) return;
    if (lastScrolledTo.current === tree.currentPathId) return;
    const i = tree.path.findIndex((p) => p.id === tree.currentPathId);
    if (i < 0) return;
    const y = Math.max(0, centerOf(i).y - viewportHeight * THUMB_ZONE);
    lastScrolledTo.current = tree.currentPathId;
    pendingScrollY.current = y;
    setTimeout(() => scrollRef.current?.scrollTo({ y, animated: true }), 300);
  }, [tree, viewportHeight]);

  // Fallback (CODE_REVIEW Finding 14): if native layout finishes after the timer, scroll again.
  const onContentSizeChange = (_w, h) => {
    const y = pendingScrollY.current;
    if (typeof y !== "number" || h < y + viewportHeight * 0.5) return;
    pendingScrollY.current = null;
    scrollRef.current?.scrollTo({ y, animated: false });
  };

  // ---------- Opening activities ----------
  // 🚩 auto-marked questions (quest.knownIssues): "known" → 🔧, "hidden" → left out of quizzes.
  const knownIssues = quest?.knownIssues || {};
  const hiddenIds = Object.keys(knownIssues).filter((id) => knownIssues[id]?.status === "hidden");

  const openStep = (node, step, passPercent, extraContext = {}) => {
    const questContext = {
      questId,
      nodeId: step.id,
      passPercent,
      returnTo: "EnglishQuestMap",
      knownIssues,
      contentVersion: quest?.contentVersion ?? null, // lets quizzes/pages use the local cache
      ...extraContext,
    };
    if (step.type === "study") {
      navigation.navigate("Apprec8Reader", { contentId: step.contentId, questContext });
    } else if (step.type === "reading") {
      navigation.navigate("ReadingScreen", { contentId: step.contentId, questContext });
    } else if (step.type === "quiz") {
      openQuizDetails({ id: step.quizId, title: node.title }, questContext, passPercent);
    }
  };

  // Like the Space quest: Quiz Details lets the kid choose Training (hearts, instant feedback) or Exam.
  const openQuizDetails = ({ id, title, description, config = {} }, questContext, passPercent) => {
    navigation.navigate("QuizDetails", {
      quiz: {
        id,
        title,
        description:
          description ||
          `Score ${passPercent}% or more to complete this step. Choose Training to practise with hints, or Exam to test yourself.`,
        config: {
          shuffleQuestions: true,
          shuffleOptions: true,
          questionCount: 10,
          ...(shortQuizzes && !config.balanceBy ? { questionCount: 3 } : {}),
          ...config,
          excludeIds: hiddenIds,
          contentVersion: quest?.contentVersion ?? null, // cached questions (Step 3)
        },
      },
      questContext,
    });
  };

  const openTest = (node, passPercent) =>
    openQuizDetails(
      { id: node.quizId, title: node.title },
      { questId, nodeId: node.id, passPercent, returnTo: "EnglishQuestMap", knownIssues },
      passPercent
    );

  const explainClosed = (status, lockedText) => {
    if (status === "comingSoon") Alert.alert("Coming soon!", "This will be ready in a future update.");
    else Alert.alert("Locked", lockedText);
  };

  const onMainPress = (item) => {
    if (item.status === "locked" || item.status === "comingSoon") {
      return explainClosed(item.status, "Pass the challenge before this one to open it.");
    }
    if (item.nextStep) openStep(item, item.nextStep, DEFAULT_PRACTICE_PASS_PERCENT);
  };

  const onPracticePress = (leaf, main) => {
    if (leaf.status === "locked" || leaf.status === "comingSoon") {
      return explainClosed(leaf.status, `Finish "${main.title}" first to open its practice.`);
    }
    if (leaf.nextStep) {
      openStep(
        leaf,
        leaf.nextStep,
        leaf.passPercent ?? DEFAULT_PRACTICE_PASS_PERCENT,
        leaf.glow && main.gate ? { resetGateId: main.gate.id } : {}
      );
    }
  };

  const onGatePress = (gate, main) => {
    if (gate.status === "locked" || gate.status === "comingSoon") {
      return explainClosed(gate.status, `Finish "${main.title}" first to open its challenge.`);
    }
    if (gate.retryLocked) {
      Alert.alert(
        "Practise first",
        "You've tried this challenge twice. Practise one of the glowing topics, then you can try again. You can do it!"
      );
      return;
    }
    const passPercent = gate.passPercent ?? DEFAULT_GATE_PASS_PERCENT;
    const index = tree.path.findIndex((p) => p.id === main.id);
    const next = tree.path.slice(index + 1).find((p) => p.kind === "main" || p.kind === "boss");
    openQuizDetails(
      {
        id: gate.quizId,
        title: gate.title || "Challenge",
        description: `Score ${passPercent}% or more, with at least one right answer in every topic, to open the next step. Every try has new questions.`,
        config: shortQuizzes
          ? // Tester: one question per sub-topic (max 4), still balanced.
            { balanceBy: "subtopic", minPerGroup: 1, questionCount: Math.min(4, Object.keys(gate.subtopicTitles || {}).length || 3) }
          : { balanceBy: "subtopic", minPerGroup: 2, questionCount: gate.drawCount || 10 },
      },
      {
        questId,
        nodeId: gate.id,
        passPercent,
        returnTo: "EnglishQuestMap",
        knownIssues,
        gate: true,
        nextTitle: next?.title || null,
        failsSoFar: gate.failsSinceLastPractice || 0,
        subtopicTitles: gate.subtopicTitles || {},
      },
      passPercent
    );
  };

  const onBossPress = (bossItem) => {
    if (bossItem.status === "locked" || bossItem.status === "comingSoon") {
      return explainClosed(bossItem.status, "Clear every topic in this unit to face the Unit Boss.");
    }
    openTest(bossItem, bossItem.passPercent ?? DEFAULT_BOSS_PASS_PERCENT);
  };

  const onEndlessPress = (e) =>
    explainClosed(e.status === "locked" ? "locked" : "comingSoon", "Finish the main step first.");

  // ---------- Rendering ----------
  const circleColors = (status, { mastered } = {}) => {
    if (mastered) return { bg: theme.gold, icon: "#3b0940", border: theme.gold };
    switch (status) {
      case "completed":
        return { bg: theme.success, icon: "#FFFFFF", border: theme.success };
      case "unlocked":
        return { bg: theme.primary, icon: theme.textOnPrimary || "#FFFFFF", border: theme.primary };
      default:
        return { bg: theme.disabledBackground, icon: LOCKED_ICON, border: theme.border };
    }
  };

  const renderSideRow = (item) => {
    const leaves = [];
    item.practices.forEach((p) => {
      const open = p.status === "unlocked" || p.status === "completed";
      const diff = DIFFICULTY[p.difficulty] || DIFFICULTY.easy;
      const icon =
        p.status === "completed" ? "checkmark" : p.status === "locked" ? "lock-closed" : p.status === "comingSoon" ? "hourglass-outline" : STEP_ICONS[p.nextStep?.type] || "create";
      leaves.push(
        <TouchableOpacity key={p.id} style={styles.leafWrap} onPress={() => onPracticePress(p, item)} activeOpacity={0.8}>
          <View
            style={[
              styles.leaf,
              {
                backgroundColor: p.status === "completed" ? diff : open ? theme.cardBackground : theme.disabledBackground,
                borderColor: open ? diff : theme.border,
              },
              p.glow && [styles.leafGlow, { borderColor: theme.gold, shadowColor: theme.gold }],
            ]}
          >
            <Ionicons name={icon} size={20} color={p.status === "completed" ? "#FFFFFF" : open ? diff : LOCKED_ICON} />
          </View>
          <View style={styles.starsRow}>
            {p.status === "completed"
              ? [1, 2, 3].map((s) => (
                  <Ionicons key={s} name={s <= p.stars ? "star" : "star-outline"} size={9} color={theme.gold} />
                ))
              : null}
          </View>
          <Text style={[styles.leafLabel, p.glow && styles.glowLabel]} numberOfLines={2}>
            {p.glow ? `✨ ${p.title}` : p.title}
          </Text>
        </TouchableOpacity>
      );
    });
    if (item.gate) {
      const g = item.gate;
      const c = circleColors(g.status);
      leaves.push(
        <TouchableOpacity key={g.id} style={styles.leafWrap} onPress={() => onGatePress(g, item)} activeOpacity={0.8}>
          <View style={[styles.leaf, styles.gateLeaf, { backgroundColor: c.bg, borderColor: g.status === "unlocked" ? theme.accent : c.border }]}>
            <Ionicons name={g.status === "locked" || g.retryLocked ? "lock-closed" : "shield-checkmark"} size={22} color={c.icon} />
          </View>
          <View style={styles.starsRow} />
          <Text style={[styles.leafLabel, styles.gateLabel]} numberOfLines={2}>
            {g.retryLocked ? "Practise first" : g.title || "Challenge"}
          </Text>
        </TouchableOpacity>
      );
    }
    if (item.endless) {
      const e = item.endless;
      leaves.push(
        <TouchableOpacity key={e.id} style={styles.leafWrap} onPress={() => onEndlessPress(e)} activeOpacity={0.8}>
          <View style={[styles.leaf, { backgroundColor: theme.disabledBackground, borderColor: theme.border }]}>
            <Ionicons name={e.status === "comingSoon" ? "hourglass-outline" : "infinite"} size={22} color={LOCKED_ICON} />
          </View>
          <View style={styles.starsRow} />
          <Text style={styles.leafLabel} numberOfLines={2}>
            {e.title}
          </Text>
        </TouchableOpacity>
      );
    }
    if (leaves.length === 0) return null;
    return (
      <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sideRowContent}>
        {leaves}
      </ScrollView>
    );
  };

  const renderRow = (item, i) => {
    const isBoss = item.kind === "boss";
    const size = isBoss ? BOSS_SIZE : MAIN_SIZE;
    const { x } = centerOf(i);
    const isCurrent = item.id === tree.currentPathId;
    const c = circleColors(item.status, { mastered: item.mastered || (isBoss && item.status === "completed") });

    let icon;
    if (item.status === "locked") icon = <Ionicons name="lock-closed" size={30} color={c.icon} />;
    else if (item.status === "comingSoon" || item.kind === "comingSoon") icon = <Ionicons name="hourglass-outline" size={30} color={c.icon} />;
    else if (isBoss) icon = <Ionicons name="trophy" size={38} color={c.icon} />;
    else if (item.mastered) icon = <MaterialCommunityIcons name="crown" size={34} color={c.icon} />;
    else if (item.status === "completed") icon = <Ionicons name="checkmark-sharp" size={34} color={c.icon} />;
    else icon = <Ionicons name={STEP_ICONS[item.nextStep?.type] || "school"} size={30} color={c.icon} />;

    const practiceProgress = item.kind === "main" && item.practices.length ? item.practiceDone / item.practices.length : 0;
    const sideLeft = x + size / 2 + 16;

    return (
      <View key={item.id} style={[styles.row, { top: rowTop(i) }]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => (isBoss ? onBossPress(item) : item.kind === "main" ? onMainPress(item) : explainClosed("comingSoon"))}
          style={[styles.nodeHit, { left: x - size / 2 - 7, width: size + 14, height: size + 14 }]}
        >
          {item.kind === "main" && item.practices.length ? (
            <ProgressRing size={size} progress={practiceProgress} color={theme.gold} track={theme.border} />
          ) : null}
          <View
            style={[
              styles.node,
              { width: size, height: size, borderRadius: size / 2, backgroundColor: c.bg, borderColor: isCurrent ? theme.gold : c.border },
              isCurrent && styles.currentNode,
            ]}
          >
            {icon}
          </View>
        </TouchableOpacity>
        <Text style={[styles.nodeTitle, { left: Math.max(4, x - 52), top: size + 18 }]} numberOfLines={2}>
          {item.kind === "comingSoon" ? `Coming soon: ${item.title}` : item.title}
        </Text>
        {item.kind === "main" && item.status === "unlocked" && item.steps.length > 1 ? (
          <Text style={[styles.stepBadge, { left: x - 20, top: size + 52 }]}>
            {item.doneCount}/{item.steps.length}
          </Text>
        ) : null}
        {item.kind === "main" ? (
          <View style={[styles.sideRow, { left: sideLeft, top: size / 2 + 8 - LEAF_SIZE / 2 - 4 }]}>{renderSideRow(item)}</View>
        ) : null}
      </View>
    );
  };

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        {/* No back button: Android back gesture/button, as in the Space quest. */}
        <Text style={styles.headerTitle} numberOfLines={1}>
          {quest?.title || "Quest"}
        </Text>
        {tree ? (
          <View style={styles.headerStats}>
            <Ionicons name="trophy" size={16} color={theme.gold} />
            <Text style={styles.headerStatsText}>
              {tree.stats.unitsDone}/{tree.stats.unitsTotal}
            </Text>
          </View>
        ) : null}
      </View>

      {isTester && (unlockAll || shortQuizzes) ? (
        <Text style={styles.testerBanner}>
          🧪 Tester mode{unlockAll ? " · everything unlocked (view only)" : ""}{shortQuizzes ? " · short quizzes" : ""}
        </Text>
      ) : null}

      {error ? (
        <Text style={styles.message}>{error}</Text>
      ) : !tree ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 60 }} />
      ) : count === 0 ? (
        <Text style={styles.message}>This quest has no steps yet.</Text>
      ) : (
        <ScrollView
          ref={scrollRef}
          onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}
          onContentSizeChange={onContentSizeChange}
          contentContainerStyle={{ height: contentHeight + insets.bottom }}
        >
          <Svg height={contentHeight} width={width} style={StyleSheet.absoluteFill}>
            <Path d={pathD} stroke={theme.border} strokeWidth={5} strokeDasharray="10" fill="transparent" />
          </Svg>
          {tree.path.map((item, i) => renderRow(item, i))}
          <View style={[styles.startRow, { top: contentHeight - PAD_BOTTOM + 30, left: nodeX(0, width) - 30 }]}>
            <Ionicons name="flag" size={18} color={theme.primary} />
            <Text style={styles.startText}>Start</Text>
          </View>
        </ScrollView>
      )}
    </LinearGradient>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 10 },
    headerTitle: { flex: 1, fontSize: 22, fontFamily: "nunitoBold", color: theme.textPrimaryOnGradient },
    headerStats: { flexDirection: "row", alignItems: "center", gap: 4 },
    headerStatsText: { fontSize: 15, fontFamily: "nunitoBold", color: theme.textPrimaryOnGradient },
    message: { fontSize: 16, fontFamily: "nunito", color: theme.textPrimaryOnGradient, textAlign: "center", marginTop: 60, paddingHorizontal: 24 },

    row: { position: "absolute", left: 0, right: 0, height: ROW_HEIGHT },
    nodeHit: { position: "absolute", top: 1, alignItems: "center", justifyContent: "center" },
    node: { alignItems: "center", justifyContent: "center", borderWidth: 4, elevation: 5 },
    currentNode: { borderWidth: 5, transform: [{ scale: 1.08 }] },
    nodeTitle: {
      position: "absolute",
      width: 104,
      textAlign: "center",
      fontSize: 14,
      fontFamily: "nunitoBold",
      color: theme.textPrimaryOnGradient,
    },
    stepBadge: {
      position: "absolute",
      width: 40,
      textAlign: "center",
      fontSize: 12,
      fontFamily: "nunitoBold",
      color: theme.textSecondaryOnGradient,
    },

    sideRow: { position: "absolute", right: 0 },
    sideRowContent: { paddingRight: 16, alignItems: "flex-start" },
    leafWrap: { width: 66, alignItems: "center" },
    leaf: {
      width: LEAF_SIZE,
      height: LEAF_SIZE,
      borderRadius: LEAF_SIZE / 2,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 3,
      elevation: 2,
    },
    gateLeaf: { borderRadius: 12 },
    leafGlow: { borderWidth: 4, elevation: 8, shadowOpacity: 0.9, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
    glowLabel: { fontFamily: "nunitoBold", color: theme.gold },
    starsRow: { flexDirection: "row", height: 11, marginTop: 2 },
    leafLabel: { fontSize: 10, fontFamily: "nunito", color: theme.textPrimaryOnGradient, textAlign: "center" },
    gateLabel: { fontFamily: "nunitoBold" },

    startRow: { position: "absolute", flexDirection: "row", alignItems: "center", gap: 6 },
    testerBanner: {
      marginHorizontal: 16,
      marginBottom: 6,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 10,
      overflow: "hidden",
      fontSize: 12,
      fontFamily: "nunitoBold",
      color: "#000000",
      backgroundColor: theme.gold,
    },
    startText: { fontSize: 14, fontFamily: "nunitoBold", color: theme.primary },
  });

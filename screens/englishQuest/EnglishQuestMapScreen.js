// screens/englishQuest/EnglishQuestMapScreen.js
// The quest tree. The trunk grows upwards: the first unit is at the bottom.
// Each unit = one trunk node (the unit test) + horizontal, swipeable branch rows.
// Leaves further out in a branch are harder. Unlock rules live in utils/questTree.js.

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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  listenToQuest,
  listenToQuestTreeNodes,
  listenToQuestProgress,
  markStudyNodeCompleted,
} from "../../services/englishQuestApi";
import {
  buildQuestTree,
  DEFAULT_LEAF_PASS_PERCENT,
  DEFAULT_UNIT_PASS_PERCENT,
} from "../../utils/questTree";
import { QUEST_COLORS } from "./questColors";

const LEAF_ICONS = { study: "book", quiz: "create", reading: "document-text" };

const Stars = ({ count }) => (
  <View style={styles.starsRow}>
    {[1, 2, 3].map((i) => (
      <Ionicons
        key={i}
        name={i <= count ? "star" : "star-outline"}
        size={11}
        color={i <= count ? QUEST_COLORS.gold : "rgba(255,255,255,0.35)"}
      />
    ))}
  </View>
);

const LeafNode = ({ leaf, onPress }) => {
  const { status } = leaf;
  const isOpen = status === "unlocked" || status === "completed";
  let icon = LEAF_ICONS[leaf.type] || "help";
  if (status === "locked") icon = "lock-closed";
  if (status === "comingSoon") icon = "hourglass-outline";

  const circleStyle = [
    styles.leafCircle,
    status === "completed" && styles.leafCompleted,
    status === "unlocked" && styles.leafUnlocked,
    (status === "locked" || status === "comingSoon") && styles.leafLocked,
  ];

  return (
    <TouchableOpacity style={styles.leafWrap} onPress={() => onPress(leaf)} activeOpacity={0.8}>
      <View style={circleStyle}>
        <Ionicons name={icon} size={24} color={isOpen ? "#0B3D2E" : "#E6ECE9"} />
      </View>
      {(leaf.type === "quiz" || leaf.type === "reading") && status === "completed" ? <Stars count={leaf.stars} /> : <View style={{ height: 13 }} />}
      <Text style={[styles.leafTitle, !isOpen && styles.dimText]} numberOfLines={2}>
        {leaf.title}
      </Text>
    </TouchableOpacity>
  );
};

const BranchRow = ({ branch, onLeafPress }) => (
  <View style={styles.branch}>
    <View style={styles.branchHeader}>
      <Ionicons name="leaf" size={14} color={QUEST_COLORS.branch} />
      <Text style={styles.branchTitle}>{branch.title}</Text>
      <Text style={styles.branchCount}>
        {branch.completedCount}/{branch.leaves.length}
      </Text>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.branchScroll}>
      {branch.leaves.map((leaf, i) => (
        <View key={leaf.id} style={styles.leafSlot}>
          {i > 0 ? <View style={styles.branchLine} /> : null}
          <LeafNode leaf={leaf} onPress={onLeafPress} />
        </View>
      ))}
    </ScrollView>
  </View>
);

const UnitBlock = ({ unit, index, onUnitPress, onLeafPress, onLayout }) => {
  const { status } = unit;
  let icon = "trophy";
  if (status === "locked") icon = "lock-closed";
  if (status === "comingSoon") icon = "hourglass-outline";
  if (status === "completed") icon = "checkmark";

  return (
    <View onLayout={onLayout}>
      {/* Trunk node = unit test (at the top of its unit, because the tree grows upward) */}
      <View style={styles.trunkNodeRow}>
        <TouchableOpacity onPress={() => onUnitPress(unit)} activeOpacity={0.8} style={{ alignItems: "center" }}>
          <View
            style={[
              styles.trunkCircle,
              status === "unlocked" && styles.trunkUnlocked,
              status === "completed" && styles.trunkCompleted,
              (status === "locked" || status === "comingSoon") && styles.trunkLocked,
            ]}
          >
            <Ionicons name={icon} size={34} color={status === "locked" || status === "comingSoon" ? "#E6ECE9" : "#0B3D2E"} />
          </View>
          <Text style={styles.unitLabel}>
            {status === "comingSoon" ? "Coming soon" : `Unit ${index} test`}
          </Text>
          <Text style={styles.unitTitle}>{unit.title}</Text>
          {typeof unit.bestPercent === "number" ? (
            <Text style={styles.unitScore}>Best: {unit.bestPercent}%</Text>
          ) : null}
        </TouchableOpacity>
      </View>

      {unit.branches.length > 0 ? (
        <View style={[styles.branchesCard, status === "locked" && { opacity: 0.6 }]}>
          {unit.branches.map((b) => (
            <BranchRow key={b.branchId} branch={b} onLeafPress={onLeafPress} />
          ))}
        </View>
      ) : null}

      {/* Trunk segment down to the previous unit */}
      {index > 0 ? <View style={styles.trunkSegment} /> : null}
    </View>
  );
};

export default function EnglishQuestMapScreen({ route, navigation }) {
  const { questId, completedNodeId } = route.params || {};
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  const [quest, setQuest] = useState(null);
  const [nodes, setNodes] = useState(null);
  const [progress, setProgress] = useState({});
  const [error, setError] = useState(null);

  const scrollRef = useRef(null);
  const unitY = useRef({});
  const hasAutoScrolled = useRef(false);

  useEffect(() => {
    const onError = (e) => {
      console.error("EnglishQuestMap:", e);
      setError("Could not load the quest. Please check your internet and try again.");
    };
    const unsubs = [
      listenToQuest(questId, setQuest, onError),
      listenToQuestTreeNodes(questId, setNodes, onError),
      listenToQuestProgress(questId, setProgress, onError),
    ];
    return () => unsubs.forEach((u) => u());
  }, [questId]);

  // A study page was finished: mark it as completed.
  useEffect(() => {
    if (completedNodeId) {
      markStudyNodeCompleted(questId, completedNodeId).catch((e) =>
        console.error("markStudyNodeCompleted failed:", e)
      );
      navigation.setParams({ completedNodeId: undefined });
    }
  }, [completedNodeId, questId, navigation]);

  const tree = useMemo(() => (nodes ? buildQuestTree(nodes, progress) : null), [nodes, progress]);
  // Show the last unit at the top, the first unit at the bottom.
  const unitsTopDown = useMemo(() => (tree ? [...tree.units].reverse() : []), [tree]);

  // Scroll once so the current unit sits in the lower part of the screen (thumb zone).
  const tryAutoScroll = () => {
    if (hasAutoScrolled.current || !tree?.currentUnitId) return;
    const y = unitY.current[tree.currentUnitId];
    if (typeof y !== "number") return;
    hasAutoScrolled.current = true;
    scrollRef.current?.scrollTo({ y: Math.max(0, y - screenHeight * 0.3), animated: false });
  };

  const openQuiz = (node, { quizId, mode, passPercent }) => {
    navigation.navigate("QuizScreenV2", {
      quiz: {
        id: quizId,
        title: node.title,
        config: { shuffleQuestions: true, shuffleOptions: true, questionCount: 10, maxLives: 5 },
      },
      mode,
      isFirstAttempt: false,
      questContext: { questId, nodeId: node.id, passPercent, returnTo: "EnglishQuestMap" },
    });
  };

  const onLeafPress = (leaf) => {
    if (leaf.status === "locked") {
      Alert.alert("Locked", "Finish the step before this one to open it.");
      return;
    }
    if (leaf.status === "comingSoon") {
      Alert.alert("Coming soon!", "This activity will be ready in a future update.");
      return;
    }
    if (leaf.type === "study") {
      navigation.navigate("Apprec8Reader", {
        contentId: leaf.contentId,
        questContext: { questId, nodeId: leaf.id, returnTo: "EnglishQuestMap" },
      });
    } else if (leaf.type === "reading") {
      navigation.navigate("ReadingScreen", {
        contentId: leaf.contentId,
        questContext: {
          questId,
          nodeId: leaf.id,
          passPercent: leaf.passPercent ?? DEFAULT_LEAF_PASS_PERCENT,
          returnTo: "EnglishQuestMap",
        },
      });
    } else if (leaf.type === "quiz") {
      openQuiz(leaf, {
        quizId: leaf.quizId,
        mode: "training",
        passPercent: leaf.passPercent ?? DEFAULT_LEAF_PASS_PERCENT,
      });
    }
  };

  const onUnitPress = (unit) => {
    if (unit.status === "comingSoon") {
      Alert.alert("Coming soon!", "New units are being added. Check back soon!");
      return;
    }
    if (unit.status === "locked") {
      Alert.alert("Locked", "Pass the unit test below to open this unit.");
      return;
    }
    const passPercent = unit.passPercent ?? DEFAULT_UNIT_PASS_PERCENT;
    Alert.alert(
      `${unit.title}: Unit test`,
      `Score ${passPercent}% or more to open the next unit. You can practise in the branches first.`,
      [
        { text: "Not yet", style: "cancel" },
        { text: "Start test", onPress: () => openQuiz(unit, { quizId: unit.quizId, mode: "exam", passPercent }) },
      ]
    );
  };

  return (
    <LinearGradient colors={QUEST_COLORS.background} style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="arrow-back" size={26} color={QUEST_COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {quest?.title || "Quest"}
        </Text>
        {tree ? (
          <Text style={styles.headerStats}>
            {tree.stats.unitsDone}/{tree.stats.unitsTotal}
          </Text>
        ) : null}
      </View>

      {error ? (
        <Text style={styles.message}>{error}</Text>
      ) : !tree ? (
        <ActivityIndicator size="large" color={QUEST_COLORS.text} style={{ marginTop: 60 }} />
      ) : tree.units.length === 0 ? (
        <Text style={styles.message}>This quest has no units yet.</Text>
      ) : (
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
          onContentSizeChange={tryAutoScroll}
        >
          {unitsTopDown.map((unit) => {
            const index = tree.units.findIndex((u) => u.id === unit.id);
            return (
              <UnitBlock
                key={unit.id}
                unit={unit}
                index={index}
                onUnitPress={onUnitPress}
                onLeafPress={onLeafPress}
                onLayout={(e) => {
                  unitY.current[unit.id] = e.nativeEvent.layout.y;
                  tryAutoScroll();
                }}
              />
            );
          })}
          <View style={styles.rootRow}>
            <Ionicons name="flag" size={22} color={QUEST_COLORS.gold} />
            <Text style={styles.rootText}>Start here</Text>
          </View>
        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 12,
  },
  headerTitle: { flex: 1, fontSize: 22, fontFamily: "nunitoBold", color: QUEST_COLORS.text },
  headerStats: { fontSize: 15, fontFamily: "nunitoBold", color: QUEST_COLORS.gold },
  message: { fontSize: 16, fontFamily: "nunito", color: QUEST_COLORS.text, textAlign: "center", marginTop: 60, paddingHorizontal: 24 },
  scroll: { paddingTop: 10 },

  trunkNodeRow: { alignItems: "center", paddingTop: 8, paddingBottom: 10 },
  trunkCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5,
    borderColor: QUEST_COLORS.trunk,
  },
  trunkUnlocked: { backgroundColor: QUEST_COLORS.gold },
  trunkCompleted: { backgroundColor: QUEST_COLORS.green },
  trunkLocked: { backgroundColor: QUEST_COLORS.locked },
  unitLabel: { marginTop: 6, fontSize: 12, fontFamily: "nunitoBold", color: QUEST_COLORS.gold, textTransform: "uppercase" },
  unitTitle: { fontSize: 18, fontFamily: "nunitoBold", color: QUEST_COLORS.text },
  unitScore: { fontSize: 13, fontFamily: "nunito", color: QUEST_COLORS.textSoft },
  trunkSegment: { alignSelf: "center", width: 10, height: 36, backgroundColor: QUEST_COLORS.trunk, borderRadius: 5 },

  branchesCard: {
    marginHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: QUEST_COLORS.card,
  },
  branch: { paddingVertical: 6 },
  branchHeader: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14 },
  branchTitle: { flex: 1, fontSize: 15, fontFamily: "nunitoBold", color: QUEST_COLORS.text },
  branchCount: { fontSize: 13, fontFamily: "nunito", color: QUEST_COLORS.textSoft },
  branchScroll: { paddingHorizontal: 10, paddingTop: 8, alignItems: "flex-start" },
  leafSlot: { flexDirection: "row", alignItems: "flex-start" },
  branchLine: { width: 18, height: 4, marginTop: 26, backgroundColor: QUEST_COLORS.branch, borderRadius: 2 },
  leafWrap: { width: 76, alignItems: "center" },
  leafCircle: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "rgba(255,255,255,0.4)" },
  leafUnlocked: { backgroundColor: QUEST_COLORS.gold, borderColor: "#FFFFFF" },
  leafCompleted: { backgroundColor: QUEST_COLORS.green, borderColor: QUEST_COLORS.gold },
  leafLocked: { backgroundColor: QUEST_COLORS.locked },
  starsRow: { flexDirection: "row", marginTop: 2, height: 13 },
  leafTitle: { marginTop: 2, fontSize: 11, fontFamily: "nunito", color: QUEST_COLORS.text, textAlign: "center" },
  dimText: { color: "rgba(255,255,255,0.55)" },

  rootRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 16 },
  rootText: { fontSize: 15, fontFamily: "nunitoBold", color: QUEST_COLORS.gold },
});

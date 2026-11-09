// screens/admin/AdminDashboardScreen.js
// Admin dashboard v0 (admin account only): Kids tab + Reported tab. Mockup approved 2026-10-31.
// Reads once on open / pull-to-refresh (no live listeners). No header back button (Android back).

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../../context/ThemeContext";
import { listKidProgress, listQuestionIssues } from "../../services/adminApi";
import { getQuest, getQuestNodes } from "../../services/contentCache";
import { buildQuestPath } from "../../utils/questTree";
import { summarize, accuracy, weakTopics, activeIn, timeAgo, formatDuration } from "../../utils/kidStats";

import { QUESTS } from "../../data/quests";

const DEFAULT_QUEST_ID = "english-quest";
const RANGES = [
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "all", label: "All" },
];
const REASON_LABELS = {
  wrong_answer: "Wrong answer",
  spelling: "Spelling",
  confusing: "Confusing",
  media_broken: "Image/audio",
  other: "Other",
  messy: "Looks messy",
  too_long: "Too long",
  too_easy: "Too easy",
  too_hard: "Too hard",
};
const nice = (s) => String(s || "").replace(/-/g, " ");

/** Current unit + topics cleared for one kid, from the quest nodes + their progress. */
function unitProgress(nodes, progressNodes) {
  if (!nodes?.length) return null;
  const tree = buildQuestPath(nodes, progressNodes || {});
  const current = tree.path.find((p) => p.id === tree.currentPathId);
  const unitId = current?.unitId;
  const unit = nodes.find((n) => n.kind === "unit" && n.id === unitId);
  const mains = tree.path.filter((p) => p.kind === "main" && p.unitId === unitId);
  return {
    unitTitle: unit?.title || "",
    unitIndex: (unit?.unitOrder ?? 0),
    cleared: mains.filter((m) => m.cleared).length,
    total: mains.length,
  };
}

// embedded: shown inside the Progress tab (admin "Kids" view): no own title/background, tab bar visible.
export default function AdminDashboardScreen({ navigation, embedded = false, header: outerHeader = null }) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme, insets, embedded), [theme, insets, embedded]);

  const [questId, setQuestId] = useState(DEFAULT_QUEST_ID); // which tile quest (English, Science, ...)
  const [tab, setTab] = useState("kids");
  const [range, setRange] = useState("today");
  const [kids, setKids] = useState(null);
  const [issues, setIssues] = useState([]);
  const [nodes, setNodes] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [k, i, q] = await Promise.all([listKidProgress(questId), listQuestionIssues(), getQuest(questId)]);
      setKids(k);
      setIssues(i);
      setNodes(q ? await getQuestNodes(questId, q.contentVersion) : []);
    } catch (e) {
      console.error("AdminDashboard load failed:", e);
      setError(
        e?.code === "firestore/permission-denied"
          ? "No permission. The admin rules (DR-5) may not be deployed yet."
          : "Could not load the dashboard. Pull down to try again."
      );
      setKids((k) => k || []);
    }
  }, [questId]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  // ---- Kids tab data
  const kidRows = useMemo(() => {
    if (!kids) return [];
    const now = Date.now();
    return kids
      .filter((k) => activeIn(k.stats, range, now))
      .map((k) => {
        const sum = summarize(k.stats, range, now);
        return {
          ...k,
          name: k.stats?.userName || `Kid ${String(k.uid).slice(0, 5)}`,
          sum,
          acc: accuracy(sum),
          weak: weakTopics(k.stats)[0] || null,
          mistakeCount: Object.keys(k.mistakes || {}).length,
          unit: unitProgress(nodes, k.nodes),
        };
      })
      .sort((a, b) => (b.stats?.lastActiveAt || 0) - (a.stats?.lastActiveAt || 0));
  }, [kids, range, nodes]);

  const totals = useMemo(() => {
    const t = kidRows.reduce(
      (acc, k) => ({ answered: acc.answered + k.sum.answered, correct: acc.correct + k.sum.correct, timeMs: acc.timeMs + k.sum.timeMs }),
      { answered: 0, correct: 0, timeMs: 0 }
    );
    return { ...t, active: kidRows.length, acc: accuracy(t) };
  }, [kidRows]);

  // ---- Reported tab data: "needs you" first, then most-reported
  const issueRows = useMemo(
    () =>
      [...issues].sort(
        (a, b) => (b.needsAdmin ? 1 : 0) - (a.needsAdmin ? 1 : 0) || (b.counts?.distinct || 0) - (a.counts?.distinct || 0)
      ),
    [issues]
  );

  const renderKid = ({ item: k }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      accessibilityLabel={`Kid: ${k.name}`}
      onPress={() => navigation.navigate("AdminKidDetail", { kid: k, nodes })}
    >
      <View style={styles.rowBetween}>
        <Text style={styles.kidName} numberOfLines={1}>
          {k.name}
        </Text>
        <Text style={styles.muted}>{timeAgo(k.stats?.lastActiveAt)}</Text>
      </View>
      <Text style={styles.line}>
        {k.unit ? `Unit ${k.unit.unitIndex} · ${k.unit.cleared}/${k.unit.total} topics` : "—"}
        {"  ·  "}
        {k.acc === null ? "no answers" : `${k.acc}%`}
        {"  ·  "}
        {formatDuration(k.sum.timeMs)}
      </Text>
      {k.weak || k.mistakeCount ? (
        <View style={styles.chips}>
          {k.weak ? <Text style={[styles.chip, styles.weakChip]}>⚠️ {nice(k.weak.subtopic)}</Text> : null}
          {k.mistakeCount ? <Text style={styles.chip}>🔧 {k.mistakeCount} mistakes</Text> : null}
        </View>
      ) : null}
    </TouchableOpacity>
  );

  const renderIssue = ({ item: i }) => (
    <View style={[styles.card, i.needsAdmin && styles.needsCard]}>
      <Text style={styles.issueText} numberOfLines={3}>
        {i.questionText || i.questionId}
      </Text>
      <Text style={styles.line}>
        {Object.entries(i.counts?.byReason || {})
          .map(([r, n]) => `${REASON_LABELS[r] || r} × ${n}`)
          .join(" · ")}
      </Text>
      <Text style={styles.muted}>
        {i.status === "hidden" ? "🙈 hidden from quizzes" : i.status === "known" ? "🔧 known" : "new"}
        {i.needsAdmin ? " · ⚠️ needs you (can't hide: pool too small)" : ""}
        {"  ·  "}
        {i.counts?.distinct || 0} kids · {i.quizId || ""}
      </Text>
    </View>
  );

  const header = (
    <View>
      {outerHeader}
      {embedded ? null : <Text style={styles.title}>Dashboard</Text>}
      <View style={styles.tabs}>
        {QUESTS.map((m) => (
          <TouchableOpacity
            key={m.QUEST_ID}
            onPress={() => {
              if (m.QUEST_ID === questId) return;
              setKids(null);
              setQuestId(m.QUEST_ID);
            }}
            style={[styles.filter, questId === m.QUEST_ID && styles.filterActive]}
          >
            <Text style={[styles.filterText, questId === m.QUEST_ID && styles.tabTextActive]}>
              {m.quest.title.replace(/ Quest$/, "")}
              {m.quest.draft ? " (draft)" : ""}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.tabs}>
        {[
          ["kids", "Kids"],
          ["reported", `Reported 🚩 ${issues.length}`],
        ].map(([id, label]) => (
          <TouchableOpacity key={id} onPress={() => setTab(id)} style={[styles.tab, tab === id && styles.tabActive]}>
            <Text style={[styles.tabText, tab === id && styles.tabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {tab === "kids" ? (
        <>
          <Text style={styles.summary}>
            {totals.active} active · {totals.answered} answers · accuracy {totals.acc === null ? "—" : `${totals.acc}%`} ·{" "}
            {formatDuration(totals.timeMs)}
          </Text>
          <View style={styles.tabs}>
            {RANGES.map((r) => (
              <TouchableOpacity key={r.id} onPress={() => setRange(r.id)} style={[styles.filter, range === r.id && styles.filterActive]}>
                <Text style={[styles.filterText, range === r.id && styles.tabTextActive]}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );

  const Wrapper = embedded ? View : LinearGradient;
  const wrapperProps = embedded ? {} : { colors: [theme.gradientStart, theme.gradientEnd] };
  return (
    <Wrapper {...wrapperProps} style={styles.container}>
      {!kids ? (
        <View style={styles.list}>
          {outerHeader}
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 60 }} />
        </View>
      ) : (
        <FlatList
          data={tab === "kids" ? kidRows : issueRows}
          keyExtractor={(item) => item.uid || item.id}
          renderItem={tab === "kids" ? renderKid : renderIssue}
          ListHeaderComponent={header}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {tab === "kids" ? "No kids active in this period yet." : "No reported questions. 🎉"}
            </Text>
          }
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </Wrapper>
  );
}

const makeStyles = (theme, insets, embedded = false) =>
  StyleSheet.create({
    container: { flex: 1 },
    list: embedded
      ? { paddingTop: insets.top + 14, paddingHorizontal: 18, paddingBottom: 24 }
      : { paddingTop: insets.top + 12, paddingHorizontal: 16, paddingBottom: insets.bottom + 24 },
    title: { fontSize: 26, fontFamily: "nunitoBold", color: theme.textPrimaryOnGradient, marginBottom: 10 },
    tabs: { flexDirection: "row", gap: 8, marginBottom: 10, flexWrap: "wrap" },
    tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: theme.cardBackground },
    tabActive: { backgroundColor: theme.primary },
    tabText: { fontSize: 15, fontFamily: "nunitoBold", color: theme.textPrimary },
    tabTextActive: { color: theme.textOnPrimary || "#FFFFFF" },
    filter: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: theme.border },
    filterActive: { backgroundColor: theme.primary, borderColor: theme.primary },
    filterText: { fontSize: 13, fontFamily: "nunitoBold", color: theme.textPrimaryOnGradient },
    summary: { fontSize: 14, fontFamily: "nunito", color: theme.textSecondaryOnGradient, marginBottom: 8 },
    card: { backgroundColor: theme.cardBackground, borderRadius: 16, padding: 14, marginBottom: 10, gap: 4 },
    needsCard: { borderWidth: 2, borderColor: theme.warning },
    rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
    kidName: { flex: 1, fontSize: 17, fontFamily: "nunitoBold", color: theme.textPrimary },
    line: { fontSize: 14, fontFamily: "nunito", color: theme.textPrimary },
    muted: { fontSize: 13, fontFamily: "nunito", color: theme.textSecondary },
    chips: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 2 },
    chip: { fontSize: 13, fontFamily: "nunitoBold", color: theme.textPrimary, backgroundColor: theme.background, borderRadius: 12, paddingVertical: 3, paddingHorizontal: 8, overflow: "hidden" },
    weakChip: { color: theme.warning },
    issueText: { fontSize: 15, fontFamily: "nunitoBold", color: theme.textPrimary },
    error: { fontSize: 14, fontFamily: "nunito", color: theme.warning, marginBottom: 8 },
    empty: { fontSize: 15, fontFamily: "nunito", color: theme.textSecondaryOnGradient, textAlign: "center", marginTop: 30 },
  });

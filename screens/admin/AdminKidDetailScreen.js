// screens/admin/AdminKidDetailScreen.js
// Admin dashboard v0: one kid. Summary comes from the dashboard (no extra read);
// recent attempts are read once (20 docs). No header back button (Android back).

import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../../context/ThemeContext";
import { listKidAttempts } from "../../services/adminApi";
import { buildQuestPath } from "../../utils/questTree";
import { summarize, accuracy, timeAgo, formatDuration } from "../../utils/kidStats";

const MODE_LABELS = {
  training: "Practice",
  exam: "Exam",
  reading: "Reading",
  endless: "Keep practising",
  mistakes: "My mistakes",
};
const nice = (s) => String(s || "").replace(/-/g, " ");

export default function AdminKidDetailScreen({ route }) {
  const { kid, nodes = [] } = route.params || {};
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme, insets), [theme, insets]);

  const [attempts, setAttempts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    listKidAttempts(kid.uid, 20)
      .then(setAttempts)
      .catch((e) => {
        console.error("listKidAttempts failed:", e);
        setError(
          e?.code === "firestore/failed-precondition"
            ? "Recent activity needs a database index (DR-5)."
            : "Could not load recent activity."
        );
        setAttempts([]);
      });
  }, [kid.uid]);

  const stats = kid.stats || {};
  const week = summarize(stats, "week");
  const topics = Object.entries(stats.bySubtopic || {})
    .map(([subtopic, v]) => ({ subtopic, ...v, percent: Math.round((v.correct / v.total) * 100) }))
    .sort((a, b) => a.percent - b.percent);

  // Topic names come from the gate's subtopicTitles when available.
  const subtopicTitles = Object.assign({}, ...nodes.filter((n) => n.kind === "gate").map((g) => g.subtopicTitles || {}));
  const topicName = (id) => subtopicTitles[id] || nice(id);

  const tree = nodes.length ? buildQuestPath(nodes, kid.nodes || {}) : null;
  const current = tree?.path.find((p) => p.id === tree.currentPathId);
  const unit = nodes.find((n) => n.kind === "unit" && n.id === current?.unitId);
  const mains = tree ? tree.path.filter((p) => p.kind === "main" && p.unitId === current?.unitId) : [];
  const titleOf = (nodeId) => {
    const base = String(nodeId || "").split("__")[0];
    return nodes.find((n) => n.id === base)?.title || nodeId;
  };

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{stats.userName || `Kid ${String(kid.uid).slice(0, 5)}`}</Text>
        <Text style={styles.muted}>Last active: {timeAgo(stats.lastActiveAt)}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {unit ? `Unit ${unit.unitOrder} · ${unit.title}` : "Not started"}
          </Text>
          {mains.length ? (
            <>
              <Text style={styles.dots}>{mains.map((m) => (m.cleared ? "●" : "○")).join(" ")}</Text>
              <Text style={styles.line}>
                {mains.filter((m) => m.cleared).length}/{mains.length} topics · now on: {current?.title}
              </Text>
            </>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>This week</Text>
          <Text style={styles.line}>
            {week.answered} answers · {accuracy(week) === null ? "—" : `${accuracy(week)}%`} · {formatDuration(week.timeMs)}
          </Text>
          <Text style={styles.muted}>
            All time: {stats.answered || 0} answers · {accuracy({ answered: stats.answered || 0, correct: stats.correct || 0 }) ?? "—"}% ·{" "}
            {formatDuration(stats.totalTimeMs || 0)} · 🔧 {Object.keys(kid.mistakes || {}).length} mistakes to fix
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Topics</Text>
          {topics.length ? (
            topics.map((t) => (
              <View key={t.subtopic} style={styles.rowBetween}>
                <Text style={[styles.line, t.percent < 60 && t.total >= 3 && { color: theme.warning }]}>
                  {t.percent < 60 && t.total >= 3 ? "⚠️ " : "✓ "}
                  {topicName(t.subtopic)}
                </Text>
                <Text style={styles.line}>
                  {t.correct}/{t.total} · {t.percent}%
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.muted}>No topic data yet.</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent activity</Text>
          {error ? <Text style={[styles.muted, { color: theme.warning }]}>{error}</Text> : null}
          {!attempts ? (
            <ActivityIndicator color={theme.primary} />
          ) : attempts.length ? (
            attempts.map((a) => (
              <View key={a.id} style={styles.rowBetween}>
                <Text style={[styles.line, { flex: 1 }]} numberOfLines={1}>
                  {titleOf(a.nodeId)} · {MODE_LABELS[a.mode] || a.mode}
                </Text>
                <Text style={styles.line}>
                  {a.mode === "endless" || a.mode === "mistakes"
                    ? `${a.answeredCount} q · ${a.percent}%`
                    : `${a.passed ? "✓" : "✗"} ${a.percent}%`}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.muted}>No activity yet.</Text>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const makeStyles = (theme, insets) =>
  StyleSheet.create({
    container: { flex: 1 },
    scroll: { paddingTop: insets.top + 12, paddingHorizontal: 16, paddingBottom: insets.bottom + 24, gap: 10 },
    title: { fontSize: 26, fontFamily: "nunitoBold", color: theme.textPrimaryOnGradient },
    muted: { fontSize: 13, fontFamily: "nunito", color: theme.textSecondary },
    card: { backgroundColor: theme.cardBackground, borderRadius: 16, padding: 14, gap: 6 },
    cardTitle: { fontSize: 17, fontFamily: "nunitoBold", color: theme.textPrimary },
    dots: { fontSize: 18, color: theme.success, letterSpacing: 2 },
    line: { fontSize: 14, fontFamily: "nunito", color: theme.textPrimary },
    rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  });

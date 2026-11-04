// screens/progress/ProgressScreen.js
// Progress tab (owner-approved mockups "D · Progress" and "E · admin view", 2026-11-04).
// Kid: streak week, stars / this week / % right, quest progress, "Work on these", "Great at", leaderboard.
// Admin also gets Me · Kids (the old Dashboard, embedded: Kids + Reported).
// English Quest numbers come from the kid's progress doc; topic names and topic counts come from
// the quest content bundled in the app (no extra Firestore reads).

import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { authInstance } from "../../config/firebaseConfig";
import { APPREC8_TEAM_REVIEWER_UID } from "../../config/appConfig";
import { listenToUserDocument } from "../../services/firestoreContentApi";
import { listenToQuestProgress } from "../../services/englishQuestApi";
import { QUEST_ID, nodes as BUNDLED_NODES } from "../../data/englishQuestData";
import { summarize, accuracy, weakTopics } from "../../utils/kidStats";
import { dayStreak } from "../../utils/homeFeed";
import { weekStrip, greatTopics, topicNamer, questSummary } from "../../utils/progressView";
import AdminDashboardScreen from "../admin/AdminDashboardScreen";

const TrophyIcon = ({ color }) => (
  <Svg width={26} height={26} viewBox="0 0 24 24">
    <Path d="M7 4h10v4a5 5 0 01-10 0zM7 6H4a3 3 0 003 4M17 6h3a3 3 0 01-3 4M10 14h4v3h-4zM8 20h8" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const FlameIcon = () => (
  <Svg width={28} height={28} viewBox="0 0 24 24">
    <Path d="M12 2c1 4 5 5.5 5 11a5 5 0 01-10 0c0-2.5 1.2-4 2.5-5 .2 1.8 1 2.8 2 3-.5-3 .5-6 .5-9z" fill="#F29A1F" />
  </Svg>
);

function Bar({ percent, P, color }) {
  return (
    <View style={{ height: 10, borderRadius: 5, backgroundColor: P.track, overflow: "hidden" }}>
      <View style={{ width: `${Math.max(0, Math.min(100, percent))}%`, height: "100%", borderRadius: 5, backgroundColor: color || P.primary }} />
    </View>
  );
}

export default function ProgressScreen({ navigation }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(P, insets), [P, insets]);

  const user = authInstance.currentUser;
  const uid = user?.uid || null;
  const isAdmin = !!APPREC8_TEAM_REVIEWER_UID && uid === APPREC8_TEAM_REVIEWER_UID;
  const [view, setView] = useState("me");
  const [userData, setUserData] = useState(null);
  const [progress, setProgress] = useState({ nodes: {}, doc: {} });

  useEffect(() => {
    if (!uid) return undefined;
    const unsubUser = listenToUserDocument(setUserData, (e) => console.warn("Progress: user doc failed", e));
    const unsubProgress = listenToQuestProgress(
      QUEST_ID,
      (nodes, doc) => setProgress({ nodes: nodes || {}, doc: doc || {} }),
      (e) => console.warn("Progress: quest progress failed", e)
    );
    return () => {
      unsubUser && unsubUser();
      unsubProgress && unsubProgress();
    };
  }, [uid]);

  const name = useMemo(() => topicNamer(BUNDLED_NODES), []);
  const stats = progress.doc?.stats || {};
  const daily = stats.daily || {};
  const streak = dayStreak(daily);
  const week = weekStrip(daily);
  const thisWeek = summarize(stats, "week");
  const right = accuracy({ answered: stats.answered || 0, correct: stats.correct || 0 });
  const stars = userData?.stats?.totalStars || 0;
  const weak = weakTopics(stats).slice(0, 3);
  const great = greatTopics(stats);
  const english = useMemo(() => {
    try {
      return questSummary(BUNDLED_NODES, progress.nodes);
    } catch (e) {
      return null;
    }
  }, [progress.nodes]);

  const openQuestMap = () => navigation.navigate("Apprec8", { screen: "EnglishQuestMap", params: { questId: QUEST_ID } });

  const segment = isAdmin ? (
    <View style={styles.segment} accessibilityRole="tablist">
      {[
        ["me", "Me"],
        ["kids", "Kids · Reported"],
      ].map(([id, label]) => (
        <Pressable key={id} onPress={() => setView(id)} style={[styles.segmentItem, view === id && styles.segmentOn]} accessibilityRole="tab" accessibilityState={{ selected: view === id }}>
          <Text style={[styles.segmentText, view === id && styles.segmentTextOn]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  ) : null;

  const title = <Text style={styles.h1}>{isAdmin && view === "kids" ? "Progress" : "My progress"}</Text>;

  if (isAdmin && view === "kids") {
    return (
      <View style={styles.screen}>
        <AdminDashboardScreen
          navigation={navigation}
          embedded
          header={
            <View style={{ gap: 12, marginBottom: 12 }}>
              {title}
              {segment}
            </View>
          }
        />
      </View>
    );
  }

  if (!uid) {
    return (
      <View style={[styles.screen, styles.content]}>
        {title}
        <Text style={styles.soft}>Sign in to see your stars, streak and progress.</Text>
        <Pressable onPress={() => navigation.navigate("Profile")} style={styles.bigButton} accessibilityRole="button">
          <Text style={styles.bigButtonText}>SIGN IN</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {title}
      {segment}

      {/* Streak + this week */}
      <View style={styles.card}>
        <View style={styles.row}>
          <FlameIcon />
          <Text style={styles.cardTitle}>{streak === 1 ? "1-day streak" : `${streak}-day streak`}</Text>
        </View>
        <View style={styles.weekRow}>
          {week.map((d) => (
            <View key={d.key} style={{ alignItems: "center", gap: 4 }}>
              <View
                style={[
                  styles.dayDot,
                  d.played ? { backgroundColor: "#F5C842" } : { backgroundColor: P.track },
                  d.isToday && { borderWidth: 3, borderColor: P.primary },
                ]}
                accessibilityLabel={`${d.letter}${d.played ? ", played" : ""}`}
              >
                <Text style={[styles.dayMark, { color: d.played ? "#7A5B00" : P.dimText }]}>{d.played ? "✓" : ""}</Text>
              </View>
              <Text style={styles.dayLetter}>{d.letter}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.tiles}>
        {[
          ["STARS", String(stars)],
          ["THIS WEEK", `${thisWeek.answered} Qs`],
          ["RIGHT", right === null ? "—" : `${right}%`],
        ].map(([label, value]) => (
          <View key={label} style={styles.tile}>
            <Text style={styles.tileLabel}>{label}</Text>
            <Text style={styles.tileValue}>{value}</Text>
          </View>
        ))}
      </View>

      {/* Quests */}
      <Text style={styles.section}>Quests</Text>
      <Pressable onPress={openQuestMap} accessibilityRole="button">
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>
              English{english?.unitOrder !== null && english?.unitOrder !== undefined ? ` · Unit ${english.unitOrder}` : ""}
            </Text>
            {english ? <Text style={styles.soft}>{english.cleared} / {english.total} topics</Text> : null}
          </View>
          {english ? <Bar percent={english.total ? (english.cleared / english.total) * 100 : 0} P={P} /> : null}
          {english?.current ? <Text style={styles.soft}>Now: {english.current}</Text> : null}
        </View>
      </Pressable>

      {/* Work on these */}
      {weak.length > 0 ? (
        <>
          <Text style={styles.section}>Work on these</Text>
          {weak.map((t) => (
            <View key={t.subtopic} style={[styles.card, styles.row]}>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={styles.cardTitle} numberOfLines={2}>{name(t.subtopic)}</Text>
                <Bar percent={t.percent} P={P} color={P.wrongBorder} />
                <Text style={styles.soft}>{t.percent}% right · {t.total} answers</Text>
              </View>
              <Pressable onPress={openQuestMap} style={styles.smallButton} accessibilityRole="button" accessibilityLabel={`Practise ${name(t.subtopic)}`}>
                <Text style={styles.smallButtonText}>Practise</Text>
              </Pressable>
            </View>
          ))}
        </>
      ) : null}

      {great.length > 0 ? (
        <View style={[styles.card, styles.greatCard]}>
          <Text style={styles.greatText}>
            ⭐ Great at: {great.map((t) => `${name(t.subtopic)} (${t.percent}%)`).join(", ")}
          </Text>
        </View>
      ) : null}

      {(stats.answered || 0) === 0 ? (
        <View style={styles.card}>
          <Text style={styles.soft}>Play English Quest to see your strong and tricky topics here.</Text>
        </View>
      ) : null}

      {/* Leaderboard (the old Stats screen) */}
      <Pressable onPress={() => navigation.navigate("Leaderboard")} accessibilityRole="button">
        <View style={[styles.card, styles.row]}>
          <TrophyIcon color={P.label} />
          <Text style={[styles.cardTitle, { flex: 1 }]}>Leaderboard</Text>
          <Text style={styles.link}>See ›</Text>
        </View>
      </Pressable>
    </ScrollView>
  );
}

const makeStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg },
    content: { paddingTop: insets.top + 14, paddingHorizontal: 18, paddingBottom: 28, gap: 14 },
    h1: { fontSize: 28, fontFamily: "nunitoBold", color: P.text },
    segment: { flexDirection: "row", gap: 4, padding: 4, borderRadius: 16, backgroundColor: P.track },
    segmentItem: { flex: 1, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    segmentOn: { backgroundColor: P.card },
    segmentText: { fontSize: 15, fontFamily: "nunitoBold", color: P.textSoft },
    segmentTextOn: { color: P.selectedText },
    card: { padding: 14, borderRadius: 18, backgroundColor: P.card, borderWidth: 2, borderColor: P.border, gap: 8 },
    row: { flexDirection: "row", alignItems: "center", gap: 10 },
    rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
    cardTitle: { fontSize: 17, fontFamily: "nunitoBold", color: P.text },
    soft: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft },
    link: { fontSize: 15, fontFamily: "nunitoBold", color: P.label },
    weekRow: { flexDirection: "row", justifyContent: "space-between" },
    dayDot: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
    dayMark: { fontSize: 15, fontFamily: "nunitoBold" },
    dayLetter: { fontSize: 12, fontFamily: "nunitoBold", color: P.textSoft },
    tiles: { flexDirection: "row", gap: 10 },
    tile: { flex: 1, padding: 12, borderRadius: 18, backgroundColor: P.card, borderWidth: 2, borderColor: P.border, gap: 2 },
    tileLabel: { fontSize: 11, fontFamily: "nunitoBold", color: P.label, letterSpacing: 1 },
    tileValue: { fontSize: 22, fontFamily: "nunitoBold", color: P.text },
    section: { fontSize: 20, fontFamily: "nunitoBold", color: P.text, marginTop: 4 },
    smallButton: { paddingHorizontal: 14, height: 40, borderRadius: 14, backgroundColor: P.primary, alignItems: "center", justifyContent: "center", borderBottomWidth: 3, borderBottomColor: P.primaryShadow },
    smallButtonText: { color: P.onPrimary, fontSize: 15, fontFamily: "nunitoBold" },
    greatCard: { backgroundColor: P.correctBg, borderColor: P.correctBorder },
    greatText: { fontSize: 15, fontFamily: "nunitoBold", color: P.correctText },
    bigButton: { height: 54, borderRadius: 16, backgroundColor: P.primary, alignItems: "center", justifyContent: "center", borderBottomWidth: 4, borderBottomColor: P.primaryShadow },
    bigButtonText: { color: P.onPrimary, fontSize: 18, fontFamily: "nunitoBold", letterSpacing: 1 },
  });

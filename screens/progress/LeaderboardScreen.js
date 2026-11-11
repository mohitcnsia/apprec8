// screens/progress/LeaderboardScreen.js
// Leaderboard in the new look (mockup M1, owner-approved 2026-11-05). Replaces the old gradient Stats screen.
// Two tabs: "My class" (right answers this week + claps, kids in a class only) and "Everyone" (all-time stars).
// First names + class only, initials instead of photos (child safety). Your own row is pinned at the bottom (thumb zone).
// Shaping logic: utils/leaderboardView.js (tested).

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import functions from "@react-native-firebase/functions";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { authInstance } from "../../config/firebaseConfig";
import { listenToUserDocument } from "../../services/firestoreContentApi";
import { leaderboardView, formatPoints } from "../../utils/leaderboardView";
import { showAlert } from "../../services/dialog";
import { nextUpdateText } from "../../utils/refreshSlots";

const AVATAR_COLORS = ["#C98ACF", "#F0904A", "#5BA4E6", "#7BC98F", "#E8C43A", "#E58FB0"];
const CACHE_MS = 5 * 60 * 1000;
const cache = {}; // per session: { class: { at, data }, all: { at, data } } (saves function calls)

const firstNameOf = (s) => String(s || "").trim().split(/\s+/)[0] || "Kid";

function Avatar({ name, index, size, ring }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
        alignItems: "center",
        justifyContent: "center",
        borderWidth: ring ? 3 : 0,
        borderColor: ring || "transparent",
      }}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      <Text style={{ color: "#241027", fontSize: Math.round(size * 0.42), fontFamily: "nunitoBold" }}>{name[0] || "?"}</Text>
    </View>
  );
}

export default function LeaderboardScreen({ route }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(P, insets), [P, insets]);
  const me = authInstance.currentUser?.uid;

  const [userData, setUserData] = useState(null);
  const classId = (userData?.classIds || [])[0] || null;
  const [tab, setTab] = useState(route?.params?.tab || null); // "class" | "all"; null until we know if the kid has a class
  const [data, setData] = useState({ class: null, all: null });
  const [failed, setFailed] = useState({ class: false, all: false });
  const [refreshing, setRefreshing] = useState(false);
  const [clapped, setClapped] = useState({});
  const active = useRef(true);

  useEffect(() => {
    active.current = true;
    const unsub = listenToUserDocument(setUserData, () => setUserData({}));
    return () => {
      active.current = false;
      if (typeof unsub === "function") unsub();
    };
  }, []);

  // First tab: my class if I'm in one, else everyone
  useEffect(() => {
    if (tab || userData === null) return;
    setTab(classId ? "class" : "all");
  }, [tab, userData, classId]);

  const load = useCallback(
    async (which, force = false) => {
      const hit = cache[which];
      if (!force && hit && Date.now() - hit.at < CACHE_MS) {
        setData((d) => ({ ...d, [which]: hit.data }));
        return;
      }
      try {
        let rows;
        let className = null;
        let nextAt = null;
        let appreciated = [];
        if (which === "class") {
          const r = await functions().httpsCallable("getClassLeaderboard")({ classId });
          className = r.data.className || null;
          nextAt = Number.isFinite(r.data.nextAt) ? r.data.nextAt : null; // server recomputes the class board hourly
          appreciated = Array.isArray(r.data.appreciated) ? r.data.appreciated : []; // teachers' Appreciate this week
          rows = (r.data.rows || []).map((x) => ({ id: x.uid, name: firstNameOf(x.firstName), points: x.points || 0, rank: x.rank, claps: x.claps || 0 }));
        } else {
          const [top, mine] = await Promise.all([
            functions().httpsCallable("getLeaderboard")({ topN: 20 }),
            functions().httpsCallable("getCurrentUserRank")(),
          ]);
          rows = (top.data.leaderboard || []).map((x) => ({ id: x.id, name: firstNameOf(x.firstName || x.username), grade: x.grade, points: x.points || 0, rank: x.rank }));
          const m = mine.data;
          if (m && !rows.some((x) => x.id === m.id)) {
            rows.push({ id: m.id, name: firstNameOf(m.firstName || m.username), grade: userData?.grade, points: m.points || 0, rank: m.rank });
          }
        }
        const value = { rows, className, nextAt, appreciated };
        cache[which] = { at: Date.now(), data: value };
        if (active.current) {
          setData((d) => ({ ...d, [which]: value }));
          setFailed((f) => ({ ...f, [which]: false }));
        }
      } catch (e) {
        console.warn(`Leaderboard: ${which} failed`, e?.message);
        if (active.current) setFailed((f) => ({ ...f, [which]: true }));
      }
    },
    [classId, userData?.grade]
  );

  useEffect(() => {
    if (!tab) return;
    if (tab === "class" && !classId) return;
    load(tab);
  }, [tab, classId, load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load(tab, true);
    setRefreshing(false);
  };

  const clap = async (row) => {
    if (clapped[row.id]) return;
    try {
      const r = await functions().httpsCallable("clapForClassmate")({ classId, toUid: row.id });
      setClapped((c) => ({ ...c, [row.id]: true })); // sent, or already sent today: either way it's done for today
      if (!r.data.ok) showAlert("Already clapped", r.data.message);
    } catch (e) {
      showAlert("Couldn't clap", e.message);
    }
  };

  const isClass = tab === "class";
  const current = tab ? data[tab] : null;
  const view = useMemo(() => leaderboardView(current?.rows || [], me, { unit: isClass ? "points" : "stars" }), [current, me, isClass]);
  const subtitle = isClass
    ? `${current?.className || "My class"} · right answers this week · new week on Monday`
    : "All Apprec8 kids · stars · first names only";
  const scoreText = (r) => (isClass ? `${r.points} pts` : `${formatPoints(r.points)} stars`);
  const myName = firstNameOf(userData?.firstName);

  const header = (
    <View style={styles.headerWrap}>
      {classId ? (
        <View style={styles.tabs} accessibilityRole="tablist">
          {[
            ["class", "My class"],
            ["all", "Everyone"],
          ].map(([id, label]) => {
            const on = tab === id;
            return (
              <Pressable key={id} onPress={() => setTab(id)} accessibilityRole="tab" accessibilityState={{ selected: on }} style={[styles.tab, on && styles.tabOn]}>
                <Text style={[styles.tabText, on && styles.tabTextOn]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Text style={styles.h1}>Leaderboard</Text>
      )}
      <Text style={styles.subtitle}>{subtitle}</Text>
      {tab === "class" && current?.nextAt && current.nextAt > Date.now() ? <Text style={styles.subtitle}>{nextUpdateText(current.nextAt)}</Text> : null}
      {tab === "class" && current?.appreciated?.length ? <Text style={styles.subtitle}>🌟 Appreciated this week: {current.appreciated.map((n) => firstNameOf(n)).join(", ")}</Text> : null}

      {view.podium.length ? (
        <View style={styles.podium}>
          {view.podium.map((r) => {
            const first = r.place === 1;
            return (
              <View key={r.id} style={styles.podiumCol} accessible accessibilityLabel={`Number ${r.place}: ${r.name}, ${scoreText(r)}`}>
                <Avatar name={r.name} index={r.place - 1} size={first ? 60 : 50} ring={first ? P.gold : null} />
                <Text style={styles.podiumName} numberOfLines={1}>{r.id === me ? `${r.name} (you)` : r.name}</Text>
                <Text style={styles.soft}>{scoreText(r)}</Text>
                <View style={[styles.block, { height: first ? 64 : r.place === 2 ? 46 : 34 }, first && styles.blockFirst]}>
                  <Text style={[styles.blockText, first && { color: P.gold }]}>{r.place}</Text>
                </View>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );

  const renderRow = ({ item: r, index }) => {
    const done = !!clapped[r.id];
    return (
      <View style={styles.row}>
        <Text style={styles.rank}>{r.rank}</Text>
        <Avatar name={r.name} index={index + 3} size={40} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.name} numberOfLines={1}>{r.name}</Text>
          <Text style={styles.small}>{isClass ? (done ? "You clapped today" : `👏 ${r.claps || 0} this week`) : r.grade ? `Class ${r.grade}` : " "}</Text>
        </View>
        <Text style={styles.points}>{isClass ? r.points : formatPoints(r.points)}</Text>
        {isClass ? (
          <Pressable
            onPress={() => clap(r)}
            disabled={done}
            accessibilityRole="button"
            accessibilityLabel={done ? `Clapped for ${r.name}` : `Clap for ${r.name}`}
            style={[styles.clap, done && styles.clapDone]}
          >
            <Text style={styles.clapText}>👏</Text>
          </Pressable>
        ) : null}
      </View>
    );
  };

  const loading = !tab || (!current && !failed[tab]);
  return (
    <View style={styles.screen}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={P.label} />
        </View>
      ) : failed[tab] && !current ? (
        <View style={styles.center}>
          {header}
          <Text style={styles.soft}>Could not load the leaderboard. Pull down or try again later.</Text>
          <Pressable onPress={onRefresh} accessibilityRole="button" style={styles.retry}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={view.list}
          keyExtractor={(r) => r.id}
          renderItem={renderRow}
          ListHeaderComponent={header}
          ListEmptyComponent={view.podium.length ? null : <Text style={[styles.soft, { textAlign: "center" }]}>No one has points yet this week. Be the first!</Text>}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={P.label} />}
        />
      )}

      {/* You, pinned in the thumb zone */}
      {view.mine ? (
        <View style={styles.meWrap}>
          <View style={styles.me} accessible accessibilityLabel={`You are number ${view.mine.rank} with ${scoreText(view.mine)}. ${view.mine.hint || ""}`}>
            <Text style={[styles.rank, { color: P.selectedText }]}>{view.mine.rank}</Text>
            <Avatar name={myName} index={0} size={40} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: P.selectedText }]}>You · {myName}</Text>
              {view.mine.hint ? <Text style={[styles.small, { color: P.label }]}>{view.mine.hint}</Text> : null}
            </View>
            <Text style={[styles.points, { color: P.selectedText }]}>{scoreText(view.mine)}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const makeStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg },
    center: { flex: 1, paddingTop: insets.top + 24, paddingHorizontal: 18, gap: 14, alignItems: "stretch" },
    headerWrap: { paddingTop: insets.top + 18, gap: 12, paddingBottom: 12 },
    h1: { fontSize: 26, fontFamily: "nunitoBold", color: P.text },
    tabs: { flexDirection: "row", gap: 6, padding: 4, borderRadius: 16, backgroundColor: P.card, borderWidth: 2, borderColor: P.border },
    tab: { flex: 1, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    tabOn: { backgroundColor: P.primary },
    tabText: { fontSize: 16, fontFamily: "nunitoBold", color: P.textSoft },
    tabTextOn: { color: P.onPrimary },
    subtitle: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft, textAlign: "center" },
    podium: { flexDirection: "row", alignItems: "flex-end", gap: 8, paddingTop: 4 },
    podiumCol: { flex: 1, alignItems: "center", gap: 6 },
    podiumName: { fontSize: 15, fontFamily: "nunitoBold", color: P.text, maxWidth: "100%" },
    block: { alignSelf: "stretch", borderTopLeftRadius: 14, borderTopRightRadius: 14, backgroundColor: P.card, borderWidth: 2, borderBottomWidth: 0, borderColor: P.border, alignItems: "center", justifyContent: "center" },
    blockFirst: { backgroundColor: P.selectedBg, borderColor: P.selectedBorder },
    blockText: { fontSize: 20, fontFamily: "nunitoBold", color: P.textSoft },
    list: { paddingHorizontal: 18, paddingBottom: 16 },
    row: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 12, minHeight: 60, borderRadius: 16, backgroundColor: P.card, borderWidth: 2, borderColor: P.border },
    rank: { width: 28, fontSize: 16, fontFamily: "nunitoBold", color: P.textSoft, textAlign: "center" },
    name: { fontSize: 16, fontFamily: "nunitoBold", color: P.text },
    small: { fontSize: 13, fontFamily: "nunitoBold", color: P.textSoft },
    soft: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft },
    points: { fontSize: 16, fontFamily: "nunitoBold", color: P.selectedText },
    clap: { width: 44, height: 44, borderRadius: 14, borderWidth: 2, borderColor: P.border, alignItems: "center", justifyContent: "center" },
    clapDone: { borderColor: P.selectedBorder, backgroundColor: P.selectedBg },
    clapText: { fontSize: 20 },
    meWrap: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 12, backgroundColor: P.bg },
    me: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, minHeight: 64, borderRadius: 18, backgroundColor: P.selectedBg, borderWidth: 2, borderColor: P.selectedBorder },
    retry: { alignSelf: "center", paddingHorizontal: 20, height: 48, borderRadius: 16, backgroundColor: P.primary, alignItems: "center", justifyContent: "center" },
    retryText: { color: P.onPrimary, fontSize: 16, fontFamily: "nunitoBold" },
  });

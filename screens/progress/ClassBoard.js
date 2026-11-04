// screens/progress/ClassBoard.js
// Weekly class leaderboard + claps (owner idea, 2026-11-04). Kids see their own class only, first names only.
// Points = right answers this week (server: functions/callable/schoolActions.js getClassLeaderboard). One clap per
// classmate per day (server-checked: clapForClassmate). Shown in Progress for kids who are in a class.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import functions from "@react-native-firebase/functions";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { authInstance } from "../../config/firebaseConfig";

export default function ClassBoard({ classId }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const styles = useMemo(() => makeStyles(P), [P]);
  const me = authInstance.currentUser?.uid;
  const [board, setBoard] = useState(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await functions().httpsCallable("getClassLeaderboard")({ classId });
      setBoard(r.data);
    } catch (e) {
      setFailed(true);
    }
  }, [classId]);
  useEffect(() => {
    load();
  }, [load]);

  const clap = async (toUid) => {
    try {
      const r = await functions().httpsCallable("clapForClassmate")({ classId, toUid });
      Alert.alert(r.data.ok ? "👏" : "Already clapped", r.data.message);
      if (r.data.ok) load();
    } catch (e) {
      Alert.alert("Couldn't clap", e.message);
    }
  };

  if (failed) return null; // not deployed yet, or not in a class: show nothing
  if (!board) return <ActivityIndicator color={P.label} />;
  const top = board.rows.slice(0, 10);
  const mine = board.rows.find((r) => r.uid === me);
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{(board.className || "MY CLASS").toUpperCase()} · THIS WEEK</Text>
      {top.map((r) => (
        <View key={r.uid} style={[styles.row, r.uid === me && styles.rowMe]}>
          <Text style={styles.rank}>{r.rank === 1 ? "👑" : r.rank}</Text>
          <Text style={styles.name} numberOfLines={1}>{r.uid === me ? `${r.firstName} (you)` : r.firstName}</Text>
          <Text style={styles.points}>{r.points}</Text>
          {r.uid !== me ? (
            <Pressable onPress={() => clap(r.uid)} hitSlop={8} accessibilityRole="button" accessibilityLabel={`Clap for ${r.firstName}`} style={styles.clap}>
              <Text style={styles.clapText}>👏 {r.claps || ""}</Text>
            </Pressable>
          ) : (
            <Text style={[styles.clapText, styles.clapMine]}>👏 {r.claps || 0}</Text>
          )}
        </View>
      ))}
      {mine && mine.rank > 10 ? <Text style={styles.soft}>You're #{mine.rank} with {mine.points} right answers. Keep going!</Text> : null}
      <Text style={styles.soft}>Points = right answers this week. Clap once a day for a classmate who works hard.</Text>
    </View>
  );
}

const makeStyles = (P) =>
  StyleSheet.create({
    card: { padding: 14, borderRadius: 18, backgroundColor: P.card, borderWidth: 1, borderColor: P.border, gap: 6 },
    label: { fontSize: 12, letterSpacing: 1, fontFamily: "nunitoBold", color: P.label },
    row: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6, paddingHorizontal: 6, borderRadius: 12 },
    rowMe: { backgroundColor: P.selectedBg },
    rank: { width: 26, fontSize: 16, fontFamily: "nunitoBold", color: P.textSoft, textAlign: "center" },
    name: { flex: 1, fontSize: 16, fontFamily: "nunitoBold", color: P.text },
    points: { fontSize: 16, fontFamily: "nunitoBold", color: P.text, minWidth: 34, textAlign: "right" },
    clap: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, backgroundColor: P.streakBg },
    clapText: { fontSize: 14, fontFamily: "nunitoBold", color: P.streakText },
    clapMine: { paddingHorizontal: 10 },
    soft: { fontSize: 12, fontFamily: "nunitoBold", color: P.textSoft },
  });

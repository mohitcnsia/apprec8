// screens/wellbeing/MoodListScreen.js: the counsellor's next-morning list (well-being safety steps, section 2–3).
// Seema sees kids in her classes who asked to talk, said sad "for a while", or were sad two weeks in a row.
// One tap per kid: Talked, okay · Follow up (back in 3 days) · Referred. "I'm away" hands the list to her backup.
// Opened from Home → Needs you. Only counsellors and the backup can load it (the server checks).
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { myMoodList, setMoodOutcome, setCounsellorAway } from "../../services/moodApi";
import { FLAG_TEXT, OUTCOMES } from "../../utils/mood";

const when = (ms) => {
  const d = new Date(ms);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
};

export default function MoodListScreen() {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const styles = useMemo(() => makeStyles(P), [P]);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);

  const load = useCallback(() => {
    setError("");
    myMoodList()
      .then(setData)
      .catch((e) => setError(e?.code === "functions/permission-denied" ? "Only the school counsellor sees this list." : "Couldn't load. Check the internet and pull down."));
  }, []);
  useEffect(load, [load]);

  const mark = async (id, outcome) => {
    setBusy(id);
    try {
      await setMoodOutcome(id, outcome);
      setData((d) => ({ ...d, items: d.items.filter((x) => x.id !== id) }));
    } catch {
      setError("Couldn't save. Try again.");
    }
    setBusy(null);
  };
  const toggleAway = async () => {
    try {
      await setCounsellorAway(!data?.away);
      load();
    } catch {
      setError("Couldn't save. Try again.");
    }
  };

  if (!data && !error) return <ActivityIndicator style={{ marginTop: 40 }} color={P.label} />;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Kids to see</Text>
      <Text style={styles.soft}>Only you see this. Meet each kid quietly, then tap what happened.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {data && !data.items.length ? <Text style={styles.body}>Nobody on the list today. 🌱</Text> : null}
      {(data?.items || []).map((k) => (
        <View key={k.id} style={styles.card}>
          <Text style={styles.name}>
            {k.firstName || "A kid"} · {k.className}
          </Text>
          <Text style={styles.soft}>
            {FLAG_TEXT[k.flag] || "on the list"} · {when(k.at)}
            {k.followUp ? " · follow-up" : ""}
          </Text>
          <View style={styles.row}>
            {OUTCOMES.map((o) => (
              <Pressable key={o.id} disabled={busy === k.id} onPress={() => mark(k.id, o.id)} accessibilityRole="button" style={styles.btn}>
                <Text style={styles.btnText}>{o.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
      {data?.counsellor ? (
        <Pressable onPress={toggleAway} accessibilityRole="button" style={styles.away}>
          <Text style={styles.awayText}>{data.away ? "I'm back: show me my list again" : "I'm away: send my list to my backup"}</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

const makeStyles = (P) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg },
    content: { padding: 16, gap: 12, paddingBottom: 40 },
    title: { fontSize: 26, fontFamily: "nunitoBold", color: P.text },
    soft: { fontSize: 14, fontFamily: "nunito", color: P.textSoft },
    body: { fontSize: 16, fontFamily: "nunito", color: P.text },
    error: { fontSize: 14, fontFamily: "nunitoBold", color: P.wrongText },
    card: { padding: 14, borderRadius: 18, backgroundColor: P.card, borderWidth: 1, borderColor: P.border, gap: 6 },
    name: { fontSize: 17, fontFamily: "nunitoBold", color: P.text },
    row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
    btn: { paddingHorizontal: 12, minHeight: 40, borderRadius: 20, borderWidth: 1.5, borderColor: P.selectedBorder, justifyContent: "center" },
    btnText: { fontSize: 14, fontFamily: "nunitoBold", color: P.selectedText },
    away: { marginTop: 12, minHeight: 44, alignItems: "center", justifyContent: "center" },
    awayText: { fontSize: 14, fontFamily: "nunitoBold", color: P.label },
  });

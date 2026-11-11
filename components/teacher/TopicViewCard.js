// components/teacher/TopicViewCard.js: the teacher's topic view (mockup "Reported speech needs teaching again", owner OK
// 2026-11-11). Reads ONE document (classSummaries/{classId}) instead of every kid's progress. Topics worst first, a bar
// split into Learned / Practising / New / Slipping; tap a topic for the names in each group.
// Not yet in this version: the common mistake and the Nudge / Appreciate buttons (they need stickers + nudges).
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import { bundledQuest } from "../../data/quests";
import { topicNamer } from "../../utils/progressView";
import { topicRows, rowLine, headline } from "../../utils/topicView";

const db = getFirestore();

export default function TopicViewCard({ classId, members, questIds, refreshKey = 0, P }) {
  const styles = useMemo(() => makeStyles(P), [P]);
  const [summary, setSummary] = useState(undefined);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    let alive = true;
    getDoc(doc(db, "classSummaries", classId))
      .then((s) => alive && setSummary(s.exists() ? s.data() : null))
      .catch(() => alive && setSummary(null)); // rules not deployed yet, or offline: the card just doesn't show
    return () => {
      alive = false;
    };
  }, [classId, refreshKey]);

  const rows = useMemo(
    () => topicRows(summary, members, questIds, (q) => topicNamer(bundledQuest(q)?.nodes || [])),
    [summary, members, questIds]
  );
  if (!rows.length) return null;

  const colors = { learned: P.correctBorder, practising: P.selectedBorder, new: P.track, slipping: P.gold };
  const groups = [
    ["slipping", "Slipping"],
    ["new", "New"],
    ["practising", "Practising"],
    ["learned", "Learned"],
  ];

  return (
    <View style={styles.card} accessibilityLabel="Topics, worst first">
      <Text style={styles.label}>TOPICS · WORST FIRST</Text>
      <Text style={styles.head}>{headline(rows)}</Text>
      <View style={styles.legend}>
        {[["learned", "Learned"], ["practising", "Practising"], ["new", "New"], ["slipping", "Slipping"]].map(([k, l]) => (
          <View key={k} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: colors[k] }]} />
            <Text style={styles.soft}>{l}</Text>
          </View>
        ))}
      </View>
      {rows.slice(0, 12).map((r) => (
        <Pressable key={r.key} onPress={() => setOpen(open === r.key ? null : r.key)} accessibilityRole="button" accessibilityLabel={`${r.title}: ${rowLine(r)}`} style={[styles.row, open === r.key && styles.rowOn]}>
          <Text style={styles.title}>{r.title}</Text>
          <View style={styles.bar}>
            {[["learned", r.learned], ["practising", r.practising], ["new", r.newCount], ["slipping", r.slipping]].map(([k, n]) =>
              n > 0 ? <View key={k} style={{ flex: n, backgroundColor: colors[k] }} /> : null
            )}
          </View>
          <Text style={styles.soft}>{rowLine(r)}</Text>
          {open === r.key ? (
            <View style={{ gap: 6, marginTop: 8 }}>
              {groups.map(([k, label]) =>
                r.names[k].length ? (
                  <Text key={k} style={styles.names}>
                    <Text style={styles.bold}>
                      {label} · {r.names[k].length}:{" "}
                    </Text>
                    {r.names[k].join(", ")}
                  </Text>
                ) : null
              )}
            </View>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
}

const makeStyles = (P) =>
  StyleSheet.create({
    card: { padding: 16, borderRadius: 20, backgroundColor: P.card, borderWidth: 1, borderColor: P.border, gap: 8 },
    label: { fontSize: 13, fontFamily: "nunitoBold", letterSpacing: 1, color: P.label },
    head: { fontSize: 17, fontFamily: "nunitoBold", color: P.text },
    legend: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
    dot: { width: 10, height: 10, borderRadius: 2 },
    row: { paddingVertical: 10, paddingHorizontal: 8, borderRadius: 12, gap: 6 },
    rowOn: { backgroundColor: P.selectedBg },
    title: { fontSize: 15, fontFamily: "nunitoBold", color: P.text },
    bar: { flexDirection: "row", height: 12, borderRadius: 6, overflow: "hidden", backgroundColor: P.track },
    soft: { fontSize: 13, fontFamily: "nunito", color: P.textSoft },
    names: { fontSize: 14, fontFamily: "nunito", color: P.text, lineHeight: 20 },
    bold: { fontFamily: "nunitoBold" },
  });

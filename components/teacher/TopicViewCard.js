// components/teacher/TopicViewCard.js: the teacher's topic view (mockup "Reported speech needs teaching again", owner OK
// 2026-11-11). Reads ONE document (classSummaries/{classId}) instead of every kid's progress. Topics worst first, a bar
// split into Learned / Practising / New / Slipping; tap a topic for the names in each group.
// Per group: Nudge (slipping, new), Cheer on (practising): a private note on the kid's Home; Appreciate (learned): a
// sticker + the name on the class board. Not yet: the common mistake.
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import { bundledQuest } from "../../data/quests";
import { topicNamer } from "../../utils/progressView";
import { topicRows, rowLine, headline } from "../../utils/topicView";
import { sendSticker } from "../../services/moodApi";

const db = getFirestore();

export default function TopicViewCard({ classId, members, questIds, refreshKey = 0, P }) {
  const styles = useMemo(() => makeStyles(P), [P]);
  const [summary, setSummary] = useState(undefined);
  const [open, setOpen] = useState(null);
  const [sent, setSent] = useState({}); // `${rowKey}|${group}` → "sending" | number sent | "error"

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
    ["slipping", "Slipping", "nudge", "Nudge"],
    ["new", "New", "nudge", "Nudge"],
    ["practising", "Practising", "cheer", "Cheer on"],
    ["learned", "Learned", "appreciate", "Appreciate"],
  ];
  const send = async (r, g, kind) => {
    const k = `${r.key}|${g}`;
    setSent((x) => ({ ...x, [k]: "sending" }));
    try {
      const res = await sendSticker(classId, kind, r.uids[g], r.title);
      setSent((x) => ({ ...x, [k]: res?.sent ?? 0 }));
    } catch (e) {
      setSent((x) => ({ ...x, [k]: "error" }));
    }
  };

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
              {groups.map(([k, label, kind, action]) => {
                if (!r.names[k].length) return null;
                const st = sent[`${r.key}|${k}`];
                return (
                  <View key={k} style={styles.group}>
                    <Text style={[styles.names, { flex: 1 }]}>
                      <Text style={styles.bold}>
                        {label} · {r.names[k].length}:{" "}
                      </Text>
                      {r.names[k].join(", ")}
                    </Text>
                    <Pressable
                      disabled={st === "sending" || typeof st === "number"}
                      onPress={() => send(r, k, kind)}
                      accessibilityRole="button"
                      accessibilityLabel={`${action} ${r.names[k].length} kids`}
                      style={styles.act}
                    >
                      <Text style={styles.actText}>{st === "sending" ? "…" : typeof st === "number" ? `Sent ✓ ${st}` : st === "error" ? "Try again" : action}</Text>
                    </Pressable>
                  </View>
                );
              })}
              <Text style={styles.soft}>Nudge and Cheer on reach only that kid. Appreciate shows the names to the class.</Text>
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
    group: { flexDirection: "row", alignItems: "center", gap: 8 },
    act: { paddingHorizontal: 12, minHeight: 36, borderRadius: 18, borderWidth: 1.5, borderColor: P.selectedBorder, justifyContent: "center" },
    actText: { fontSize: 13, fontFamily: "nunitoBold", color: P.selectedText },
  });

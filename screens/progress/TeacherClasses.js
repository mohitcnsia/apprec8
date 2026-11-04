// screens/progress/TeacherClasses.js
// RB-2 phase A: a teacher's own classes in the Progress tab. Pick a class → each kid's progress in the quests of the
// teacher's subjects only (English teacher → English Quest + Word Power; Science teacher → Science Quest).
// Reads: classes (teacherIds contains me), members, and each member's questProgress (rules: DR-9). One-time reads.

import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { authInstance } from "../../config/firebaseConfig";
import { myTeachingClasses, classMembers } from "../../services/classesApi";
import { questsForTeacher, classLabel } from "../../utils/classes";
import { summarize, accuracy, weakTopics, timeAgo } from "../../utils/kidStats";
import { bundledQuest } from "../../data/quests";
import { topicNamer } from "../../utils/progressView";

const db = getFirestore(getApp());

export default function TeacherClasses() {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const styles = useMemo(() => makeStyles(P), [P]);
  const uid = authInstance.currentUser?.uid;

  const [classes, setClasses] = useState(null);
  const [open, setOpen] = useState(null);
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    myTeachingClasses().then(setClasses).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!open) return;
    setRows(null);
    const questIds = questsForTeacher(open, uid);
    (async () => {
      try {
        const members = await classMembers(open.id);
        const out = [];
        for (const m of members) {
          const perQuest = [];
          for (const q of questIds) {
            const snap = await getDoc(doc(db, "users", m.uid, "questProgress", q));
            const stats = snap.exists() ? snap.data()?.stats || {} : {};
            const mistakes = snap.exists() ? Object.keys(snap.data()?.mistakes || {}).length : 0;
            const namer = topicNamer(bundledQuest(q)?.nodes || []);
            const week = summarize(stats, "week");
            const weak = weakTopics(stats)[0];
            perQuest.push({ q, week, acc: accuracy(week), mistakes, weak: weak ? namer(weak.subtopic) : null, last: stats.lastActiveAt || 0 });
          }
          out.push({ ...m, perQuest, last: Math.max(0, ...perQuest.map((p) => p.last)) });
        }
        out.sort((a, b) => b.last - a.last);
        setRows(out);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [open, uid]);

  if (error) return <Text style={styles.soft}>Couldn't load your classes ({error}). The class rules may not be live yet (DR-9).</Text>;
  if (classes === null) return <ActivityIndicator color={P.label} />;
  if (!classes.length) return <Text style={styles.soft}>You don't teach a class yet. Your school admin adds you.</Text>;

  return (
    <View style={{ gap: 10 }}>
      {classes.map((c) => (
        <Pressable key={c.id} onPress={() => setOpen(open?.id === c.id ? null : c)} style={[styles.card, open?.id === c.id && styles.cardOn]} accessibilityRole="button">
          <Text style={styles.title}>{classLabel(c)}</Text>
          <Text style={styles.soft}>{c.schoolName} · Class {c.grade} · code {c.joinCode}</Text>
        </Pressable>
      ))}
      {open && rows === null ? <ActivityIndicator color={P.label} /> : null}
      {open && rows?.length === 0 ? <Text style={styles.soft}>No kids yet. Give parents the code {open.joinCode}.</Text> : null}
      {open && rows
        ? rows.map((k) => (
            <View key={k.uid} style={styles.kid}>
              <View style={styles.rowBetween}>
                <Text style={styles.title}>{k.firstName || "Kid"}</Text>
                <Text style={styles.soft}>{k.last ? timeAgo(k.last) : "not started"}</Text>
              </View>
              {k.perQuest.map((p) => (
                <Text key={p.q} style={styles.line}>
                  {bundledQuest(p.q)?.quest?.title || p.q}: {p.week.answered} this week · {p.acc === null ? "—" : `${p.acc}%`} right
                  {p.mistakes ? ` · ${p.mistakes} to fix` : ""}
                  {p.weak ? ` · weak: ${p.weak}` : ""}
                </Text>
              ))}
            </View>
          ))
        : null}
    </View>
  );
}

const makeStyles = (P) =>
  StyleSheet.create({
    card: { padding: 14, borderRadius: 18, borderWidth: 1, borderColor: P.border, backgroundColor: P.card, gap: 2 },
    cardOn: { borderColor: P.selectedBorder, backgroundColor: P.selectedBg },
    kid: { padding: 12, borderRadius: 16, backgroundColor: P.card, borderWidth: 1, borderColor: P.border, gap: 4 },
    rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    title: { fontSize: 17, fontFamily: "nunitoBold", color: P.text },
    soft: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft },
    line: { fontSize: 14, fontFamily: "nunitoBold", color: P.text },
  });

// screens/progress/TeacherClasses.js
// RB-2 phase A: a teacher's own classes in the Progress tab. Pick a class → each kid's progress in the quests of the
// teacher's subjects only (English teacher → English Quest + Word Power; Science teacher → Science Quest).
// Reads: classes (teacherIds contains me), members, and each member's questProgress (rules: DR-9). One-time reads.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { authInstance } from "../../config/firebaseConfig";
import { myTeachingClasses, classMembers, approveMember } from "../../services/classesApi";
import { questsForTeacher, classLabel, classCodeMessage } from "../../utils/classes";
import { markGuide } from "../../services/guideFacts";
import { teacherWeek } from "../../utils/weeklySummary";
import TeacherWeekCard from "../../components/teacher/TeacherWeekCard";
import { summarize, accuracy, weakTopics, timeAgo } from "../../utils/kidStats";
import { bundledQuest } from "../../data/quests";
import { topicNamer } from "../../utils/progressView";
import { nodesForGrade } from "../../utils/gradeFilter";
import { createAssignment, listAssignments, deleteAssignment } from "../../services/assignmentsApi";
import { dayKey } from "../../utils/kidStats";
import { showAlert } from "../../services/dialog";

const db = getFirestore(getApp());

function AssignPanel({ cls, uid, kids, P, styles }) {
  const questIds = questsForTeacher(cls, uid);
  const [questId, setQuestId] = useState(questIds[0] || null);
  const [picked, setPicked] = useState([]);
  const [who, setWho] = useState([]); // empty = whole class
  const [due, setDue] = useState(7);
  const [note, setNote] = useState("");
  const [list, setList] = useState([]);
  const reload = () => listAssignments(cls.id).then(setList).catch(() => setList([]));
  useEffect(() => {
    reload();
  }, [cls.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const topics = useMemo(() => {
    const nodes = bundledQuest(questId)?.nodes || [];
    return nodesForGrade(nodes, cls.grade).filter((n) => n.kind === "main");
  }, [questId, cls.grade]);
  if (!questIds.length) return <Text style={styles.soft}>No quests for your subjects yet.</Text>;
  const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const assign = async () => {
    try {
      const dueDate = due ? dayKey(Date.now() + due * 24 * 60 * 60 * 1000) : null;
      await createAssignment({ classId: cls.id, questId, nodes: topics.filter((t) => picked.includes(t.id)), kidIds: who, dueDate, note });
      setPicked([]);
      setNote("");
      showAlert("Assigned", who.length ? `Sent to ${who.length} kid(s).` : "Sent to the whole class.");
      reload();
    } catch (e) {
      showAlert("Couldn't assign", e.message);
    }
  };
  return (
    <View style={[styles.kid, { gap: 8 }]}>
      <Text style={styles.title}>Assign a topic</Text>
      <View style={styles.chips}>
        {questIds.map((q) => (
          <Pressable key={q} onPress={() => { setQuestId(q); setPicked([]); }} style={[styles.chip, questId === q && styles.chipOn]}>
            <Text style={styles.line}>{bundledQuest(q)?.quest?.title || q}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.chips}>
        {topics.map((t) => (
          <Pressable key={t.id} onPress={() => toggle(picked, setPicked, t.id)} style={[styles.chip, picked.includes(t.id) && styles.chipOn]}>
            <Text style={styles.line}>{t.title}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.soft}>Who (none picked = whole class)</Text>
      <View style={styles.chips}>
        {kids.map((k) => (
          <Pressable key={k.uid} onPress={() => toggle(who, setWho, k.uid)} style={[styles.chip, who.includes(k.uid) && styles.chipOn]}>
            <Text style={styles.line}>{k.firstName || "Kid"}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.chips}>
        {[[0, "No due date"], [3, "3 days"], [7, "1 week"], [14, "2 weeks"]].map(([d, label]) => (
          <Pressable key={d} onPress={() => setDue(d)} style={[styles.chip, due === d && styles.chipOn]}>
            <Text style={styles.line}>{label}</Text>
          </Pressable>
        ))}
      </View>
      <TextInput value={note} onChangeText={setNote} placeholder="Note for the kids (optional)" placeholderTextColor={P.dimText} style={styles.input} />
      <Pressable disabled={!picked.length} onPress={assign} style={[styles.button, !picked.length && { opacity: 0.45 }]}>
        <Text style={styles.buttonText}>ASSIGN</Text>
      </Pressable>
      {list.map((a) => (
        <View key={a.id} style={styles.rowBetween}>
          <Text style={[styles.line, { flex: 1 }]} numberOfLines={2}>
            {(a.nodeTitles || []).join(", ")} · {a.kidIds?.length ? `${a.kidIds.length} kid(s)` : "whole class"}
            {a.dueDate ? ` · due ${a.dueDate}` : ""}
          </Text>
          <Pressable onPress={() => deleteAssignment(cls.id, a.id).then(reload)} hitSlop={8}>
            <Text style={[styles.line, { color: P.wrongText }]}>Remove</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

/** The weekly card's input from the rows this screen already loaded (no extra reads). */
function weekOf(cls, rows, assignments) {
  const nodes = rows[0]?.perQuest.flatMap((p) => bundledQuest(p.q)?.nodes || []) || [];
  const namer = topicNamer(nodes);
  const titles = Object.fromEntries(nodes.map((n) => [n.id, n.title]));
  const kids = rows.map((r) => ({ uid: r.uid, firstName: r.firstName, quests: r.perQuest.map((p) => ({ questId: p.q, stats: p.stats, nodes: p.nodes })) }));
  return teacherWeek({ kids, assignments, namer, gateTitle: (id) => titles[id] || "challenge" });
}

export default function TeacherClasses({ refreshTrigger = 0 }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const styles = useMemo(() => makeStyles(P), [P]);
  const uid = authInstance.currentUser?.uid;

  const [classes, setClasses] = useState(null);
  const [open, setOpen] = useState(null);
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [assignments, setAssignments] = useState([]);
  const decide = (kid, approve) =>
    approveMember({ classId: open.id, kidUid: kid.uid, approve })
      .then(() => setReloadKey((k) => k + 1))
      .catch((e) => showAlert("Couldn't do that", e.message));

  const reloadClasses = useCallback(() => {
    return myTeachingClasses()
      .then(setClasses)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    reloadClasses();
  }, [reloadClasses]);

  useFocusEffect(
    useCallback(() => {
      reloadClasses();
      setReloadKey((k) => k + 1);
    }, [reloadClasses])
  );

  useEffect(() => {
    if (refreshTrigger > 0) {
      reloadClasses();
      setReloadKey((k) => k + 1);
    }
  }, [refreshTrigger, reloadClasses]);

  useEffect(() => {
    if (!open) return;
    setRows(null);
    const questIds = questsForTeacher(open, uid);
    (async () => {
      try {
        const all = await classMembers(open.id);
        setPending(all.filter((m) => m.status === "pending"));
        const members = all.filter((m) => m.status === "approved");
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
            const nodes = snap.exists() ? snap.data()?.nodes || {} : {};
            perQuest.push({ q, week, acc: accuracy(week), mistakes, weak: weak ? namer(weak.subtopic) : null, last: stats.lastActiveAt || 0, stats, nodes });
          }
          out.push({ ...m, perQuest, last: Math.max(0, ...perQuest.map((p) => p.last)) });
        }
        out.sort((a, b) => b.last - a.last);
        setAssignments(await listAssignments(open.id).catch(() => []));
        setRows(out);
        if (out.length) markGuide("teacher.progress"); // guide step 5: the teacher has seen students' progress
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [open, uid, reloadKey]);

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
      {/* "This week" (mockup V4): reteach one thing, who needs you, the assignment. */}
      {open && rows?.length ? <TeacherWeekCard week={weekOf(open, rows, assignments)} className={classLabel(open)} P={P} /> : null}
      {/* Guide step 2: share the class code (phone share menu, like the admin's SHARE CODE). */}
      {open?.joinCode ? (
        <Pressable
          onPress={() => {
            markGuide("teacher.share");
            Share.share({ message: classCodeMessage({ className: open.name, schoolName: open.schoolName, code: open.joinCode }) }).catch(() => {});
          }}
          accessibilityRole="button"
          style={styles.button}
        >
          <Text style={styles.buttonText}>SHARE CODE {open.joinCode}</Text>
        </Pressable>
      ) : null}
      {/* Join requests: only the teacher, who knows the family, lets a child in (child safety). */}
      {open && pending.length ? (
        <View style={[styles.kid, { borderColor: P.gold }]}>
          <Text style={styles.title}>Waiting for you ({pending.length})</Text>
          {pending.map((k) => (
            <View key={k.uid} style={styles.rowBetween}>
              <Text style={[styles.line, { flex: 1 }]} numberOfLines={2}>
                {k.firstName || "Child"} · Class {k.grade || "?"} · {k.parentName ? `parent: ${k.parentName}${k.relation ? ` (${k.relation})` : ""}` : "parent: linked account ✓"}
              </Text>
              <Pressable onPress={() => decide(k, true)} hitSlop={6} style={styles.chip}>
                <Text style={[styles.line, { color: P.correctText }]}>Approve</Text>
              </Pressable>
              <Pressable onPress={() => decide(k, false)} hitSlop={6} style={styles.chip}>
                <Text style={[styles.line, { color: P.wrongText }]}>Reject</Text>
              </Pressable>
            </View>
          ))}
          <Text style={styles.soft}>Only approve children you know, with the parent named here.</Text>
        </View>
      ) : null}
      {open && rows ? <AssignPanel cls={open} uid={uid} kids={rows} P={P} styles={styles} /> : null}
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
    chips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    chip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 14, borderWidth: 1, borderColor: P.border },
    chipOn: { borderColor: P.selectedBorder, backgroundColor: P.selectedBg },
    input: { height: 44, borderRadius: 12, borderWidth: 1, borderColor: P.border, color: P.text, paddingHorizontal: 12, fontFamily: "nunitoBold" },
    button: { height: 48, borderRadius: 14, backgroundColor: P.primary, alignItems: "center", justifyContent: "center" },
    buttonText: { color: P.onPrimary, fontSize: 15, fontFamily: "nunitoBold", letterSpacing: 0.5 },
  });

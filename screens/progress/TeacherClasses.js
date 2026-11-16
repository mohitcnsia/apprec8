// screens/progress/TeacherClasses.js
// RB-2 phase A: a teacher's own classes in the Progress tab. Pick a class → each kid's progress in the quests of the
// teacher's subjects only (English teacher → English Quest + Word Power; Science teacher → Science Quest).
// Reads: classes (teacherIds contains me), members, and each member's questProgress (rules: DR-9). One-time reads.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { loadProgress, progressReadAt, pullRefreshAllowed } from "../../services/progressCache";
import { updatedText } from "../../utils/refreshSlots";
import { makeTtlCache } from "../../utils/ttlCache";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { authInstance } from "../../config/firebaseConfig";
import { myTeachingClasses, classMembers, approveMember, leaveClass } from "../../services/classesApi";
import { questsForTeacher, classLabel } from "../../utils/classes";
import { getClassLink, markNotSure } from "../../services/joinApi";
import { shareInvite } from "../../services/invite";
import JoinRequestCard from "../../components/teacher/JoinRequestCard";
import BulkApproveCard from "../../components/teacher/BulkApproveCard";
import { markGuide } from "../../services/guideFacts";
import { teacherWeek } from "../../utils/weeklySummary";
import TeacherWeekCard from "../../components/teacher/TeacherWeekCard";
import TopicViewCard from "../../components/teacher/TopicViewCard";
import { summarize, accuracy, weakTopics, timeAgo } from "../../utils/kidStats";
import { bundledQuest } from "../../data/quests";
import { topicTitle } from "../../data/papers";
import { classCheckup } from "../../utils/paperTopics";
import { topicNamer } from "../../utils/progressView";
import { nodesForGrade } from "../../utils/gradeFilter";
import { createAssignment, listAssignments, deleteAssignment, remindAssignment } from "../../services/assignmentsApi";
import { computeAssignmentResults, computeStarOfTheWeek } from "../../utils/assignmentResults";
import { dayKey } from "../../utils/kidStats";
import { showAlert } from "../../services/dialog";
import AppButton from "../../components/common/AppButton";

// Owner, 2026-11-10: switching tabs must be instant and not re-read the class. Rows drawn last time (per teacher and
// class) show at once; the member list is re-read at most every 2 minutes (join requests stay timely).
const rowsCache = new Map();
const membersCache = makeTtlCache({ freshMs: 2 * 60 * 1000 });

function AssignPanel({ cls, uid, kids, P, styles }) {
  const questIds = questsForTeacher(cls, uid);
  const [questId, setQuestId] = useState(questIds[0] || null);
  const [picked, setPicked] = useState([]);
  const [who, setWho] = useState([]); // empty = whole class
  const [due, setDue] = useState(7);
  const [note, setNote] = useState("");
  const [list, setList] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [reminding, setReminding] = useState({});

  const reload = () =>
    listAssignments(cls.id)
      .then((items) => {
        setList(items);
        setExpandedId((prev) => (prev ? prev : items[0]?.id || null));
      })
      .catch(() => setList([]));

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

  const handleRemindOne = async (a, student) => {
    const k = `${a.id}:${student.uid}`;
    setReminding((prev) => ({ ...prev, [k]: true }));
    try {
      const mistakesMap = { [student.uid]: student.mistakesLeft };
      await remindAssignment({
        classId: cls.id,
        assignmentId: a.id,
        assignmentTitle: (a.nodeTitles || []).join(", ") || "Assignment",
        toUids: [student.uid],
        mistakesMap,
      });
      showAlert("Reminded", `Sent reminder to ${student.name}.`);
    } catch (e) {
      setReminding((prev) => {
        const copy = { ...prev };
        delete copy[k];
        return copy;
      });
      showAlert("Couldn't remind", e.message);
    }
  };

  const handleRemindAll = async (a, students) => {
    const toRemind = students.filter((s) => s.status !== "done" && s.canRemind && !reminding[`${a.id}:${s.uid}`]);
    if (!toRemind.length) return;
    const updates = {};
    const mistakesMap = {};
    toRemind.forEach((s) => {
      updates[`${a.id}:${s.uid}`] = true;
      mistakesMap[s.uid] = s.mistakesLeft;
    });
    setReminding((prev) => ({ ...prev, ...updates }));
    try {
      const res = await remindAssignment({
        classId: cls.id,
        assignmentId: a.id,
        assignmentTitle: (a.nodeTitles || []).join(", ") || "Assignment",
        toUids: toRemind.map((s) => s.uid),
        mistakesMap,
      });
      showAlert("Reminded", `Sent reminder to ${res?.reminded ?? toRemind.length} student(s).`);
    } catch (e) {
      setReminding((prev) => {
        const copy = { ...prev };
        toRemind.forEach((s) => delete copy[`${a.id}:${s.uid}`]);
        return copy;
      });
      showAlert("Couldn't remind", e.message);
    }
  };

  const star = computeStarOfTheWeek(kids);

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
      {list.map((a) => {
        const isExpanded = expandedId === a.id;
        const res = isExpanded ? computeAssignmentResults(a, kids, (q) => bundledQuest(q)?.nodes || []) : null;
        const canRemindAny = res ? res.students.some((s) => s.status !== "done" && s.canRemind && !reminding[`${a.id}:${s.uid}`]) : false;

        return (
          <View key={a.id} style={styles.assignmentBox}>
            <Pressable
              onPress={() => setExpandedId(isExpanded ? null : a.id)}
              style={styles.rowBetween}
              accessibilityRole="button"
              accessibilityLabel={`Assignment ${(a.nodeTitles || []).join(", ")}`}
            >
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.title} numberOfLines={2}>
                  {(a.nodeTitles || []).join(", ")}
                </Text>
                <Text style={styles.soft}>
                  {a.kidIds?.length ? `${a.kidIds.length} kid(s)` : "whole class"}
                  {a.dueDate ? ` · due ${a.dueDate}` : ""}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Pressable onPress={() => deleteAssignment(cls.id, a.id).then(reload)} hitSlop={8} accessibilityLabel="Remove assignment">
                  <Text style={[styles.soft, { color: P.wrongText }]}>Remove</Text>
                </Pressable>
                <Text style={[styles.title, { color: P.textSoft }]}>{isExpanded ? "▲" : "▼"}</Text>
              </View>
            </Pressable>

            {isExpanded && res ? (
              <View style={{ gap: 8, marginTop: 4 }}>
                <Text style={styles.line}>{res.summary.topLine}</Text>

                <View style={styles.bar}>
                  <View style={{ flex: res.summary.done || 0.0001, backgroundColor: P.correctBorder }} />
                  <View style={{ flex: res.summary.fixingMistakes || 0.0001, backgroundColor: P.gold }} />
                  <View style={{ flex: res.summary.halfway || 0.0001, backgroundColor: P.selectedBorder }} />
                  <View style={{ flex: res.summary.notStarted || 0.0001, backgroundColor: P.border }} />
                </View>

                {star ? (
                  <View style={styles.starCard}>
                    <View style={styles.rowBetween}>
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text style={styles.starTitle}>{star.shortShareText}</Text>
                        <Text style={styles.soft}>Accuracy {star.student.accuracy}% · {star.student.answered} questions</Text>
                      </View>
                      <Pressable
                        onPress={() => Share.share({ message: star.shortShareText })}
                        style={styles.shareBtn}
                        accessibilityRole="button"
                        accessibilityLabel="Share star of the week to WhatsApp"
                      >
                        <Text style={styles.shareBtnText}>Share 💬</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : null}

                <AppButton variant="soft" icon="notifications-outline" label="Remind all not done" disabled={!canRemindAny} onPress={() => handleRemindAll(a, res.students)} style={{ alignSelf: "flex-start" }} />

                {res.students.map((s) => {
                  const alreadyReminded = !s.canRemind || reminding[`${a.id}:${s.uid}`];
                  return (
                    <View key={s.uid} style={styles.studentRow}>
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text style={styles.studentName}>{s.name}</Text>
                        <Text style={styles.soft}>
                          {s.statusLabel} · {s.accuracyLabel}
                        </Text>
                      </View>
                      {s.status !== "done" ? (
                        alreadyReminded ? (
                          <Text style={[styles.soft, { fontSize: 13 }]}>Reminded today</Text>
                        ) : (
                          <AppButton variant="soft" size="sm" icon="notifications-outline" label="Remind" accessibilityLabel={`Remind ${s.name}`} onPress={() => handleRemindOne(a, s)} />
                        )
                      ) : (
                        <Text style={{ color: P.correctText, fontFamily: "nunitoBold", fontSize: 14 }}>✓</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

/** The weekly card's input from the rows this screen already loaded (no extra reads). */
function weekOf(cls, rows, assignments) {
  const nodes = rows[0]?.perQuest.flatMap((p) => bundledQuest(p.q)?.nodes || []) || [];
  const namer = topicNamer(nodes);
  const titles = Object.fromEntries(nodes.map((n) => [n.id, n.title]));
  const kids = rows.map((r) => ({ uid: r.uid, firstName: r.firstName, quests: r.perQuest.map((p) => ({ questId: p.q, stats: p.stats, nodes: p.nodes, mistakes: p.mistakesMap || p.mistakes })) }));
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
  const [approved, setApproved] = useState([]); // kids in the open class (for the topic view)
  const [error, setError] = useState(null);
  const [pending, setPending] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [assignments, setAssignments] = useState([]);
  const [readAt, setReadAt] = useState(null); // oldest progress read shown: "Updated 7:35 am"
  const lastForced = useRef(0);
  const forceNext = useRef(false); // after approving / declining: re-read the member list
  const decide = (kid, approve, parentSaidYes = null) =>
    approveMember({ classId: open.id, kidUid: kid.uid, approve, parentSaidYes })
      .then(() => {
        forceNext.current = true;
        setReloadKey((k) => k + 1);
      })
      .catch((e) => showAlert("Couldn't do that", e.message));
  // G97 (Gemini, merged 2026-11-12): remove an approved kid from the class; their own progress stays.
  const confirmRemove = (kid) => {
    const kidName = kid.firstName || "this child";
    showAlert(`Remove ${kidName} from ${open ? classLabel(open) : "this class"}?`, "Their own progress stays. They can ask to join again with the class link.", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => decide(kid, false) },
    ]);
  };
  const notSure = (kid) =>
    markNotSure(open.id, kid.uid)
      .then(() => {
        forceNext.current = true;
        setReloadKey((k) => k + 1);
      })
      .catch((e) => showAlert("Couldn't do that", e.message));
  // Sign-up without codes (2026-11-11), then (12 Nov) one invite instead of the class link. Turning the old link off if it was forwarded
  // too far: the old link stops working.
  const teacherName = (authInstance.currentUser?.displayName || "").trim().split(/\s+/)[0] || null;
  // One invite for every teacher (owner, 12 Nov): steps that end at "Join your class"; no class link to forward.
  const invite = () => shareInvite({ className: open.name, schoolName: open.schoolName, teacherName }).catch(() => {});
  // An old class link that went too far: turn it off (it is no longer shared; families join with the Home button).
  const offOldLink = () =>
    showAlert("Turn off the old class link?", "Anyone with the old link can no longer use it. Families join with the Home button instead.", [
      { text: "Cancel", style: "cancel" },
      { text: "Turn off", onPress: () => getClassLink(open.id, { renew: true }).then(() => showAlert("Done", "The old class link no longer works.")).catch((e) => showAlert("Couldn't do that", e?.message || "Try again.")) },
    ]);

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
    // Owner, 2026-11-10: fast and cheap. Show what was loaded before at once (no spinner when switching tabs); each
    // child's progress is read fresh only after 7:30 am / 7:30 pm (services/progressCache.js), all at the same time,
    // and a pull-down (refreshTrigger) reads fresh.
    const force = refreshTrigger > lastForced.current;
    lastForced.current = refreshTrigger;
    const forceMembers = force || forceNext.current;
    forceNext.current = false;
    const cacheKey = `${uid}|${open.id}`;
    setApproved([]); // another class: its own kids only
    if (rowsCache.has(cacheKey)) setRows(rowsCache.get(cacheKey));
    else setRows(null);
    const questIds = questsForTeacher(open, uid);
    (async () => {
      try {
        const all = await membersCache.get(cacheKey, () => classMembers(open.id), { force: forceMembers });
        setPending(all.filter((m) => m.status === "pending" || m.status === "unsure"));
        const members = all.filter((m) => m.status === "approved");
        setApproved(members.map((m) => ({ uid: m.uid, firstName: m.firstName })));
        const out = await Promise.all(
          members.map(async (m) => {
            const perQuest = await Promise.all(
              questIds.map(async (q) => {
                const d = await loadProgress(m.uid, q, { force }).catch(() => null);
                const stats = d?.stats || {};
                const mistakes = Object.keys(d?.mistakes || {}).length;
                const namer = topicNamer(bundledQuest(q)?.nodes || []);
                const week = summarize(stats, "week");
                const weak = weakTopics(stats)[0];
                return { q, week, acc: accuracy(week), mistakes, mistakesMap: d?.mistakes || {}, weak: weak ? namer(weak.subtopic) : null, last: stats.lastActiveAt || 0, stats, nodes: d?.nodes || {}, checkups: d?.checkups || null };
              })
            );
            return { ...m, perQuest, last: Math.max(0, ...perQuest.map((p) => p.last)) };
          })
        );
        out.sort((a, b) => b.last - a.last);
        const reads = members.flatMap((m) => questIds.map((q) => progressReadAt(m.uid, q))).filter(Number.isFinite);
        setReadAt(reads.length ? Math.min(...reads) : null);
        rowsCache.set(cacheKey, out);
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
          <Text style={styles.soft}>{c.schoolName} · Class {c.grade}</Text>
        </Pressable>
      ))}
      {/* Redesign doc (owner YES): the teacher's top card is the most urgent thing, so kids waiting to join come first. */}
      {/* Join requests: only the teacher, who knows the family, lets a child in (child safety). Not sure → the
          follow-up list (the teacher and the owner call the parent). */}
      {open && pending.some((k) => k.status !== "unsure") ? (
        <View style={{ gap: 8 }}>
          <Text style={styles.title}>New in your class ({pending.filter((k) => k.status !== "unsure").length})</Text>
          {/* Owner, 12 Nov: they are already learning; confirming adds them to the class board with their classmates. */}
          <Text style={styles.soft}>Already learning. Confirm the ones you know to show them their classmates; remove anyone who isn't yours.</Text>
          {/* 50 students at once (owner, 2026-11-12): tick the ones whose parents said YES, approve together. */}
          <BulkApproveCard
            kids={pending.filter((k) => k.status !== "unsure")}
            P={P}
            approveOne={(kid, how) => approveMember({ classId: open.id, kidUid: kid.uid, approve: true, parentSaidYes: how })}
            onDone={() => {
              forceNext.current = true;
              setReloadKey((k) => k + 1);
            }}
          />
          {pending
            .filter((k) => k.status !== "unsure")
            .map((k) => (
              <JoinRequestCard key={k.uid} k={k} P={P} onApprove={(how) => decide(k, true, how)} onNotSure={() => notSure(k)} onDecline={() => decide(k, false)} />
            ))}
        </View>
      ) : null}
      {open && pending.some((k) => k.status === "unsure") ? (
        <View style={{ gap: 8 }}>
          <Text style={styles.title}>Follow up · not sure ({pending.filter((k) => k.status === "unsure").length})</Text>
          <Text style={styles.soft}>Call the parent to check. You and Apprec8 both see this list.</Text>
          {pending
            .filter((k) => k.status === "unsure")
            .map((k) => (
              <JoinRequestCard key={k.uid} k={k} P={P} onApprove={(how) => decide(k, true, how)} onDecline={() => decide(k, false)} />
            ))}
        </View>
      ) : null}
      {/* Topic view (DR-35): one summary document per class, topics worst first. */}
      {open && approved.length ? <TopicViewCard classId={open.id} members={approved} questIds={questsForTeacher(open, uid)} refreshKey={refreshTrigger} P={P} /> : null}
      {/* "This week" (mockup V4): reteach one thing, who needs you, the assignment. */}
      {open && rows?.length ? <TeacherWeekCard week={weekOf(open, rows, assignments)} className={classLabel(open)} classId={String(open.id).startsWith("demo_") ? null : open.id} P={P} /> : null}
      {open && rows?.length && readAt ? <Text style={styles.soft}>{updatedText(readAt)}{pullRefreshAllowed() ? " · pull down for the latest" : ""}</Text> : null}
      {/* G91: the week-1 check-up, whole class by topic (only kids who took it; names only for the teacher). */}
      {open && rows?.length ? <CheckupCard rows={rows} P={P} styles={styles} /> : null}
      {/* Guide step 2: invite families (WhatsApp): one message with steps that end at the app's "Join your class". */}
      {open && !String(open.id).startsWith("demo_") ? (
        <>
          <Pressable onPress={invite} accessibilityRole="button" style={styles.button}>
            <Text style={styles.buttonText}>INVITE FAMILIES</Text>
          </Pressable>
          <Pressable onPress={offOldLink} accessibilityRole="button" hitSlop={8} style={{ alignSelf: "center", minHeight: 40, justifyContent: "center" }}>
            <Text style={styles.soft}>Old class link sent too far? Turn it off ›</Text>
          </Pressable>
        </>
      ) : null}
      {open && rows ? <AssignPanel cls={open} uid={uid} kids={rows} P={P} styles={styles} /> : null}
      {open && rows === null ? <ActivityIndicator color={P.label} /> : null}
      {open && rows?.length === 0 ? <Text style={styles.soft}>No children yet. Tap INVITE FAMILIES and send it to your class WhatsApp group.</Text> : null}
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
              {!String(open.id).startsWith("demo_") ? (
                <AppButton variant="danger" size="sm" icon="person-remove-outline" label="Remove" accessibilityLabel={`Remove ${k.firstName || "child"} from class`} onPress={() => confirmRemove(k)} style={{ alignSelf: "flex-end" }} />
              ) : null}
            </View>
          ))
        : null}
      {/* Owner, 16 Nov 2026: a teacher can stop teaching a class (server: leaveClass; the last teacher of a class with
          children is refused, so the children always have someone). */}
      {open ? (
        <Pressable
          onPress={() =>
            showAlert(`Stop teaching ${classLabel(open)}?`, "The class and the children's progress stay. You can be added back by the school.", [
              { text: "Keep teaching", style: "cancel" },
              {
                text: "Stop teaching",
                style: "destructive",
                onPress: () =>
                  leaveClass({ classId: open.id, role: "teacher" })
                    .then(() => {
                      setClasses((list) => (list || []).filter((c) => c.id !== open.id));
                      setOpen(null);
                    })
                    .catch((e) => showAlert("Couldn't do that", e?.message || String(e))),
              },
            ])
          }
          accessibilityRole="button"
          style={{ alignSelf: "center", minHeight: 44, paddingHorizontal: 16, justifyContent: "center", marginTop: 8 }}
        >
          <Text style={[styles.soft, { color: P.wrongText, fontFamily: "nunitoBold" }]}>Stop teaching {classLabel(open)}</Text>
        </Pressable>
      ) : null}
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
    assignmentBox: { padding: 12, borderRadius: 14, borderWidth: 1, borderColor: P.border, backgroundColor: P.card, gap: 6 },
    bar: { flexDirection: "row", height: 8, borderRadius: 4, overflow: "hidden", marginVertical: 6, gap: 2 },
    starCard: { padding: 10, borderRadius: 14, borderWidth: 1.5, borderColor: P.gold, backgroundColor: P.card, marginVertical: 4 },
    starTitle: { fontSize: 15, fontFamily: "nunitoBold", color: P.text },
    shareBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, backgroundColor: P.selectedBg, borderWidth: 1, borderColor: P.selectedBorder },
    shareBtnText: { fontSize: 13, fontFamily: "nunitoBold", color: P.selectedText },
    remindAllBtn: { height: 38, borderRadius: 12, borderWidth: 1.5, borderColor: P.selectedBorder, alignItems: "center", justifyContent: "center", marginVertical: 4 },
    remindAllText: { fontSize: 13, fontFamily: "nunitoBold", color: P.selectedText },
    studentRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8, borderTopWidth: 1, borderTopColor: P.border },
    studentName: { fontSize: 15, fontFamily: "nunitoBold", color: P.text },
    remindBtn: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: P.selectedBorder },
    remindBtnText: { fontSize: 12, fontFamily: "nunitoBold", color: P.selectedText },
  });

function CheckupCard({ rows, P, styles }) {
  const kids = rows.map((r) => ({ firstName: r.firstName, checkups: r.perQuest.find((p) => p.q === "english-quest")?.checkups || null }));
  const { took, topics } = classCheckup(kids);
  if (!took) return null;
  const namer = (node) => topicTitle({ quest: "english-quest", node });
  return (
    <View style={[styles.card, { gap: 8 }]}>
      <Text style={styles.title}>Check-up by topic</Text>
      <Text style={styles.soft}>{took} of {rows.length} children took it · weakest first · Accuracy</Text>
      {topics.map((t) => (
        <View key={t.node}>
          <Text style={styles.title}>
            {namer(t.node)} · {t.accuracy}%
          </Text>
          {t.weakKids.length ? (
            <Text style={styles.soft} numberOfLines={2}>
              Under 60%: {t.weakKids.join(", ")}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}

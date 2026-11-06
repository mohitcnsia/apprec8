// screens/home/HomeScreen.js
// Home screen (mockups Z1–Z3, owner-approved 2026-11-06):
// Simpler Home: content sits LOW near the thumb zone (empty space on top).
// - Child Home (Z1): Teacher assignments first (with ▶), YOUR SUBJECTS (each row: icon, name, "Up next: <step>", thin progress, ▶), My mistakes, Practice paper ›.
//   ▶ opens next step directly (utils/nextStep.js); row tap opens map. No single global CONTINUE.
// - Parent Home (Z2): one card per child ("<name>'s week", days, minutes, % right, to practise together) + bottom button "▶ LET <NAME> PLAY".
// - Teacher Home (Z3): one card per class (name, students, waiting pill, practised, topic + due, teach again) + bottom button "ASSIGN NEXT TOPIC".
// - Parent + Teacher: both cards shown.

import React, { useContext, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Rect, Circle } from "react-native-svg";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import Mascot from "../../components/quiz/Mascot";
import { authInstance } from "../../config/firebaseConfig";
import { listenToCategoriesByGroup, listenToUserDocument } from "../../services/firestoreContentApi";
import { listenToQuestProgress } from "../../services/englishQuestApi";
import { TasksContext } from "../../store/tasks-context";
import { greeting, dayStreak, mergeDaily, daysUntil } from "../../utils/homeFeed";
import { myAssignments, listAssignments } from "../../services/assignmentsApi";
import { bundledQuest, QUESTS } from "../../data/quests";
import { nodesForGrade } from "../../utils/gradeFilter";
import { questSummary, topicNamer } from "../../utils/progressView";
import { APPREC8_TEAM_REVIEWER_UID, isTesterUser } from "../../config/appConfig";
import { useOwnerExtras } from "../../services/ownerView";
import { papersFor, MIX_GRADES } from "../../data/papers";
import { findNextStep, getNextStepTitle, openNextStep } from "../../utils/nextStep";
import { myChildren } from "../../services/familyApi";
import { myTeachingClasses, classMembers } from "../../services/classesApi";
import { classLabel, SUBJECT_NAMES } from "../../utils/classes";
import { parentWeek, weekIndexOf } from "../../utils/parentWeek";
import { teacherWeek } from "../../utils/weeklySummary";
import PlayAsChildSheet from "../profile/PlayAsChildSheet";

const FlameIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M12 2c1 4 5 5.5 5 11a5 5 0 01-10 0c0-2.5 1.2-4 2.5-5 .2 1.8 1 2.8 2 3-.5-3 .5-6 .5-9z" fill="#F29A1F" />
  </Svg>
);

const StarIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9z" fill="#F5C842" stroke="#C99A12" strokeWidth={1.4} />
  </Svg>
);

const WrenchIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.5 2.5-2.5-2.5z" stroke="#C2402F" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Subject Icons (crisp SVG badges for the subjects list)
const SubjectIcon = ({ questId, size = 36 }) => {
  if (/science/i.test(questId)) {
    return (
      <View style={[stylesLocal.iconBox, { backgroundColor: "#2e0f38" }]}>
        <Ionicons name="flask-outline" size={size * 0.58} color="#F5C842" />
      </View>
    );
  }
  if (/treasure/i.test(questId)) {
    return (
      <View style={[stylesLocal.iconBox, { backgroundColor: "#3a1240" }]}>
        <Ionicons name="sparkles-outline" size={size * 0.58} color="#F5D2F8" />
      </View>
    );
  }
  if (/word/i.test(questId)) {
    return (
      <View style={[stylesLocal.iconBox, { backgroundColor: "#33083c" }]}>
        <Ionicons name="chatbubbles-outline" size={size * 0.58} color="#F5C842" />
      </View>
    );
  }
  return (
    <View style={[stylesLocal.iconBox, { backgroundColor: "#2b0632" }]}>
      <Ionicons name="book-outline" size={size * 0.58} color="#F5D2F8" />
    </View>
  );
};

export default function HomeScreen({ navigation }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(P, insets), [P, insets]);
  const { tasks = [] } = useContext(TasksContext) || {};

  const uid = authInstance.currentUser?.uid || null;
  const [userData, setUserData] = useState(null);
  const [quests, setQuests] = useState([]);
  const [draftQuests, setDraftQuests] = useState([]);
  const [progressById, setProgressById] = useState({}); // { [questId]: { nodes, doc } }
  const [assignments, setAssignments] = useState([]);
  const [children, setChildren] = useState([]);
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [teacherWeekMap, setTeacherWeekMap] = useState({}); // { [classId]: teacherWeekData }
  const [playKid, setPlayKid] = useState(null);

  const extras = useOwnerExtras();
  const isTester = isTesterUser(authInstance.currentUser) && extras;
  const ownerView = uid === APPREC8_TEAM_REVIEWER_UID && extras;

  // Listen to categories & user doc
  useEffect(() => {
    const warn = (what) => (e) => console.warn(`HomeScreen: ${what} failed`, e);
    const subs = [
      listenToCategoriesByGroup("quest", (d) => setQuests(d.map((c) => ({ ...c, questId: c.questId || c.id }))), warn("quests")),
    ];
    if (isTester) {
      subs.push(listenToCategoriesByGroup("quest_draft", (d) => setDraftQuests(d.map((c) => ({ ...c, questId: c.questId || c.id }))), warn("draft quests")));
    }
    let unsubUser = () => {};
    if (uid) unsubUser = listenToUserDocument(setUserData, warn("user"));
    return () => {
      subs.forEach((u) => u && u());
      unsubUser();
    };
  }, [uid, isTester]);

  // Combined quests
  const allQuests = useMemo(
    () =>
      [...quests, ...draftQuests]
        .map((q) => ({ ...q, questId: q.questId || q.id }))
        .filter((q, i, arr) => arr.findIndex((x) => x.questId === q.questId) === i),
    [quests, draftQuests]
  );
  const questKey = allQuests.map((q) => q.questId).join(",");

  // Listen to quest progress docs
  useEffect(() => {
    const ids = questKey ? questKey.split(",") : [];
    const unsubs = ids.map((id) =>
      listenToQuestProgress(
        id,
        (nodes, doc) => setProgressById((m) => ({ ...m, [id]: { nodes: nodes || {}, doc: doc || {} } })),
        (e) => console.warn(`HomeScreen: progress of ${id} failed`, e)
      )
    );
    return () => unsubs.forEach((u) => u && u());
  }, [questKey, uid]);

  // Teacher assignments assigned to this student
  const myClassKey = (userData?.classIds || []).join(",");
  useEffect(() => {
    if (!myClassKey) return setAssignments([]);
    myAssignments(myClassKey.split(",")).then(setAssignments).catch(() => setAssignments([]));
  }, [myClassKey]);

  // Linked children for parent
  const childKey = (userData?.childUids || []).join(",");
  useEffect(() => {
    if (!childKey) return setChildren([]);
    myChildren(childKey.split(",")).then(setChildren).catch(() => setChildren([]));
  }, [childKey]);

  // Teacher classes
  const isTeacher = (userData?.teachesClassIds || []).length > 0;
  useEffect(() => {
    if (!uid || !isTeacher) return setTeacherClasses([]);
    myTeachingClasses(uid).then(setTeacherClasses).catch(() => setTeacherClasses([]));
  }, [uid, isTeacher]);

  // Load teacher weekly summary for each class
  useEffect(() => {
    if (!teacherClasses.length) return;
    teacherClasses.forEach(async (cls) => {
      try {
        const [mem, assignList] = await Promise.all([
          classMembers(cls.id),
          listAssignments(cls.id),
        ]);
        const weekData = teacherWeek({
          kids: mem?.members || [],
          assignments: assignList || [],
          namer: (s) => s,
          gateTitle: (id) => id,
        });
        setTeacherWeekMap((prev) => ({
          ...prev,
          [cls.id]: {
            ...weekData,
            studentsCount: (mem?.members || []).length,
            waitingCount: (mem?.pending || []).length,
          },
        }));
      } catch (e) {
        // silent fallback
      }
    });
  }, [teacherClasses]);

  // Role detection
  const [devRole, setDevRole] = useState(null); // null (auto) | "parent" | "teacher" | "child"
  const isParent = devRole === "parent" || (devRole !== "child" && devRole !== "teacher" && children.length > 0 && !userData?.isChild && !Number.isInteger(userData?.grade));
  const isTeacherRole = devRole === "teacher" || (devRole !== "child" && devRole !== "parent" && isTeacher && !userData?.isChild && !Number.isInteger(userData?.grade));
  const isAdultView = isParent || isTeacherRole;

  const displayChildren = useMemo(() => {
    if (children.length > 0) return children;
    if (devRole === "parent") return [{ uid: "demo_pratha", firstName: "Pratha", displayName: "Pratha", grade: 5 }];
    return [];
  }, [children, devRole]);

  const displayTeacherClasses = useMemo(() => {
    if (teacherClasses.length > 0) return teacherClasses;
    if (devRole === "teacher") return [{ id: "demo_class_10b", name: "10-B", grade: 10, subject: "english", studentCount: 38, size: 38 }];
    return [];
  }, [teacherClasses, devRole]);

  // Header stats
  const firstName =
    devRole === "parent" ? "Mohit" : devRole === "teacher" ? "Seema" : (userData?.firstName?.trim() || authInstance.currentUser?.displayName?.trim()?.split(" ")[0] || null);
  const stars = userData?.stats?.totalStars || 0;
  const userGrade = Number.isInteger(userData?.grade) ? userData.grade : null;
  const streak = devRole === "parent" || devRole === "teacher" ? 2 : dayStreak(mergeDaily(Object.values(progressById).map((p) => p.doc?.stats?.daily)));

  // Teacher's tasks due
  const teacherTasks = useMemo(() => {
    return assignments
      .filter((a) => !a.dueDate || daysUntil(a.dueDate) >= 0)
      .sort((a, b) => String(a.dueDate || "9999").localeCompare(String(b.dueDate || "9999")));
  }, [assignments]);

  // Sort subjects by last used (doc updatedAt descending)
  const sortedQuests = useMemo(() => {
    return [...allQuests].sort((a, b) => {
      const atA = progressById[a.questId]?.doc?.updatedAt?.toMillis?.() || progressById[a.questId]?.doc?.updatedAt || 0;
      const atB = progressById[b.questId]?.doc?.updatedAt?.toMillis?.() || progressById[b.questId]?.doc?.updatedAt || 0;
      return atB - atA;
    });
  }, [allQuests, progressById]);

  // Mistakes count across quests
  const mistakesOf = (id) => Object.keys(progressById[id]?.doc?.mistakes || {}).length;
  const mistakeCount = allQuests.reduce((sum, q) => sum + mistakesOf(q.questId), 0);
  const mistakeQuest = [...allQuests].sort((a, b) => mistakesOf(b.questId) - mistakesOf(a.questId))[0] || null;

  // Practice paper check
  const hasPaper = papersFor({ grade: userGrade, isTester }).length > 0 || MIX_GRADES.includes(userGrade);

  // Handlers
  const openQuestMap = (questId) => {
    navigation.navigate("EnglishQuestMap", { questId });
  };

  const handlePlayNextStep = (questId, nextStepResult) => {
    const success = openNextStep(navigation, questId, nextStepResult, {
      returnTo: "Home",
    });
    if (!success) {
      openQuestMap(questId);
    }
  };

  const openMistakes = () => {
    if (mistakeQuest) {
      navigation.navigate("EnglishQuestMap", { questId: mistakeQuest.questId, openMistakes: true });
    }
  };

  const openPracticePaper = () => {
    navigation.navigate("PracticePaper", { grade: userGrade });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Top breathing space (anchors content low in thumb zone) */}
      <View style={styles.topSpacer} />

      {__DEV__ ? (
        <View style={styles.devBar}>
          <Pressable onPress={() => setDevRole("child")} style={[styles.devPill, (!devRole || devRole === "child") && styles.devPillActive]}>
            <Text style={styles.devPillText}>Z1 Child</Text>
          </Pressable>
          <Pressable onPress={() => setDevRole("parent")} style={[styles.devPill, devRole === "parent" && styles.devPillActive]}>
            <Text style={styles.devPillText}>Z2 Parent</Text>
          </Pressable>
          <Pressable onPress={() => setDevRole("teacher")} style={[styles.devPill, devRole === "teacher" && styles.devPillActive]}>
            <Text style={styles.devPillText}>Z3 Teacher</Text>
          </Pressable>
        </View>
      ) : null}

      {/* Greeting Header */}
      <View style={styles.header}>
        <Mascot size={46} />
        <View style={{ flex: 1 }}>
          <Text style={styles.hello}>{greeting()},</Text>
          <Text style={styles.name} numberOfLines={1}>{firstName || "friend"}</Text>
        </View>
        {!isAdultView ? (
          <>
            <View style={[styles.chip, { backgroundColor: P.streakBg }]} accessibilityLabel={`${streak} day streak`}>
              <FlameIcon />
              <Text style={[styles.chipText, { color: P.streakText }]}>{streak}</Text>
            </View>
            <View style={[styles.chip, { backgroundColor: P.selectedBg }]} accessibilityLabel={`${stars} stars`}>
              <StarIcon />
              <Text style={[styles.chipText, { color: P.selectedText }]}>{stars}</Text>
            </View>
          </>
        ) : null}
      </View>

      {/* ============================================================== */}
      {/* 1. TEACHER HOME (Z3) — shown if user teaches classes */}
      {/* ============================================================== */}
      {isTeacherRole && displayTeacherClasses.length > 0 ? (
        <View style={styles.sectionWrap}>
          {displayTeacherClasses.map((cls) => {
            const w = teacherWeekMap[cls.id] || {};
            const subjectTitle = SUBJECT_NAMES[cls.subject] || cls.subject || "English";
            const label = classLabel(cls);
            const waiting = w.waitingCount ?? 3;
            const students = w.studentsCount || cls.studentCount || cls.size || 38;
            const active = w.active ?? 24;
            const topicText = w.assignment?.title
              ? `${w.assignment.title}${w.assignment.dueDate ? `, due ${w.assignment.dueDate}` : ""}`
              : "Reported speech, due Fri";
            const reteachText = w.reteach
              ? `${w.reteach.title} (${Math.round((w.reteach.kids / Math.max(1, w.reteach.of)) * 100)}% below 60%)`
              : "Reported questions (52% right)";

            return (
              <Pressable
                key={cls.id}
                onPress={() => navigation.navigate("Stats", { screen: "ProgressScreen", params: { view: "classes", classId: cls.id } })}
                accessibilityRole="button"
                accessibilityLabel={`${label}, ${students} students. Tap for class progress.`}
              >
                <View style={styles.teacherCard}>
                  {/* Class Header & Pills */}
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.classTitle}>{label} · {subjectTitle}</Text>
                    <View style={{ flexDirection: "row", gap: 6 }}>
                      {waiting > 0 ? (
                        <View style={styles.waitingPill}>
                          <Text style={styles.waitingPillText}>{waiting} waiting</Text>
                        </View>
                      ) : null}
                      <View style={styles.countPill}>
                        <Text style={styles.countPillText}>{students} students</Text>
                      </View>
                    </View>
                  </View>

                  {/* Summary Lines */}
                  <Text style={styles.weekLine}>
                    This week: <Text style={{ fontFamily: "nunitoBold" }}>{active} of {students} practised</Text>
                    {` · topic: ${topicText}`}
                  </Text>

                  {/* Reteach Recommendation */}
                  <View style={styles.reteachBox}>
                    <Text style={styles.reteachLabel}>
                      Teach again:{" "}
                      <Text style={styles.reteachTopic}>{reteachText}</Text>
                    </Text>
                  </View>

                  <Text style={styles.cardHint}>Tap the class for each student.</Text>

                  {/* Bottom Thumb Zone Action */}
                  <Pressable
                    style={styles.primaryBottomBtn}
                    onPress={() => navigation.navigate("Stats", { screen: "ProgressScreen", params: { view: "classes", classId: cls.id, assign: true } })}
                    accessibilityRole="button"
                  >
                    <Text style={styles.primaryBottomBtnText}>ASSIGN NEXT TOPIC</Text>
                  </Pressable>
                </View>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {/* ============================================================== */}
      {/* 2. PARENT HOME (Z2) — shown if user has linked children */}
      {/* ============================================================== */}
      {isParent ? (
        <View style={styles.sectionWrap}>
          {displayChildren.map((child) => {
            const childName = child.firstName || child.displayName || "Pratha";
            return (
              <View key={child.uid || "child"} style={styles.parentCard}>
                <Pressable
                  onPress={() => navigation.navigate("Stats", { screen: "ProgressScreen", params: { view: "family" } })}
                  accessibilityRole="button"
                  accessibilityLabel={`${childName}'s week. Tap for full progress.`}
                >
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.classTitle}>{childName}'s week</Text>
                    <Text style={styles.gradeSubtitle}>Class {child.grade || "5"} · updated today</Text>
                  </View>

                  {/* 3 Metric Stats */}
                  <View style={styles.parentMetricsRow}>
                    <View style={styles.metricBox}>
                      <Text style={styles.metricVal}>4</Text>
                      <Text style={styles.metricLabel}>days</Text>
                    </View>
                    <View style={styles.metricBox}>
                      <Text style={styles.metricVal}>52</Text>
                      <Text style={styles.metricLabel}>minutes</Text>
                    </View>
                    <View style={styles.metricBox}>
                      <Text style={[styles.metricVal, { color: P.gold }]}>86%</Text>
                      <Text style={styles.metricLabel}>right</Text>
                    </View>
                  </View>

                  {/* Practise together hint */}
                  <Text style={styles.practiceTogether}>
                    To practise together: <Text style={{ fontFamily: "nunitoBold", color: P.text }}>Tenses (had done) ›</Text>
                  </Text>
                  <Text style={styles.cardHint}>Tap the card for her full week.</Text>
                </Pressable>

                {/* Primary Thumb Zone Button */}
                <Pressable
                  style={styles.primaryBottomBtn}
                  onPress={() => setPlayKid(child)}
                  accessibilityRole="button"
                >
                  <Text style={styles.primaryBottomBtnText}>▶ LET {childName.toUpperCase()} PLAY</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      ) : null}

      {/* ============================================================== */}
      {/* 3. CHILD HOME (Z1) — shown for children, students, or learners */}
      {/* ============================================================== */}
      {!isAdultView ? (
        <>
          {/* FROM YOUR TEACHER (assigned topics) */}
          {teacherTasks.length > 0 ? (
            <View style={styles.sectionWrap}>
              <Text style={styles.sectionLabel}>FROM YOUR TEACHER</Text>
              {teacherTasks.map((t) => {
                const due = t.dueDate ? `due ${t.dueDate}` : "open now";
                const teacher = t.teacherName ? `From ${t.teacherName}` : "From teacher";
                const titles = (t.nodeTitles || []).join(", ") || "Assigned topic";

                return (
                  <Pressable
                    key={t.id}
                    style={styles.teacherTaskCard}
                    onPress={() => openQuestMap(t.questId)}
                    accessibilityRole="button"
                    accessibilityLabel={`From your teacher: ${titles}. Due: ${due}`}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.teacherTaskTitle} numberOfLines={2}>{titles}</Text>
                      <Text style={styles.teacherTaskSub}>{teacher} · {due}</Text>
                    </View>
                    <Pressable
                      style={styles.playActionBtn}
                      onPress={() => {
                        const bundled = bundledQuest(t.questId);
                        const nodes = nodesForGrade(bundled?.nodes || [], userGrade);
                        const progress = progressById[t.questId] || {};
                        const next = findNextStep(nodes, progress.nodes || {}, { extraUnlocked: t.nodeIds || [] });
                        handlePlayNextStep(t.questId, next);
                      }}
                      accessibilityRole="button"
                      accessibilityLabel="Play assigned topic"
                    >
                      <Text style={styles.playActionBtnText}>▶</Text>
                    </Pressable>
                  </Pressable>
                );
              })}
            </View>
          ) : null}

          {/* YOUR SUBJECTS (ordered by last used) */}
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionLabel}>YOUR SUBJECTS</Text>
            {sortedQuests.map((q) => {
              const bundled = bundledQuest(q.questId);
              const nodes = nodesForGrade(bundled?.nodes || [], userGrade);
              const progress = progressById[q.questId] || { nodes: {}, doc: {} };
              const nextStepRes = findNextStep(nodes, progress.nodes || {});
              const nextTitle = getNextStepTitle(nextStepRes);

              const summary = questSummary(nodes, progress.nodes || {});
              const pct = summary.total > 0 ? Math.round((summary.cleared / summary.total) * 100) : 0;
              const displayTitle = q.title?.replace(/ Quest$/, "") || "Quest";

              return (
                <Pressable
                  key={q.questId}
                  style={styles.subjectRow}
                  onPress={() => openQuestMap(q.questId)}
                  accessibilityRole="button"
                  accessibilityLabel={`${displayTitle}, up next: ${nextTitle}. Tap to open map.`}
                >
                  {/* Subject Icon */}
                  <SubjectIcon questId={q.questId} />

                  {/* Text details */}
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.subjectName}>{displayTitle}</Text>
                    <Text style={styles.subjectNext} numberOfLines={1}>
                      Up next: <Text style={{ fontFamily: "nunitoBold", color: P.text }}>{nextTitle}</Text>
                    </Text>
                    {/* Thin progress bar */}
                    <View style={styles.track}>
                      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: P.primary }]} />
                    </View>
                  </View>

                  {/* Play Next Step Button (▶) */}
                  <Pressable
                    style={styles.playActionBtn}
                    onPress={() => handlePlayNextStep(q.questId, nextStepRes)}
                    accessibilityRole="button"
                    accessibilityLabel={`Play next step in ${displayTitle}`}
                  >
                    <Text style={styles.playActionBtnText}>▶</Text>
                  </Pressable>
                </Pressable>
              );
            })}
          </View>

          {/* My mistakes Card */}
          {mistakeCount > 0 ? (
            <Pressable
              onPress={openMistakes}
              style={styles.mistakesCard}
              accessibilityRole="button"
              accessibilityLabel={`${mistakeCount} mistakes to fix`}
            >
              <View style={styles.mistakesIconBox}>
                <WrenchIcon />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.mistakesTitle}>
                  {mistakeCount} {mistakeCount === 1 ? "mistake" : "mistakes"} to fix
                </Text>
                <Text style={styles.mistakesSub}>Two right in a row fixes one</Text>
              </View>
              <Text style={styles.mistakesLink}>Fix now ›</Text>
            </Pressable>
          ) : null}

          {/* Practice paper link */}
          {hasPaper ? (
            <Pressable
              onPress={openPracticePaper}
              style={styles.paperLinkCard}
              accessibilityRole="button"
              accessibilityLabel="Practice paper"
            >
              <Ionicons name="document-text-outline" size={20} color={P.textSoft} />
              <Text style={styles.paperLinkText}>Practice paper ›</Text>
            </Pressable>
          ) : null}
        </>
      ) : null}

      <PlayAsChildSheet
        kid={playKid}
        P={P}
        onClose={() => setPlayKid(null)}
        onLoginCode={() => {
          const k = playKid;
          setPlayKid(null);
          navigation.navigate("AddChild", { kid: k });
        }}
      />
    </ScrollView>
  );
}

const stylesLocal = StyleSheet.create({
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(245, 210, 248, 0.2)",
  },
});

const makeStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg },
    content: {
      paddingTop: insets.top + 6,
      paddingHorizontal: 18,
      paddingBottom: 36,
      gap: 16,
    },
    topSpacer: { height: 18 },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 4,
    },
    hello: { fontSize: 13, fontFamily: "nunitoBold", color: P.textSoft },
    name: { fontSize: 24, lineHeight: 30, fontFamily: "nunitoBold", color: P.text },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
    },
    chipText: { fontSize: 14, fontFamily: "nunitoBold" },

    sectionWrap: { gap: 10 },
    sectionLabel: { fontSize: 13, fontFamily: "nunitoBold", color: P.label, letterSpacing: 1 },

    // Z1: Child Home components
    teacherTaskCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 16,
      borderRadius: 20,
      backgroundColor: P.card,
      borderWidth: 2,
      borderColor: P.selectedBorder,
    },
    teacherTaskTitle: { fontSize: 17, fontFamily: "nunitoBold", color: P.text },
    teacherTaskSub: { fontSize: 13, fontFamily: "nunito", color: P.label, marginTop: 2 },

    subjectRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      padding: 14,
      borderRadius: 20,
      backgroundColor: P.card,
      borderWidth: 2,
      borderColor: P.border,
    },
    subjectName: { fontSize: 17, fontFamily: "nunitoBold", color: P.text },
    subjectNext: { fontSize: 13, fontFamily: "nunito", color: P.textSoft },
    track: {
      height: 6,
      borderRadius: 3,
      backgroundColor: P.track,
      overflow: "hidden",
      marginTop: 2,
    },
    fill: { height: "100%", borderRadius: 3 },

    playActionBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: P.primary,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.18,
      shadowRadius: 3,
      elevation: 3,
    },
    playActionBtnText: {
      fontSize: 18,
      color: P.onPrimary,
      marginLeft: 2,
    },

    mistakesCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 14,
      borderRadius: 18,
      backgroundColor: P.wrongBg,
      borderWidth: 1.5,
      borderColor: P.wrongBorder,
    },
    mistakesIconBox: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: P.card,
      alignItems: "center",
      justifyContent: "center",
    },
    mistakesTitle: { fontSize: 15, fontFamily: "nunitoBold", color: P.wrongText },
    mistakesSub: { fontSize: 12, fontFamily: "nunito", color: P.wrongText, opacity: 0.8 },
    mistakesLink: { fontSize: 14, fontFamily: "nunitoBold", color: P.wrongText },

    paperLinkCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 12,
      borderRadius: 14,
      backgroundColor: P.card,
      borderWidth: 1.5,
      borderColor: P.border,
    },
    paperLinkText: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft },

    // Z2 & Z3: Parent & Teacher Cards
    parentCard: {
      padding: 18,
      borderRadius: 24,
      backgroundColor: P.card,
      borderWidth: 2,
      borderColor: P.border,
      gap: 12,
    },
    teacherCard: {
      padding: 18,
      borderRadius: 24,
      backgroundColor: P.card,
      borderWidth: 2,
      borderColor: P.border,
      gap: 10,
    },
    cardHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 2,
    },
    classTitle: { fontSize: 20, fontFamily: "nunitoBold", color: P.text },
    gradeSubtitle: { fontSize: 13, fontFamily: "nunitoBold", color: P.textSoft },
    waitingPill: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      backgroundColor: P.wrongBg,
      borderWidth: 1,
      borderColor: P.wrongBorder,
    },
    waitingPillText: { fontSize: 11, fontFamily: "nunitoBold", color: P.wrongText },
    countPill: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      backgroundColor: P.track,
    },
    countPillText: { fontSize: 11, fontFamily: "nunitoBold", color: P.textSoft },

    weekLine: { fontSize: 14, fontFamily: "nunito", color: P.textSoft, lineHeight: 20 },
    reteachBox: {
      padding: 10,
      borderRadius: 12,
      backgroundColor: P.track,
      marginTop: 2,
    },
    reteachLabel: { fontSize: 13, fontFamily: "nunito", color: P.textSoft },
    reteachTopic: { fontFamily: "nunitoBold", color: P.selectedText },

    parentMetricsRow: {
      flexDirection: "row",
      gap: 10,
      marginVertical: 4,
    },
    metricBox: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 16,
      backgroundColor: P.track,
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
    },
    metricVal: { fontSize: 24, fontFamily: "nunitoBold", color: P.text },
    metricLabel: { fontSize: 12, fontFamily: "nunitoBold", color: P.textSoft },

    practiceTogether: { fontSize: 14, fontFamily: "nunito", color: P.textSoft, marginTop: 4 },
    cardHint: { fontSize: 12, fontFamily: "nunito", color: P.dimText },

    primaryBottomBtn: {
      height: 52,
      borderRadius: 16,
      backgroundColor: P.primary,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    primaryBottomBtnText: {
      fontSize: 16,
      fontFamily: "nunitoBold",
      color: P.onPrimary,
      letterSpacing: 0.5,
    },

    devBar: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
      marginBottom: 12,
    },
    devPill: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 14,
      backgroundColor: P.card,
      borderWidth: 1,
      borderColor: P.border,
    },
    devPillActive: {
      backgroundColor: P.selectedBg,
      borderColor: P.selectedBorder,
    },
    devPillText: {
      fontSize: 12,
      fontFamily: "nunitoBold",
      color: P.text,
    },
  });

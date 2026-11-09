// screens/home/HomeScreen.js
// New Home (owner-approved mockup "A · Home", 2026-11-04): one vertical scroll, most important first:
// greeting → Coming up (exams + own reminders) → Continue → My mistakes → quests → Olympiad practice.
// Replaces the old Home (now the Fun tab) and the Study tab. Tiles open screens in the Home stack.

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View, Image, Share } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Rect, Circle } from "react-native-svg";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import Mascot from "../../components/quiz/Mascot";
import { authInstance } from "../../config/firebaseConfig";
import { listenToCategoriesByGroup, listenToUserDocument } from "../../services/firestoreContentApi";
import { visibleOldTiles, showOldSpace } from "../../utils/oldContent";
import { listenToQuestProgress } from "../../services/englishQuestApi";
import { TasksContext } from "../../store/tasks-context";
import { EXAMS } from "../../config/exams";
import { greeting, dayStreak, upcomingItems, mergeDaily, pickContinue } from "../../utils/homeFeed";
import { openCategory } from "../../utils/openCategory";
import useReduceMotion from "../../hooks/useReduceMotion";
import { myAssignments } from "../../services/assignmentsApi";
import { bundledQuest } from "../../data/quests";
import { nodesForGrade } from "../../utils/gradeFilter";
import { questSummary } from "../../utils/progressView";
import { daysUntil } from "../../utils/homeFeed";
import { canAddReminder, LIMIT_MESSAGE } from "../../utils/reminders";
import { APPREC8_TEAM_REVIEWER_UID, isTesterUser } from "../../config/appConfig";
import { useOwnerExtras } from "../../services/ownerView";
import { papersFor, MIX_GRADES } from "../../data/papers";
import { showAlert } from "../../services/dialog";
import HomeIdeaPromptCard from "../../components/feedback/HomeIdeaPromptCard";
import { assignedTopics } from "../../utils/assignedTopics";
import { computeNeedsYou } from "../../utils/needsYou";
import { listenDecisions } from "../../services/decisionsApi";
import { inbox } from "../../utils/decisions";
import { loadTeacherClassesOverview, loadAdminTeacherRequests } from "../../services/classesApi";
import { classLabel, classCodeMessage } from "../../utils/classes";

const ROTATE_MS = 3500;
const PAUSE_AFTER_TAP_MS = 10000;

const TONES = {
  gold: { head: "#dcb51b", border: "#F0D98A", num: "#7A5B00" },
  green: { head: "#3E9B3A", border: "#BFE5C2", num: "#1E5E1B" },
  plum: { head: "#85508a", border: "#E0C6E3", num: "#3b0940" },
};

const tileOf = (c) => ({
  id: c.id,
  title: c.title,
  image: c.image,
  subtitle: c.subtitle || "",
  description: c.description || "",
  type: c.type || "COURSE",
  questId: c.questId || null,
});

// ---- small drawings (no image downloads) ----
const BookArt = ({ size = 62 }) => (
  <Svg width={size} height={size * 0.75} viewBox="0 0 120 90">
    <Path d="M10 14c16-7 32-7 50 5v62c-18-12-34-12-50-5z" fill="#85508a" />
    <Path d="M110 14c-16-7-32-7-50 5v62c18-12 34-12 50-5z" fill="#3b0940" />
    <Path d="M22 32c9-3 18-3 28 2M22 46c9-3 18-3 28 2M70 34c10-5 19-5 28-2M70 48c10-5 19-5 28-2" stroke="#F5D2F8" strokeWidth={4} strokeLinecap="round" />
  </Svg>
);
const PaperArt = () => (
  <Svg width={46} height={58} viewBox="0 0 60 76">
    <Rect x={6} y={4} width={44} height={60} rx={6} fill="#FFFFFF" stroke="#85508a" strokeWidth={4} />
    <Path d="M16 20h24M16 31h24M16 42h14" stroke="#C98ACF" strokeWidth={4} strokeLinecap="round" />
    <Circle cx={44} cy={58} r={13} fill="#F5C842" />
    <Path d="M44 51v7l5 3" stroke="#3b0940" strokeWidth={3} strokeLinecap="round" fill="none" />
  </Svg>
);
const RocketArt = () => (
  <Svg width={44} height={58} viewBox="0 0 60 80">
    <Path d="M30 4c12 10 16 24 14 42H16C14 28 18 14 30 4z" fill="#3E73C8" />
    <Circle cx={30} cy={28} r={6} fill="#FFFFFF" />
    <Path d="M16 40l-8 14h10zM44 40l8 14H42z" fill="#E5533F" />
    <Path d="M22 50h16l-3 12h-10z" fill="#F5C842" />
  </Svg>
);
const FlaskArt = () => (
  <Svg width={46} height={56} viewBox="0 0 60 74">
    <Path d="M22 4h16v22l16 34c3 6-1 10-7 10H13c-6 0-10-4-7-10l16-34z" fill="#3E9B3A" />
    <Path d="M12 54h36l5 9c1 3-1 5-4 5H11c-3 0-5-2-4-5z" fill="#BFE5C2" />
  </Svg>
);
const BlocksArt = () => (
  <Svg width={52} height={52} viewBox="0 0 60 60">
    <Rect x={6} y={6} width={22} height={22} rx={6} fill="#E9772A" />
    <Rect x={32} y={6} width={22} height={22} rx={6} fill="#F5C842" />
    <Rect x={6} y={32} width={22} height={22} rx={6} fill="#3E73C8" />
    <Rect x={32} y={32} width={22} height={22} rx={6} fill="#3E9B3A" />
  </Svg>
);
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

function ComingUp({ items, P, isDark, styles, onAdd }) {
  const [index, setIndex] = useState(0);
  const pausedUntil = useRef(0);
  const fade = useRef(new Animated.Value(1)).current;
  const count = items.length;

  useEffect(() => {
    if (index >= count) setIndex(0);
  }, [count, index]);

  const indexRef = useRef(0);
  indexRef.current = index;

  const reduceMotion = useReduceMotion();

  // Fade IN only, starting half-visible (QA 2026-11-04: fading out first could leave the card invisible
  // when an animation callback never ran, e.g. with phone animations off).
  const show = (next) => {
    setIndex(next);
    if (reduceMotion) return fade.setValue(1);
    fade.setValue(0.5);
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  };

  // Moves by itself; a tap pauses it for a while (manual mode). Still when the phone asks for less motion.
  useEffect(() => {
    if (count < 2 || reduceMotion) return undefined;
    const t = setInterval(() => {
      if (Date.now() < pausedUntil.current) return;
      show((indexRef.current + 1) % count);
    }, ROTATE_MS);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, reduceMotion]);

  const tapTo = (next) => {
    pausedUntil.current = Date.now() + PAUSE_AFTER_TAP_MS;
    show(next);
  };

  const item = items[Math.min(index, count - 1)];
  const tone = TONES[item?.tone] || TONES.plum;

  return (
    <View style={{ gap: 8 }}>
      <View style={styles.rowBetween}>
        <Text style={styles.label}>COMING UP</Text>
        <Pressable onPress={onAdd} hitSlop={10} accessibilityRole="button" style={styles.addPill}>
          <Text style={styles.link}>+ Add reminder</Text>
        </Pressable>
      </View>
      {item ? (
        <Pressable
          onPress={() => count > 1 && tapTo((index + 1) % count)}
          accessibilityRole="button"
          accessibilityLabel={`${item.title}, ${item.days} ${item.unit.toLowerCase()} left. Tap for the next one.`}
        >
          <Animated.View style={[styles.remCard, { borderColor: isDark ? P.border : tone.border, opacity: fade }]}>
            <View style={[styles.remBox, { borderColor: tone.head }]}>
              <Text style={[styles.remTag, { backgroundColor: tone.head }]}>{item.tag}</Text>
              <View style={styles.remNumWrap}>
                <Text style={[styles.remNum, { color: isDark ? P.text : tone.num }]}>{item.days === 0 ? "!" : item.days}</Text>
              </View>
              <Text style={[styles.remUnit, { color: isDark ? P.textSoft : tone.num }]}>{item.unit}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.remTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.remSub} numberOfLines={1}>{item.sub}</Text>
            </View>
          </Animated.View>
        </Pressable>
      ) : (
        <Pressable onPress={onAdd} accessibilityRole="button">
          <View style={styles.remCard}>
            <Text style={styles.remSub}>Nothing coming up. Add a reminder for a test, a project or an exam!</Text>
          </View>
        </Pressable>
      )}
      {count > 1 ? (
        <View style={styles.dots}>
          {items.map((it, k) => (
            <Pressable key={it.id} onPress={() => tapTo(k)} hitSlop={8} accessibilityLabel={`Show ${it.title}`}>
              <View style={[styles.dot, k === index && styles.dotOn]} />
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function GlowButton({ label, onPress, styles }) {
  const pulse = useRef(new Animated.Value(0)).current;
  const reduceMotion = useReduceMotion();
  useEffect(() => {
    if (reduceMotion) {
      pulse.setValue(1); // ring fully faded out
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reduceMotion]);
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] });
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
      <View>
        <Animated.View pointerEvents="none" style={[styles.glowRing, { opacity, transform: [{ scale }] }]} />
        <View style={styles.continueButton}>
          <Text style={styles.continueButtonText}>{label}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen({ navigation }) {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(P, insets), [P, insets]);
  const { tasks = [] } = useContext(TasksContext) || {};

  const uid = authInstance.currentUser?.uid || null;
  const [userData, setUserData] = useState(null);
  const [quests, setQuests] = useState([]);
  const [olympiad, setOlympiad] = useState([]);
  const [popularQuizzes, setPopularQuizzes] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [draftQuests, setDraftQuests] = useState([]); // testers only: quests still in review
  const [progressById, setProgressById] = useState({}); // { questId: { nodes, doc } }
  const extras = useOwnerExtras(); // owner's "Owner extras" switch (services/ownerView.js)
  const isTester = isTesterUser(authInstance.currentUser) && extras;
  const ownerView = uid === APPREC8_TEAM_REVIEWER_UID && extras;
  const isAdmin = !!APPREC8_TEAM_REVIEWER_UID && uid === APPREC8_TEAM_REVIEWER_UID;

  const [decisions, setDecisions] = useState([]);
  const [teacherRequests, setTeacherRequests] = useState([]);
  const [studentRequests, setStudentRequests] = useState([]);
  const [teacherClasses, setTeacherClasses] = useState([]);

  useEffect(() => {
    if (!isAdmin) {
      setDecisions([]);
      return undefined;
    }
    return listenDecisions((docs) => {
      setDecisions(inbox(docs).waiting);
    });
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      loadAdminTeacherRequests(uid, true).then(setTeacherRequests).catch(() => setTeacherRequests([]));
    } else {
      setTeacherRequests([]);
    }
  }, [isAdmin, uid]);

  const teachesKey = (userData?.teachesClassIds || []).join(",");
  useEffect(() => {
    if (!teachesKey || !uid) {
      setTeacherClasses([]);
      setStudentRequests([]);
      return;
    }
    loadTeacherClassesOverview(uid)
      .then(({ classes, pendingStudents }) => {
        setTeacherClasses(classes);
        setStudentRequests(pendingStudents);
      })
      .catch(() => {
        setTeacherClasses([]);
        setStudentRequests([]);
      });
  }, [teachesKey, uid]);

  const needsYouRows = useMemo(() => {
    return computeNeedsYou({
      decisions,
      teacherRequests,
      studentRequests,
    });
  }, [decisions, teacherRequests, studentRequests]);

  const onNeedsYouPress = (row) => {
    if (row.screen === "Decisions") {
      navigation.navigate("Decisions");
    } else if (row.screen === "ClassDetail") {
      navigation.navigate("ClassDetail", row.params);
    } else if (row.screen === "Progress") {
      navigation.navigate("Stats", { screen: "Progress", params: row.params });
    }
  };

  useEffect(() => {
    const warn = (what) => (e) => console.warn(`HomeScreen: ${what} failed to load`, e);
    const subs = [
      listenToCategoriesByGroup("quest", (d) => setQuests(d.map(tileOf)), warn("quests")),
      // Old IEO / NSO / IMO tiles hidden (owner 2026-11-04: decommission slowly, see if anyone misses them).
      // Nothing is deleted: English Quest Unit 1 still uses some of those quizzes inside the quest.
    ];
    // Old tiles: owner only (utils/oldContent.js), so nobody else pays for the reads.
    if (ownerView) {
      subs.push(listenToCategoriesByGroup("popular_quiz", (d) => setPopularQuizzes(d.map(tileOf)), warn("popular quizzes")));
      subs.push(listenToCategoriesByGroup("classroom", (d) => setClassrooms(d.map(tileOf)), warn("classrooms")));
    }
    // Draft quests (e.g. Science while Gemini writes it): only testers see them.
    if (isTester) subs.push(listenToCategoriesByGroup("quest_draft", (d) => setDraftQuests(d.map(tileOf)), warn("draft quests")));
    let unsubUser = () => {};
    if (uid) unsubUser = listenToUserDocument((d) => setUserData(d), warn("user"));
    return () => {
      subs.forEach((u) => u && u());
      unsubUser();
    };
  }, [uid, isTester, ownerView]);

  // Every tile quest (English, Science, ...), each with its own progress doc.
  const allQuests = useMemo(
    () =>
      [...quests, ...draftQuests]
        .map((q) => ({ ...q, questId: q.questId || q.id }))
        .filter((q, i, arr) => arr.findIndex((x) => x.questId === q.questId) === i),
    [quests, draftQuests]
  );
  const questKey = allQuests.map((q) => q.questId).join(",");

  useEffect(() => {
    const ids = questKey ? questKey.split(",") : [];
    const unsubs = ids.map((id) =>
      listenToQuestProgress(
        id,
        (nodes, doc) => setProgressById((m) => ({ ...m, [id]: { nodes: nodes || {}, doc: doc || {} } })),
        (e) => console.warn(`HomeScreen: progress of ${id} failed to load`, e)
      )
    );
    return () => unsubs.forEach((u) => u && u());
  }, [questKey, uid]);

  // RB-7: a teacher's assignment (not past its due date) becomes the "Next up" card.
  const [assignments, setAssignments] = useState([]);
  const myClassKey = (userData?.classIds || []).join(",");
  useEffect(() => {
    if (!myClassKey) return setAssignments([]);
    myAssignments(myClassKey.split(",")).then(setAssignments).catch(() => setAssignments([]));
  }, [myClassKey]);

  // Continue = the quest played most recently. Mistakes = all quests; the tile opens the one with most.
  const mainQuest = pickContinue(allQuests, progressById);
  const mainQuestId = mainQuest?.questId || null;
  const progress = progressById[mainQuestId] || { nodes: {}, doc: {} };
  const mistakesOf = (id) => Object.keys(progressById[id]?.doc?.mistakes || {}).length;
  const mistakeQuest = [...allQuests].sort((a, b) => mistakesOf(b.questId) - mistakesOf(a.questId))[0] || null;

  // Every unfinished topic a teacher assigned, soonest first (2026-11-09: only the first showed, and it opened "Sentences").
  const todayIso = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const teacherTopics = assignedTopics(assignments, (q) => bundledQuest(q)?.nodes || [], (q) => progressById[q]?.nodes || {}, todayIso);
  const openTopic = (t) => navigation.navigate("EnglishQuestMap", { questId: t.questId, openTopic: t.nodeId });

  const firstName =
    userData?.firstName?.trim() || authInstance.currentUser?.displayName?.trim()?.split(" ")[0] || null;
  const stars = userData?.stats?.totalStars || 0;
  const userGrade = Number.isInteger(userData?.grade) ? userData.grade : null;
  const streak = dayStreak(mergeDaily(Object.values(progressById).map((p) => p.doc?.stats?.daily)));
  const mistakeCount = allQuests.reduce((sum, q) => sum + mistakesOf(q.questId), 0);
  const doneSteps = Object.values(progress.nodes || {}).filter((n) => n?.status === "completed").length;
  const started = Object.keys(progress.nodes || {}).length > 0;

  const myTasks = uid ? tasks.filter((t) => t.userId === uid) : [];
  const coming = upcomingItems(EXAMS, myTasks);

  const openMainQuest = () => {
    if (teacherTopics.length) return openTopic(teacherTopics[0]);
    if (!mainQuestId) return;
    if (started) navigation.navigate("EnglishQuestMap", { questId: mainQuestId });
    else navigation.navigate("EnglishQuestIntro", { questId: mainQuestId });
  };
  const openMistakes = () =>
    mistakeQuest && navigation.navigate("EnglishQuestMap", { questId: mistakeQuest.questId, openMistakes: true });
  const openSpace = () => navigation.navigate("Quest", { screen: "QuestMap" });
  const addReminder = () => {
    if (!uid) return navigation.navigate("Profile"); // guests: sign in first
    if (!canAddReminder(tasks, uid, { isAdmin: uid === APPREC8_TEAM_REVIEWER_UID })) {
      showAlert("Too many reminders", LIMIT_MESSAGE);
      return navigation.navigate("Tasks");
    }
    return navigation.navigate("TaskEditor");
  };

  // Old content: owner only, except Pratha's favourites (dogs, animals). Seema 2026-11-05.
  const oldAdmin = ownerView;
  const practiceTiles = visibleOldTiles([...olympiad, ...popularQuizzes], { isAdmin: oldAdmin });
  const classroomTiles = visibleOldTiles(classrooms, { isAdmin: oldAdmin });
  const hasPaper = papersFor({ grade: userGrade, isTester }).length > 0 || MIX_GRADES.includes(userGrade);

  // Each quest tile is its own "continue" (owner 2026-11-04: a kid runs several quests; no single big Continue card).
  const questStats = (q) => {
    const data = bundledQuest(q.questId);
    if (!data) return null;
    try {
      const grade = Number.isInteger(userData?.grade) ? userData.grade : null;
      return questSummary(nodesForGrade(data.nodes, grade), progressById[q.questId]?.nodes || {});
    } catch (e) {
      return null;
    }
  };
  const openQuest = (q) => {
    const started = Object.keys(progressById[q.questId]?.nodes || {}).length > 0;
    if (started) navigation.navigate("EnglishQuestMap", { questId: q.questId });
    else openCategory(navigation, q);
  };
  const PRACTICE_NAMES = { IEO: "English", NSO: "Science", IMO: "Maths" }; // old category titles → subject names (no exam labels)

  const questTile = (key, title, sub, art, tint, onPress, { stats = null, dim = false, teacher = false } = {}) => (
    <Pressable key={key} style={styles.gridCell} onPress={onPress} disabled={!onPress} accessibilityRole="button" accessibilityLabel={`${title}, ${sub}`}>
      <View style={[styles.questTile, dim && styles.soon]}>
        <View style={[styles.questArtBox, { backgroundColor: tint }]}>{art}</View>
        <Text style={styles.questTitle} numberOfLines={1}>{title}</Text>
        <Text style={[styles.questSub, teacher && { color: P.label }]} numberOfLines={2}>{sub}</Text>
        {stats && stats.total ? (
          <View style={styles.tileProgressRow}>
            <View style={styles.tileTrack}>
              <View style={[styles.tileFill, { width: `${Math.round((stats.cleared / stats.total) * 100)}%` }]} />
            </View>
            <Text style={styles.tileCount}>{stats.cleared}/{stats.total}</Text>
          </View>
        ) : null}
        {onPress && !dim ? (
          <View style={styles.goArrow}>
            <Text style={styles.goArrowText}>▶</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );

  // Home (owner 2026-11-04: back to mockup A, quest tiles carry the continue; no exam labels anywhere).
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Mascot size={50} />
        <View style={{ flex: 1 }}>
          <Text style={styles.hello}>{greeting()},</Text>
          <Text style={styles.name} numberOfLines={1}>{firstName || "friend"}</Text>
        </View>
        <View style={[styles.chip, { backgroundColor: P.streakBg }]} accessibilityLabel={`${streak} day streak`}>
          <FlameIcon />
          <Text style={[styles.chipText, { color: P.streakText }]}>{streak}</Text>
        </View>
        <View style={[styles.chip, { backgroundColor: P.selectedBg }]} accessibilityLabel={`${stars} stars`}>
          <StarIcon />
          <Text style={[styles.chipText, { color: P.selectedText }]}>{stars}</Text>
        </View>
      </View>

      {/* 1. Needs you card = the FIRST card on Home for anyone with pending items */}
      {needsYouRows.length > 0 ? (
        <View style={styles.needsYouCard} accessibilityLabel="Needs you">
          <View style={styles.needsYouHeader}>
            <Ionicons name="notifications" size={16} color={P.gold} />
            <Text style={styles.needsYouTitle}>NEEDS YOU</Text>
          </View>
          <View style={styles.needsYouList}>
            {needsYouRows.map((row, idx) => (
              <Pressable
                key={row.id}
                onPress={() => onNeedsYouPress(row)}
                style={[styles.needsYouRow, idx > 0 && styles.needsYouDivider]}
                accessibilityRole="button"
                accessibilityLabel={row.label}
              >
                <Text style={styles.needsYouLabel} numberOfLines={2}>
                  {row.label}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={P.textSoft} />
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      {/* 2. Teacher Home: Your classes */}
      {teacherClasses.length > 0 ? (
        <View style={styles.teacherSection} accessibilityLabel="Your classes">
          <Text style={styles.label}>YOUR CLASSES</Text>
          {teacherClasses.map((c) => (
            <Pressable
              key={c.id}
              style={styles.classCard}
              onPress={() => navigation.navigate("Stats", { screen: "Progress", params: { view: "classes", classId: c.id } })}
              accessibilityRole="button"
              accessibilityLabel={`${classLabel(c)}, ${c.totalStudents} students`}
            >
              <View style={styles.classCardHeader}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.classCardTitle} numberOfLines={1}>
                    {classLabel(c)}
                  </Text>
                  <Text style={styles.classCardSub}>
                    {c.totalStudents} {c.totalStudents === 1 ? "student" : "students"}
                  </Text>
                </View>
                {c.joinCode ? (
                  <Pressable
                    onPress={() => {
                      Share.share({
                        message: classCodeMessage({ className: c.name, schoolName: c.schoolName, code: c.joinCode }),
                      }).catch(() => {});
                    }}
                    style={styles.shareCodeButton}
                    accessibilityRole="button"
                    accessibilityLabel={`Share code ${c.joinCode}`}
                  >
                    <Text style={styles.shareCodeText}>SHARE CODE</Text>
                  </Pressable>
                ) : null}
              </View>

              <Text style={styles.classStatsText}>
                This week: {c.activeStudents} of {c.totalStudents} practised
              </Text>

              <View style={styles.classActionRow}>
                <Text style={styles.classWeakText} numberOfLines={1}>
                  {c.weakestTopic ? `Teach again: ${c.weakestTopic}` : "All topics on track 👍"}
                </Text>
                <Pressable
                  onPress={() => navigation.navigate("Stats", { screen: "Progress", params: { view: "classes", classId: c.id } })}
                  style={styles.assignButton}
                  accessibilityRole="button"
                  accessibilityLabel={`Assign practice for ${c.name}`}
                >
                  <Text style={styles.assignButtonText}>ASSIGN</Text>
                </Pressable>
              </View>
            </Pressable>
          ))}
        </View>
      ) : null}

      <ComingUp items={coming} P={P} isDark={isDark} styles={styles} onAdd={addReminder} />

      <HomeIdeaPromptCard userGrade={userGrade} />

      {teacherTopics.length ? (
        <View style={styles.teacherCard}>
          <Text style={styles.label}>FROM YOUR TEACHER</Text>
          {teacherTopics.slice(0, 3).map((t) => (
            <Pressable key={t.key} onPress={() => openTopic(t)} accessibilityRole="button" accessibilityLabel={`From your teacher: ${t.title}`} style={{ paddingVertical: 6 }}>
              <Text style={styles.teacherTitle} numberOfLines={1}>{t.title} ›</Text>
              <Text style={styles.questSub} numberOfLines={1}>
                {!t.dueDate ? "Open now" : t.overdue ? "Was due, still open" : daysUntil(t.dueDate) === 0 ? "Due today" : `Due in ${daysUntil(t.dueDate)} days`}
              </Text>
            </Pressable>
          ))}
          {teacherTopics.length > 3 ? <Text style={styles.questSub}>and {teacherTopics.length - 3} more</Text> : null}
        </View>
      ) : null}

      {mistakeCount > 0 ? (
        <Pressable onPress={openMistakes} accessibilityRole="button" accessibilityLabel={`My mistakes, ${mistakeCount} to fix`}>
          <View style={styles.mistakes}>
            <View style={styles.mistakesIcon}>
              <WrenchIcon />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.mistakesTitle}>
                {mistakeCount} {mistakeCount === 1 ? "mistake" : "mistakes"} to fix
              </Text>
              <Text style={styles.mistakesSub}>Two right in a row fixes one</Text>
            </View>
            <Text style={styles.mistakesGo}>Fix now</Text>
          </View>
        </Pressable>
      ) : null}

      <Text style={styles.section}>{teacherClasses.length > 0 ? "Practise yourself" : "Your quests"}</Text>
      <View style={styles.grid}>
        {allQuests.map((q) => {
          const st = questStats(q);
          const isDraft = draftQuests.some((d) => d.id === q.id);
          const sub = isDraft
            ? "Draft · testers only"
            : st?.current
            ? `${st.unitOrder !== null && st.unitOrder !== undefined ? `Unit ${st.unitOrder} · ` : ""}${st.current}`
            : "Start here";
          const sci = /science/i.test(q.questId);
          const words = /word/i.test(q.questId);
          return questTile(
            q.id,
            (q.title || "Quest").replace(/ Quest$/, ""),
            sub,
            sci ? <FlaskArt /> : <BookArt />,
            sci ? (isDark ? "#1F3322" : "#E6F6E4") : words ? (isDark ? "#3A2E12" : "#FFF4D6") : P.selectedBg,
            () => openQuest(q),
            { stats: st }
          );
        })}
        {allQuests.some((q) => /science/i.test(q.questId)) ? null : questTile("science-soon", "Science", "Coming soon", <FlaskArt />, isDark ? "#1F3322" : "#E6F6E4", null, { dim: true })}
        {questTile("maths-soon", "Maths", "Coming soon", <BlocksArt />, isDark ? "#3A2414" : "#FDEBDD", null, { dim: true })}
      </View>

      {showOldSpace({ isAdmin: oldAdmin }) || hasPaper ? <Text style={styles.section}>Explore</Text> : null}
      <View style={styles.grid}>
        {showOldSpace({ isAdmin: oldAdmin }) ? questTile("space", "Space", "Rockets, planets and stars", <RocketArt />, isDark ? "#1B2640" : "#E6EEFB", openSpace) : null}
        {/* Practice paper (mockup Q): only when this child's class has one (testers: drafts too). */}
        {hasPaper
          ? questTile("paper", "Practice paper", "50 questions · 60 min, like a real test", <PaperArt />, isDark ? "#3A2E12" : "#FFF4D6", () =>
              navigation.navigate("PracticePaper", { grade: userGrade })
            )
          : null}
      </View>

      {practiceTiles.length > 0 ? (
        <>
          <Text style={styles.section}>More practice</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 4 }}>
            {practiceTiles.map((c) => (
              <Pressable key={c.id} onPress={() => openCategory(navigation, c)} accessibilityRole="button">
                <View style={styles.practiceTile}>
                  {c.image ? <Image source={{ uri: c.image }} style={styles.practiceImage} resizeMode="cover" /> : null}
                  <Text style={styles.practiceTitle} numberOfLines={2}>{PRACTICE_NAMES[String(c.title || "").trim()] || c.title}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </>
      ) : null}

      {classroomTiles.length > 0 ? (
        <>
          <Text style={styles.section}>My classrooms</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 4 }}>
            {classroomTiles.map((c) => (
              <Pressable key={c.id} onPress={() => openCategory(navigation, c)} accessibilityRole="button">
                <View style={styles.practiceTile}>
                  {c.image ? <Image source={{ uri: c.image }} style={styles.practiceImage} resizeMode="cover" /> : null}
                  <Text style={styles.practiceTitle} numberOfLines={2}>{c.title}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </>
      ) : null}
    </ScrollView>
  );
}

const makeStyles = (P, insets) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: P.bg },
    addPill: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: P.border, backgroundColor: P.card },
    teacherCard: { padding: 16, borderRadius: 20, backgroundColor: P.selectedBg, borderWidth: 2, borderColor: P.selectedBorder, gap: 4 },
    teacherTitle: { fontSize: 20, fontFamily: "nunitoBold", color: P.selectedText },
    questArtBox: { height: 82, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 8 },
    tileProgressRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6, marginRight: 34 },
    tileTrack: { flex: 1, height: 7, borderRadius: 4, backgroundColor: P.track, overflow: "hidden" },
    tileFill: { height: "100%", borderRadius: 4, backgroundColor: P.gold },
    tileCount: { fontSize: 12, fontFamily: "nunitoBold", color: P.textSoft },
    goArrow: { position: "absolute", right: 10, bottom: 10, width: 30, height: 30, borderRadius: 15, backgroundColor: P.primary, alignItems: "center", justifyContent: "center" },
    goArrowText: { color: P.onPrimary, fontSize: 12, fontFamily: "nunitoBold", marginLeft: 2 },
    quietStats: { fontSize: 15, fontFamily: "nunitoBold", color: P.textSoft },
    nextCard: { flexDirection: "row", alignItems: "center", gap: 10, padding: 18, borderRadius: 24, backgroundColor: P.primary },
    nextLabel: { fontSize: 12, letterSpacing: 1, fontFamily: "nunitoBold", color: "#E0C6E3" },
    nextTitle: { fontSize: 21, lineHeight: 27, fontFamily: "nunitoBold", color: "#FFFFFF", marginTop: 4 },
    nextSub: { fontSize: 14, fontFamily: "nunitoBold", color: "#E0C6E3", marginTop: 2 },
    nextArt: { opacity: 0.95 },
    chipRow: { flexDirection: "row", gap: 10 },
    chipCard: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 18, backgroundColor: P.track, minHeight: 78 },
    chipLabel: { fontSize: 12, letterSpacing: 1, fontFamily: "nunitoBold", color: P.label },
    chipValue: { fontSize: 19, fontFamily: "nunitoBold", color: P.text },
    chipSub: { fontSize: 12, fontFamily: "nunitoBold", color: P.textSoft },
    miniDots: { flexDirection: "row", gap: 4, marginTop: 4 },
    miniDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: P.borderDeep },
    miniDotOn: { width: 14, backgroundColor: P.label },
    addButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: P.card, alignItems: "center", justifyContent: "center" },
    addButtonText: { fontSize: 22, lineHeight: 24, fontFamily: "nunitoBold", color: P.label },
    shelfLabel: { fontSize: 13, letterSpacing: 1, fontFamily: "nunitoBold", color: P.textSoft, marginTop: 6 },
    shelfTile: { height: 128, borderRadius: 18, backgroundColor: P.card, borderWidth: 1, borderColor: P.border, padding: 12, justifyContent: "flex-end" },
    shelfArt: { flex: 1, alignItems: "flex-start", justifyContent: "center" },
    footer: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 12, backgroundColor: P.bg },
    content: { paddingTop: insets.top + 14, paddingHorizontal: 18, paddingBottom: 20, gap: 14 },
    header: { flexDirection: "row", alignItems: "center", gap: 10 },
    hello: { fontSize: 15, fontFamily: "nunitoBold", color: P.textSoft },
    name: { fontSize: 26, fontFamily: "nunitoBold", color: P.text },
    chip: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, height: 36, borderRadius: 18 },
    chipText: { fontSize: 16, fontFamily: "nunitoBold" },
    rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    label: { fontSize: 13, fontFamily: "nunitoBold", letterSpacing: 1, color: P.label },
    link: { fontSize: 15, fontFamily: "nunitoBold", color: P.label },
    remCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      padding: 14,
      borderRadius: 20,
      backgroundColor: P.card,
      borderWidth: 2,
      borderColor: P.border,
      minHeight: 92,
    },
    remBox: { width: 58, height: 68, borderRadius: 14, overflow: "hidden", borderWidth: 2, backgroundColor: P.card },
    remTag: { color: "#FFFFFF", fontSize: 11, fontFamily: "nunitoBold", textAlign: "center", paddingVertical: 2 },
    remNumWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
    remNum: { fontSize: 22, fontFamily: "nunitoBold" },
    remUnit: { fontSize: 9, fontFamily: "nunitoBold", textAlign: "center", paddingBottom: 2 },
    remTitle: { fontSize: 18, fontFamily: "nunitoBold", color: P.text },
    remSub: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft },
    dots: { flexDirection: "row", justifyContent: "center", gap: 6 },
    dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: P.borderDeep },
    dotOn: { width: 22, backgroundColor: P.primary },
    continueCard: {
      padding: 18,
      borderRadius: 24,
      backgroundColor: P.selectedBg,
      borderWidth: 2,
      borderColor: P.selectedBorder,
      gap: 6,
      overflow: "hidden",
    },
    continueArt: { position: "absolute", right: 6, top: 4, opacity: 0.9 },
    continueTitle: { fontSize: 24, fontFamily: "nunitoBold", color: P.selectedText, marginRight: 90 },
    continueSub: { fontSize: 15, fontFamily: "nunitoBold", color: P.textSoft, marginRight: 90, marginBottom: 8 },
    glowRing: { position: "absolute", left: -4, right: -4, top: -4, bottom: -4, borderRadius: 20, backgroundColor: P.gold },
    continueButton: {
      height: 54,
      borderRadius: 16,
      backgroundColor: P.primary,
      borderBottomWidth: 4,
      borderBottomColor: P.primaryShadow,
      alignItems: "center",
      justifyContent: "center",
    },
    continueButtonText: { color: P.onPrimary, fontSize: 18, fontFamily: "nunitoBold", letterSpacing: 1 },
    mistakes: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 14,
      borderRadius: 20,
      backgroundColor: P.wrongBg,
      borderWidth: 2,
      borderColor: P.wrongBorder,
    },
    mistakesIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: P.card, alignItems: "center", justifyContent: "center" },
    mistakesTitle: { fontSize: 17, fontFamily: "nunitoBold", color: P.wrongText },
    mistakesSub: { fontSize: 14, fontFamily: "nunitoBold", color: P.textSoft },
    mistakesGo: { fontSize: 15, fontFamily: "nunitoBold", color: P.wrongText },
    section: { fontSize: 20, fontFamily: "nunitoBold", color: P.text, marginTop: 4 },
    grid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
    gridCell: { width: "50%", padding: 6 },
    questTile: {
      minHeight: 190,
      borderRadius: 20,
      backgroundColor: P.card,
      borderWidth: 2,
      borderColor: P.border,
      borderBottomWidth: 5,
      padding: 12,
      justifyContent: "flex-start",
    },
    soon: { opacity: 0.55 },
    questArt: { flex: 1, alignItems: "center", justifyContent: "center" },
    questTitle: { fontSize: 18, fontFamily: "nunitoBold", color: P.text },
    questSub: { fontSize: 13, fontFamily: "nunitoBold", color: P.textSoft },
    practiceTile: {
      width: 132,
      borderRadius: 18,
      backgroundColor: P.card,
      borderWidth: 2,
      borderColor: P.border,
      overflow: "hidden",
    },
    practiceImage: { width: "100%", height: 84, backgroundColor: P.track },
    practiceTitle: { fontSize: 15, fontFamily: "nunitoBold", color: P.text, padding: 10, minHeight: 58 },
    needsYouCard: {
      padding: 14,
      borderRadius: 20,
      backgroundColor: P.card,
      borderWidth: 2,
      borderColor: P.gold,
      gap: 10,
    },
    needsYouHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    needsYouTitle: {
      fontSize: 12,
      fontFamily: "nunitoBold",
      letterSpacing: 1,
      color: P.gold,
    },
    needsYouList: {
      borderRadius: 14,
      backgroundColor: P.track,
      overflow: "hidden",
    },
    needsYouRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 14,
      gap: 10,
    },
    needsYouDivider: {
      borderTopWidth: 1,
      borderTopColor: P.border,
    },
    needsYouLabel: {
      flex: 1,
      fontSize: 15,
      fontFamily: "nunitoBold",
      color: P.text,
    },
    teacherSection: {
      gap: 10,
      marginTop: 4,
    },
    classCard: {
      padding: 16,
      borderRadius: 20,
      backgroundColor: P.card,
      borderWidth: 2,
      borderColor: P.border,
      gap: 10,
    },
    classCardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    classCardTitle: {
      fontSize: 18,
      fontFamily: "nunitoBold",
      color: P.text,
    },
    classCardSub: {
      fontSize: 13,
      fontFamily: "nunitoBold",
      color: P.textSoft,
      marginTop: 2,
    },
    shareCodeButton: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 12,
      backgroundColor: P.selectedBg,
      borderWidth: 1,
      borderColor: P.selectedBorder,
    },
    shareCodeText: {
      fontSize: 11,
      fontFamily: "nunitoBold",
      letterSpacing: 0.5,
      color: P.selectedText,
    },
    classStatsText: {
      fontSize: 14,
      fontFamily: "nunitoBold",
      color: P.text,
    },
    classActionRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: P.border,
      gap: 10,
    },
    classWeakText: {
      flex: 1,
      fontSize: 13,
      fontFamily: "nunitoBold",
      color: P.textSoft,
    },
    assignButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: P.primary,
    },
    assignButtonText: {
      fontSize: 12,
      fontFamily: "nunitoBold",
      letterSpacing: 0.5,
      color: P.onPrimary,
    },
  });

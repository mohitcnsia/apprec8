// screens/englishQuest/EndlessPracticeScreen.js
// ♾️ Keep practising (Spec v2 Step 4): one question at a time, instant feedback,
// no hearts, no end, no fail. The kid stops whenever they like.
// Questions = the branch's main + practice quizzes (never gate/boss questions) + generated
// questions from verified word tables. Answers are recorded in chunks of 10 and on Stop/close.
// No header back button: Android back = stop (answers are still saved on close).

import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../../context/ThemeContext";
import QuestionCard from "../../components/quiz/QuestionCard";
import Option from "../../components/quiz/Option";
import ReportQuestionButton from "../../components/quiz/ReportQuestionButton";
import ListenButtons from "../../components/quiz/ListenButtons";
import { useSoundEffects } from "../../hooks/useSoundEffects";
import { getQuizQuestions, getStudyDoc } from "../../services/contentCache";
import { saveQuestAttempt, updateEndlessStats } from "../../services/englishQuestApi";
import { GENERATORS, nextEndlessQuestion } from "../../utils/generators";
import { shuffle } from "../../utils/gateRules";
import { buildMistakeItems, similarQuestions, RIGHT_TO_CLEAR } from "../../utils/mistakes";

const CHUNK_SIZE = 10;

export default function EndlessPracticeScreen({ route, navigation }) {
  const {
    questId,
    nodeId,
    title = "Keep practising",
    poolQuizIds = [],
    poolSubtopics = {}, // quizId → sub-topic of the practice leaf it came from (old questions have none)
    generators = [],
    contentVersion = null,
    knownIssues = {},
    returnTo = "EnglishQuestMap",
    branchId = null,
    // "My mistakes" mode (owner priority): same screen, questions come from the kid's mistakes.
    mode = "endless", // "endless" | "mistakes"
    mistakes = {}, // the progress doc's mistakes map
    branchPools = {}, // branchId → { poolQuizIds, poolSubtopics, generators } (for topic mistakes)
    unitBranches = {}, // unitId → [branchId] (Unit Boss mistakes have no branch)
  } = route.params || {};
  const isMistakes = mode === "mistakes";
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme, insets), [theme, insets]);
  const { playSuccess, playFailure } = useSoundEffects();

  const [feed, setFeed] = useState(null); // { pool, generated, ... } for nextEndlessQuestion
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ answered: 0, correct: 0, streak: 0, bestStreak: 0 });

  const chunkRef = useRef([]);
  const totalsRef = useRef({ answered: 0, correct: 0, bestStreak: 0, bySubtopic: {}, savedAnswered: 0 });
  const startedAtRef = useRef(Date.now());
  const shownAtRef = useRef(Date.now());
  const finishedRef = useRef(false);
  // "My mistakes" session
  const queueRef = useRef([]); // [{ question, mistakeKey }]
  const rightRef = useRef({}); // mistakeKey → right answers in a row
  const similarRef = useRef(() => []);
  const keyRef = useRef(null); // mistakeKey of the current question
  const [left, setLeft] = useState(0);
  const fixedRef = useRef(0);

  // ---------- Load questions (cached, offline-friendly) ----------
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const hidden = new Set(Object.keys(knownIssues).filter((id) => knownIssues[id]?.status === "hidden"));
        if (isMistakes) {
          await loadMistakes(hidden);
          return;
        }
        const pool = [];
        for (const quizId of poolQuizIds) {
          const qs = (await getQuizQuestions(quizId, contentVersion).catch(() => [])) || [];
          qs.forEach((q) => {
            if (!hidden.has(q.id) && q.options?.some((o) => o.isCorrect)) {
              pool.push({ ...q, quizId, subtopic: q.subtopic || poolSubtopics[quizId] || null });
            }
          });
        }
        const generated = [];
        for (const g of generators) {
          const table = await getStudyDoc(g.table, contentVersion).catch(() => null);
          const make = GENERATORS[g.type];
          if (table?.entries && make) {
            make(table.entries).forEach((q) => !hidden.has(q.id) && generated.push({ ...q, quizId: g.table }));
          }
        }
        if (!alive) return;
        if (pool.length + generated.length === 0) {
          setError("No practice questions here yet. Check back soon!");
          return;
        }
        const first = nextEndlessQuestion({ pool, generated });
        setFeed(first.state);
        setQuestion(first.question);
        shownAtRef.current = Date.now();
      } catch (e) {
        console.error("EndlessPractice load failed:", e);
        if (alive) setError("Could not load practice questions. Please check your internet and try again.");
      }
    })();
    return () => {
      alive = false;
    };

    async function loadMistakes(hidden) {
      const entries = Object.values(mistakes);
      const byId = new Map();
      const all = []; // { ...question, branchId }
      const loadQuiz = async (quizId, b, subtopicFallback) => {
        const qs = (await getQuizQuestions(quizId, contentVersion).catch(() => [])) || [];
        qs.forEach((q) => {
          if (hidden.has(q.id) || !q.options?.some((o) => o.isCorrect)) return;
          const item = { ...q, quizId, subtopic: q.subtopic || subtopicFallback || null, branchId: b };
          if (!byId.has(q.id)) byId.set(q.id, item);
          all.push(item);
        });
      };
      const loadTable = async (table, type, b) => {
        const doc = await getStudyDoc(table, contentVersion).catch(() => null);
        const make = GENERATORS[type];
        if (!doc?.entries || !make) return;
        make(doc.entries).forEach((q) => {
          if (hidden.has(q.id)) return;
          const item = { ...q, quizId: table, branchId: b };
          if (!byId.has(q.id)) byId.set(q.id, item);
          all.push(item);
        });
      };
      // Everything needed: exact questions + the branch pools for topic (gate/boss) mistakes.
      const branchesNeeded = new Set();
      const quizDone = new Set();
      const tableDone = new Set();
      for (const e of entries) {
        if (e.kind === "topic") {
          (e.branchId ? [e.branchId] : unitBranches[e.unitId] || []).forEach((b) => branchesNeeded.add(b));
        } else if (e.generator && e.quizId && !tableDone.has(e.quizId)) {
          tableDone.add(e.quizId);
          await loadTable(e.quizId, e.generator, e.branchId);
        } else if (e.quizId && !quizDone.has(e.quizId)) {
          quizDone.add(e.quizId);
          await loadQuiz(e.quizId, e.branchId, branchPools[e.branchId]?.poolSubtopics?.[e.quizId]);
        }
      }
      for (const b of branchesNeeded) {
        const bp = branchPools[b] || {};
        for (const quizId of bp.poolQuizIds || []) {
          if (!quizDone.has(quizId)) {
            quizDone.add(quizId);
            await loadQuiz(quizId, b, bp.poolSubtopics?.[quizId]);
          }
        }
        for (const g of bp.generators || []) {
          if (!tableDone.has(g.table)) {
            tableDone.add(g.table);
            await loadTable(g.table, g.type, b);
          }
        }
      }
      // Similar questions for a topic mistake: same branch(es), same sub-topic when known.
      similarRef.current = (entry) => similarQuestions(all, entry, unitBranches);
      const items = buildMistakeItems(mistakes, { byId, similar: similarRef.current });
      if (!alive) return;
      if (!items.length) {
        setError("No mistakes to fix right now. Great job! 🎉");
        return;
      }
      rightRef.current = Object.fromEntries(Object.entries(mistakes).map(([k, e]) => [k, e.rightInARow || 0]));
      queueRef.current = items;
      setLeft(items.length);
      showMistake(items[0]);
    }
  }, []);

  const showMistake = (item) => {
    keyRef.current = item.mistakeKey;
    setQuestion({ ...item.question, options: shuffle(item.question.options) });
    setSelected(null);
    shownAtRef.current = Date.now();
  };

  // ---------- Recording ----------
  const flush = (final) => {
    const answers = chunkRef.current;
    chunkRef.current = [];
    if (answers.length) {
      saveQuestAttempt({
        questId,
        nodeId,
        quizId: nodeId,
        mode: isMistakes ? "mistakes" : "endless",
        activity: isMistakes ? "mistakes" : "endless", // updates the "My mistakes" list
        branchId,
        answers,
        totalQuestions: answers.length,
        passPercent: 0,
        startedAt: startedAtRef.current,
        outcome: "finished",
        skipProgress: true, // practice never "completes" a node
        details: { generated: answers.filter((a) => a.generated).length },
      });
      startedAtRef.current = Date.now();
    }
    if (final && !isMistakes) {
      const t = totalsRef.current;
      const newAnswered = t.answered - t.savedAnswered;
      if (newAnswered > 0) {
        t.savedAnswered = t.answered;
        updateEndlessStats(questId, nodeId, { bestStreak: t.bestStreak, answered: newAnswered }).catch((e) =>
          console.warn("updateEndlessStats failed:", e)
        );
      }
    }
  };

  // Closing the screen any way (Android back, Stop) saves what's left.
  useEffect(() => () => !finishedRef.current && flush(true), []);

  const onAnswer = (option) => {
    if (selected || !question) return;
    setSelected(option);
    const isCorrect = !!option.isCorrect;
    isCorrect ? playSuccess() : playFailure();

    const t = totalsRef.current;
    t.answered += 1;
    if (isCorrect) t.correct += 1;
    const sub = question.subtopic;
    if (sub) {
      t.bySubtopic[sub] = t.bySubtopic[sub] || { correct: 0, total: 0 };
      t.bySubtopic[sub].total += 1;
      if (isCorrect) t.bySubtopic[sub].correct += 1;
    }
    setStats((s) => {
      const streak = isCorrect ? s.streak + 1 : 0;
      const bestStreak = Math.max(s.bestStreak, streak);
      t.bestStreak = bestStreak;
      return { answered: s.answered + 1, correct: s.correct + (isCorrect ? 1 : 0), streak, bestStreak };
    });

    chunkRef.current.push({
      questionId: question.id,
      questionText: question.question?.content || "",
      chosen: option.content,
      correctAnswer: question.options.find((o) => o.isCorrect)?.content || null,
      isCorrect,
      timeMs: Date.now() - shownAtRef.current,
      mistakeTag: isCorrect ? null : option.mistakeTag || null,
      subtopic: sub || null,
      generated: !!question.generated,
      generator: question.generator || null,
      quizId: question.quizId || null,
      mistakeKey: isMistakes ? keyRef.current : null, // never undefined: Firestore rejects it
    });

    // "My mistakes": 2 right in a row fixes it; a wrong answer starts the count again.
    if (isMistakes) {
      const k = keyRef.current;
      const right = isCorrect ? (rightRef.current[k] || 0) + 1 : 0;
      rightRef.current[k] = right;
      if (right >= RIGHT_TO_CLEAR) {
        queueRef.current = queueRef.current.filter((it) => it.mistakeKey !== k);
        fixedRef.current += 1;
        setLeft(queueRef.current.length);
      }
    }
    if (chunkRef.current.length >= CHUNK_SIZE) flush(false);
  };

  const onNext = () => {
    if (isMistakes) {
      const q = queueRef.current;
      if (!q.length) return onStop();
      // Move the current item to the back (if still there) so the next mistake comes up.
      const i = q.findIndex((it) => it.mistakeKey === keyRef.current);
      if (i >= 0 && q.length > 1) q.push(...q.splice(i, 1));
      let next = q[0];
      if (next.mistakeKey.startsWith("topic:")) {
        // Topic (gate/boss) mistakes get a fresh similar question each time.
        const entry = mistakes[next.mistakeKey];
        const options = entry ? similarRef.current(entry) : [];
        if (options.length) next = { ...next, question: options[Math.floor(Math.random() * options.length)] };
      }
      showMistake(next);
      return;
    }
    const r = nextEndlessQuestion(feed);
    setFeed(r.state);
    // Re-shuffle options each time a question comes back.
    setQuestion(r.question ? { ...r.question, options: shuffle(r.question.options) } : null);
    setSelected(null);
    shownAtRef.current = Date.now();
  };

  const onStop = () => {
    finishedRef.current = true;
    flush(true);
    const t = totalsRef.current;
    if (t.answered === 0) {
      navigation.goBack();
      return;
    }
    const percent = Math.round((t.correct / t.answered) * 100);
    const weak = Object.entries(t.bySubtopic)
      .filter(([, v]) => v.total >= 2)
      .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)[0];
    const backToQuest = () => navigation.navigate(returnTo, { questId });
    const exitToStudy = () => navigation.popToTop();
    if (isMistakes) {
      const allFixed = queueRef.current.length === 0;
      navigation.replace("ResultsScreen", {
        title: allFixed ? "All mistakes fixed! 🎉" : "Great fixing! 🔧",
        message: allFixed ? "You fixed every mistake. Brilliant!" : "Come back to fix the rest. Two right answers in a row fixes a mistake.",
        metrics: [
          { label: "Fixed today", value: String(fixedRef.current) },
          { label: "Still to fix", value: String(queueRef.current.length) },
          { label: "Right", value: `${t.correct} of ${t.answered}` },
        ],
        actions: [
          ...(allFixed ? [] : [{ label: "Keep fixing", onPress: () => navigation.replace("EndlessPractice", { ...route.params, mistakes: currentMistakesAfterSession() }), mode: "contained" }]),
          { label: "Back to Quest", onPress: () => navigation.navigate(returnTo, { questId }), mode: allFixed ? "contained" : "outlined" },
          { label: "Exit to Study", onPress: () => navigation.popToTop(), mode: "text" },
        ],
        closeAction: () => navigation.popToTop(),
        savedNote: "Progress saved ✓",
        effects: { confetti: allFixed },
        feedbackContext: { type: "quest_mistakes", id: questId },
      });
      return;
    }
    navigation.replace("ResultsScreen", {
      title: "Great practice! 💪",
      message: `${title}`,
      metrics: [
        { label: "Questions", value: String(t.answered) },
        { label: "Right", value: `${t.correct} (${percent}%)` },
        { label: "Best streak", value: `${t.bestStreak} 🔥` },
        ...(weak && weak[1].correct < weak[1].total
          ? [{ label: `Keep working on ${weak[0].replace(/-/g, " ")}`, value: `${weak[1].correct}/${weak[1].total}`, status: "weak" }]
          : []),
      ],
      actions: [
        { label: "Keep going", onPress: () => navigation.replace("EndlessPractice", route.params), mode: "contained" },
        { label: "Back to Quest", onPress: backToQuest, mode: "outlined" },
        { label: "Exit to Study", onPress: exitToStudy, mode: "text" },
      ],
      closeAction: exitToStudy,
      savedNote: "Practice saved ✓",
      effects: { confetti: t.bestStreak >= 10 },
      feedbackContext: { type: "quest_endless", id: nodeId },
    });
  };

  // The mistakes list as it is after this session (for "Keep fixing" without waiting for the listener).
  const currentMistakesAfterSession = () => {
    const keep = new Set(queueRef.current.map((it) => it.mistakeKey));
    return Object.fromEntries(
      Object.entries(mistakes)
        .filter(([k]) => keep.has(k))
        .map(([k, e]) => [k, { ...e, rightInARow: rightRef.current[k] || 0 }])
    );
  };

  // ---------- UI ----------
  if (error) {
    return (
      <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={[styles.container, styles.centered]}>
        <Text style={styles.message}>{error}</Text>
      </LinearGradient>
    );
  }
  if (!question) {
    return (
      <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </LinearGradient>
    );
  }

  const answered = !!selected;
  const wasCorrect = answered && !!selected.isCorrect;
  const explanation = question.explanation?.text || (typeof question.explanation === "string" ? question.explanation : "");

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <ReportQuestionButton
          questionId={question.id}
          questionText={question.question?.content}
          options={question.options}
          quizId={question.quizId}
          chosen={selected?.content ?? null}
          mode={isMistakes ? "mistakes" : "endless"}
          questContext={{ questId, nodeId }}
          knownStatus={knownIssues?.[question.id]?.status}
          color={theme.textPrimaryOnGradient}
        />
      </View>
      <View style={styles.statsRow}>
        <Text style={styles.stat}>🔥 {stats.streak} in a row</Text>
        <Text style={styles.stat}>
          {isMistakes ? `🔧 ${left} to fix` : `✓ ${stats.correct} / ${stats.answered}`}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* RB-5b ear training (practice only) */}
        <View style={styles.listenRow}>
          <ListenButtons questionId={question.id} questionText={question.question?.content} options={question.options} />
        </View>
        <QuestionCard question={question} />
        <View style={{ flex: 1 }} />
        <View style={{ marginTop: 10 }}>
          {question.options.map((option, index) => (
            <Option
              key={`${question.id}-${index}`}
              index={index}
              option={option}
              onPress={() => onAnswer(option)}
              isSelected={selected?.content === option.content}
              showFeedback={answered}
              isCorrect={option.isCorrect}
            />
          ))}
        </View>
        {answered ? (
          <View style={styles.feedbackBox}>
            <Text style={[styles.feedbackTitle, { color: wasCorrect ? theme.success : theme.warning }]}>
              {wasCorrect ? "Correct! 🎉" : "Not quite."}
            </Text>
            {explanation ? <Text style={styles.feedbackText}>{explanation}</Text> : null}
          </View>
        ) : null}
      </ScrollView>

      {/* Thumb zone */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={onStop} activeOpacity={0.85}>
          <Ionicons name="stop-circle-outline" size={20} color={theme.textPrimaryOnGradient} />
          <Text style={styles.stopText}>Stop</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.nextButton, !answered && { opacity: 0.4 }]}
          onPress={onNext}
          disabled={!answered}
          activeOpacity={0.85}
        >
          <Text style={styles.nextText}>{isMistakes && left === 0 ? "Finish" : "Next"}</Text>
          <Ionicons name="arrow-forward" size={20} color={theme.textOnPrimary || "#FFFFFF"} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const makeStyles = (theme, insets) =>
  StyleSheet.create({
    container: { flex: 1 },
    centered: { justifyContent: "center", alignItems: "center", padding: 24 },
    message: { fontSize: 16, fontFamily: "nunito", color: theme.textPrimaryOnGradient, textAlign: "center" },
    header: { flexDirection: "row", alignItems: "center", paddingTop: insets.top + 12, paddingHorizontal: 16, gap: 8 },
    title: { flex: 1, fontSize: 20, fontFamily: "nunitoBold", color: theme.textPrimaryOnGradient },
    statsRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 6 },
    stat: { fontSize: 15, fontFamily: "nunitoBold", color: theme.gold },
    scroll: { flexGrow: 1, padding: 15, paddingBottom: 20 },
    listenRow: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 6 },
    feedbackBox: { marginTop: 12, padding: 12, borderRadius: 14, backgroundColor: theme.cardBackground, gap: 4 },
    feedbackTitle: { fontSize: 17, fontFamily: "nunitoBold" },
    feedbackText: { fontSize: 15, fontFamily: "nunito", color: theme.textPrimary, lineHeight: 21 },
    footer: { flexDirection: "row", gap: 12, paddingHorizontal: 15, paddingTop: 8, paddingBottom: Math.max(24, insets.bottom + 16) },
    button: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 28, paddingVertical: 14 },
    stopButton: { flex: 1, borderWidth: 2, borderColor: theme.border },
    stopText: { fontSize: 17, fontFamily: "nunitoBold", color: theme.textPrimaryOnGradient },
    nextButton: { flex: 2, backgroundColor: theme.primary },
    nextText: { fontSize: 17, fontFamily: "nunitoBold", color: theme.textOnPrimary || "#FFFFFF" },
  });

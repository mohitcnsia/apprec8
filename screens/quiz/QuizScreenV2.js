/**
 * @file QuizScreenV2.js
 * @description The main UI for the V2 Quiz. It now passes final score data
 * to the generic ResultsScreen and lets it handle the UI logic.
 */
import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from "../../context/ThemeContext";
import { useQuizEngine } from "../../hooks/useQuizEngine";
import { useSoundEffects } from "../../hooks/useSoundEffects";
import Option from "../../components/quiz/Option";
import ReportQuestionButton from "../../components/quiz/ReportQuestionButton";
import ListenButtons from "../../components/quiz/ListenButtons";
import QuestionPrompt from "../../components/quiz/QuestionPrompt";
import FeedbackSheet from "../../components/quiz/FeedbackSheet";
import Mascot from "../../components/quiz/Mascot";
import { quizPalette } from "../../components/quiz/quizPalette";
import { fitsTiles, sheetExplanation } from "../../utils/quizText";
import { saveQuestAttempt } from "../../services/englishQuestApi";
import { evaluateGate, canRetryAfter } from "../../utils/gateRules";

const QuizScreenV2 = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const C = theme.appColors || theme;
  const P = quizPalette(isDark);
  // questContext is only set by tile-based quests (English Quest):
  // { questId, nodeId, passPercent, returnTo }
  const { quiz, mode, isFirstAttempt, questContext } = route.params;

  const { state, dispatch } = useQuizEngine(quiz, mode, isFirstAttempt);
  const { status, questions, error, currentIndex, score, lives } = state;
  const { playSuccess, playFailure } = useSoundEffects();

  // --- Answer recording for quests (who answered what, and how fast) ---
  const answerLogRef = useRef({}); // questionId -> answer entry
  const questionShownAtRef = useRef(Date.now());
  const quizStartedAtRef = useRef(null);
  const attemptSavedRef = useRef(false);

  useEffect(() => {
    if (status === "answering") {
      if (!quizStartedAtRef.current) quizStartedAtRef.current = Date.now();
      questionShownAtRef.current = Date.now();
    }
  }, [status, currentIndex]);

  const logAnswer = (question, option) => {
    if (!questContext || !question || !option) return;
    const previous = answerLogRef.current[question.id];
    const timeMs = Date.now() - questionShownAtRef.current;
    answerLogRef.current[question.id] = {
      questionId: question.id,
      questionText: question.question?.content || "",
      chosen: option.content,
      correctAnswer: question.options.find((o) => o.isCorrect)?.content || null,
      isCorrect: !!option.isCorrect,
      // In exam mode a kid can come back and change an answer; add up the time.
      timeMs: (previous?.timeMs || 0) + timeMs,
      mistakeTag: option.isCorrect ? null : option.mistakeTag || null,
      subtopic: question.subtopic || null,
      changedAnswer: !!previous,
    };
  };

  // Gates (English Quest): pass = score >= passPercent AND at least one right in every sub-topic.
  const isGate = !!questContext?.gate;
  const gateResultRef = useRef(null);
  const getGateResult = () =>
    evaluateGate(Object.values(answerLogRef.current), questions, {
      passPercent: questContext?.passPercent ?? 80,
      requireEverySubtopic: true,
    });

  const saveAttemptOnce = (outcome) => {
    if (!questContext || attemptSavedRef.current) return;
    attemptSavedRef.current = true;
    if (isGate) gateResultRef.current = getGateResult();
    saveQuestAttempt({
      questId: questContext.questId,
      nodeId: questContext.nodeId,
      quizId: quiz.id,
      mode,
      answers: Object.values(answerLogRef.current),
      totalQuestions: questions.length,
      passPercent: questContext.passPercent ?? 60,
      startedAt: quizStartedAtRef.current,
      outcome,
      gateResult: isGate ? gateResultRef.current : null,
      resetGateId: questContext.resetGateId || null,
      // "My mistakes": where this quiz sits (gate/boss mistakes are kept as topics)
      activity: questContext.activity || "practice",
      branchId: questContext.branchId || null,
      unitId: questContext.unitId || null,
      topicTag: questContext.topicTag || null, // dashboard topic when a question has no sub-topic
    });
  };

  // Retry a gate with a fresh draw (remount), honouring the 2-fails lock.
  const failsAfterThisAttempt = (passed) => (passed ? 0 : (questContext?.failsSoFar || 0) + 1);
  const retryGate = (passed) =>
    navigation.replace("QuizScreenV2", {
      quiz,
      mode,
      questContext: { ...questContext, failsSoFar: failsAfterThisAttempt(passed) },
    });
  const backToQuest = () =>
    navigation.navigate(questContext?.returnTo || "EnglishQuestMap", { questId: questContext?.questId });
  // Leave the quest entirely (back to the Study tab root) without the 3-step back chain.
  const exitToStudy = () => navigation.popToTop();
  const exitAction = { label: "Exit to Study", onPress: exitToStudy, mode: "text" };

  const buildGateResultParams = (submissionContext) => {
    const r = gateResultRef.current || getGateResult();
    const titles = questContext.subtopicTitles || {};
    const nameOf = (id) => titles[id] || id;
    const weakNames = r.weak.map(nameOf);
    const canRetry = canRetryAfter(failsAfterThisAttempt(r.passed));
    const metrics = Object.entries(r.bySubtopic).map(([id, v]) => ({
      label: nameOf(id),
      value: `${v.correct}/${v.total}`,
      status: v.correct === 0 ? "weak" : "passed", // ResultsScreen draws a vector icon
    }));
    if (r.passed) {
      return {
        title: `🎉 ${questContext.nextTitle ? `${questContext.nextTitle} unlocked!` : "Challenge passed!"}`,
        message: `${quiz.title}: ${r.correctCount}/${r.total} (${r.percent}%)${r.percent < 100 ? "\nTry for 100% to earn ⭐" : ""}`,
        finalScore: r.correctCount,
        maxPossibleScore: r.total,
        metrics,
        actions: [
          { label: "Back to Quest", onPress: backToQuest, mode: "contained" },
          { label: "Play again", onPress: () => retryGate(true), mode: "outlined" },
          exitAction,
        ],
        closeAction: exitToStudy,
        savedNote: "Progress saved ✓",
        effects: { confetti: true },
        submissionContext,
        feedbackContext: { type: "quest_gate", id: quiz.id },
      };
    }
    const passPercent = questContext.passPercent ?? 80;
    const lines = [`You need ${passPercent}% and at least one right answer in every topic.`];
    if (weakNames.length) lines.push(`Practise "${weakNames.join('", "')}" first.`);
    if (!canRetry) lines.push("Practise a glowing topic on the map, then you can try again.");
    return {
      title: `So close! ${r.correctCount}/${r.total} (${r.percent}%)`,
      message: lines.join("\n"),
      finalScore: r.correctCount,
      maxPossibleScore: r.total,
      metrics,
      actions: canRetry
        ? [
            { label: weakNames.length ? `Go practise ${weakNames[0]}` : "Back to Quest", onPress: backToQuest, mode: "contained" },
            { label: "Try again", onPress: () => retryGate(false), mode: "outlined" },
            exitAction,
          ]
        : [
            { label: weakNames.length ? `Go practise ${weakNames[0]}` : "Back to Quest", onPress: backToQuest, mode: "contained" },
            exitAction,
          ],
      closeAction: exitToStudy,
      savedNote: "Progress saved ✓",
      effects: { confetti: false },
      submissionContext,
      feedbackContext: { type: "quest_gate", id: quiz.id },
    };
  };

  // Out of hearts still counts as an attempt (useful for teachers).
  useEffect(() => {
    if (status === "failed") saveAttemptOnce("outOfHearts");
    // "Try Again" restarts the quiz: allow a new attempt to be saved.
    if (status === "ready") {
      attemptSavedRef.current = false;
      answerLogRef.current = {};
      quizStartedAtRef.current = null;
    }
  }, [status]);

  /**
   * DOCUMENTATION:
   * This hook runs when the quiz engine's status changes.
   * When the status becomes "finished", we prepare the data for the ResultsScreen.
   *
   * THE CHANGE:
   * The "Exit" button's onPress action is modified. Instead of just going back,
   * it now navigates specifically to "QuestMap" and passes a parameter
   * called `completedQuizId`. This is the signal the Quest Map will listen for.
   */
  useEffect(() => {
    if (status === "finished") {
      saveAttemptOnce("finished");
      let maxPossibleScore;
      if (mode === "exam") {
        maxPossibleScore = 10;
      } else {
        maxPossibleScore = questions.reduce(
          (sum, q) => sum + (q.stars || 10),
          0,
        );
      }
      
      const isPerfectScore = score >= maxPossibleScore; // In exam, it can be 15 which is >= 10

      const resultParams = {
        title: "Quiz Complete!",
        message: "Great effort, {username}!",
        finalScore: score,
        maxPossibleScore: mode === "exam" && isFirstAttempt ? 15 : maxPossibleScore,
        missedQuestions: state.missedQuestions || [],
        metrics: [
          {
            label: "Final Score",
            value: `${score} / ${mode === "exam" && isFirstAttempt ? 15 : maxPossibleScore} Stars`,
          },
        ],
        actions: [
          {
            label: "Play Again",
            onPress: () => navigation.replace("QuizScreenV2", { quiz, mode, questContext }),
            mode: "contained",
          },
          {
            label: questContext ? "Back to Quest" : "Exit",
            onPress: () =>
              questContext
                ? navigation.navigate(questContext.returnTo || "EnglishQuestMap", {
                    questId: questContext.questId,
                  })
                : navigation.navigate("QuestMap", {
                    completedQuizId: (mode === "exam" && score >= maxPossibleScore) ? quiz.id : null,
                  }),
            mode: "outlined",
          },
          ...(questContext ? [exitAction] : []),
        ],
        ...(questContext ? { closeAction: exitToStudy, savedNote: "Progress saved ✓" } : {}),
        effects: { confetti: isPerfectScore },
        // Spec v2: every English Quest quiz reports (also Training) as mode "quest"; the server's
        // existing rules decide stars (100% only, anti-farming). Space/V1 Training stays unreported.
        submissionContext: mode === "training" && !questContext ? null : {
          // UnComment this
          cloudFunctionName: "recordQuizResult",
          /// And delete this///
          // cloudFunctionName: "DelteMeLater",
          ///////
          payload: {
            quizId: quiz.id,
            scoreAchieved: score,
            maxScore: maxPossibleScore,
            mode: questContext ? "quest" : mode,
            passingScore: 0,
          },
        },
        feedbackContext: { type: "quiz_v2_overall", id: quiz.id },
      };

      navigation.replace(
        "ResultsScreen",
        isGate ? buildGateResultParams(resultParams.submissionContext) : resultParams
      );
    }
  }, [status, navigation, questions, score, quiz, mode]);

  const handleContinueToExplanation = () => {
    const currentQuestion = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;
    navigation.navigate("Explanation", {
      explanation: currentQuestion.explanation,
      isCorrect: state.wasCorrect,
      isLastQuestion: isLastQuestion,
      quizId: quiz.id,
      questionId: currentQuestion.id,
      onNext: () => dispatch({ type: "NEXT_QUESTION" }),
    });
    // dispatch({ type: "NEXT_QUESTION" });
  };

  const handleCheckAnswer = async () => {
    if (!state.selectedAnswer) return;
    const isCorrect = state.selectedAnswer.isCorrect;
    const currentQuestion = questions[currentIndex];
    logAnswer(currentQuestion, state.selectedAnswer);

    if (isCorrect) {
      playSuccess();
    } else {
      playFailure();
    }
    dispatch({ type: "CHECK_ANSWER" });

    // Update Local Question Analytics
    try {
      const statsKey = `quizStats_${quiz.id}`;
      const statsJson = await AsyncStorage.getItem(statsKey);
      let stats = statsJson ? JSON.parse(statsJson) : {};
      
      const qStats = stats[currentQuestion.id] || { seen: 0, correct: 0, wrong: 0 };
      qStats.seen += 1;
      if (isCorrect) {
        qStats.correct += 1;
      } else {
        qStats.wrong += 1;
      }
      stats[currentQuestion.id] = qStats;
      await AsyncStorage.setItem(statsKey, JSON.stringify(stats));
    } catch (e) {
      console.warn("Failed to save local question stats:", e);
    }
  };

  // ---------- Look (quiz redesign, owner-approved mockups 2026-11-04) ----------
  const styles = useMemo(() => makeStyles(P, insets), [P, insets]);

  // After Check: plain-text explanations show in the sheet; a picture or fun fact keeps its screen.
  const handleContinue = () => {
    const currentQuestion = questions[currentIndex];
    if (sheetExplanation(currentQuestion?.explanation).rich) handleContinueToExplanation();
    else dispatch({ type: "NEXT_QUESTION" });
  };

  const bigButton = (label, onPress, { disabled = false, tone = "primary", style } = {}) => {
    const colors =
      tone === "danger"
        ? { bg: P.wrongBorder, shadow: P.wrongButtonShadow, fg: "#FFFFFF" }
        : tone === "ghost"
        ? { bg: "transparent", shadow: "transparent", fg: P.label }
        : disabled
        ? { bg: P.disabledBg, shadow: P.disabledShadow, fg: P.disabledText }
        : { bg: P.primary, shadow: P.primaryShadow, fg: P.onPrimary };
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={[styles.bigButton, { backgroundColor: colors.bg, borderBottomColor: colors.shadow }, tone === "ghost" && styles.ghostButton, style]}
      >
        <Text style={[styles.bigButtonText, { color: colors.fg }]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    const currentQuestion = questions[currentIndex];
    switch (status) {
      case "loading":
      case "error":
      case "ready": {
        return (
          <View style={styles.centered}>
            {status === "loading" && <ActivityIndicator animating size="large" color={P.label} />}
            {status === "error" && <Text style={styles.errorText}>{error}</Text>}
            {status === "ready" ? (
              <>
                <Mascot size={96} />
                <Text style={styles.bigTitle}>{quiz.title}</Text>
              </>
            ) : null}
            {status !== "loading"
              ? bigButton(status === "ready" ? `Start ${mode}` : "Go back", () =>
                  status === "ready" ? dispatch({ type: "START_QUIZ" }) : navigation.goBack()
                , { style: { alignSelf: "stretch", marginTop: 12 } })
              : null}
          </View>
        );
      }
      case "failed": {
        return (
          <View style={styles.centered}>
            <Mascot mood="thinking" size={96} />
            <View style={styles.heartsRow}>
              <Ionicons name="heart-dislike" size={30} color={P.heart} />
              <Text style={[styles.bigTitle, { color: P.wrongBorder, marginBottom: 0 }]}>Out of hearts!</Text>
            </View>
            <Text style={styles.softText}>Don't worry, mistakes help you learn.</Text>
            {!isGate || canRetryAfter(failsAfterThisAttempt(false))
              ? bigButton("Try again", () => (isGate ? retryGate(false) : dispatch({ type: "RESTART_QUIZ" })), {
                  style: { alignSelf: "stretch", marginTop: 18 },
                })
              : <Text style={styles.softText}>Practise a glowing topic on the map, then try this challenge again.</Text>}
            {bigButton("Quit", () => navigation.goBack(), { tone: "ghost", style: { alignSelf: "stretch", marginTop: 6 } })}
          </View>
        );
      }
      case "answering": {
        if (!currentQuestion) return null;
        const isMarkedForReview = state.markedForReview.includes(currentQuestion.id);
        const checked = mode === "training" && state.showFeedback;
        const wasCorrect = !!state.wasCorrect;
        const tiles = fitsTiles(currentQuestion.options);
        const done = currentIndex + (checked ? 1 : 0);
        const chosenText = mode === "exam" ? state.userAnswers[currentQuestion.id] ?? null : state.selectedAnswer?.content ?? null;
        const explanation = sheetExplanation(currentQuestion.explanation);
        const onOption = (option) => {
          if (mode === "training") {
            dispatch({ type: "SELECT_ANSWER", payload: { selectedOption: option } });
          } else {
            logAnswer(currentQuestion, option);
            dispatch({ type: "ANSWER_AND_ADVANCE", payload: { questionId: currentQuestion.id, selectedOption: option } });
          }
        };
        return (
          <View style={styles.screen}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
              <View style={styles.headerRow}>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${Math.round((done / Math.max(1, questions.length)) * 100)}%` }]} />
                </View>
                {mode === "exam" ? (
                  <TouchableOpacity
                    accessibilityLabel={isMarkedForReview ? "Unmark this question" : "Mark this question for review"}
                    style={styles.iconButton}
                    onPress={() => dispatch({ type: "TOGGLE_MARK_FOR_REVIEW", payload: { questionId: currentQuestion.id } })}
                  >
                    <Ionicons name={isMarkedForReview ? "bookmark" : "bookmark-outline"} size={26} color={isMarkedForReview ? P.gold : P.textSoft} />
                  </TouchableOpacity>
                ) : null}
                <ReportQuestionButton
                  questionId={currentQuestion.id}
                  questionText={currentQuestion.question?.content}
                  options={currentQuestion.options}
                  quizId={quiz.id}
                  chosen={mode === "exam" ? state.userAnswers[currentQuestion.id] ?? null : checked ? state.selectedAnswer?.content ?? null : null}
                  mode={mode}
                  questContext={questContext}
                  knownStatus={questContext?.knownIssues?.[currentQuestion.id]?.status}
                  color={P.textSoft}
                />
                {mode === "training" ? (
                  <View style={styles.heartsRow} accessibilityLabel={`${lives} hearts left`}>
                    <Ionicons name="heart" size={24} color={P.heart} />
                    <Text style={styles.heartsText}>{lives}</Text>
                  </View>
                ) : null}
              </View>

              <QuestionPrompt
                question={currentQuestion}
                mood={checked ? (wasCorrect ? "cheer" : "thinking") : "happy"}
                chosenText={chosenText}
              />

              {/* RB-5b ear training: English Quest PRACTICE in Training only (never gates, Boss or Exam) */}
              {mode === "training" && questContext?.activity === "practice" ? (
                <View style={styles.listenRow}>
                  <ListenButtons
                    questionId={currentQuestion.id}
                    questionText={currentQuestion.question?.content}
                    options={currentQuestion.options}
                    color={P.label}
                  />
                </View>
              ) : null}

              <View style={tiles ? styles.tileGrid : styles.optionList}>
                {currentQuestion.options.map((option, index) => (
                  <Option
                    key={`${currentQuestion.id}-${index}`}
                    index={index}
                    variant={tiles ? "tile" : "card"}
                    option={option}
                    onPress={() => onOption(option)}
                    isSelected={chosenText !== null && chosenText === option.content}
                    showFeedback={checked}
                    isCorrect={option.isCorrect}
                  />
                ))}
              </View>
            </ScrollView>

            {mode === "training" && !checked ? (
              <View style={styles.footer}>{bigButton("CHECK", handleCheckAnswer, { disabled: !state.selectedAnswer })}</View>
            ) : null}
            {checked ? (
              <FeedbackSheet
                correct={wasCorrect}
                title={wasCorrect ? "Brilliant!" : "Not quite"}
                text={explanation.text}
                buttonLabel={explanation.rich ? "SEE WHY" : wasCorrect ? "CONTINUE" : "GOT IT"}
                onPress={handleContinue}
                bottomInset={insets.bottom}
              />
            ) : null}
          </View>
        );
      }
      case "reviewing": {
        return (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.bigTitle}>Review your answers</Text>
            {questions.map((q, index) => {
              const isMarked = state.markedForReview.includes(q.id);
              const userAnswer = state.userAnswers[q.id];
              return (
                <TouchableOpacity
                  key={q.id}
                  style={[styles.reviewItem, isMarked && styles.reviewItemMarked]}
                  onPress={() => dispatch({ type: "GO_TO_QUESTION", payload: { index } })}
                  accessibilityLabel={`Question ${index + 1}, tap to change`}
                >
                  <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                    {isMarked ? <Ionicons name="bookmark" size={18} color={P.gold} /> : null}
                    <Text style={styles.reviewQuestionText}>{`Question ${index + 1}: ${q.question.content}`}</Text>
                  </View>
                  {q.options.map((opt, optIndex) => {
                    const picked = opt.content === userAnswer;
                    return (
                      <View key={optIndex} style={[styles.reviewOption, picked && styles.reviewOptionPicked]}>
                        <Text style={picked ? styles.reviewOptionTextPicked : styles.reviewOptionText}>{opt.content}</Text>
                      </View>
                    );
                  })}
                </TouchableOpacity>
              );
            })}
            {bigButton("SUBMIT EXAM", () => dispatch({ type: "SUBMIT_EXAM", payload: { isFirstAttempt } }), { style: { marginTop: 16 } })}
          </ScrollView>
        );
      }
      default:
        return (
          <View style={styles.centered}>
            <ActivityIndicator animating size="large" color={P.label} />
          </View>
        );
    }
  };

  return <View style={[styles.container, { backgroundColor: P.bg }]}>{renderContent()}</View>;
};

const makeStyles = (P, insets) =>
  StyleSheet.create({
    container: { flex: 1 },
    screen: { flex: 1 },
    centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, gap: 6 },
    errorText: { color: P.wrongBorder, fontSize: 16, textAlign: "center", marginBottom: 15, fontFamily: "nunitoBold" },
    bigTitle: { color: P.text, fontSize: 26, textAlign: "center", fontFamily: "nunitoBold", marginVertical: 10 },
    softText: { color: P.textSoft, fontSize: 16, textAlign: "center", fontFamily: "nunitoBold", lineHeight: 23 },
    scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingTop: insets.top + 16, paddingBottom: 20, gap: 14 },
    headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    progressTrack: { flex: 1, height: 16, borderRadius: 8, backgroundColor: P.track, overflow: "hidden" },
    progressFill: { height: "100%", borderRadius: 8, backgroundColor: P.gold },
    iconButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
    heartsRow: { flexDirection: "row", alignItems: "center", gap: 5 },
    heartsText: { color: P.heart, fontFamily: "nunitoBold", fontSize: 18 },
    listenRow: { flexDirection: "row", justifyContent: "flex-start" },
    optionList: { marginTop: 6 },
    tileGrid: { marginTop: 10, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
    footer: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: Math.max(22, insets.bottom + 14) },
    bigButton: { height: 58, borderRadius: 18, borderBottomWidth: 5, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
    ghostButton: { borderBottomWidth: 0 },
    bigButtonText: { fontSize: 18, fontFamily: "nunitoBold", letterSpacing: 1 },
    reviewItem: { padding: 15, marginBottom: 10, backgroundColor: P.card, borderRadius: 16, borderWidth: 2, borderColor: P.border },
    reviewItemMarked: { borderColor: P.gold },
    reviewQuestionText: { flex: 1, fontFamily: "nunitoBold", fontSize: 16, color: P.text, lineHeight: 22 },
    reviewOption: { marginVertical: 4, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 14, borderWidth: 2, borderColor: P.border },
    reviewOptionPicked: { backgroundColor: P.selectedBg, borderColor: P.selectedBorder },
    reviewOptionText: { fontFamily: "nunito", fontSize: 15, color: P.textSoft },
    reviewOptionTextPicked: { fontFamily: "nunitoBold", fontSize: 15, color: P.selectedText },
  });

export default QuizScreenV2;

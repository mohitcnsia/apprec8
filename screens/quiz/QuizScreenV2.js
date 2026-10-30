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
import { Button as PaperButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from "../../context/ThemeContext";
import { useQuizEngine } from "../../hooks/useQuizEngine";
import { useSoundEffects } from "../../hooks/useSoundEffects";
import QuestionCard from "../../components/quiz/QuestionCard";
import Option from "../../components/quiz/Option";
import ReportQuestionButton from "../../components/quiz/ReportQuestionButton";
import ListenButtons from "../../components/quiz/ListenButtons";
import { saveQuestAttempt } from "../../services/englishQuestApi";
import { evaluateGate, canRetryAfter } from "../../utils/gateRules";

const QuizScreenV2 = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const C = theme.appColors || theme;
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

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1 },
        centered: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        },
        errorText: {
          color: C.warning,
          fontSize: 16,
          textAlign: "center",
          marginBottom: 15,
        },
        scrollableContainer: { flex: 1 },
        scrollContent: { flexGrow: 1, padding: 15, paddingTop: 60, paddingBottom: Math.max(40, insets.bottom + 20) },
        footer: { padding: 15, paddingTop: 5, paddingBottom: Math.max(40, insets.bottom + 20), backgroundColor: "transparent" },
        progressText: {
          color: C.textOnPrimary || "white",
          fontSize: 16,
          textAlign: "center",
          marginBottom: 15,
          fontFamily: "nunitoBold",
        },
        reviewItem: {
          padding: 15,
          marginVertical: 8,
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "transparent",
        },
        reviewItemMarked: { borderColor: C.accent || "#1CB0F6" },
        reviewQuestionText: {
          fontFamily: "nunitoBold",
          fontSize: 16,
          color: C.textOnPrimary || "white",
          marginBottom: 12,
        },
        reviewOptionContainer: {
          marginVertical: 4,
          padding: 10,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.2)",
        },
        reviewOptionContainerSelected: {
          backgroundColor: C.primary || "#58CC02",
        },
        reviewOptionText: {
          fontFamily: "nunito",
          color: "rgba(255,255,255,0.8)",
        },
        reviewOptionTextSelected: { fontFamily: "nunitoBold", color: "white" },
        markButton: {
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1,
          padding: 5,
        },
        headerRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 15,
        },
        progressBarContainer: {
          flex: 1,
          height: 12,
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 6,
          marginRight: 15,
          overflow: 'hidden',
        },
        progressBarFill: {
          height: '100%',
          backgroundColor: '#58CC02', // Duolingo Green
        },
        heartsContainer: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        heartsText: {
          color: '#FF4B4B',
          fontFamily: 'nunitoBold',
          fontSize: 18,
          marginLeft: 5,
        },
        footerCorrect: {
          backgroundColor: 'rgba(88, 204, 2, 0.9)', // Green tint
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        footerIncorrect: {
          backgroundColor: 'rgba(255, 75, 75, 0.9)', // Red tint
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        feedbackText: {
          color: 'white',
          fontFamily: 'nunitoBold',
          fontSize: 20,
          marginBottom: 10,
        },
      }),
    [C, insets.bottom],
  );

  const renderContent = () => {
    const currentQuestion = questions[currentIndex];
    switch (status) {
      case "loading":
      case "error":
      case "ready": {
        const titleColor = {
          color: C.textOnPrimary || "white",
          fontSize: 22,
          textAlign: "center",
          marginBottom: 20,
          fontFamily: "nunitoBold",
        };
        return (
          <View style={styles.centered}>
            {status === "loading" && (
              <ActivityIndicator
                animating={true}
                size="large"
                color="#FFFFFF"
              />
            )}
            {status === "error" && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            {status === "ready" && <Text style={titleColor}>{quiz.title}</Text>}
            <PaperButton
              mode="contained"
              onPress={() =>
                status === "ready"
                  ? dispatch({ type: "START_QUIZ" })
                  : navigation.goBack()
              }
            >
              {status === "ready" ? `Start ${mode}` : "Go Back"}
            </PaperButton>
          </View>
        );
      }
      case "failed": {
        const titleColor = {
          color: "#FF4B4B",
          fontSize: 24,
          textAlign: "center",
          marginBottom: 10,
          fontFamily: "nunitoBold",
        };
        return (
          <View style={styles.centered}>
            <Ionicons name="heart-dislike" size={64} color="#FF4B4B" style={{marginBottom: 20}} />
            <Text style={titleColor}>Out of Hearts!</Text>
            <Text style={[styles.progressText, {marginBottom: 30}]}>Don't worry, mistakes help you learn.</Text>
            {!isGate || canRetryAfter(failsAfterThisAttempt(false)) ? (
              <PaperButton
                mode="contained"
                buttonColor="#FF4B4B"
                onPress={() => (isGate ? retryGate(false) : dispatch({ type: "RESTART_QUIZ" }))}
              >
                Try Again
              </PaperButton>
            ) : (
              <Text style={[styles.progressText, { marginBottom: 10 }]}>
                Practise a glowing topic on the map, then try this challenge again.
              </Text>
            )}
            <PaperButton
              mode="outlined"
              style={{marginTop: 15}}
              textColor="white"
              onPress={() => navigation.goBack()}
            >
              Quit
            </PaperButton>
          </View>
        );
      }
      case "answering": {
        if (!currentQuestion) return null;
        const isMarkedForReview = state.markedForReview.includes(
          currentQuestion.id,
        );
        return (
          <View style={styles.scrollableContainer}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.headerRow}>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBarFill, { width: `${(currentIndex / questions.length) * 100}%` }]} />
                </View>
                <ReportQuestionButton
                  questionId={currentQuestion.id}
                  questionText={currentQuestion.question?.content}
                  options={currentQuestion.options}
                  quizId={quiz.id}
                  chosen={
                    mode === "exam"
                      ? state.userAnswers[currentQuestion.id] ?? null
                      : state.showFeedback
                      ? state.selectedAnswer?.content ?? null
                      : null
                  }
                  mode={mode}
                  questContext={questContext}
                  knownStatus={questContext?.knownIssues?.[currentQuestion.id]?.status}
                  color="white"
                />
                {mode === "training" && (
                  <View style={styles.heartsContainer}>
                    <Ionicons name="heart" size={24} color="#FF4B4B" />
                    <Text style={styles.heartsText}>{lives}</Text>
                  </View>
                )}
              </View>
              {mode === "exam" && (
                <TouchableOpacity
                  style={styles.markButton}
                  onPress={() =>
                    dispatch({
                      type: "TOGGLE_MARK_FOR_REVIEW",
                      payload: { questionId: currentQuestion.id },
                    })
                  }
                >
                  <Ionicons
                    name={isMarkedForReview ? "bookmark" : "bookmark-outline"}
                    size={28}
                    color={isMarkedForReview ? C.accent : "white"}
                  />
                </TouchableOpacity>
              )}
              {/* RB-5b ear training: English Quest PRACTICE in Training only (never gates, Boss or Exam) */}
              {mode === "training" && questContext?.activity === "practice" ? (
                <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 6 }}>
                  <ListenButtons
                    questionId={currentQuestion.id}
                    questionText={currentQuestion.question?.content}
                    options={currentQuestion.options}
                    color="white"
                  />
                </View>
              ) : null}
              <QuestionCard question={currentQuestion} />
              
              {/* Spacer to push options to the bottom (Thumb Zone) */}
              <View style={{ flex: 1 }} />

              <View style={{ marginTop: 10, paddingBottom: 10 }}>
                {currentQuestion.options.map((option, index) => (
                  <Option
                    key={index}
                    option={option}
                    onPress={() => {
                      if (mode === "training") {
                        dispatch({
                          type: "SELECT_ANSWER",
                          payload: { selectedOption: option },
                        });
                      } else {
                        logAnswer(currentQuestion, option);
                        dispatch({
                          type: "ANSWER_AND_ADVANCE",
                          payload: {
                            questionId: currentQuestion.id,
                            selectedOption: option,
                          },
                        });
                      }
                    }}
                    isSelected={state.selectedAnswer?.content === option.content}
                    showFeedback={state.showFeedback}
                    isCorrect={option.isCorrect}
                  />
                ))}
              </View>
            </ScrollView>
            {mode === "training" && (
              <View style={[styles.footer, state.showFeedback && (state.wasCorrect ? styles.footerCorrect : styles.footerIncorrect)]}>
                {state.showFeedback && (
                  <Text style={styles.feedbackText}>
                    {state.wasCorrect ? "Excellent!" : "Not quite!"}
                  </Text>
                )}
                <PaperButton
                  mode="contained"
                  disabled={!state.selectedAnswer}
                  buttonColor={state.showFeedback ? (state.wasCorrect ? 'white' : 'white') : C.primary}
                  textColor={state.showFeedback ? (state.wasCorrect ? '#58CC02' : '#FF4B4B') : 'white'}
                  onPress={
                    state.showFeedback
                      ? handleContinueToExplanation
                      : handleCheckAnswer
                  }
                >
                  {state.showFeedback ? "Continue" : "Check"}
                </PaperButton>
              </View>
            )}
          </View>
        );
      }
      case "reviewing": {
        return (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.progressText}>Review Your Answers</Text>
            {questions.map((q, index) => {
              const isMarked = state.markedForReview.includes(q.id);
              const userAnswer = state.userAnswers[q.id];
              return (
                <TouchableOpacity
                  key={q.id}
                  style={[
                    styles.reviewItem,
                    isMarked && styles.reviewItemMarked,
                  ]}
                  onPress={() =>
                    dispatch({ type: "GO_TO_QUESTION", payload: { index } })
                  }
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    {isMarked && (
                      <Ionicons
                        name="bookmark"
                        size={18}
                        color={C.accent}
                        style={{ marginRight: 8 }}
                      />
                    )}
                    <Text style={styles.reviewQuestionText}>{`Question ${
                      index + 1
                    }: ${q.question.content}`}</Text>
                  </View>
                  {q.options.map((opt, optIndex) => (
                    <View
                      key={optIndex}
                      style={[
                        styles.reviewOptionContainer,
                        opt.content === userAnswer &&
                          styles.reviewOptionContainerSelected,
                      ]}
                    >
                      <Text
                        style={
                          opt.content === userAnswer
                            ? styles.reviewOptionTextSelected
                            : styles.reviewOptionText
                        }
                      >
                        {opt.content}
                      </Text>
                    </View>
                  ))}
                </TouchableOpacity>
              );
            })}
            <PaperButton
              mode="contained"
              style={{ marginTop: 20 }}
              onPress={() => dispatch({ type: "SUBMIT_EXAM", payload: { isFirstAttempt } })}
            >
              Submit Exam
            </PaperButton>
          </ScrollView>
        );
      }
      default:
        return (
          <View style={styles.centered}>
            <ActivityIndicator animating={true} size="large" color="#FFFFFF" />
          </View>
        );
    }
  };

  return (
    <LinearGradient
      colors={[C.gradientStart, C.gradientEnd]}
      style={{ flex: 1 }}
    >
      {renderContent()}
    </LinearGradient>
  );
};

export default QuizScreenV2;

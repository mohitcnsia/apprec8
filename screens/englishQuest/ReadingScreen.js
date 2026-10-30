// screens/englishQuest/ReadingScreen.js
// Reading activity: a passage with comprehension questions.
//   - stepByStep: read a paragraph → answer its question → next paragraph appears.
//   - fullPassage: read the whole passage → "Start questions" → questions under the passage.
// Extras: "Show me where" highlights the sentence that proves the answer,
// tricky words can be tapped for their meaning, and each paragraph can be read aloud.
// The content is a studyContent document with kind: "reading" (see utils/readingFlow.js).

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Speech from "expo-speech";

import { listenToStudyContent } from "../../services/firestoreContentApi";
import { saveQuestAttempt } from "../../services/englishQuestApi";
import { buildReadingFlow, nextCursor, splitParagraph, countWords } from "../../utils/readingFlow";
import { scoreAnswers, starsForPercent, DEFAULT_LEAF_PASS_PERCENT } from "../../utils/questTree";
import { useTheme } from "../../context/ThemeContext";
import ReportQuestionButton from "../../components/quiz/ReportQuestionButton";

// Semantic colours (same in light and dark). Everything else comes from the app theme.
const COLORS = {
  highlight: "#FFE58A",
  correct: "#58CC02",
  wrong: "#FF4B4B",
};

const Paragraph = ({ text, highlightText, glossary, onWordPress, speaking, onSpeak }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const segments = useMemo(() => splitParagraph(text, highlightText, glossary), [text, highlightText, glossary]);
  return (
    <View style={styles.paperCard}>
      <TouchableOpacity style={styles.speakButton} onPress={onSpeak} hitSlop={10}>
        <Ionicons name={speaking ? "stop-circle" : "volume-high"} size={22} color={theme.primary} />
      </TouchableOpacity>
      <Text style={styles.paragraphText}>
        {segments.map((s, i) => (
          <Text
            key={i}
            style={[s.highlight && styles.highlight, s.glossaryWord && styles.glossaryWord]}
            onPress={s.glossaryWord ? () => onWordPress(s.glossaryWord) : undefined}
          >
            {s.text}
          </Text>
        ))}
      </Text>
    </View>
  );
};

const QuestionBlock = ({ number, question, answer, onAnswer, onShowMe, report }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const answered = !!answer;
  return (
    <View style={styles.questionCard}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={styles.questionNumber}>Question {number}</Text>
        {report ? <ReportQuestionButton {...report} chosen={answer?.chosen ?? null} options={question.options} questionText={question.question?.content} /> : null}
      </View>
      <Text style={styles.questionText}>{question.question?.content}</Text>
      {question.options.map((opt) => {
        const isChosen = answered && answer.chosen === opt.content;
        let style = styles.option;
        if (answered && opt.isCorrect) style = [styles.option, styles.optionCorrect];
        else if (isChosen) style = [styles.option, styles.optionWrong];
        return (
          <TouchableOpacity
            key={opt.content}
            style={style}
            disabled={answered}
            onPress={() => onAnswer(opt)}
            activeOpacity={0.8}
          >
            <Text style={[styles.optionText, answered && (opt.isCorrect || isChosen) && { color: "#FFFFFF" }]}>
              {opt.content}
            </Text>
          </TouchableOpacity>
        );
      })}
      {answered ? (
        <View style={styles.feedback}>
          <Text style={[styles.feedbackTitle, { color: answer.isCorrect ? COLORS.correct : COLORS.wrong }]}>
            {answer.isCorrect ? "Correct! 🎉" : "Not quite."}
          </Text>
          {question.explanation?.text ? <Text style={styles.feedbackText}>{question.explanation.text}</Text> : null}
          {question.evidence?.text ? (
            <TouchableOpacity style={styles.showMeButton} onPress={onShowMe}>
              <Ionicons name="search" size={16} color={theme.primary} />
              <Text style={styles.showMeText}>Show me where</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

export default function ReadingScreen({ route, navigation }) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { contentId, questContext } = route.params || {};
  const insets = useSafeAreaInsets();

  const [doc, setDoc] = useState(null);
  const [error, setError] = useState(null);
  const [cursor, setCursor] = useState(0);
  const [answers, setAnswers] = useState({}); // questionIndex -> { chosen, isCorrect, timeMs, mistakeTag }
  const [highlight, setHighlight] = useState(null); // { paragraph, text }
  const [glossaryWord, setGlossaryWord] = useState(null);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [result, setResult] = useState(null); // { percent, passed, correctCount, total }
  const [saving, setSaving] = useState(false);

  const scrollRef = useRef(null);
  const paragraphY = useRef({});
  const startedAtRef = useRef(Date.now());
  const questionShownAtRef = useRef(Date.now());
  // After revealing new content: scroll to the new paragraph's top, or to the end.
  const scrollTarget = useRef(null); // { paragraph: number } | "end" | null

  useEffect(() => {
    const unsub = listenToStudyContent(
      contentId,
      (data) => {
        if (!data || data.kind !== "reading") setError("This reading is not available yet.");
        else setDoc(data);
      },
      () => setError("Could not load the reading. Please check your internet and try again.")
    );
    return () => {
      unsub();
      Speech.stop();
    };
  }, [contentId]);

  const flow = useMemo(() => (doc ? buildReadingFlow(doc) : null), [doc]);
  const questions = doc?.questions || [];
  const paragraphs = doc?.paragraphs || [];

  // Start position once the document has loaded.
  useEffect(() => {
    if (flow) setCursor(flow.startCursor);
  }, [flow]);

  const currentItem = flow?.items[cursor];

  useEffect(() => {
    if (currentItem?.kind === "q") questionShownAtRef.current = Date.now();
  }, [cursor, currentItem?.kind]);

  const advance = () => {
    setHighlight(null);
    const firstNew = flow.items[cursor + 1];
    scrollTarget.current = firstNew?.kind === "p" ? { paragraph: firstNew.index } : "end";
    setCursor((c) => nextCursor(flow.items, c));
  };

  const onAnswer = (questionIndex, option) => {
    const q = questions[questionIndex];
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: {
        chosen: option.content,
        isCorrect: !!option.isCorrect,
        timeMs: Date.now() - questionShownAtRef.current,
        mistakeTag: option.isCorrect ? null : option.mistakeTag || null,
        correctAnswer: q.options.find((o) => o.isCorrect)?.content || null,
      },
    }));
  };

  const showMeWhere = (question) => {
    const ev = question.evidence;
    if (!ev) return;
    setHighlight({ paragraph: ev.paragraph, text: ev.text });
    const y = paragraphY.current[ev.paragraph];
    if (typeof y === "number") scrollRef.current?.scrollTo({ y: Math.max(0, y - 16), animated: true });
  };

  const toggleSpeak = (index) => {
    Speech.stop();
    if (speakingIndex === index) {
      setSpeakingIndex(null);
      return;
    }
    setSpeakingIndex(index);
    Speech.speak(paragraphs[index], {
      language: "en-IN",
      rate: 0.9,
      onDone: () => setSpeakingIndex(null),
      onStopped: () => setSpeakingIndex(null),
      onError: () => setSpeakingIndex(null),
    });
  };

  const finish = async () => {
    Speech.stop();
    const answerLog = questions.map((q, i) => ({
      questionId: `${contentId}-q${i + 1}`,
      questionText: q.question?.content || "",
      chosen: answers[i]?.chosen ?? null,
      correctAnswer: answers[i]?.correctAnswer ?? q.options.find((o) => o.isCorrect)?.content ?? null,
      isCorrect: !!answers[i]?.isCorrect,
      timeMs: answers[i]?.timeMs ?? null,
      mistakeTag: answers[i]?.mistakeTag ?? null,
    }));
    const passPercent = questContext?.passPercent ?? DEFAULT_LEAF_PASS_PERCENT;
    const local = scoreAnswers(answerLog, questions.length);
    const localResult = { ...local, passed: local.percent >= passPercent };

    if (questContext) {
      setSaving(true);
      await saveQuestAttempt({
        questId: questContext.questId,
        nodeId: questContext.nodeId,
        quizId: contentId,
        mode: "reading",
        answers: answerLog,
        totalQuestions: questions.length,
        passPercent,
        startedAt: startedAtRef.current,
        outcome: "finished",
        details: { readingMode: doc.mode || "fullPassage", wordCount: countWords(paragraphs) },
      });
      setSaving(false);
    }
    setResult(localResult);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const restart = () => {
    Speech.stop();
    setAnswers({});
    setHighlight(null);
    setResult(null);
    startedAtRef.current = Date.now();
    setCursor(flow.startCursor);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const backToQuest = () =>
    questContext
      ? navigation.navigate(questContext.returnTo || "EnglishQuestMap", { questId: questContext.questId })
      : navigation.goBack();

  // ---- Footer button (thumb zone) ----
  const renderFooter = () => {
    if (!flow || result) return null;
    const isLast = cursor >= flow.items.length - 1;
    let label = null;
    let onPress = null;
    if (currentItem?.kind === "gate") {
      label = "I've finished reading: start questions";
      onPress = advance;
    } else if (currentItem?.kind === "q") {
      if (!answers[currentItem.index]) return null; // pick an option first
      label = isLast ? "Finish" : "Next";
      onPress = isLast ? finish : advance;
    } else if (currentItem?.kind === "p") {
      label = isLast ? "Finish" : "Continue reading";
      onPress = isLast ? finish : advance;
    }
    if (!label) return null;
    return (
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity style={styles.footerButton} onPress={onPress} disabled={saving} activeOpacity={0.85}>
          {saving ? <ActivityIndicator color={theme.textOnPrimary} /> : <Text style={styles.footerText}>{label}</Text>}
        </TouchableOpacity>
      </View>
    );
  };

  const renderResult = () => {
    if (!result) return null;
    const stars = starsForPercent(result.percent, questContext?.passPercent ?? DEFAULT_LEAF_PASS_PERCENT);
    return (
      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>{result.passed ? "Great reading! 📚" : "Good try!"}</Text>
        <Text style={styles.resultScore}>
          {result.correctCount} of {result.total} correct ({result.percent}%)
        </Text>
        <View style={{ flexDirection: "row", marginVertical: 8 }}>
          {[1, 2, 3].map((i) => (
            <Ionicons key={i} name={i <= stars ? "star" : "star-outline"} size={30} color={theme.gold} />
          ))}
        </View>
        {!result.passed ? (
          <Text style={styles.resultHint}>Read the passage again and use "Show me where" to find the answers.</Text>
        ) : null}
        <TouchableOpacity style={styles.footerButton} onPress={backToQuest}>
          <Text style={styles.footerText}>{questContext ? "Back to Quest" : "Done"}</Text>
        </TouchableOpacity>
        {!result.passed ? (
          <TouchableOpacity style={[styles.footerButton, styles.secondaryButton]} onPress={restart}>
            <Text style={[styles.footerText, { color: theme.textPrimaryOnGradient }]}>Try again</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  const body = () => {
    if (error) return <Text style={styles.message}>{error}</Text>;
    if (!doc || !flow) return <ActivityIndicator size="large" color={theme.textPrimaryOnGradient} style={{ marginTop: 60 }} />;
    const gateIndex = flow.items.findIndex((it) => it.kind === "gate");
    let questionNumber = 0;
    return (
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scroll}
        onContentSizeChange={() => {
          const target = scrollTarget.current;
          if (!target) return;
          scrollTarget.current = null;
          const y = target !== "end" ? paragraphY.current[target.paragraph] : undefined;
          if (typeof y === "number") scrollRef.current?.scrollTo({ y: Math.max(0, y - 8), animated: true });
          else scrollRef.current?.scrollToEnd({ animated: true });
        }}
      >
        <Text style={styles.title}>{doc.name}</Text>
        <Text style={styles.subtitle}>
          {countWords(paragraphs)} words · {questions.length} questions
          {Object.keys(doc.glossary || {}).length ? " · Tap underlined words for their meaning" : ""}
        </Text>

        {flow.items.slice(0, cursor + 1).map((item, i) => {
          if (item.kind === "p") {
            return (
              <View key={`p${item.index}`} onLayout={(e) => (paragraphY.current[item.index] = e.nativeEvent.layout.y)}>
                <Paragraph
                  text={paragraphs[item.index]}
                  highlightText={highlight?.paragraph === item.index ? highlight.text : null}
                  glossary={doc.glossary}
                  onWordPress={setGlossaryWord}
                  speaking={speakingIndex === item.index}
                  onSpeak={() => toggleSpeak(item.index)}
                />
              </View>
            );
          }
          if (item.kind === "gate") {
            return cursor > gateIndex ? (
              <Text key="gate" style={styles.sectionLabel}>Questions</Text>
            ) : null;
          }
          questionNumber += 1;
          const q = questions[item.index];
          return (
            <QuestionBlock
              key={`q${item.index}`}
              number={questionNumber}
              question={q}
              answer={answers[item.index]}
              onAnswer={(opt) => onAnswer(item.index, opt)}
              onShowMe={() => showMeWhere(q)}
              report={{
                questionId: `${contentId}-q${item.index + 1}`,
                quizId: contentId,
                mode: "reading",
                questContext,
                knownStatus: questContext?.knownIssues?.[`${contentId}-q${item.index + 1}`]?.status,
              }}
            />
          );
        })}
        {renderResult()}
      </ScrollView>
    );
  };

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => {
            Speech.stop();
            navigation.goBack();
          }}
          hitSlop={12}
        >
          <Ionicons name="arrow-back" size={26} color={theme.textPrimaryOnGradient} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reading</Text>
      </View>

      {body()}
      {renderFooter()}

      <Modal visible={!!glossaryWord} transparent animationType="fade" onRequestClose={() => setGlossaryWord(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setGlossaryWord(null)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalWord}>{glossaryWord}</Text>
            <Text style={styles.modalMeaning}>{glossaryWord ? doc?.glossary?.[glossaryWord] : ""}</Text>
            <Text style={styles.modalHint}>Tap anywhere to close</Text>
          </View>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingBottom: 8 },
  headerTitle: { fontSize: 20, fontFamily: "nunitoBold", color: theme.textPrimaryOnGradient },
  scroll: { paddingHorizontal: 16, paddingBottom: 140 },
  title: { fontSize: 26, fontFamily: "nunitoBold", color: theme.textPrimaryOnGradient, marginTop: 4 },
  subtitle: { fontSize: 13, fontFamily: "nunito", color: theme.textSecondaryOnGradient, marginBottom: 12 },
  message: { fontSize: 16, fontFamily: "nunito", color: theme.textPrimaryOnGradient, textAlign: "center", marginTop: 60, paddingHorizontal: 24 },

  paperCard: { backgroundColor: theme.cardBackground, borderRadius: 16, padding: 16, paddingTop: 14, marginBottom: 12 },
  speakButton: { alignSelf: "flex-end", marginBottom: 2 },
  paragraphText: { fontSize: 18, lineHeight: 29, fontFamily: "nunito", color: theme.textPrimary },
  highlight: { backgroundColor: COLORS.highlight, color: "#000000" },
  glossaryWord: { color: theme.primary, fontFamily: "nunitoBold", textDecorationLine: "underline", textDecorationStyle: "dotted" },

  sectionLabel: { fontSize: 14, fontFamily: "nunitoBold", color: theme.gold, textTransform: "uppercase", marginVertical: 8 },
  questionCard: { backgroundColor: theme.cardBackground, borderRadius: 16, padding: 14, marginBottom: 12 },
  questionNumber: { fontSize: 12, fontFamily: "nunitoBold", color: theme.gold, textTransform: "uppercase" },
  questionText: { fontSize: 17, fontFamily: "nunitoBold", color: theme.textPrimaryOnGradient, marginVertical: 8, lineHeight: 24 },
  option: { backgroundColor: "#FFFFFF", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, marginTop: 8 },
  optionCorrect: { backgroundColor: COLORS.correct },
  optionWrong: { backgroundColor: COLORS.wrong },
  optionText: { fontSize: 16, fontFamily: "nunito", color: theme.textPrimary },
  feedback: { marginTop: 12, gap: 6 },
  feedbackTitle: { fontSize: 17, fontFamily: "nunitoBold" },
  feedbackText: { fontSize: 15, fontFamily: "nunito", color: theme.textSecondaryOnGradient, lineHeight: 21 },
  showMeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: COLORS.highlight,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  showMeText: { fontSize: 14, fontFamily: "nunitoBold", color: theme.primary },

  footer: { position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: 16, paddingTop: 10, backgroundColor: theme.background + "EE" },
  footerButton: { backgroundColor: theme.primary, borderRadius: 28, paddingVertical: 14, alignItems: "center", marginTop: 8, alignSelf: "stretch" },
  secondaryButton: { backgroundColor: "transparent", borderWidth: 2, borderColor: theme.primary },
  footerText: { fontSize: 18, fontFamily: "nunitoBold", color: theme.textOnPrimary },

  resultCard: { backgroundColor: theme.cardBackground, borderRadius: 16, padding: 18, alignItems: "center", marginTop: 8 },
  resultTitle: { fontSize: 24, fontFamily: "nunitoBold", color: theme.textPrimaryOnGradient },
  resultScore: { fontSize: 16, fontFamily: "nunito", color: theme.textSecondaryOnGradient, marginTop: 4 },
  resultHint: { fontSize: 14, fontFamily: "nunito", color: theme.textSecondaryOnGradient, textAlign: "center", marginBottom: 4 },

  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 32 },
  modalCard: { backgroundColor: theme.cardBackground, borderRadius: 18, padding: 20, alignItems: "center", gap: 8 },
  modalWord: { fontSize: 24, fontFamily: "nunitoBold", color: theme.primary, textTransform: "capitalize" },
  modalMeaning: { fontSize: 17, fontFamily: "nunito", color: theme.textPrimary, textAlign: "center", lineHeight: 24 },
  modalHint: { fontSize: 12, fontFamily: "nunito", color: "#888" },
});

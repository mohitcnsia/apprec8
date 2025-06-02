import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Button as PaperButton } from "react-native-paper"; // Assuming you use react-native-paper
import firestore from "@react-native-firebase/firestore"; // For fetching quiz data

import { useTheme } from "../../context/ThemeContext"; // Your theme context
import InteractivePassage from "../../components/wordInspector/InteractivePassage"; // Adjust path

// --- Helper: Passage Parser ---
// This parser splits text into words, common punctuation, and spaces.
// It assigns unique IDs and normalizes words for logic.
const parsePassageToUnits = (passageText, caseSensitive = false) => {
  const units = [];
  let unitIndex = 0;
  // Regex: captures sequences of word characters, or sequences of common punctuation, or sequences of spaces
  const regex = /(\w+)|([.,!?;:"“”‘’'-]+)|(\s+)/g;
  let match;

  while ((match = regex.exec(passageText)) !== null) {
    const fullMatch = match[0];
    let type = "unknown";
    let normalizedText = null;

    if (match[1]) {
      // Word
      type = "word";
      normalizedText = caseSensitive ? match[1] : match[1].toLowerCase();
    } else if (match[2]) {
      // Punctuation
      type = "punctuation";
    } else if (match[3]) {
      // Space
      type = "space";
    }

    units.push({
      id: `unit_${unitIndex++}`,
      originalText: fullMatch,
      normalizedText: normalizedText, // Will be null for non-words
      isWord: type === "word",
    });
  }
  return units;
};
// --- End Helper ---

const WordInspectorScreen = ({ route, navigation }) => {
  // const { quizId } = route.params; // Assuming quizId is passed via navigation
  const quizId = "your_word_inspector_quiz_id"; // <<<< REPLACE WITH ACTUAL QUIZ ID or get from route.params

  const { theme } = useTheme();
  const styles = useStyles(theme);

  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [parsedPassageUnits, setParsedPassageUnits] = useState([]);
  const [selectedInstanceIds, setSelectedInstanceIds] = useState(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedbackMap, setFeedbackMap] = useState(new Map());
  const [score, setScore] = useState(null); // e.g., { correct: 0, incorrect: 0, missed: 0, totalTargets: 0, percentage: 0 }

  // Fetch Quiz Data
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const fetchQuiz = async () => {
      try {
        // Replace 'wordInspectorQuizzes' with your actual collection name
        const docRef = firestore()
          .collection("wordInspectorQuizzes")
          .doc(quizId);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
          const data = docSnap.data();
          setQuizData(data);
          const units = parsePassageToUnits(
            data.passage,
            data.caseSensitive || false
          );
          setParsedPassageUnits(units);
        } else {
          setError("Quiz not found.");
          console.warn(
            "WordInspectorScreen: Quiz document not found for ID:",
            quizId
          );
        }
      } catch (e) {
        console.error("WordInspectorScreen: Error fetching quiz data:", e);
        setError("Failed to load quiz. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
    // Reset state on new quizId (if component is reused for different quizzes)
    return () => {
      setSelectedInstanceIds(new Set());
      setIsSubmitted(false);
      setFeedbackMap(new Map());
      setScore(null);
    };
  }, [quizId]);

  const handleWordTap = useCallback(
    (instanceId) => {
      if (isSubmitted) return;
      setSelectedInstanceIds((prevSelectedIds) => {
        const newSelectedIds = new Set(prevSelectedIds);
        if (newSelectedIds.has(instanceId)) {
          newSelectedIds.delete(instanceId);
        } else {
          newSelectedIds.add(instanceId);
        }
        return newSelectedIds;
      });
    },
    [isSubmitted]
  );

  const handleSubmit = useCallback(() => {
    if (!quizData || parsedPassageUnits.length === 0) return;
    setIsSubmitted(true);

    const newFeedbackMap = new Map();
    let correctSelections = 0;
    let incorrectSelections = 0;
    let missedSelections = 0;

    const { matchBehavior, caseSensitive } = quizData;
    const targetWordType = quizData.targetWordType; // e.g. "noun" - for context, actual targets are in matchBehavior.targetWords

    if (matchBehavior.mode === "type") {
      const uniqueTargetWords = new Set(
        (matchBehavior.targetWords.uniqueTargets || []).map((w) =>
          caseSensitive ? w : w.toLowerCase()
        )
      );
      const userSelectedNormalizedWords = new Set();
      parsedPassageUnits.forEach((unit) => {
        if (unit.isWord && selectedInstanceIds.has(unit.id)) {
          userSelectedNormalizedWords.add(unit.normalizedText);
        }
      });

      // Calculate TP, FP, FN based on unique word types
      uniqueTargetWords.forEach((targetWord) => {
        if (userSelectedNormalizedWords.has(targetWord)) {
          correctSelections++; // This target type was correctly identified
        } else {
          missedSelections++; // This target type was missed
        }
      });
      userSelectedNormalizedWords.forEach((selectedWord) => {
        if (!uniqueTargetWords.has(selectedWord)) {
          incorrectSelections++; // This selected word type is not a target
        }
      });

      // Generate feedback map for UI highlighting
      parsedPassageUnits.forEach((unit) => {
        if (unit.isWord) {
          const isSelected = selectedInstanceIds.has(unit.id);
          const isTargetType = uniqueTargetWords.has(unit.normalizedText);
          if (isSelected && isTargetType)
            newFeedbackMap.set(unit.id, "correct");
          else if (isSelected && !isTargetType)
            newFeedbackMap.set(unit.id, "incorrect");
          else if (!isSelected && isTargetType)
            newFeedbackMap.set(unit.id, "missed");
          else newFeedbackMap.set(unit.id, "neutral"); // Correctly ignored
        }
      });
      setScore({
        correct: correctSelections,
        incorrect: incorrectSelections,
        missed: missedSelections,
        totalTargets: uniqueTargetWords.size,
        percentage:
          uniqueTargetWords.size > 0
            ? Math.round((correctSelections / uniqueTargetWords.size) * 100)
            : 0,
      });
    } else if (matchBehavior.mode === "instance") {
      const instanceTargetFrequencies = {};
      Object.entries(matchBehavior.targetWords.instanceTargets || {}).forEach(
        ([word, freq]) => {
          instanceTargetFrequencies[caseSensitive ? word : word.toLowerCase()] =
            freq;
        }
      );

      let totalRequiredInstances = 0;
      Object.values(instanceTargetFrequencies).forEach(
        (freq) => (totalRequiredInstances += freq)
      );

      const actualSelectedTargetInstances = new Map(); // Tracks normalizedWord -> count of correctly selected instances

      parsedPassageUnits.forEach((unit) => {
        if (unit.isWord) {
          const isSelected = selectedInstanceIds.has(unit.id);
          const normalizedWord = unit.normalizedText;
          const isTargetWordType =
            instanceTargetFrequencies.hasOwnProperty(normalizedWord);

          if (isSelected) {
            if (isTargetWordType) {
              newFeedbackMap.set(unit.id, "correct");
              actualSelectedTargetInstances.set(
                normalizedWord,
                (actualSelectedTargetInstances.get(normalizedWord) || 0) + 1
              );
            } else {
              newFeedbackMap.set(unit.id, "incorrect");
              incorrectSelections++;
            }
          } else {
            // Not selected by user
            if (isTargetWordType) {
              newFeedbackMap.set(unit.id, "missed");
              // Missed selections count will be totalRequiredInstances - correctSelections below
            } else {
              newFeedbackMap.set(unit.id, "neutral");
            }
          }
        }
      });

      // Calculate correctly selected instances, respecting frequencies
      correctSelections = 0;
      actualSelectedTargetInstances.forEach((countSelected, word) => {
        correctSelections += Math.min(
          countSelected,
          instanceTargetFrequencies[word] || 0
        );
      });

      missedSelections = totalRequiredInstances - correctSelections;

      setScore({
        correct: correctSelections,
        incorrect: incorrectSelections, // User selected non-target words
        missed: missedSelections, // Target instances not selected
        totalTargets: totalRequiredInstances,
        percentage:
          totalRequiredInstances > 0
            ? Math.round((correctSelections / totalRequiredInstances) * 100)
            : 0,
      });
    }
    setFeedbackMap(newFeedbackMap);

    // Here you would typically record the score/attempt to Firestore
    // using a Firebase Function call, similar to your QuizResultScreen
    // Alert.alert("Quiz Submitted!", `Your score: ${score?.percentage}%`);
  }, [quizData, parsedPassageUnits, selectedInstanceIds, caseSensitive]);

  const handleTryAgain = () => {
    setSelectedInstanceIds(new Set());
    setIsSubmitted(false);
    setFeedbackMap(new Map());
    setScore(null);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.accent || "#007AFF"} />
        <Text style={styles.loadingText}>Loading Quiz...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <PaperButton onPress={() => navigation.goBack()}>Go Back</PaperButton>
      </View>
    );
  }

  if (!quizData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Quiz data could not be loaded.</Text>
        <PaperButton onPress={() => navigation.goBack()}>Go Back</PaperButton>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>{quizData.title}</Text>
      <Text style={styles.instruction}>{quizData.instruction}</Text>

      <InteractivePassage
        passageUnits={parsedPassageUnits}
        selectedInstanceIds={selectedInstanceIds}
        feedbackMap={feedbackMap}
        isSubmitted={isSubmitted}
        onWordTap={handleWordTap}
        theme={theme}
      />

      {isSubmitted && score && (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Your Score: {score.percentage}%</Text>
          <Text style={styles.scoreDetailText}>
            Correct: {score.correct} / {score.totalTargets}
          </Text>
          {score.incorrect > 0 && (
            <Text style={styles.scoreDetailText}>
              Incorrect Taps: {score.incorrect}
            </Text>
          )}
          {/* {score.missed > 0 && <Text style={styles.scoreDetailText}>Missed: {score.missed}</Text>} */}
        </View>
      )}

      <View style={styles.buttonContainer}>
        {!isSubmitted ? (
          <PaperButton
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
          >
            Submit Answers
          </PaperButton>
        ) : (
          <PaperButton
            mode="outlined"
            onPress={handleTryAgain}
            style={styles.button}
          >
            Try Again
          </PaperButton>
          // Optionally add a "Next Quiz" button here
        )}
      </View>
    </ScrollView>
  );
};

const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background || "#FFFFFF",
    },
    contentContainer: {
      padding: 20,
      alignItems: "center", // Center content like title/instruction
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: theme.background || "#FFFFFF",
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: theme.textSecondary || "#666666",
    },
    errorText: {
      fontSize: 16,
      color: theme.error || "#D32F2F",
      textAlign: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 22,
      fontFamily: "nunitoBold", // From your project fonts
      color: theme.textPrimary || "#000000",
      marginBottom: 10,
      textAlign: "center",
    },
    instruction: {
      fontSize: 16,
      fontFamily: "delius", // From your project fonts
      color: theme.textSecondary || "#333333",
      marginBottom: 20,
      textAlign: "center",
      lineHeight: 24,
    },
    scoreContainer: {
      marginTop: 20,
      padding: 15,
      backgroundColor: theme.cardBackground || "#F5F5F5",
      borderRadius: 8,
      alignItems: "center",
      width: "100%",
    },
    scoreText: {
      fontSize: 20,
      fontFamily: "nunitoBold",
      color: theme.textPrimary,
      marginBottom: 5,
    },
    scoreDetailText: {
      fontSize: 14,
      fontFamily: "nunito",
      color: theme.textSecondary,
    },
    buttonContainer: {
      marginTop: 30,
      width: "80%",
      alignSelf: "center",
    },
    button: {
      paddingVertical: 8,
    },
  });

export default WordInspectorScreen;

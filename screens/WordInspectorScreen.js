import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Button as PaperButton } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

import { useTheme } from "../context/ThemeContext";
import InteractivePassage from "../components/InteractivePassage";

// --- Helper: Passage Parser ---
const parsePassageToUnits = (passageText, caseSensitiveParam) => {
  const caseSensitive =
    typeof caseSensitiveParam === "boolean" ? caseSensitiveParam : false;

  const units = [];
  let unitIndex = 0;
  const regex = /(\w+)|([.,!?;:"“”‘’'-]+)|(\s+)/g;
  let match;

  while ((match = regex.exec(passageText)) !== null) {
    const fullMatch = match[0];
    let type = "unknown";
    let normalizedText = null;

    if (match[1]) {
      type = "word";
      normalizedText = caseSensitive ? match[1] : match[1].toLowerCase();
    } else if (match[2]) {
      type = "punctuation";
    } else if (match[3]) {
      type = "space";
    }

    units.push({
      id: `unit_${unitIndex++}`,
      originalText: fullMatch,
      normalizedText: normalizedText,
      isWord: type === "word",
    });
  }
  return units;
};
// --- End Helper ---

const WordInspectorScreen = ({ route, navigation }) => {
  const quizId = route?.params?.quizId;
  const parentTopicId = route?.params?.parentTopicId;

  const { theme, isDark } = useTheme();
  const styles = useStyles(theme, isDark); // Pass isDark to useStyles for conditional styles

  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [parsedPassageUnits, setParsedPassageUnits] = useState([]);
  const [selectedInstanceIds, setSelectedInstanceIds] = useState(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedbackMap, setFeedbackMap] = useState(new Map());
  const [score, setScore] = useState(null);

  const requiredSelectionsCount = useMemo(() => {
    if (
      !quizData ||
      !quizData.matchBehavior ||
      !quizData.matchBehavior.targetWords
    ) {
      return 0;
    }

    const { mode, targetWords } = quizData.matchBehavior;

    if (mode === "type") {
      return (targetWords || []).length;
    } else if (mode === "instance") {
      const instanceTargets =
        quizData.matchBehavior.targetWords.instanceTargets || {};
      return Object.values(instanceTargets).reduce(
        (sum, freq) => sum + freq,
        0
      );
    }
    return 0;
  }, [quizData]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const fetchQuiz = async () => {
      try {
        const docRef = firestore()
          .collection("wordInspectorQuizzes")
          .doc(quizId);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
          const data = docSnap.data();
          setQuizData(data);
          const units = parsePassageToUnits(data.passage, data.caseSensitive);
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

    return () => {
      setSelectedInstanceIds(new Set());
      setIsSubmitted(false);
      setFeedbackMap(new Map());
      setScore(null);
    };
  }, [quizId]);

  useFocusEffect(
    useCallback(() => {
      const parentNav = navigation.getParent();
      if (parentNav) {
        parentNav.setOptions({ tabBarStyle: { display: "none" } });
      } else {
        try {
          navigation.setOptions({ tabBarStyle: { display: "none" } });
        } catch (err) {
          /* ignore - not all navigators have tabBarStyle option */
        }
      }

      return () => {
        if (parentNav) {
          parentNav.setOptions({
            tabBarStyle: {
              display: "flex",
              backgroundColor: theme.tabBarBackground,
              borderTopColor: theme.border,
            },
          });
        } else {
          try {
            navigation.setOptions({
              tabBarStyle: { display: "flex" },
            });
          } catch (err) {
            /* ignore */
          }
        }
      };
    }, [navigation, theme.tabBarBackground, theme.border])
  );

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
    if (!quizData || parsedPassageUnits.length === 0) {
      console.log(
        "DEBUG: Submit called but quizData or parsedPassageUnits missing."
      );
      return;
    }
    setIsSubmitted(true);

    const newFeedbackMap = new Map();
    let currentCorrectSelections = 0;
    let currentIncorrectSelections = 0;
    let currentMissedSelections = 0;

    const { matchBehavior, caseSensitive } = quizData;

    if (matchBehavior.mode === "type") {
      const uniqueTargetWords = new Set(
        (matchBehavior.targetWords || []).map((w) =>
          caseSensitive ? w : w.toLowerCase()
        )
      );
      const userSelectedNormalizedWords = new Set();
      parsedPassageUnits.forEach((unit) => {
        if (unit.isWord && selectedInstanceIds.has(unit.id)) {
          userSelectedNormalizedWords.add(unit.normalizedText);
        }
      });

      uniqueTargetWords.forEach((targetWord) => {
        if (userSelectedNormalizedWords.has(targetWord)) {
          currentCorrectSelections++;
        } else {
          currentMissedSelections++;
        }
      });
      userSelectedNormalizedWords.forEach((selectedWord) => {
        if (!uniqueTargetWords.has(selectedWord)) {
          currentIncorrectSelections++;
        }
      });

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
          else newFeedbackMap.set(unit.id, "neutral");
        }
      });
      setScore({
        correct: currentCorrectSelections,
        incorrect: currentIncorrectSelections,
        missed: currentMissedSelections,
        totalTargets: uniqueTargetWords.size,
        percentage:
          uniqueTargetWords.size > 0
            ? Math.round(
                (currentCorrectSelections / uniqueTargetWords.size) * 100
              )
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

      const actualSelectedTargetInstances = new Map();

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
              currentIncorrectSelections++;
            }
          } else {
            if (isTargetWordType) {
              newFeedbackMap.set(unit.id, "missed");
            } else {
              newFeedbackMap.set(unit.id, "neutral");
            }
          }
        }
      });

      currentCorrectSelections = 0;
      actualSelectedTargetInstances.forEach((countSelected, word) => {
        currentCorrectSelections += Math.min(
          countSelected,
          instanceTargetFrequencies[word] || 0
        );
      });

      currentMissedSelections =
        totalRequiredInstances - currentCorrectSelections;

      setScore({
        correct: currentCorrectSelections,
        incorrect: currentIncorrectSelections,
        missed: currentMissedSelections,
        totalTargets: totalRequiredInstances,
        percentage:
          totalRequiredInstances > 0
            ? Math.round(
                (currentCorrectSelections / totalRequiredInstances) * 100
              )
            : 0,
      });
    }
    setFeedbackMap(newFeedbackMap);
  }, [
    quizData,
    parsedPassageUnits,
    selectedInstanceIds,
    requiredSelectionsCount,
  ]);

  const handleSeeResults = useCallback(() => {
    // This will now be for "Next" button
    if (!score) {
      console.warn("Attempted to see results before score was calculated.");
      return;
    }

    console.log("DEBUG: Navigating to QuizResult with score:", score);
    navigation.replace("QuizResult", {
      score: score.correct,
      totalQuestions: requiredSelectionsCount, // Use requiredSelectionsCount
      quizId: quizId,
      parentTopicId: parentTopicId,
      maxScore: requiredSelectionsCount, // Use requiredSelectionsCount
    });
  }, [score, quizId, parentTopicId, navigation, requiredSelectionsCount]); // Updated dependency array

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
        <PaperButton
          mode="contained"
          onPress={() => navigation.goBack()}
          buttonColor={theme.accent}
          textColor={theme.buttonText}
        >
          Go Back
        </PaperButton>
      </View>
    );
  }

  if (!quizData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Quiz data could not be loaded.</Text>
        <PaperButton
          mode="contained"
          onPress={() => navigation.goBack()}
          buttonColor={theme.accent}
          textColor={theme.buttonText}
        >
          Go Back
        </PaperButton>
      </View>
    );
  }

  // --- BEGIN DISABLED BUTTON STYLE MANAGEMENT (QuizScreen Style) ---
  const isSubmitButtonDisabled = selectedInstanceIds.size === 0 || isLoading;

  const submitButtonColor = isSubmitButtonDisabled
    ? theme.disabledBackground || "#cccccc" // Use theme's disabled background
    : theme.primary; // Use theme's primary color when enabled

  // Dynamically set text color for the button based on its disabled state,
  // mimicking QuizScreen behavior where text is often consistently white
  // or switches for disabled. Here, it will pick theme.textDisabled for disabled.
  const submitButtonTextColor = isSubmitButtonDisabled
    ? "#666666" // Black text for disabled in dark mode
    : "#FFFFFF"; // White text for enabled in both modes

  console.log("DEBUG WordInspectorScreen - isDark:", isDark);
  console.log(
    "DEBUG WordInspectorScreen - Submit Button Disabled:",
    isSubmitButtonDisabled
  );
  console.log(
    "DEBUG WordInspectorScreen - Submit Button Color:",
    submitButtonColor
  );
  console.log(
    "DEBUG WordInspectorScreen - Submit Button Text Color:",
    submitButtonTextColor
  );
  // --- END DISABLED BUTTON STYLE MANAGEMENT ---

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollViewContent}>
        <View style={styles.scrollContentInner}>
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
        </View>
      </ScrollView>
      <View style={styles.bottomFixedContainer}>
        {!isSubmitted && (
          <Text style={styles.selectionCounterText}>
            Selected: {selectedInstanceIds.size} / {requiredSelectionsCount}
          </Text>
        )}
        <View style={styles.buttonContainer}>
          {!isSubmitted ? (
            <PaperButton
              mode="contained"
              onPress={handleSubmit}
              disabled={isSubmitButtonDisabled}
              style={styles.button}
              buttonColor={submitButtonColor}
              textColor={submitButtonTextColor} // Use the dynamically set text color
              labelStyle={{
                fontSize: 18,
                fontFamily: "nunitoBold",
                color: submitButtonTextColor,
              }} // Explicitly set label color
            >
              Check
            </PaperButton>
          ) : (
            <View style={styles.postSubmitButtons}>
              <PaperButton
                mode="contained"
                onPress={handleSeeResults}
                style={styles.button}
                buttonColor={theme.primary}
                textColor={theme.textOnPrimary || "#FFFFFF"}
                labelStyle={{
                  fontSize: 18,
                  fontFamily: "nunitoBold",
                  color: theme.textOnPrimary || "#FFFFFF",
                }}
              >
                Next {/* Renamed from See Results */}
              </PaperButton>
              {/* Removed "Try Again" button */}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

// Pass isDark to useStyles if needed for conditional styling within styles.create
const useStyles = (theme, isDark) =>
  useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.background || "#FFFFFF",
        },
        scrollViewContent: {
          flex: 1,
        },
        scrollContentInner: {
          padding: 20,
          alignItems: "center",
          paddingBottom: 200,
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
          fontFamily: "delius",
        },
        title: {
          fontSize: 22,
          fontFamily: "nunitoBold",
          color: theme.textPrimary || "#000000",
          marginBottom: 10,
          textAlign: "center",
        },
        instruction: {
          fontSize: 16,
          fontFamily: "delius",
          color: theme.textSecondary || "#333333",
          marginBottom: 20,
          textAlign: "center",
          lineHeight: 24,
        },
        bottomFixedContainer: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.background || "#FFFFFF",
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderTopWidth: 1,
          borderTopColor: theme.borderColor || "#E0E0E0",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
        selectionCounterText: {
          fontSize: 16,
          fontFamily: "nunitoBold",
          color: theme.textPrimary,
          marginBottom: 15,
        },
        buttonContainer: {
          width: "80%",
          alignSelf: "center",
        },
        postSubmitButtons: {
          width: "100%",
          alignItems: "center",
        },
        button: {
          paddingVertical: 8,
          width: "100%",
          borderRadius: 25, // Added borderRadius to match QuizScreen
          borderWidth: 1, // Added border to match QuizScreen
          borderColor: isDark // Conditional border color for dark/light themes
            ? (theme.textOnPrimary || theme.primaryWhite || "#FFFFFF") + "80" // Semi-transparent white in dark
            : "transparent", // Transparent in light (as in QuizScreen)
        },
      }),
    [theme, isDark] // Add isDark to dependencies
  );

export default WordInspectorScreen;

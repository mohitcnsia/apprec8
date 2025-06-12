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
// No longer need authInstance here as username will be fetched by QuizResultScreen

// --- Helper: Passage Parser ---
// This parser splits text into words, common punctuation, and spaces.
// It assigns unique IDs and normalizes words for logic.
const parsePassageToUnits = (passageText, caseSensitiveParam) => {
  // Explicitly handle the default value for caseSensitive
  // This ensures 'caseSensitive' is always a boolean, defaulting to false if not provided or explicitly undefined.
  const caseSensitive =
    typeof caseSensitiveParam === "boolean" ? caseSensitiveParam : false;

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
      // Use the explicitly defined 'caseSensitive' variable
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
  // Extract quizId and parentTopicId from route params
  const quizId = route?.params?.quizId;
  const parentTopicId = route?.params?.parentTopicId; // Ensure parentTopicId is captured if needed for results screen

  // Access the current theme from the ThemeContext
  const { theme } = useTheme();
  // Generate styles using the theme
  const styles = useStyles(theme);

  // State variables for quiz data, loading, and error handling
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for parsed passage units, selected word instances, submission status, feedback, and score
  const [parsedPassageUnits, setParsedPassageUnits] = useState([]);
  const [selectedInstanceIds, setSelectedInstanceIds] = useState(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedbackMap, setFeedbackMap] = useState(new Map());
  const [score, setScore] = useState(null); // This score will be used internally for calculation before navigating

  // Calculate the required number of selections based on quizData
  const requiredSelectionsCount = useMemo(() => {
    if (
      !quizData ||
      !quizData.matchBehavior ||
      !quizData.matchBehavior.targetWords
    ) {
      return 0; // Default to 0 if data is not ready or malformed
    }

    const { mode, targetWords } = quizData.matchBehavior;

    if (mode === "type") {
      // For 'type' mode, targetWords is an array of unique words
      return (targetWords || []).length;
    } else if (mode === "instance") {
      // For 'instance' mode, targetWords.instanceTargets is an object with word frequencies
      const instanceTargets = targetWords.instanceTargets || {};
      return Object.values(instanceTargets).reduce(
        (sum, freq) => sum + freq,
        0
      );
    }
    return 0; // Fallback
  }, [quizData]); // Recalculate if quizData changes

  // Effect hook to fetch quiz data when the component mounts or quizId changes
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const fetchQuiz = async () => {
      try {
        // Reference to the Firestore document for the specific quiz
        const docRef = firestore()
          .collection("wordInspectorQuizzes")
          .doc(quizId);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
          const data = docSnap.data();
          setQuizData(data);
          // --- LOGGING FOR DEBUGGING ---
          console.log(
            "DEBUG: Fetched quizData:",
            JSON.stringify(data, null, 2)
          );
          console.log("DEBUG: Quiz data.caseSensitive:", data.caseSensitive);
          // --- END LOGGING ---
          // Parse the passage text into units, explicitly passing the caseSensitive property from data
          const units = parsePassageToUnits(
            data.passage,
            data.caseSensitive // Pass it directly; the helper now handles its default logic internally
          );
          setParsedPassageUnits(units);
          // --- LOGGING FOR DEBUGGING ---
          console.log(
            "DEBUG: Parsed Passage Units (first 5):",
            units.slice(0, 5)
          );
          console.log("DEBUG: Parsed Passage Units length:", units.length);
          // Example of logging all normalized texts for quick check:
          // console.log("DEBUG: All Normalized Texts:", units.filter(u => u.isWord).map(u => u.normalizedText));
          // --- END LOGGING ---
        } else {
          // Handle case where quiz document is not found
          setError("Quiz not found.");
          console.warn(
            "WordInspectorScreen: Quiz document not found for ID:",
            quizId
          );
        }
      } catch (e) {
        // Handle any errors during data fetching
        console.error("WordInspectorScreen: Error fetching quiz data:", e);
        setError("Failed to load quiz. Please try again.");
      } finally {
        // Set loading to false regardless of success or failure
        setIsLoading(false);
      }
    };

    fetchQuiz();

    // Cleanup function to reset state if quizId changes (e.g., if component is reused for different quizzes)
    return () => {
      setSelectedInstanceIds(new Set());
      setIsSubmitted(false);
      setFeedbackMap(new Map());
      setScore(null);
    };
  }, [quizId]); // Dependency array: re-run effect if quizId changes

  // Effect to hide and show the bottom tab bar when this screen is focused/unfocused
  useFocusEffect(
    useCallback(() => {
      const parentNav = navigation.getParent();
      if (parentNav) {
        parentNav.setOptions({ tabBarStyle: { display: "none" } });
      } else {
        // Fallback for cases where getParent() might not return a tab navigator directly
        // (e.g., if this screen is the root of a stack that's inside a tab)
        try {
          navigation.setOptions({ tabBarStyle: { display: "none" } });
        } catch (err) {
          /* ignore - not all navigators have tabBarStyle option */
        }
      }

      return () => {
        // When the screen loses focus (e.g., navigating away), show the tab bar again
        if (parentNav) {
          parentNav.setOptions({
            tabBarStyle: {
              display: "flex", // Show the tab bar
              // Apply your theme-based styles for consistency
              backgroundColor: theme.tabBarBackground,
              borderTopColor: theme.border,
            },
          });
        } else {
          try {
            navigation.setOptions({
              tabBarStyle: { display: "flex" }, // Show the tab bar
            });
          } catch (err) {
            /* ignore */
          }
        }
      };
    }, [navigation, theme.tabBarBackground, theme.border]) // Dependencies for useFocusEffect
  );

  // Callback for handling word taps in the interactive passage
  const handleWordTap = useCallback(
    (instanceId) => {
      // Prevent interactions if the quiz has already been submitted
      if (isSubmitted) return;
      setSelectedInstanceIds((prevSelectedIds) => {
        const newSelectedIds = new Set(prevSelectedIds);
        // Toggle selection status for the tapped word
        if (newSelectedIds.has(instanceId)) {
          newSelectedIds.delete(instanceId);
        } else {
          newSelectedIds.add(instanceId);
        }
        // --- LOGGING FOR DEBUGGING ---
        console.log(
          "DEBUG: Selected Instance IDs after tap:",
          Array.from(newSelectedIds)
        );
        // --- END LOGGING ---
        return newSelectedIds;
      });
    },
    [isSubmitted] // Dependency array: memoize if isSubmitted changes
  );

  // Callback for handling quiz submission
  const handleSubmit = useCallback(() => {
    // Do nothing if quiz data is missing or passage is empty
    if (!quizData || parsedPassageUnits.length === 0) {
      console.log(
        "DEBUG: Submit called but quizData or parsedPassageUnits missing."
      );
      return;
    }
    setIsSubmitted(true); // Mark the quiz as submitted

    const newFeedbackMap = new Map(); // Map to store feedback for each unit (correct, incorrect, missed, neutral)
    let currentCorrectSelections = 0; // Use a distinct name for calculation
    let currentIncorrectSelections = 0;
    let currentMissedSelections = 0;

    // Destructure matchBehavior and caseSensitive from quizData
    const { matchBehavior, caseSensitive } = quizData;
    // --- LOGGING FOR DEBUGGING ---
    console.log(
      "DEBUG: handleSubmit - quizData.matchBehavior:",
      JSON.stringify(matchBehavior, null, 2)
    );
    console.log(
      "DEBUG: handleSubmit - caseSensitive from quizData:",
      caseSensitive
    );
    console.log(
      "DEBUG: handleSubmit - selectedInstanceIds (at submit):",
      Array.from(selectedInstanceIds)
    );
    // --- END LOGGING ---

    // Logic for "type" mode matching (matching specific word types)
    if (matchBehavior.mode === "type") {
      // Create a set of unique target words, normalized based on case sensitivity
      const uniqueTargetWords = new Set(
        (matchBehavior.targetWords || []).map((w) =>
          caseSensitive ? w : w.toLowerCase()
        )
      );
      // Create a set of unique normalized words selected by the user
      const userSelectedNormalizedWords = new Set();
      parsedPassageUnits.forEach((unit) => {
        if (unit.isWord && selectedInstanceIds.has(unit.id)) {
          userSelectedNormalizedWords.add(unit.normalizedText);
        }
      });
      // --- LOGGING FOR DEBUGGING ---
      console.log(
        "DEBUG (Type Mode): uniqueTargetWords (from Firestore):",
        Array.from(uniqueTargetWords)
      );
      console.log(
        "DEBUG (Type Mode): userSelectedNormalizedWords (from user taps):",
        Array.from(userSelectedNormalizedWords)
      );
      // --- END LOGGING ---

      // Calculate true positives (correctSelections) and false negatives (missedSelections)
      uniqueTargetWords.forEach((targetWord) => {
        if (userSelectedNormalizedWords.has(targetWord)) {
          currentCorrectSelections++; // This target type was correctly identified
        } else {
          currentMissedSelections++; // This target type was missed
        }
      });
      // Calculate false positives (incorrectSelections)
      userSelectedNormalizedWords.forEach((selectedWord) => {
        if (!uniqueTargetWords.has(selectedWord)) {
          currentIncorrectSelections++; // This selected word type is not a target
        }
      });

      // Generate feedback map for UI highlighting based on selection and target status
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
          else newFeedbackMap.set(unit.id, "neutral"); // Correctly ignored (not selected, not a target)
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
      // Logic for "instance" mode matching (matching specific occurrences of words)
      const instanceTargetFrequencies = {};
      Object.entries(matchBehavior.targetWords.instanceTargets || {}).forEach(
        ([word, freq]) => {
          // Normalize target words based on case sensitivity
          instanceTargetFrequencies[caseSensitive ? word : word.toLowerCase()] =
            freq;
        }
      );
      // --- LOGGING FOR DEBUGGING ---
      console.log(
        "DEBUG (Instance Mode): instanceTargetFrequencies (from Firestore):",
        instanceTargetFrequencies
      );
      // --- END LOGGING ---

      let totalRequiredInstances = 0;
      // Calculate the total number of target instances required
      Object.values(instanceTargetFrequencies).forEach(
        (freq) => (totalRequiredInstances += freq)
      );

      const actualSelectedTargetInstances = new Map(); // Tracks normalizedWord -> count of correctly selected instances

      // Iterate through parsed units to determine feedback and counts
      parsedPassageUnits.forEach((unit) => {
        if (unit.isWord) {
          const isSelected = selectedInstanceIds.has(unit.id);
          const normalizedWord = unit.normalizedText;
          // Check if the normalized word is a target word type
          const isTargetWordType =
            instanceTargetFrequencies.hasOwnProperty(normalizedWord);

          if (isSelected) {
            if (isTargetWordType) {
              newFeedbackMap.set(unit.id, "correct");
              // Increment count for correctly selected instances of this word
              actualSelectedTargetInstances.set(
                normalizedWord,
                (actualSelectedTargetInstances.get(normalizedWord) || 0) + 1
              );
            } else {
              newFeedbackMap.set(unit.id, "incorrect");
              currentIncorrectSelections++; // User selected a non-target word
            }
          } else {
            // Not selected by user
            if (isTargetWordType) {
              newFeedbackMap.set(unit.id, "missed");
              // Missed selections count will be calculated below based on total required vs. correct
            } else {
              newFeedbackMap.set(unit.id, "neutral"); // Correctly ignored
            }
          }
        }
      });

      // Calculate correctly selected instances, respecting specified frequencies
      currentCorrectSelections = 0;
      actualSelectedTargetInstances.forEach((countSelected, word) => {
        currentCorrectSelections += Math.min(
          countSelected,
          instanceTargetFrequencies[word] || 0
        );
      });

      currentMissedSelections =
        totalRequiredInstances - currentCorrectSelections; // Calculate missed targets

      setScore({
        correct: currentCorrectSelections,
        incorrect: currentIncorrectSelections, // User selected non-target words
        missed: currentMissedSelections, // Target instances not selected
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

    // After scoring, navigate to QuizResultScreen
    const finalScore = {
      correct: currentCorrectSelections,
      incorrect: currentIncorrectSelections,
      missed: currentMissedSelections,
      totalTargets: requiredSelectionsCount,
      percentage:
        requiredSelectionsCount > 0
          ? Math.round(
              (currentCorrectSelections / requiredSelectionsCount) * 100
            )
          : 0,
    };
    console.log("DEBUG: Navigating to QuizResult with score:", finalScore);
    navigation.replace("QuizResult", {
      score: finalScore.correct, // QuizResultScreen expects 'score' as the number of correct answers
      totalQuestions: finalScore.totalTargets, // totalQuestions expected as target count
      quizId: quizId,
      parentTopicId: parentTopicId, // Pass parentTopicId
      // passingScore: (you might want to define a passing score for word inspector quizzes)
      maxScore: finalScore.totalTargets,
    });
  }, [
    quizId,
    parentTopicId,
    quizData,
    parsedPassageUnits,
    selectedInstanceIds,
    requiredSelectionsCount,
    navigation,
  ]);

  // Callback to reset the quiz for another attempt (now navigates back to self)
  const handleTryAgain = () => {
    // Navigate back to this screen to reset its state
    navigation.replace("WordInspector", {
      quizId: quizId,
      parentTopicId: parentTopicId,
    });
  };

  // Render loading indicator while data is being fetched
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.accent || "#007AFF"} />
        <Text style={styles.loadingText}>Loading Quiz...</Text>
      </View>
    );
  }

  // Render error message if there's a problem loading the quiz
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <PaperButton onPress={() => navigation.goBack()}>Go Back</PaperButton>
      </View>
    );
  }

  // Render a message if quiz data is unexpectedly null after loading
  if (!quizData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Quiz data could not be loaded.</Text>
        <PaperButton onPress={() => navigation.goBack()}>Go Back</PaperButton>
      </View>
    );
  }

  // Main component rendering with fixed bottom elements
  return (
    <View style={styles.container}>
      {/* Main container with flex: 1 */}
      <ScrollView style={styles.scrollViewContent}>
        {/* Scrollable content area */}
        <View style={styles.scrollContentInner}>
          {/* Inner padding for scrollable content */}
          <Text style={styles.title}>{quizData.title}</Text>
          <Text style={styles.instruction}>{quizData.instruction}</Text>
          {/* Interactive passage component for word selection */}
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
      {/* Fixed bottom container for score and buttons */}
      <View style={styles.bottomFixedContainer}>
        {/* The score display is removed from here as results will be shown on QuizResultScreen */}
        <View style={styles.buttonContainer}>
          {!isSubmitted ? ( // Only show submit button if not submitted
            <PaperButton
              mode="contained"
              onPress={handleSubmit}
              // Disable submit button if selected count doesn't match required count, or if already submitted/loading
              disabled={
                selectedInstanceIds.size !== requiredSelectionsCount ||
                isLoading
              }
              style={styles.button}
            >
              Submit Answers
            </PaperButton>
          ) : (
            // After submission, show 'Try Again' button to reset the quiz
            <PaperButton
              mode="outlined"
              onPress={handleTryAgain}
              style={styles.button}
            >
              Try Again
            </PaperButton>
          )}
        </View>
      </View>
    </View>
  );
};

// StyleSheet for component styling, dynamically created using the theme
const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1, // Main container takes full screen height
      backgroundColor: theme.background || "#FFFFFF",
    },
    scrollViewContent: {
      flex: 1, // ScrollView takes all available space above the fixed bottom
      // No padding here, padding will be inside scrollContentInner
    },
    scrollContentInner: {
      padding: 20, // Apply padding here for the scrollable content
      alignItems: "center", // Center content like title/instruction
      paddingBottom: 150, // Add enough padding to prevent content from being hidden by the fixed footer
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
    // New style for the fixed bottom container
    bottomFixedContainer: {
      position: "absolute", // Position absolutely
      bottom: 0, // Stick to the bottom
      left: 0,
      right: 0,
      backgroundColor: theme.background || "#FFFFFF", // Match screen background
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderTopWidth: 1,
      borderTopColor: theme.borderColor || "#E0E0E0", // Optional border
      alignItems: "center", // Center content horizontally
      // Shadow for better visual separation (optional)
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -3, // Shadow upwards
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 5, // For Android shadow
    },
    scoreContainer: {
      // This container is now commented out/removed from rendering within this screen
      // as it's meant for QuizResultScreen
    },
    buttonContainer: {
      width: "80%", // Keep button width
      alignSelf: "center", // Center the button container
    },
    button: {
      paddingVertical: 8,
    },
  });

export default WordInspectorScreen;

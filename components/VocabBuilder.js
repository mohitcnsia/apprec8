import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Button,
  ScrollView,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import {
  fetchVocabGameData,
  listenToVocabGameData,
} from "../store/firestore-api";
import functions from "@react-native-firebase/functions";
import * as Speech from "expo-speech"; // 👈 Import for speaker

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Define the new generic star function
const awardStars = functions().httpsCallable("awardStars");

const VocabBuilder = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  // All state and functions remain the same...
  const [wordCategories, setWordCategories] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameStatus, setGameStatus] = useState("loading");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentWord, setCurrentWord] = useState("");
  const [currentHint, setCurrentHint] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [score, setScore] = useState(0);
  const [showMessage, setShowMessage] = useState("");
  const [usedWords, setUsedWords] = useState([]);

  // New state for star messages
  const [milestoneMessage, setMilestoneMessage] = useState(null);

  const maxWrongGuesses = 6;

  // 👇 Speaker function
  const speakWord = () => {
    // We speak the `currentWord` which is stored in state
    Speech.speak(currentWord, {
      language: "en-US", // Use US English
      rate: 0.9, // Speak slightly slower for clarity
    });
  };

  useEffect(() => {
    const unsubscribe = listenToVocabGameData(
      (data) => {
        if (Object.keys(data).length > 0) {
          setWordCategories(data);
          if (gameStatus === "loading" || gameStatus === "error") {
            setGameStatus("category-select");
          }
        }
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
        setGameStatus("error");
      }
    );
    return () => unsubscribe();
  }, [gameStatus]);

  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      parent?.setOptions({ tabBarStyle: { display: "none" } });
      return () =>
        parent?.setOptions({
          tabBarStyle: {
            display: "flex",
            backgroundColor: theme.tabBarBackground,
            borderTopColor: theme.border,
          },
        });
    }, [navigation, theme])
  );

  const selectCategory = (categoryKey) => {
    setSelectedCategory(categoryKey);
    setUsedWords([]);
    startNewWord(categoryKey);
  };

  const startNewWord = (categoryKey = selectedCategory) => {
    const category = wordCategories[categoryKey];
    if (!category || !category.words) {
      setGameStatus("error");
      setError("Could not find words for this category.");
      return;
    }
    const availableWords = category.words.filter(
      (w) => !usedWords.includes(w.word)
    );
    if (availableWords.length === 0) {
      // This is now handled by the 'complete' milestone logic,
      // but we keep this as a fallback.
      setGameStatus("category-complete");
      setShowMessage(`🎉 Amazing! You completed all ${category.name} words!`);
      return;
    }
    const randomWord =
      availableWords[Math.floor(Math.random() * availableWords.length)];
    setCurrentWord(randomWord.word);
    setCurrentHint(randomWord.hint);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameStatus("playing");
    setShowMessage("");
    setMilestoneMessage(null); // Clear star message
  };

  const resetToCategorySelect = () => {
    setGameStatus("category-select");
    setSelectedCategory(null);
    setScore(0);
    setMilestoneMessage(null); // Clear star message
  };

  const guessLetter = (letter) => {
    if (guessedLetters.includes(letter) || gameStatus !== "playing") return;
    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);
    if (!currentWord.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      if (newWrongGuesses >= maxWrongGuesses) {
        setGameStatus("lost");
        setShowMessage(`${currentWord}`);
      }
    } else {
      const isComplete = currentWord
        .split("")
        .every((l) => newGuessedLetters.includes(l));

      // 👇 This is the final logic block for winning
      if (isComplete) {
        setGameStatus("won");
        setScore(score + 1);

        const newUsedWords = [...usedWords, currentWord];
        setUsedWords(newUsedWords);

        // 1. ALWAYS set the win message, even on milestones
        setShowMessage(`${currentWord}`);

        const totalWords = wordCategories[selectedCategory]?.words.length || 0;
        const halfwayPoint = Math.ceil(totalWords / 2);

        let starsToAward = 0;
        let messageText = "";
        let source = "";

        // Check for "complete"
        if (totalWords > 2 && newUsedWords.length === totalWords) {
          starsToAward = 15; // You can change this reward
          messageText = "Category Complete!";
          source = "vocab_complete";
          setGameStatus("category-complete");
        }
        // Check for "halfway"
        else if (totalWords > 2 && newUsedWords.length === halfwayPoint) {
          starsToAward = 5; // You can change this reward
          messageText = "Halfway point!";
          source = "vocab_halfway";
        }

        if (starsToAward > 0) {
          // 2. SET MILESTONE MESSAGE (in addition to the win message)
          setMilestoneMessage({ text: messageText, stars: starsToAward });

          // 3. CALL FUNCTION IN BACKGROUND
          awardStars({ starsAwarded: starsToAward, source: source })
            .then((result) => {
              console.log(
                `Stars awarded successfully for ${source}. New total: ${result.data.totalStars}`
              );
            })
            .catch((error) => {
              console.error(`Failed to award stars for ${source}:`, error);
            });
        }
      }
    }
  };

  const getDisplayWord = () =>
    currentWord
      .split("")
      .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
      .join(" ");

  const getRescueCharacter = () => {
    const progress = Math.max(0, maxWrongGuesses - wrongGuesses);
    const characters = ["😵", "😰", "😟", "😐", "🙂", "😊", "🤗"];
    return characters[progress] || "😵";
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Loading Word Game...</Text>
        </View>
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // UPDATED for sorting and scrolling
  const renderCategorySelect = () => (
    <View style={styles.categorySelect}>
      <Text style={styles.categoryTitle}>Choose a Category!</Text>
      <ScrollView style={{ width: "100%" }}>
        <View style={styles.categories}>
          {Object.entries(wordCategories)
            // Sort by the 'order' field numerically
            .sort(([, catA], [, catB]) => catA.order - catB.order)
            .map(([key, category]) => (
              <TouchableOpacity
                key={key}
                style={styles.categoryBtn}
                onPress={() => selectCategory(key)}
                activeOpacity={0.8}
              >
                <Text style={styles.categoryBtnText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderAlphabet = () => {
    const rows = [];
    for (let i = 0; i < ALPHABET.length; i += 7) {
      const row = ALPHABET.slice(i, i + 7);
      rows.push(
        <View key={i} style={styles.alphabetRow}>
          {row.map((letter) => {
            const isGuessed = guessedLetters.includes(letter);
            const isCorrect = currentWord.includes(letter) && isGuessed;
            const isWrong = !currentWord.includes(letter) && isGuessed;
            let buttonStyle = [styles.letterBtn];
            if (isGuessed) buttonStyle.push(styles.letterBtnDisabled);
            if (isCorrect) buttonStyle.push(styles.letterBtnCorrect);
            if (isWrong) buttonStyle.push(styles.letterBtnWrong);
            return (
              <TouchableOpacity
                key={letter}
                style={buttonStyle}
                onPress={() => guessLetter(letter)}
                disabled={isGuessed || gameStatus !== "playing"}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.letterBtnText,
                    isGuessed && styles.letterBtnTextDisabled,
                  ]}
                >
                  {letter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }
    return rows;
  };

  if (gameStatus === "category-select") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.statsContainer}>
            <Text style={styles.title}>🧠 Word Learning</Text>
            <Text style={styles.score}>Words Learned: {score}</Text>
          </View>
          {renderCategorySelect()}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={styles.statsContainer}>
            <Text style={styles.title}>
              {wordCategories[selectedCategory]?.name}
            </Text>
            <Text style={styles.score}>Words Learned: {score}</Text>
          </View>
          <View style={styles.hintSection}>
            <Text style={styles.hintLabel}>💡 Hint:</Text>
            <Text style={styles.hintText}>{currentHint}</Text>
          </View>
          <View style={styles.rescueSection}>
            <Text style={styles.characterDisplay}>{getRescueCharacter()}</Text>
            <Text style={styles.statusText}>
              {wrongGuesses}/{maxWrongGuesses} wrong •{" "}
              {maxWrongGuesses - wrongGuesses} chances left
            </Text>
            {/* 👇 Back to just the word display */}
            <Text style={styles.wordDisplay}>{getDisplayWord()}</Text>
          </View>
        </View>
        <View style={styles.middleSection}>
          <View style={styles.progressSection}>
            <Text style={styles.progressInfo}>
              Completed: {usedWords.length}/
              {wordCategories[selectedCategory]?.words.length || 0} words
            </Text>
          </View>

          {/* 👇 FINAL MESSAGE BOX with Speaker Icon */}
          {(showMessage || milestoneMessage) && (
            <View
              style={[
                styles.message,
                (gameStatus === "won" || milestoneMessage) && styles.messageWin,
                gameStatus === "lost" && styles.messageLose,
                gameStatus === "category-complete" && styles.messageComplete,
              ]}
            >
              {/* Part 1: The Word Message (Win or Lose) + Speaker */}
              {showMessage && (
                <View style={styles.messageRow}>
                  {/* Show speaker button only when word is revealed */}
                  {(gameStatus === "won" ||
                    gameStatus === "lost" ||
                    gameStatus === "category-complete") && (
                    <TouchableOpacity
                      onPress={speakWord}
                      style={styles.speakButtonInMessage}
                    >
                      <Text style={styles.speakButtonText}>🔊</Text>
                    </TouchableOpacity>
                  )}
                  <Text
                    style={[
                      styles.messageText,
                      gameStatus === "won" && styles.messageTextWin,
                      gameStatus === "lost" && styles.messageTextLose,
                      gameStatus === "category-complete" &&
                        styles.messageTextComplete,
                    ]}
                  >
                    {showMessage}
                  </Text>
                </View>
              )}

              {/* Part 2: The Star Message (Milestone) */}
              {milestoneMessage && (
                <Text style={styles.messageText}>
                  {milestoneMessage.text}{" "}
                  <Text style={styles.messageStarText}>
                    {milestoneMessage.stars} 🌟
                  </Text>
                </Text>
              )}
            </View>
          )}
        </View>
        <View style={styles.bottomSection}>
          {(gameStatus === "won" || gameStatus === "lost") && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => startNewWord()}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnText}>🎯 Next Word</Text>
            </TouchableOpacity>
          )}
          {gameStatus === "category-complete" && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={resetToCategorySelect}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnText}>🏆 Choose New Category</Text>
            </TouchableOpacity>
          )}
          {gameStatus === "playing" && (
            <View style={styles.alphabetContainer}>{renderAlphabet()}</View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: theme.textSecondary,
    },
    errorText: {
      fontSize: 16,
      color: theme.warning,
      textAlign: "center",
      marginBottom: 20,
    },
    content: {
      flex: 1,
      padding: 15,
    },
    topSection: {
      flex: 0,
    },
    middleSection: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    bottomSection: {
      flex: 0,
      alignItems: "center",
      paddingBottom: 10,
    },
    statsContainer: {
      alignItems: "center",
      marginBottom: 15,
      paddingTop: 15,
    },
    title: {
      fontSize: 26,
      fontWeight: "bold",
      color: theme.primary,
      marginBottom: 5,
    },
    score: {
      fontSize: 15,
      color: theme.textPrimary,
      fontWeight: "600",
    },
    // UPDATED for scrolling layout
    categorySelect: {
      alignItems: "center",
      flex: 1,
      // Removed justifyContent
    },
    categoryTitle: {
      fontSize: 22,
      color: theme.primary,
      fontWeight: "bold",
      marginBottom: 25,
    },
    // UPDATED for "scattered" layout
    categories: {
      width: "100%",
      gap: 10,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      paddingBottom: 20,
    },
    // This style now works with flex-wrap automatically
    categoryBtn: {
      backgroundColor: theme.primary,
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 15,
      alignItems: "center",
    },
    categoryBtnText: {
      color: theme.buttonText,
      fontSize: 18,
      fontWeight: "bold",
    },
    hintSection: {
      backgroundColor: theme.quoteBackground,
      borderRadius: 12,
      padding: 12,
      marginBottom: 10,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
    },
    hintLabel: {
      fontSize: 13,
      color: theme.textSecondary,
      marginBottom: 3,
      fontWeight: "600",
    },
    hintText: {
      fontSize: 15,
      color: theme.textPrimary,
      lineHeight: 20,
    },
    rescueSection: {
      alignItems: "center",
      backgroundColor: theme.cardBackground,
      borderRadius: 15,
      padding: 15,
      marginBottom: 10,
      borderWidth: 2,
      borderColor: theme.border,
    },
    characterDisplay: {
      fontSize: 50,
      marginVertical: 5,
    },
    statusText: {
      fontSize: 13,
      color: theme.textSecondary,
      marginBottom: 8,
    },
    // 👇 Restored to original
    wordDisplay: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.primary,
      letterSpacing: 6,
      marginVertical: 10,
      textAlign: "center",
      minHeight: 40,
    },
    progressSection: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
      paddingHorizontal: 5,
    },
    progressInfo: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
    },
    alphabetContainer: {
      marginBottom: 10,
    },
    alphabetRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 6,
      gap: 4,
    },
    letterBtn: {
      width: 48,
      height: 48,
      backgroundColor: theme.primary,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    letterBtnDisabled: {
      backgroundColor: theme.disabledBackground,
    },
    letterBtnCorrect: {
      backgroundColor: theme.success,
    },
    letterBtnWrong: {
      backgroundColor: theme.warning,
    },
    letterBtnText: {
      color: theme.buttonText,
      fontSize: 20,
      fontWeight: "bold",
    },
    letterBtnTextDisabled: {
      color: theme.textDisabled,
    },
    actionBtn: {
      backgroundColor: theme.accent,
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 20,
      marginVertical: 5,
      minWidth: 200,
      alignItems: "center",
      marginBottom: 10,
    },
    actionBtnText: {
      color: theme.textOnPrimary,
      fontSize: 16,
      fontWeight: "bold",
    },
    message: {
      alignItems: "center",
      marginVertical: 10,
      padding: 10,
      borderRadius: 10,
      borderWidth: 2,
    },
    messageWin: {
      backgroundColor: theme.successBackground,
      borderColor: theme.success,
    },
    messageLose: {
      backgroundColor: theme.warningBackground,
      borderColor: theme.warning,
    },
    messageComplete: {
      backgroundColor: theme.quoteBackground,
      borderColor: theme.primary,
    },
    messageText: {
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
    messageTextWin: {
      color: theme.success,
    },
    messageTextLose: {
      color: theme.warning,
    },
    messageTextComplete: {
      color: theme.primary,
    },
    // NEW STYLE for the star message
    messageStarText: {
      color: theme.success, // Green color
      fontWeight: "bold",
      fontSize: 18,
    },
    // 👇 STYLES for the speaker button in the message box
    messageRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 10,
    },
    speakButtonInMessage: {
      marginRight: 10,
      padding: 5,
    },
    speakButtonText: {
      fontSize: 30,
    },
  });

export default VocabBuilder;

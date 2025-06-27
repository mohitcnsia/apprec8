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
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import {
  fetchVocabGameData,
  listenToVocabGameData,
} from "../store/firestore-api";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const VocabBuilder = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  // Data fetching state
  const [wordCategories, setWordCategories] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameStatus, setGameStatus] = useState("loading");

  // Game state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentWord, setCurrentWord] = useState("");
  const [currentHint, setCurrentHint] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [score, setScore] = useState(0);
  const [showMessage, setShowMessage] = useState("");
  const [usedWords, setUsedWords] = useState([]);

  const maxWrongGuesses = 6;

  // Set up the real-time listener
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

    // Cleanup: detach the listener when the component unmounts
    return () => unsubscribe();
  }, [gameStatus]); // Rerun if gameStatus changes from loading/error

  // Fetch all game data on component mount
  const loadGameData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchVocabGameData();
      setWordCategories(data);
      setGameStatus("category-select");
    } catch (err) {
      setError(err.message);
      setGameStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGameData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Get the parent navigator which controls the tab bar
      const parent = navigation.getParent();

      // Hide the tab bar when the game screen is focused
      parent?.setOptions({
        tabBarStyle: { display: "none" },
      });

      // This is the cleanup function that runs when you leave the screen
      return () =>
        parent?.setOptions({
          // Re-apply the correct THEMED style when showing the tab bar again
          tabBarStyle: {
            display: "flex", // Make it visible again
            backgroundColor: theme.tabBarBackground, // Use the theme's background color
            borderTopColor: theme.border, // Use the theme's border color
          },
        });
    }, [navigation, theme]) // Add theme to the dependency array
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
  };

  const resetToCategorySelect = () => {
    setGameStatus("category-select");
    setSelectedCategory(null);
    setScore(0);
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
        setShowMessage(`😢 The word was: ${currentWord}`);
      }
    } else {
      const isComplete = currentWord
        .split("")
        .every((l) => newGuessedLetters.includes(l));
      if (isComplete) {
        setGameStatus("won");
        setScore(score + 1);
        setUsedWords([...usedWords, currentWord]);
        setShowMessage(`🎉 Correct! It was ${currentWord}!`);
        // We are not awarding points to Firebase for now, as requested
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

  // --- RENDER STATES ---
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
          {/* No retry button needed as listener will retry automatically */}
        </View>
      </SafeAreaView>
    );
  }

  const renderCategorySelect = () => (
    <View style={styles.categorySelect}>
      <Text style={styles.categoryTitle}>Choose a Category!</Text>
      <View style={styles.categories}>
        {Object.entries(wordCategories).map(([key, category]) => (
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
          <View style={styles.header}>
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
          <View style={styles.header}>
            <Text style={styles.title}>
              🧠 {wordCategories[selectedCategory]?.name}
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
          {showMessage && (
            <View
              style={[
                styles.message,
                gameStatus === "won" && styles.messageWin,
                gameStatus === "lost" && styles.messageLose,
                gameStatus === "category-complete" && styles.messageComplete,
              ]}
            >
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
    header: {
      alignItems: "center",
      marginBottom: 15,
      paddingTop: 5,
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
    categorySelect: {
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
    },
    categoryTitle: {
      fontSize: 22,
      color: theme.primary,
      fontWeight: "bold",
      marginBottom: 25,
    },
    categories: {
      width: "100%",
      gap: 15,
    },
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
  });

export default VocabBuilder;

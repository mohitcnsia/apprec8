import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Button,
  TouchableWithoutFeedback,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import HexButton from "../components/common/HexButton";
import { fetchSpellingBeePuzzles } from "../store/firestore-api";
import GameHeader from "../components/common/GameHeader";

const { width } = Dimensions.get("window");
// ✅ FIX: Updated cache key to v4. This invalidates any old, faulty cache
// and ensures only correct definitions are stored from now on.
const ASYNC_STORAGE_CACHE_KEY = "spellingBeeCache_v4";

const SpellingBeeGame = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  // State declarations
  const [puzzles, setPuzzles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [foundWordsCache, setFoundWordsCache] = useState(new Map());
  const [currentSet, setCurrentSet] = useState(0);
  const [foundWords, setFoundWords] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showSuccessCheck, setShowSuccessCheck] = useState(false);
  const [selectedWordMeaning, setSelectedWordMeaning] = useState(null);
  const [showMeaningModal, setShowMeaningModal] = useState(false);

  const loadGameData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedPuzzles, cachedWordsData] = await Promise.all([
        fetchSpellingBeePuzzles(),
        AsyncStorage.getItem(ASYNC_STORAGE_CACHE_KEY),
      ]);
      if (fetchedPuzzles.length === 0) {
        throw new Error("No Spelling Bee puzzles found in the database.");
      }
      setPuzzles(fetchedPuzzles);
      if (cachedWordsData) {
        setFoundWordsCache(new Map(JSON.parse(cachedWordsData)));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGameData();
  }, [loadGameData]);

  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      parent?.setOptions({ tabBarStyle: { display: "none" } });
      return () => {
        parent?.setOptions({
          tabBarStyle: {
            display: "flex",
            backgroundColor: theme.tabBarBackground,
            borderTopColor: theme.border,
          },
        });
      };
    }, [navigation, theme])
  );

  const validateWordWithMeaning = useCallback(
    async (word) => {
      const upperWord = word.toUpperCase();

      if (foundWordsCache.has(upperWord)) {
        const cachedItem = foundWordsCache.get(upperWord);
        // Check if the cached data is in the correct 'object' format.
        if (typeof cachedItem === "object" && cachedItem !== null) {
          return { isValid: true, ...cachedItem, source: "cache" };
        }
      }

      try {
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
        );

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const partsOfSpeech = new Set();
            const meanings = [];

            // Loop through all entries provided by the API to get all meanings.
            data.forEach((entry) => {
              entry.meanings?.forEach((meaning) => {
                partsOfSpeech.add(meaning.partOfSpeech);
                const definition = meaning.definitions[0]?.definition;
                if (definition) {
                  meanings.push(`- ${definition}`);
                }
              });
            });

            if (meanings.length > 0) {
              const result = {
                meaning: meanings.join("\n\n"), // Add space between definitions
                partOfSpeech: Array.from(partsOfSpeech).join(", "),
              };

              const updatedCache = new Map(foundWordsCache).set(
                upperWord,
                result
              );
              await AsyncStorage.setItem(
                ASYNC_STORAGE_CACHE_KEY,
                JSON.stringify(Array.from(updatedCache.entries()))
              );
              setFoundWordsCache(updatedCache);

              return { isValid: true, ...result, source: "api" };
            }
          }
        }
        return { isValid: false, source: "api" };
      } catch (error) {
        return { isValid: false, source: "offline" };
      }
    },
    [foundWordsCache]
  );

  const submitWord = async () => {
    const word = currentWord.toUpperCase();
    if (word.length < 4) {
      setMessage("Words must be at least 4 letters long!");
      setTimeout(() => setMessage(""), 2000);
      return;
    }
    if (!word.includes(centerLetter)) {
      setMessage(`Word must contain the center letter "${centerLetter}"!`);
      setTimeout(() => setMessage(""), 2000);
      return;
    }
    if (foundWords.some((wordObj) => wordObj.word === word)) {
      setMessage("You already found that word!");
      setTimeout(() => setMessage(""), 2000);
      return;
    }
    const wordLetters = word.split("");
    for (let letter of wordLetters) {
      if (!letters.includes(letter)) {
        setMessage("Word contains invalid letters!");
        setTimeout(() => setMessage(""), 2000);
        return;
      }
    }
    setIsValidating(true);
    try {
      const result = await validateWordWithMeaning(word);
      if (result.isValid) {
        const wordData = {
          word,
          meaning: result.meaning,
          partOfSpeech: result.partOfSpeech || "",
          source: result.source,
        };
        setFoundWords((prev) => [wordData, ...prev]);
        setScore((prev) => prev + word.length);
        setShowSuccessCheck(true);
        setTimeout(() => {
          setShowSuccessCheck(false);
        }, 1500);
      } else {
        setMessage("Word not found in dictionary!");
        setTimeout(() => setMessage(""), 2000);
      }
    } catch (error) {
      setMessage("Error checking word. Try again!");
      setTimeout(() => setMessage(""), 2000);
    } finally {
      setIsValidating(false);
      setCurrentWord("");
    }
  };

  const newGame = () => {
    if (puzzles.length === 0) return;
    const nextSet = (currentSet + 1) % puzzles.length;
    setCurrentSet(nextSet);
    setFoundWords([]);
    setCurrentWord("");
    setScore(0);
    setMessage("New puzzle loaded!");
    setTimeout(() => setMessage(""), 2000);
  };

  const addLetter = (letter) => {
    if (currentWord.length < 20) {
      setCurrentWord((prev) => prev + letter);
    }
  };
  const deleteLetter = () => {
    setCurrentWord((prev) => prev.slice(0, -1));
  };
  const showWordMeaning = (wordData) => {
    setSelectedWordMeaning(wordData);
    setShowMeaningModal(true);
  };
  const getHint = () => {
    const hintWords = [
      "Try words ending in -ING, -ED, or -ER",
      "Look for common prefixes like UN-, RE-, or IN-",
      "Think about plural forms (add -S)",
      "Consider past tense verbs",
    ];
    const randomHint = hintWords[Math.floor(Math.random() * hintWords.length)];
    setMessage(`Hint: ${randomHint}`);
    setTimeout(() => setMessage(""), 4000);
  };
  const getRank = () => {
    const wordsFound = foundWords.length;
    if (wordsFound >= 20)
      return { rank: "Wizard", icon: "magic-staff", color: "#eab308" };
    if (wordsFound >= 15)
      return { rank: "Master", icon: "crown", color: "#a855f7" };
    if (wordsFound >= 10)
      return { rank: "Good", icon: "star", color: "#3b82f6" };
    if (wordsFound >= 5)
      return { rank: "Better", icon: "chart-line-variant", color: "#10b981" };
    return { rank: "Beginner", icon: "leaf", color: "#6b7280" };
  };

  const headerControls = [
    { iconName: "lightbulb-on-outline", size: 28, onPress: getHint },
    { iconName: "dice-multiple-outline", size: 28, onPress: newGame },
    { iconName: "information-outline", onPress: () => setShowRules(true) },
    {
      iconName: isDark ? "white-balance-sunny" : "moon-waning-crescent",
      onPress: toggleTheme,
    },
  ];

  // Reusable Modal component for better UX
  const AppModal = ({ visible, onClose, title, children }) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={onClose} // Close on tapping the background
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              {/* ✅ FIX: The cross (close) button has been removed. */}
            </View>
            {children}
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Loading Puzzles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Retry" onPress={loadGameData} color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const currentPuzzle = puzzles[currentSet];
  if (!currentPuzzle) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>No puzzles available to play.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { letters, center: centerLetter } = currentPuzzle;
  const currentRank = getRank();
  const PADDING_HORIZONTAL_CONTENT = 24;
  const GAP_BETWEEN_HEXAGON_BUTTONS = 4;
  const NUM_BUTTONS_IN_MIDDLE_ROW = 3;
  const availableHexagonWidth = width - PADDING_HORIZONTAL_CONTENT;
  const MAX_LETTER_BUTTON_SIZE = 70;
  const calculatedLetterButtonSize =
    (availableHexagonWidth -
      (NUM_BUTTONS_IN_MIDDLE_ROW - 1) * GAP_BETWEEN_HEXAGON_BUTTONS) /
    NUM_BUTTONS_IN_MIDDLE_ROW;
  const letterButtonSize = Math.min(
    calculatedLetterButtonSize,
    MAX_LETTER_BUTTON_SIZE
  );

  return (
    <SafeAreaView style={styles.container}>
      <GameHeader rightControls={headerControls} />
      <View style={styles.mainGameContainer}>
        <View style={styles.statsPanel}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Score</Text>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                {score}
              </Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name={currentRank.icon}
                size={24}
                color={currentRank.color}
              />
              <Text style={[styles.rankText, { color: currentRank.color }]}>
                {currentRank.rank}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Words</Text>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                {foundWords.length}
              </Text>
            </View>
          </View>
          {foundWords.length > 0 && (
            <View style={styles.foundWordsSection}>
              <ScrollView
                contentContainerStyle={styles.wordsContainer}
                showsVerticalScrollIndicator={false}
              >
                {foundWords.map((wordData, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => showWordMeaning(wordData)}
                    style={styles.wordChip}
                  >
                    <Text style={styles.wordChipText}>{wordData.word}</Text>
                    <MaterialCommunityIcons
                      name="book-open-variant"
                      size={12}
                      color={theme.textOnPrimary}
                      style={styles.bookIcon}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {message && (
          <View style={styles.messagePanel}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        )}

        <View style={styles.bottomContainer}>
          <View style={styles.currentWordPanel}>
            <Text style={styles.currentWord}>
              {currentWord || "Start spelling..."}
            </Text>
          </View>
          <View style={styles.hexagonContainer}>
            <View style={styles.hexagonRow}>
              {[letters[0], letters[1]].map((letter, index) => (
                <HexButton
                  key={index}
                  letter={letter}
                  onPress={() => addLetter(letter)}
                  isCenter={false}
                  size={letterButtonSize}
                  backgroundColor={theme.cardBackground}
                  borderColor={theme.primary}
                  textColor={theme.textPrimary}
                />
              ))}
            </View>
            <View style={styles.hexagonRow}>
              {[letters[2], centerLetter, letters[3]].map((letter, index) => {
                const isCenter = index === 1;
                return (
                  <HexButton
                    key={index}
                    letter={letter}
                    onPress={() => addLetter(letter)}
                    isCenter={isCenter}
                    size={letterButtonSize}
                    backgroundColor={
                      isCenter ? theme.accent : theme.cardBackground
                    }
                    borderColor={isCenter ? theme.accent : theme.primary}
                    textColor={
                      isCenter ? theme.textOnPrimary : theme.textPrimary
                    }
                  />
                );
              })}
            </View>
            <View style={styles.hexagonRow}>
              {[letters[4], letters[5]].map((letter, index) => (
                <HexButton
                  key={index}
                  letter={letter}
                  onPress={() => addLetter(letter)}
                  isCenter={false}
                  size={letterButtonSize}
                  backgroundColor={theme.cardBackground}
                  borderColor={theme.primary}
                  textColor={theme.textPrimary}
                />
              ))}
            </View>
          </View>
          <View style={styles.submitButtonRow}>
            <TouchableOpacity
              onPress={deleteLetter}
              style={styles.backspaceButton}
            >
              <MaterialCommunityIcons
                name="backspace-outline"
                size={28}
                color={theme.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={submitWord}
              disabled={isValidating}
              style={[
                styles.checkButton,
                isValidating && styles.disabledButton,
                showSuccessCheck && styles.successButton,
              ]}
            >
              {isValidating ? (
                <ActivityIndicator color={theme.textOnPrimary} size="small" />
              ) : (
                <Text style={styles.checkButtonText}>Check</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <AppModal
        visible={showRules}
        onClose={() => setShowRules(false)}
        title="How to Play"
      >
        <View style={styles.rulesContainer}>
          <Text style={styles.ruleText}>
            • Make words using the letters provided.
          </Text>
          <Text style={styles.ruleText}>
            • Words must be at least 4 letters long.
          </Text>
          <Text style={styles.ruleText}>
            • Every word must contain the center letter (red).
          </Text>
          <Text style={styles.ruleText}>
            • Tap on found words to see their meanings! 📚
          </Text>
        </View>
      </AppModal>

      <AppModal
        visible={showMeaningModal}
        onClose={() => setShowMeaningModal(false)}
        title={selectedWordMeaning?.word}
      >
        {selectedWordMeaning && (
          <View>
            {selectedWordMeaning.partOfSpeech && (
              <Text style={styles.partOfSpeech}>
                {selectedWordMeaning.partOfSpeech}
              </Text>
            )}
            <Text style={styles.meaningText}>
              {selectedWordMeaning.meaning}
            </Text>
          </View>
        )}
      </AppModal>
    </SafeAreaView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    loadingText: { marginTop: 10, fontSize: 16, color: theme.textSecondary },
    errorText: {
      fontSize: 16,
      color: theme.warning,
      textAlign: "center",
      marginBottom: 20,
    },
    mainGameContainer: {
      flex: 1,
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    statsPanel: {
      flex: 1,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      backgroundColor: theme.cardBackground,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      overflow: "hidden",
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginBottom: 12,
    },
    statItem: { alignItems: "center" },
    statLabel: { fontSize: 10, opacity: 0.75, color: theme.textSecondary },
    statValue: { fontSize: 18, fontFamily: "nunitoBold", color: theme.primary },
    rankText: { fontSize: 14, fontFamily: "nunitoBold" },
    foundWordsSection: {
      flex: 1,
      borderTopWidth: 1,
      paddingTop: 12,
      borderTopColor: theme.border,
    },
    wordsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 6,
    },
    wordChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.primary,
    },
    wordChipText: {
      fontSize: 14,
      fontFamily: "nunito",
      color: theme.textOnPrimary,
    },
    bookIcon: { marginLeft: 5 },
    messagePanel: {
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: theme.primary,
      marginBottom: 12,
      alignSelf: "center",
    },
    messageText: {
      color: theme.textOnPrimary,
      textAlign: "center",
      fontFamily: "nunitoBold",
    },
    bottomContainer: {},
    currentWordPanel: {
      borderRadius: 12,
      padding: 12,
      minHeight: 48,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.cardBackground,
      marginBottom: 16,
    },
    currentWord: {
      fontSize: 22,
      fontFamily: "nunitoBold",
      letterSpacing: 2,
      color: theme.primary,
    },
    hexagonContainer: { alignItems: "center", marginBottom: 16 },
    hexagonRow: { flexDirection: "row", justifyContent: "center", gap: 4 },
    submitButtonRow: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "center",
      gap: 16,
    },
    backspaceButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.cardBackground,
      borderColor: theme.border,
      borderWidth: 1,
    },
    checkButton: {
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      backgroundColor: theme.primary,
    },
    checkButtonText: {
      fontSize: 18,
      fontFamily: "nunitoBold",
      color: theme.textOnPrimary,
    },
    disabledButton: { opacity: 0.5 },
    successButton: {
      backgroundColor: theme.success,
      borderColor: theme.success,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    modalContent: {
      borderRadius: 16,
      padding: 24,
      width: "100%",
      maxWidth: 350,
      backgroundColor: theme.cardBackground,
    },
    modalHeader: {
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 22,
      fontFamily: "nunitoBold",
      color: theme.primary,
      textAlign: "center", // Center title now that close button is gone
    },
    rulesContainer: { gap: 12 },
    ruleText: { fontSize: 16, fontFamily: "nunito", color: theme.textPrimary },
    partOfSpeech: {
      fontSize: 14,
      fontFamily: "nunito",
      fontStyle: "italic",
      marginBottom: 8,
      textTransform: "capitalize",
      color: theme.primary,
      opacity: 0.8,
    },
    meaningText: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: "nunito",
      color: theme.textPrimary,
    },
  });

export default SpellingBeeGame;

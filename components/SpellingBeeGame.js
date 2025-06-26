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
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import HexButton from "../components/common/HexButton";
import { fetchSpellingBeePuzzles } from "../store/firestore-api";

const { width } = Dimensions.get("window");
const ASYNC_STORAGE_CACHE_KEY = "spellingBeeFoundWordsCache";

// This small, hardcoded list remains as a fast, initial, offline dictionary.
const commonWordsWithMeaning = {
  ABLE: "Having the power, skill, or means to do something",
  CABLE: "A thick rope of wire or fiber",
  BLAME: "To hold responsible for something bad",
  BEAM: "A ray of light or a wooden support",
  MEAL: "Food eaten at a particular time",
  CALM: "Not excited, nervous, or upset",
  SCALE: "A device for measuring weight",
  GRACE: "Smooth and attractive movement",
  RANGE: "A set of different things of the same type",
  HELP: "To make it easier for someone to do something",
  LEAP: "To jump high or far",
  SHAPE: "The form of something",
  CLEAR: "Easy to understand or see through",
  LEARN: "To gain knowledge or skill",
  GREAT: "Very good or large in size",
};

const SpellingBeeGame = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  // Data Fetching State
  const [puzzles, setPuzzles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Word Cache State
  const [foundWordsCache, setFoundWordsCache] = useState(new Set());

  // Game State
  const [currentSet, setCurrentSet] = useState(0);
  const [foundWords, setFoundWords] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [isValidating, setIsValidating] = useState(false);

  // UI State
  const [showRules, setShowRules] = useState(false);
  const [showSuccessCheck, setShowSuccessCheck] = useState(false);
  const [selectedWordMeaning, setSelectedWordMeaning] = useState(null);
  const [showMeaningModal, setShowMeaningModal] = useState(false);

  const loadGameData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch puzzles and load cache from storage in parallel
      const [fetchedPuzzles, cachedWordsData] = await Promise.all([
        fetchSpellingBeePuzzles(),
        AsyncStorage.getItem(ASYNC_STORAGE_CACHE_KEY),
      ]);

      if (fetchedPuzzles.length === 0) {
        throw new Error("No Spelling Bee puzzles found in the database.");
      }
      setPuzzles(fetchedPuzzles);

      if (cachedWordsData) {
        setFoundWordsCache(new Set(JSON.parse(cachedWordsData)));
        console.log(
          `Loaded ${JSON.parse(cachedWordsData).length} words from cache.`
        );
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

  useFocusEffect(() => {
    navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    return () => navigation.getParent()?.setOptions({ tabBarStyle: undefined });
  });

  const validateWordWithMeaning = useCallback(
    async (word) => {
      const upperWord = word.toUpperCase();

      // New validation flow
      if (foundWordsCache.has(upperWord)) {
        console.log(`'${upperWord}' found in AsyncStorage cache.`);
        return {
          isValid: true,
          meaning: "You've found this word before!",
          source: "cache",
        };
      }
      if (commonWordsWithMeaning[upperWord]) {
        console.log(`'${upperWord}' found in local common words.`);
        return {
          isValid: true,
          meaning: commonWordsWithMeaning[upperWord],
          source: "offline",
        };
      }

      // If not in cache, try API
      try {
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
        );
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            // --- Cache the newly found word ---
            const updatedCache = new Set(foundWordsCache).add(upperWord);
            await AsyncStorage.setItem(
              ASYNC_STORAGE_CACHE_KEY,
              JSON.stringify(Array.from(updatedCache))
            );
            setFoundWordsCache(updatedCache);
            console.log(`'${upperWord}' validated by API and saved to cache.`);
            // --- End Caching ---

            const firstEntry = data[0];
            const firstMeaning = firstEntry.meanings?.[0];
            const firstDefinition = firstMeaning?.definitions?.[0];
            return {
              isValid: true,
              meaning: firstDefinition?.definition || "A valid English word.",
              partOfSpeech: firstMeaning?.partOfSpeech || "",
              source: "api",
            };
          }
        }
        return { isValid: false, meaning: null, source: "api" };
      } catch (error) {
        console.log("Dictionary API error or offline:", error);
        return { isValid: false, meaning: null, source: "offline" };
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
    setMessage("Checking word...");
    try {
      const result = await validateWordWithMeaning(word);
      if (result.isValid) {
        const wordData = {
          word,
          meaning: result.meaning,
          partOfSpeech: result.partOfSpeech || "",
          source: result.source,
        };
        setFoundWords((prev) => [...prev, wordData]);
        setScore((prev) => prev + word.length);
        setCurrentWord("");
        setMessage(`Great job! "${word}" is correct!`);
        setShowSuccessCheck(true);
        setTimeout(() => {
          setMessage(
            `"${word}": ${result.meaning.substring(0, 50)}${
              result.meaning.length > 50 ? "..." : ""
            }`
          );
          setTimeout(() => {
            setMessage("");
            setShowSuccessCheck(false);
          }, 3000);
        }, 1500);
      } else {
        setMessage("Word not found in dictionary!");
        setTimeout(() => setMessage(""), 2000);
      }
    } catch (error) {
      console.error("Submit Word Error:", error);
      setMessage("Error checking word. Try again!");
      setTimeout(() => setMessage(""), 2000);
    } finally {
      setIsValidating(false);
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

  // --- Unchanged Functions: addLetter, deleteLetter, showWordMeaning, getHint, getRank etc. ---
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

  // --- Render Logic ---
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

  // Need to handle the case where puzzles array might still be empty after loading
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

  const MeaningModal = () => (
    <Modal
      visible={showMeaningModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowMeaningModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedWordMeaning?.word}</Text>
            <TouchableOpacity
              onPress={() => setShowMeaningModal(false)}
              style={styles.closeButton}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.textPrimary}
              />
            </TouchableOpacity>
          </View>
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
        </View>
      </View>
    </Modal>
  );
  const RulesModal = () => (
    <Modal
      visible={showRules}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowRules(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>How to Play</Text>
            <TouchableOpacity
              onPress={() => setShowRules(false)}
              style={styles.closeButton}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.textPrimary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.rulesContainer}>
            <Text style={styles.ruleText}>• Make words using the letters</Text>
            <Text style={styles.ruleText}>
              • Words must be at least 4 letters long
            </Text>
            <Text style={styles.ruleText}>
              • Every word must contain the center letter (red)
            </Text>
            <Text style={styles.ruleText}>
              • Tap letters to build words, then submit!
            </Text>
            <Text style={styles.ruleText}>
              • Score points based on word length
            </Text>
            <Text style={styles.ruleText}>
              • Tap found words to see their meanings! 📚
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainGameContainer}>
        <View style={styles.topSectionFlex}>
          <View style={styles.topControlsRow}>
            <TouchableOpacity onPress={getHint} style={styles.iconButton}>
              <MaterialCommunityIcons
                name="lightbulb-on-outline"
                size={28}
                color={theme.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={newGame} style={styles.iconButton}>
              <MaterialCommunityIcons
                name="dice-multiple-outline"
                size={28}
                color={theme.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowRules(true)}
              style={styles.iconButton}
            >
              <MaterialCommunityIcons
                name="information-outline"
                size={24}
                color={theme.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
              <MaterialCommunityIcons
                name={isDark ? "white-balance-sunny" : "moon-waning-crescent"}
                size={24}
                color={theme.primary}
              />
            </TouchableOpacity>
          </View>
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
                <ScrollView style={styles.wordsScrollView}>
                  <View style={styles.wordsContainer}>
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
                  </View>
                </ScrollView>
              </View>
            )}
          </View>
          {message && (
            <View style={styles.messagePanel}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          )}
        </View>
        <View style={styles.currentWordPanel}>
          <Text style={styles.currentWord}>
            {currentWord || "Start spelling..."}
          </Text>
        </View>
        <View style={styles.bottomSection}>
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
          <View style={styles.separator} />
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
      <RulesModal />
      <MeaningModal />
    </SafeAreaView>
  );
};

// Stylesheet remains the same as previously provided...
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
      padding: 12,
      justifyContent: "space-between",
    },
    topSectionFlex: {
      flex: 1,
      alignSelf: "center",
      width: "100%",
      paddingBottom: 16,
    },
    topControlsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginBottom: 8,
    },
    statsPanel: {
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
      backgroundColor: theme.cardBackground,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    statItem: { alignItems: "center" },
    statLabel: { fontSize: 10, opacity: 0.75, color: theme.textSecondary },
    statValue: { fontSize: 18, fontWeight: "bold", color: theme.primary },
    rankText: { fontSize: 14, fontWeight: "bold" },
    foundWordsSection: {
      borderTopWidth: 1,
      paddingTop: 8,
      borderTopColor: theme.border,
    },
    wordsScrollView: {},
    wordsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 4,
      paddingHorizontal: 4,
    },
    wordChip: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
      backgroundColor: theme.primary,
    },
    wordChipText: {
      fontSize: 10,
      fontWeight: "bold",
      color: theme.textOnPrimary,
    },
    bookIcon: { marginLeft: 4 },
    messagePanel: {
      borderRadius: 8,
      padding: 8,
      backgroundColor: theme.accent,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      marginTop: "auto",
      marginBottom: 16,
    },
    messageText: { color: theme.textOnPrimary, textAlign: "center" },
    currentWordPanel: {
      borderRadius: 12,
      padding: 12,
      minHeight: 48,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.cardBackground,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      marginBottom: 16,
    },
    currentWord: {
      fontSize: 20,
      fontWeight: "bold",
      letterSpacing: 2,
      color: theme.primary,
    },
    iconButton: {
      padding: 4,
      borderRadius: 8,
      backgroundColor: theme.cardBackground,
    },
    bottomSection: {
      width: "100%",
      paddingHorizontal: 12,
      alignItems: "center",
    },
    hexagonContainer: { alignItems: "center", marginBottom: 16 },
    hexagonRow: { flexDirection: "row", justifyContent: "center", gap: 4 },
    separator: {
      height: 1,
      width: "100%",
      marginBottom: 16,
      backgroundColor: theme.border,
    },
    submitButtonRow: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "center",
      gap: 8,
    },
    backspaceButton: {
      width: "15%",
      borderWidth: 2,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.cardBackground,
      borderColor: theme.primary,
    },
    checkButton: {
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    checkButtonText: {
      fontSize: 18,
      fontWeight: "bold",
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
      padding: 16,
    },
    modalContent: {
      borderRadius: 16,
      padding: 24,
      width: "100%",
      maxWidth: 350,
      backgroundColor: theme.cardBackground,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 5,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    modalTitle: { fontSize: 20, fontWeight: "bold", color: theme.primary },
    closeButton: {
      padding: 4,
      borderRadius: 4,
      backgroundColor: theme.borderLight,
    },
    rulesContainer: { gap: 12 },
    ruleText: { fontSize: 14, color: theme.textPrimary },
    partOfSpeech: {
      fontSize: 14,
      fontStyle: "italic",
      marginBottom: 8,
      textTransform: "capitalize",
      color: theme.primary,
    },
    meaningText: { fontSize: 16, lineHeight: 22, color: theme.textPrimary },
  });

export default SpellingBeeGame;

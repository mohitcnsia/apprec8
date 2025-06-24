import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import HexButton from "../components/common/HexButton";
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
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");

const SpellingBeeGame = ({ navigation }) => {
  // Sample letter sets for the game
  const letterSets = [
    { letters: ["A", "B", "C", "E", "L", "M", "S"], center: "E" },
    { letters: ["A", "D", "G", "I", "N", "R", "S"], center: "R" },
    { letters: ["A", "E", "H", "L", "P", "S", "T"], center: "P" },
    { letters: ["A", "C", "E", "I", "L", "N", "R"], center: "N" },
    { letters: ["A", "E", "G", "L", "N", "R", "T"], center: "T" },
  ];

  // Enhanced word list with meanings for offline use
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
    // Add more words with meanings as needed
  };

  // Enhanced validation function that returns both validity and meaning
  const validateWordWithMeaning = async (word) => {
    const upperWord = word.toUpperCase();

    // First check our local word list (fast, offline)
    if (commonWordsWithMeaning[upperWord]) {
      return {
        isValid: true,
        meaning: commonWordsWithMeaning[upperWord],
        source: "offline",
      };
    }

    // For words not in our list, use dictionary API
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
      );

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          // Extract the first definition
          const firstEntry = data[0];
          const firstMeaning = firstEntry.meanings?.[0];
          const firstDefinition = firstMeaning?.definitions?.[0];

          let meaning = "A valid English word";
          let partOfSpeech = "";

          if (firstDefinition) {
            meaning = firstDefinition.definition;
            partOfSpeech = firstMeaning.partOfSpeech || "";
          }

          return {
            isValid: true,
            meaning: meaning,
            partOfSpeech: partOfSpeech,
            source: "api",
          };
        }
      }

      return { isValid: false, meaning: null, source: "api" };
    } catch (error) {
      console.log("Dictionary API unavailable, using offline validation");
      // Fallback: If API fails, check offline list as a last resort, even if already checked at top.
      // This catch block is primarily for network errors.
      if (commonWordsWithMeaning[upperWord]) {
        return {
          isValid: true,
          meaning: commonWordsWithMeaning[upperWord],
          source: "offline",
        };
      }
      return { isValid: false, meaning: null, source: "offline" };
    }
  };

  const [currentSet, setCurrentSet] = useState(0);
  const [foundWords, setFoundWords] = useState([]); // Now stores objects with word and meaning
  const [currentWord, setCurrentWord] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showSuccessCheck, setShowSuccessCheck] = useState(false);
  const [selectedWordMeaning, setSelectedWordMeaning] = useState(null);
  const [showMeaningModal, setShowMeaningModal] = useState(false);

  const letters = letterSets[currentSet].letters;
  const centerLetter = letterSets[currentSet].center;

  const addLetter = (letter) => {
    if (currentWord.length < 20) {
      setCurrentWord((prev) => prev + letter);
    }
  };

  const deleteLetter = () => {
    setCurrentWord((prev) => prev.slice(0, -1));
  };

  const clearWord = () => {
    setCurrentWord("");
  };

  const shuffleLetters = () => {
    setMessage("Letters shuffled!");
    setTimeout(() => setMessage(""), 2000);
  };

  useFocusEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });
    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
  });

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

    // Check if word uses only available letters
    const wordLetters = word.split("");
    const availableLetters = [...letters];
    for (let letter of wordLetters) {
      const index = availableLetters.indexOf(letter);
      if (index === -1) {
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
          word: word,
          meaning: result.meaning,
          partOfSpeech: result.partOfSpeech || "",
          source: result.source,
        };

        setFoundWords((prev) => [...prev, wordData]);
        setScore((prev) => prev + word.length);
        setCurrentWord("");
        setMessage(`Great job! "${word}" is correct!`);
        setShowSuccessCheck(true);

        // Show the meaning briefly
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
      console.error("Submit Word Error:", error); // Log the actual error
      setMessage("Error checking word. Try again!");
      setTimeout(() => setMessage(""), 2000);
    } finally {
      setIsValidating(false);
    }
  };

  const showWordMeaning = (wordData) => {
    setSelectedWordMeaning(wordData);
    setShowMeaningModal(true);
  };

  const newGame = () => {
    const nextSet = (currentSet + 1) % letterSets.length;
    setCurrentSet(nextSet);
    setFoundWords([]);
    setCurrentWord("");
    setScore(0);
    setMessage("New puzzle loaded!");
    setTimeout(() => setMessage(""), 2000);
  };

  const getHint = () => {
    const hintWords = [
      "Try words ending in -ING, -ED, or -ER",
      "Look for common prefixes like UN-, RE-, or IN-",
      "Think about plural forms (add -S)",
      "Consider past tense verbs",
      "Try compound words",
      "Look for words with double letters",
    ];

    const randomHint = hintWords[Math.floor(Math.random() * hintWords.length)];
    setMessage(`Hint: ${randomHint}`);
    setTimeout(() => setMessage(""), 4000);
  };

  const getRank = () => {
    const wordsFound = foundWords.length;
    if (wordsFound >= 20)
      return { rank: "Spelling Wizard", icon: "magic-staff", color: "#eab308" };
    if (wordsFound >= 15)
      return { rank: "Word Master", icon: "crown", color: "#a855f7" };
    if (wordsFound >= 10)
      return { rank: "Good Speller", icon: "star", color: "#3b82f6" };
    if (wordsFound >= 5)
      return {
        rank: "Getting Better",
        icon: "chart-line-variant",
        color: "#10b981",
      };
    return { rank: "Beginner", icon: "leaf", color: "#6b7280" };
  };

  const theme = {
    bg: isDarkMode ? "#000000" : "#ffffff",
    primary: isDarkMode ? "#85508a" : "#3b0940",
    accent: "#f12b15",
    success: "#28a745",
    text: isDarkMode ? "#ffffff" : "#000000",
    card: isDarkMode ? "#1a1a1a" : "#f8f9fa",
  };

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
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.primary }]}>
              {selectedWordMeaning?.word}
            </Text>
            <TouchableOpacity
              onPress={() => setShowMeaningModal(false)}
              style={[
                styles.closeButton,
                { backgroundColor: theme.primary + "20" },
              ]}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.text}
              />
            </TouchableOpacity>
          </View>
          {selectedWordMeaning && (
            <View>
              {selectedWordMeaning.partOfSpeech && (
                <Text style={[styles.partOfSpeech, { color: theme.primary }]}>
                  {selectedWordMeaning.partOfSpeech}
                </Text>
              )}
              <Text style={[styles.meaningText, { color: theme.text }]}>
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
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.primary }]}>
              How to Play
            </Text>
            <TouchableOpacity
              onPress={() => setShowRules(false)}
              style={[
                styles.closeButton,
                { backgroundColor: theme.primary + "20" },
              ]}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.text}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.rulesContainer}>
            <Text style={[styles.ruleText, { color: theme.text }]}>
              • Make words using the letters
            </Text>
            <Text style={[styles.ruleText, { color: theme.text }]}>
              • Words must be at least 4 letters long
            </Text>
            <Text style={[styles.ruleText, { color: theme.text }]}>
              • Every word must contain the center letter (red)
            </Text>
            <Text style={[styles.ruleText, { color: theme.text }]}>
              • Tap letters to build words, then submit!
            </Text>
            <Text style={[styles.ruleText, { color: theme.text }]}>
              • Score points based on word length
            </Text>
            <Text style={[styles.ruleText, { color: theme.text }]}>
              • Tap found words to see their meanings! 📚
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.mainGameContainer}>
        {/* Top Section: Controls, Stats, Found Words, Message */}
        <View style={[styles.topSectionFlex, { maxWidth: width }]}>
          <View style={styles.topControlsRow}>
            <TouchableOpacity
              onPress={getHint}
              style={[styles.iconButton, { backgroundColor: theme.card }]}
            >
              <MaterialCommunityIcons
                name="lightbulb-on-outline"
                size={28}
                color={theme.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={newGame}
              style={[styles.iconButton, { backgroundColor: theme.card }]}
            >
              <MaterialCommunityIcons
                name="dice-multiple-outline"
                size={28}
                color={theme.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowRules(true)}
              style={[styles.iconButton, { backgroundColor: theme.card }]}
            >
              <MaterialCommunityIcons
                name="information-outline"
                size={24}
                color={theme.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsDarkMode(!isDarkMode)}
              style={[styles.iconButton, { backgroundColor: theme.card }]}
            >
              <MaterialCommunityIcons
                name={
                  isDarkMode ? "white-balance-sunny" : "moon-waning-crescent"
                }
                size={24}
                color={theme.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.statsPanel, { backgroundColor: theme.card }]}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: theme.text }]}>
                  Score
                </Text>
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
                <Text style={[styles.statLabel, { color: theme.text }]}>
                  Words
                </Text>
                <Text style={[styles.statValue, { color: theme.primary }]}>
                  {foundWords.length}
                </Text>
              </View>
            </View>

            {foundWords.length > 0 && (
              <View
                style={[
                  styles.foundWordsSection,
                  { borderTopColor: theme.primary + "20" },
                ]}
              >
                <ScrollView
                  // horizontal prop removed to allow vertical scrolling
                  // showsHorizontalScrollIndicator prop removed
                  style={styles.wordsScrollView} // No maxHeight here
                >
                  <View style={styles.wordsContainer}>
                    {foundWords.map((wordData, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => showWordMeaning(wordData)}
                        style={[
                          styles.wordChip,
                          { backgroundColor: theme.primary },
                        ]}
                      >
                        <Text style={styles.wordChipText}>{wordData.word}</Text>
                        <MaterialCommunityIcons
                          name="book-open-variant"
                          size={12}
                          color="#ffffff"
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
            <View
              style={[styles.messagePanel, { backgroundColor: theme.accent }]}
            >
              <Text style={styles.messageText}>{message}</Text>
            </View>
          )}
        </View>

        {/* Middle Section: Current Word Display */}
        <View
          style={[styles.currentWordPanel, { backgroundColor: theme.card }]}
        >
          <Text style={[styles.currentWord, { color: theme.primary }]}>
            {currentWord || "Start spelling..."}
          </Text>
        </View>

        {/* Bottom Section: Hexagon Buttons and Action Buttons */}
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
                  backgroundColor={theme.card}
                  borderColor={theme.primary}
                  textColor={theme.text}
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
                    backgroundColor={isCenter ? theme.accent : theme.card}
                    borderColor={isCenter ? theme.accent : theme.primary}
                    textColor={isCenter ? "#fff" : theme.text}
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
                  backgroundColor={theme.card}
                  borderColor={theme.primary}
                  textColor={theme.text}
                />
              ))}
            </View>
          </View>

          <View
            style={[
              styles.separator,
              { backgroundColor: theme.primary + "30" },
            ]}
          />

          <View style={styles.submitButtonRow}>
            <TouchableOpacity
              onPress={deleteLetter}
              style={[
                styles.controlButton,
                styles.backspaceButtonWidth,
                { backgroundColor: theme.card, borderColor: theme.primary },
              ]}
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
                styles.controlButton,
                {
                  backgroundColor: showSuccessCheck
                    ? theme.success
                    : theme.primary,
                  borderColor: showSuccessCheck ? theme.success : theme.primary,
                  opacity: isValidating ? 0.5 : 1,
                  flex: 1,
                },
              ]}
            >
              {isValidating ? (
                <ActivityIndicator color="#ffffff" size="small" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainGameContainer: {
    flex: 1, // Make this container fill the entire screen
    padding: 12,
    justifyContent: "space-between", // Distribute space between its main sections
  },
  topSectionFlex: {
    flex: 1, // This will take up all available space, pushing down the elements below it
    alignSelf: "center", // Keep content centered if maxWidth is applied
    width: "100%",
    paddingBottom: 16, // Add some padding at the bottom to separate from currentWordPanel
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
    shadowColor: "#000",
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
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 10,
    opacity: 0.75,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  rankText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  foundWordsSection: {
    borderTopWidth: 1,
    paddingTop: 8,
    // No explicit height here; let it grow with content.
  },
  wordsScrollView: {
    // REMOVED maxHeight and horizontal. This ScrollView will now grow
    // as much as its content demands within its flex parent.
    // It will only scroll once its content overflows the 'topSectionFlex'.
  },
  wordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 4, // Spacing between individual word chips
    paddingHorizontal: 4,
  },
  wordChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4, // Spacing between rows of word chips
  },
  wordChipText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
  },
  bookIcon: {
    marginLeft: 4,
  },
  messagePanel: {
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: "auto", // Pushes the message to the bottom of topSectionFlex if content is small
    marginBottom: 16, // Space before the current word panel
  },
  currentWordPanel: {
    borderRadius: 12,
    padding: 12,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16, // Space before the bottom section (hexagon buttons)
  },
  currentWord: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  iconButton: {
    padding: 4,
    borderRadius: 8,
  },
  bottomSection: {
    width: "100%",
    paddingHorizontal: 12,
    alignItems: "center",
    // Its height is determined by its content
  },
  hexagonContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  hexagonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  backspaceButtonWidth: {
    width: "15%", // Adjust as needed
    borderWidth: 2,
    borderRadius: 30, // For a more rounded look
  },
  separator: {
    height: 1,
    width: "100%",
    marginBottom: 16,
  },
  submitButtonRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    gap: 8, // Space between backspace and check buttons
  },
  controlButton: {
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 350,
    shadowColor: "#000",
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
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
    borderRadius: 4,
  },
  rulesContainer: {
    gap: 12,
  },
  ruleText: {
    fontSize: 14,
  },
  partOfSpeech: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 8,
    textTransform: "capitalize",
  },
  meaningText: {
    fontSize: 16,
    lineHeight: 22,
  },
});

export default SpellingBeeGame;

import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

const WORD_CATEGORIES = {
  animals: {
    name: "🐾 Animals",
    words: [
      {
        word: "ELEPHANT",
        hint: "🐘 The largest land animal with a long trunk",
      },
      { word: "GIRAFFE", hint: "🦒 The tallest animal with a very long neck" },
      {
        word: "PENGUIN",
        hint: "🐧 A black and white bird that can't fly but swims",
      },
      {
        word: "BUTTERFLY",
        hint: "🦋 A colorful insect that flies from flower to flower",
      },
      {
        word: "DOLPHIN",
        hint: "🐬 A smart sea animal that loves to jump and play",
      },
      { word: "TIGER", hint: "🐅 A big orange cat with black stripes" },
    ],
  },
  food: {
    name: "🍎 Food",
    words: [
      { word: "PIZZA", hint: "🍕 Round bread with cheese and toppings" },
      { word: "SANDWICH", hint: "🥪 Food between two pieces of bread" },
      {
        word: "CHOCOLATE",
        hint: "🍫 Sweet brown treat that melts in your mouth",
      },
      { word: "BANANA", hint: "🍌 Yellow fruit that monkeys love to eat" },
      { word: "COOKIE", hint: "🍪 Sweet, round treat often eaten with milk" },
      {
        word: "POPCORN",
        hint: "🍿 Corn kernels that pop and become fluffy white snacks",
      },
    ],
  },
  school: {
    name: "📚 School",
    words: [
      { word: "TEACHER", hint: "👩‍🏫 Person who helps you learn new things" },
      { word: "PENCIL", hint: "✏️ Tool you use to write and draw" },
      {
        word: "LIBRARY",
        hint: "📚 Place full of books where you read quietly",
      },
      {
        word: "PLAYGROUND",
        hint: "🛝 Fun place outside where kids play and run",
      },
      { word: "BACKPACK", hint: "🎒 Bag you carry your school things in" },
      { word: "COMPUTER", hint: "💻 Electronic device for learning and games" },
    ],
  },
  nature: {
    name: "🌳 Nature",
    words: [
      { word: "RAINBOW", hint: "🌈 Colorful arc in the sky after rain" },
      {
        word: "MOUNTAIN",
        hint: "⛰️ Very tall rocky hill that touches the clouds",
      },
      { word: "FLOWER", hint: "🌸 Pretty, colorful plant that smells nice" },
      { word: "OCEAN", hint: "🌊 Huge body of salty water where fish live" },
      { word: "THUNDER", hint: "⛈️ Loud sound that comes after lightning" },
      {
        word: "BUTTERFLY",
        hint: "🦋 Flying insect with beautiful colored wings",
      },
    ],
  },
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const VocabBuilder = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentWord, setCurrentWord] = useState("");
  const [currentHint, setCurrentHint] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState("category-select");
  const [score, setScore] = useState(0);
  const [showMessage, setShowMessage] = useState("");
  const [usedWords, setUsedWords] = useState([]);

  const maxWrongGuesses = 6;

  const selectCategory = (categoryKey) => {
    setSelectedCategory(categoryKey);
    setUsedWords([]);
    startNewWord(categoryKey);
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

  const startNewWord = (categoryKey = selectedCategory) => {
    const category = WORD_CATEGORIES[categoryKey];
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
        .every((letter) => newGuessedLetters.includes(letter));

      if (isComplete) {
        setGameStatus("won");
        setScore(score + 1);
        setUsedWords([...usedWords, currentWord]);
        setShowMessage(`🎉 Correct! It was ${currentWord}!`);
      }
    }
  };

  const getDisplayWord = () => {
    return currentWord
      .split("")
      .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
      .join(" ");
  };

  const getRescueCharacter = () => {
    const progress = Math.max(0, maxWrongGuesses - wrongGuesses);
    const characters = ["😵", "😰", "😟", "😐", "🙂", "😊", "🤗"];
    return characters[progress] || "😵";
  };

  const renderCategorySelect = () => (
    <View style={styles.categorySelect}>
      <Text style={styles.categoryTitle}>Choose a Category!</Text>
      <View style={styles.categories}>
        {Object.entries(WORD_CATEGORIES).map(([key, category]) => (
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
              🧠 {WORD_CATEGORIES[selectedCategory]?.name}
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
              {WORD_CATEGORIES[selectedCategory]?.words.length || 0} words
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
              onPress={() => setGameStatus("category-select")}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
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
    color: "#3b0940",
    marginBottom: 5,
  },
  score: {
    fontSize: 15,
    color: "#3b0940",
    fontWeight: "600",
  },
  categorySelect: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  categoryTitle: {
    fontSize: 22,
    color: "#3b0940",
    fontWeight: "bold",
    marginBottom: 25,
  },
  categories: {
    width: "100%",
    gap: 15,
  },
  categoryBtn: {
    backgroundColor: "#3b0940",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  categoryBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  hintSection: {
    backgroundColor: "rgba(59, 9, 64, 0.05)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#3b0940",
  },
  hintLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 3,
    fontWeight: "600",
  },
  hintText: {
    fontSize: 15,
    color: "#3b0940",
    lineHeight: 20,
  },
  rescueSection: {
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#3b0940",
  },
  characterDisplay: {
    fontSize: 50,
    marginVertical: 5,
  },
  statusText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  wordDisplay: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3b0940",
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
    color: "#666",
    textAlign: "center",
  },
  changeCategoryBtnText: {
    fontSize: 16,
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
    backgroundColor: "#3b0940",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  letterBtnDisabled: {
    backgroundColor: "#e0e0e0",
  },
  letterBtnCorrect: {
    backgroundColor: "#4caf50",
  },
  letterBtnWrong: {
    backgroundColor: "#f12b15",
  },
  letterBtnText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  letterBtnTextDisabled: {
    color: "#999",
  },
  actionBtn: {
    backgroundColor: "#f12b15",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginVertical: 5,
    minWidth: 200,
    alignItems: "center",
    marginBottom: 10,
  },
  actionBtnText: {
    color: "white",
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
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderColor: "#4caf50",
  },
  messageLose: {
    backgroundColor: "rgba(241, 43, 21, 0.1)",
    borderColor: "#f12b15",
  },
  messageComplete: {
    backgroundColor: "rgba(59, 9, 64, 0.1)",
    borderColor: "#3b0940",
  },
  messageText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  messageTextWin: {
    color: "#4caf50",
  },
  messageTextLose: {
    color: "#f12b15",
  },
  messageTextComplete: {
    color: "#3b0940",
  },
});

export default VocabBuilder;

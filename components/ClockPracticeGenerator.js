import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import Svg, { Circle, Line, Text as SvgText } from "react-native-svg";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window"); // Get height for fixed positioning
const CLOCK_SIZE = Math.min(width * 0.8, 300);
const CENTER = CLOCK_SIZE / 2;
const BUTTON_AREA_HEIGHT = 100; // Approximate height for the fixed button area

const ClockPracticeGenerator = ({ navigation }) => {
  const [currentMode, setCurrentMode] = useState("basic");
  const [currentHours, setCurrentHours] = useState(3);
  const [currentMinutes, setCurrentMinutes] = useState(15);
  const [guessHours, setGuessHours] = useState("");
  const [guessMinutes, setGuessMinutes] = useState("");
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong'

  const modes = [
    { key: "basic", label: "Basic Time" },
    { key: "half", label: "Half Hours" },
    { key: "quarter", label: "Quarter Hours" },
    { key: "five", label: "5-Min Intervals" },
    { key: "any", label: "Any Time" },
  ];

  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      parent?.setOptions({ tabBarStyle: { display: "none" } });
      return () => parent?.setOptions({ tabBarStyle: undefined });
    }, [navigation])
  );

  useEffect(() => {
    generateRandomTime();
  }, [currentMode]);

  const generateRandomTime = () => {
    let hours, minutes;
    switch (currentMode) {
      case "basic":
        hours = Math.floor(Math.random() * 12) + 1;
        minutes = 0;
        break;
      case "half":
        hours = Math.floor(Math.random() * 12) + 1;
        minutes = Math.random() < 0.5 ? 0 : 30;
        break;
      case "quarter":
        hours = Math.floor(Math.random() * 12) + 1;
        minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
        break;
      case "five":
        hours = Math.floor(Math.random() * 12) + 1;
        minutes = Math.floor(Math.random() * 12) * 5;
        break;
      case "any":
      default:
        hours = Math.floor(Math.random() * 12) + 1;
        minutes = Math.floor(Math.random() * 60);
        break;
    }
    setCurrentHours(hours);
    setCurrentMinutes(minutes);
    setGuessHours("");
    setGuessMinutes("");
    setFeedback(null);
  };

  const checkAnswer = () => {
    const userHours = parseInt(guessHours);
    const userMinutes = parseInt(guessMinutes);

    if (
      isNaN(userHours) ||
      isNaN(userMinutes) ||
      userHours < 1 ||
      userHours > 12 ||
      userMinutes < 0 ||
      userMinutes > 59
    ) {
      Alert.alert(
        "Invalid Input",
        "Please enter valid time values (Hours: 1-12, Minutes: 0-59)"
      );
      return;
    }

    if (userHours === currentHours && userMinutes === currentMinutes) {
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
  };

  const minuteAngle = currentMinutes * 6;
  const hourAngle = (currentHours % 12) * 30 + currentMinutes * 0.5;

  const hourRadians = (hourAngle - 90) * (Math.PI / 180);
  const minuteRadians = (minuteAngle - 90) * (Math.PI / 180);

  const hourLength = CENTER * 0.5;
  const minuteLength = CENTER * 0.7;

  const hourX = CENTER + Math.cos(hourRadians) * hourLength;
  const hourY = CENTER + Math.sin(hourRadians) * hourLength;
  const minuteX = CENTER + Math.cos(minuteRadians) * minuteLength;
  const minuteY = CENTER + Math.sin(minuteRadians) * minuteLength;

  const renderClockNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const radius = CENTER * 0.8;
      const x = CENTER + Math.cos(angle) * radius;
      const y = CENTER + Math.sin(angle) * radius;
      numbers.push(
        <SvgText
          key={i}
          x={x}
          y={y + 6}
          fontSize="18"
          fontWeight="bold"
          fill="#333"
          textAnchor="middle"
        >
          {i}
        </SvgText>
      );
    }
    return numbers;
  };

  const renderTicks = (count, skip, innerRatio, outerRatio, color, width) => {
    const ticks = [];
    for (let i = 0; i < count; i++) {
      if (i % skip !== 0) continue;
      const angle = i * (360 / count) * (Math.PI / 180);
      const x1 = CENTER + Math.cos(angle) * CENTER * innerRatio;
      const y1 = CENTER + Math.sin(angle) * CENTER * innerRatio;
      const x2 = CENTER + Math.cos(angle) * CENTER * outerRatio;
      const y2 = CENTER + Math.sin(angle) * CENTER * outerRatio;
      ticks.push(
        <Line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth={width}
        />
      );
    }
    return ticks;
  };

  return (
    <View style={styles.fullScreenContainer}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.modeContainer}>
          {modes.map((mode) => (
            <TouchableOpacity
              key={mode.key}
              style={[
                styles.modeButton,
                currentMode === mode.key && styles.activeModeButton,
              ]}
              onPress={() => {
                setCurrentMode(mode.key);
              }}
            >
              <Text style={styles.modeButtonText}>{mode.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.clockContainer}>
          <Svg width={CLOCK_SIZE} height={CLOCK_SIZE}>
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={CENTER - 10}
              fill="white"
              stroke="#333"
              strokeWidth={8}
            />
            {renderTicks(12, 1, 0.9, 0.95, "#666", 3)}
            {renderClockNumbers()}
            <Line
              x1={CENTER}
              y1={CENTER}
              x2={hourX}
              y2={hourY}
              stroke="#333"
              strokeWidth={6}
              strokeLinecap="round"
            />
            <Line
              x1={CENTER}
              y1={CENTER}
              x2={minuteX}
              y2={minuteY}
              stroke="#333"
              strokeWidth={4}
              strokeLinecap="round"
            />
            <Circle cx={CENTER} cy={CENTER} r="6" fill="#333" />
          </Svg>
        </View>

        <Text style={styles.question}>What time is shown on the clock?</Text>

        <View style={styles.answerInputRow}>
          <View style={styles.inputGroup}>
            <TextInput
              style={[
                styles.input,
                feedback === "correct"
                  ? styles.correctBorder
                  : feedback === "wrong"
                  ? styles.wrongBorder
                  : null,
              ]}
              value={guessHours}
              onChangeText={setGuessHours}
              placeholder="HH"
              keyboardType="numeric"
              maxLength={2}
              editable={feedback === null}
            />
            {feedback && (
              <Text
                style={[
                  styles.icon,
                  feedback === "correct"
                    ? styles.correctText
                    : styles.wrongText,
                ]}
              >
                {feedback === "correct" ? "✓" : "✗"}
              </Text>
            )}
          </View>
          <Text style={{ fontSize: 24, marginHorizontal: 5, color: "#333" }}>
            :
          </Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={[
                styles.input,
                feedback === "correct"
                  ? styles.correctBorder
                  : feedback === "wrong"
                  ? styles.wrongBorder
                  : null,
              ]}
              value={guessMinutes}
              onChangeText={setGuessMinutes}
              placeholder="MM"
              keyboardType="numeric"
              maxLength={2}
              editable={feedback === null}
            />
            {feedback && (
              <Text
                style={[
                  styles.icon,
                  feedback === "correct"
                    ? styles.correctText
                    : styles.wrongText,
                ]}
              >
                {feedback === "correct" ? "✓" : "✗"}
              </Text>
            )}
          </View>
        </View>

        {feedback === "wrong" && (
          <Text style={styles.correctAnswer}>
            Correct Time:{" "}
            {`${currentHours}:${currentMinutes.toString().padStart(2, "0")}`}
          </Text>
        )}
      </ScrollView>

      {/* Fixed button container at the bottom */}
      <View style={styles.fixedButtonContainer}>
        {feedback === null ? (
          <TouchableOpacity style={styles.checkButton} onPress={checkAnswer}>
            <Text style={styles.buttonText}>Check</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={generateRandomTime}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1, // Take full height
    backgroundColor: "#f0f2f5",
  },
  scrollContentContainer: {
    padding: 20,
    alignItems: "center",
    paddingBottom: BUTTON_AREA_HEIGHT + 20, // Add padding to avoid content hiding behind fixed button
  },
  modeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  modeButton: {
    backgroundColor: "#6200EE",
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  activeModeButton: {
    backgroundColor: "#03DAC6",
    shadowOpacity: 0.2,
    elevation: 6,
  },
  modeButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
  clockContainer: {
    backgroundColor: "#ffffff",
    borderRadius: CLOCK_SIZE / 2,
    padding: 10,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  question: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  answerInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 22,
    width: 70,
    textAlign: "center",
    color: "#333",
    backgroundColor: "#fff",
    fontWeight: "bold",
  },
  correctBorder: {
    borderColor: "#4CAF50", // Green
  },
  wrongBorder: {
    borderColor: "#F44336", // Red
  },
  icon: {
    fontSize: 28,
    marginLeft: 10,
    marginRight: 5,
    fontWeight: "bold",
  },
  correctText: {
    color: "#4CAF50", // Green for checkmark
  },
  wrongText: {
    color: "#F44336", // Red for cross
  },
  correctAnswer: {
    fontSize: 17,
    color: "#D32F2F",
    marginTop: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  // Fixed button styles
  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f0f2f5", // Match background or use a distinct color
    paddingVertical: 15,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    // Add shadow for depth if desired
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8, // For Android shadow
  },
  checkButton: {
    backgroundColor: "#28A745",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "80%", // Make button wider
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "80%", // Make button wider
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});

export default ClockPracticeGenerator;

import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView, // Keep ScrollView for the main content
  Dimensions,
  Alert,
} from "react-native";
import Svg, { Circle, Line, Text as SvgText } from "react-native-svg";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext"; // Adjust path as needed based on your project structure

const { width } = Dimensions.get("window");
const CLOCK_SIZE = Math.min(width * 0.8, 300);
const CENTER = CLOCK_SIZE / 2;
const BUTTON_AREA_HEIGHT = 100; // Approximate height for the fixed button area

const ClockPracticeGenerator = ({ navigation }) => {
  const { theme, isDark } = useTheme(); // Use the theme hook
  // C for Colors, consistent with QuizScreen
  const C = theme.appColors || theme;

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
      if (parent) {
        parent.setOptions({ tabBarStyle: { display: "none" } });
      } else {
        try {
          navigation.setOptions({ tabBarStyle: { display: "none" } });
        } catch (err) {
          /*ignore*/
        }
      }
      return () => {
        if (parent) {
          parent.setOptions({
            tabBarStyle: {
              display: "flex",
              backgroundColor: C.tabBarBackground,
              borderTopColor: C.border,
            },
          });
        } else {
          try {
            navigation.setOptions({ tabBarStyle: { display: "flex" } });
          } catch (err) {
            /*ignore*/
          }
        }
      };
    }, [navigation, C.tabBarBackground, C.border])
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
    const numberColor = C.textPrimary; // Use theme color

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
          fill={numberColor}
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

  // Determine if the Check button should be disabled
  const isCheckButtonDisabled =
    guessHours.trim() === "" || guessMinutes.trim() === "";

  return (
    <View
      style={[styles.fullScreenContainer, { backgroundColor: C.background }]}
    >
      {/* Horizontal ScrollView for the mode buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.modeScrollContent}
      >
        <View style={styles.modeContainer}>
          {modes.map((mode) => (
            <TouchableOpacity
              key={mode.key}
              style={[
                styles.modeButton,
                currentMode === mode.key
                  ? { backgroundColor: C.accent } // Active mode button
                  : { backgroundColor: C.primary }, // Inactive mode button
              ]}
              onPress={() => {
                setCurrentMode(mode.key);
              }}
            >
              <Text style={[styles.modeButtonText, { color: C.buttonText }]}>
                {mode.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Main content ScrollView */}
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View
          style={[styles.clockContainer, { backgroundColor: C.cardBackground }]}
        >
          <Svg width={CLOCK_SIZE} height={CLOCK_SIZE}>
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={CENTER - 10}
              fill={C.cardBackground} // Clock face color
              stroke={C.primary} // Clock border color
              strokeWidth={8}
            />
            {/* Hour ticks - using C.buttonText for good contrast (white/light) */}
            {renderTicks(12, 1, 0.9, 0.95, C.buttonText, 3)}
            {/* Minute ticks - using C.buttonText (white/light) */}
            {renderTicks(60, 1, 0.93, 0.95, C.buttonText, 1)}
            {renderClockNumbers()}
            <Line
              x1={CENTER}
              y1={CENTER}
              x2={hourX}
              y2={hourY}
              stroke={C.primary} // Hour hand color
              strokeWidth={6}
              strokeLinecap="round"
            />
            <Line
              x1={CENTER}
              y1={CENTER}
              x2={minuteX}
              y2={minuteY}
              stroke={C.primary} // Minute hand color
              strokeWidth={4}
              strokeLinecap="round"
            />
            <Circle cx={CENTER} cy={CENTER} r="6" fill={C.textPrimary} />
            {/* Center dot */}
          </Svg>
        </View>

        {/* Correct Answer shown immediately below the clock if feedback is 'wrong' */}
        {feedback === "wrong" && (
          <Text style={[styles.correctAnswer, { color: C.warning }]}>
            Correct Time:
            {`${currentHours}:${currentMinutes.toString().padStart(2, "0")}`}
          </Text>
        )}

        {/* Spacer to push the question and input fields towards the bottom */}
        <View style={styles.spacer} />

        <Text style={[styles.question, { color: C.primary }]}>
          What time is shown on the clock?
        </Text>

        <View style={styles.answerInputRow}>
          <View style={styles.inputGroup}>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor:
                    feedback === "correct"
                      ? C.success
                      : feedback === "wrong"
                      ? C.warning
                      : C.border,
                  backgroundColor: C.inputBackground,
                  color: C.inputText,
                },
              ]}
              value={guessHours}
              onChangeText={setGuessHours}
              placeholder="HH"
              placeholderTextColor={C.placeholder}
              keyboardType="numeric"
              maxLength={2}
              editable={feedback === null}
            />
            {feedback && (
              <Text
                style={[
                  styles.icon,
                  feedback === "correct"
                    ? { color: C.success }
                    : { color: C.warning },
                ]}
              >
                {feedback === "correct" ? "✓" : "✗"}
              </Text>
            )}
          </View>
          <Text style={[styles.timeSeparator, { color: C.textPrimary }]}>
            :
          </Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor:
                    feedback === "correct"
                      ? C.success
                      : feedback === "wrong"
                      ? C.warning
                      : C.border,
                  backgroundColor: C.inputBackground,
                  color: C.inputText,
                },
              ]}
              value={guessMinutes}
              onChangeText={setGuessMinutes}
              placeholder="MM"
              placeholderTextColor={C.placeholder}
              keyboardType="numeric"
              maxLength={2}
              editable={feedback === null}
            />
            {feedback && (
              <Text
                style={[
                  styles.icon,
                  feedback === "correct"
                    ? { color: C.success }
                    : { color: C.warning },
                ]}
              >
                {feedback === "correct" ? "✓" : "✗"}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.fixedButtonContainer,
          { backgroundColor: C.background, borderTopColor: C.borderLight },
        ]}
      >
        {feedback === null ? (
          <TouchableOpacity
            style={[
              styles.checkButton,
              {
                backgroundColor: isCheckButtonDisabled
                  ? C.disabledBackground
                  : C.primary, // Check button is primary color when enabled
              },
            ]}
            onPress={checkAnswer}
            disabled={isCheckButtonDisabled} // Disable if no input
          >
            <Text style={[styles.buttonText, { color: C.textOnSuccess }]}>
              Check
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.nextButton,
              {
                backgroundColor: feedback === "correct" ? C.success : C.warning, // Next button color changes based on feedback
              },
            ]}
            onPress={generateRandomTime}
          >
            <Text style={[styles.buttonText, { color: C.buttonText }]}>
              Next
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
  },
  // New style for the horizontal ScrollView content
  modeScrollContent: {
    paddingHorizontal: 15, // Add some padding on the sides
    alignItems: "center", // Vertically center the buttons if they have different heights
    paddingVertical: 10, // Add some vertical padding above/below the buttons
    // Removed marginBottom as it will be handled by the outer ScrollView's padding
  },
  scrollContentContainer: {
    flexGrow: 1, // Allows content to grow and push elements to bottom
    padding: 20,
    alignItems: "center",
    paddingBottom: BUTTON_AREA_HEIGHT + 20, // Ensure content isn't hidden by the fixed button
  },
  spacer: {
    flex: 1, // This view will take up all available space and push elements below it down
  },
  modeContainer: {
    flexDirection: "row",
    // flexWrap: "wrap", // Removed: buttons will now flow horizontally
    justifyContent: "center",
    // marginBottom: 20, // Moved to modeScrollContent paddingVertical
  },
  modeButton: {
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
  modeButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  clockContainer: {
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
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 22,
    width: 70,
    textAlign: "center",
    fontWeight: "bold",
  },
  icon: {
    fontSize: 28,
    marginLeft: 10,
    marginRight: 5,
    fontWeight: "bold",
  },
  timeSeparator: {
    fontSize: 24,
    marginHorizontal: 5,
  },
  correctAnswer: {
    fontSize: 17,
    marginTop: 5,
    fontWeight: "600",
    textAlign: "center",
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 15,
    alignItems: "center",
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8,
  },
  checkButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
  },
  nextButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});

export default ClockPracticeGenerator;

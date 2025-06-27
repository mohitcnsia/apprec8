import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
} from "react-native";
import Svg, { Circle, Line, Text as SvgText } from "react-native-svg";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import InfoModal from "./common/InfoModal";

const { width, height } = Dimensions.get("window");
const isSmallScreen = height < 700;
const CLOCK_SIZE = Math.min(width * 0.8, isSmallScreen ? 250 : 300);
const CENTER = CLOCK_SIZE / 2;
const NUMPAD_HEIGHT = isSmallScreen ? 180 : 220;

const ClockPracticeGenerator = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const C = theme.appColors || theme;

  const [currentMode, setCurrentMode] = useState("basic");
  const [currentHours, setCurrentHours] = useState(3);
  const [currentMinutes, setCurrentMinutes] = useState(15);
  const [guessHours, setGuessHours] = useState("");
  const [guessMinutes, setGuessMinutes] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [focusedField, setFocusedField] = useState("hours");

  const hoursInputRef = useRef(null);
  const minutesInputRef = useRef(null);

  const modes = [
    { key: "basic", label: "Basic Time" },
    { key: "half", label: "Half Hours" },
    { key: "quarter", label: "Quarter Hours" },
    { key: "five", label: "5-Min Intervals" },
    { key: "any", label: "Any Time" },
  ];

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

  useEffect(() => {
    generateRandomTime();
  }, [currentMode]);

  // Auto-focus hours field when component mounts or resets
  useEffect(() => {
    if (feedback === null && hoursInputRef.current) {
      setTimeout(() => {
        hoursInputRef.current.focus();
        setFocusedField("hours");
      }, 100);
    }
  }, [feedback]);

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
    setFocusedField("hours");
  };

  const handleNumpadPress = (digit) => {
    if (feedback !== null) return;

    if (focusedField === "hours") {
      if (guessHours.length < 2) {
        const newHours = guessHours + digit;
        setGuessHours(newHours);

        // Auto-move to minutes field logic:
        // - If first digit is 2-9, auto-advance (since valid hours are only 2-9 for single digit)
        // - If first digit is 1, wait for second digit (could be 10, 11, or 12)
        // - Always auto-advance after 2 digits
        if (newHours.length === 1) {
          const firstDigit = parseInt(digit);
          if (firstDigit >= 2 && firstDigit <= 9) {
            // Single digit hours 2-9, auto-advance
            setFocusedField("minutes");
            if (minutesInputRef.current) {
              minutesInputRef.current.focus();
            }
          }
          // If first digit is 1, don't auto-advance (user might want 10, 11, or 12)
        } else if (newHours.length === 2) {
          // Two digits entered, always move to minutes
          setFocusedField("minutes");
          if (minutesInputRef.current) {
            minutesInputRef.current.focus();
          }
        }
      }
    } else if (focusedField === "minutes") {
      if (guessMinutes.length < 2) {
        setGuessMinutes(guessMinutes + digit);
      }
    }
  };

  const handleClear = () => {
    if (feedback !== null) return;

    if (focusedField === "hours") {
      setGuessHours("");
    } else if (focusedField === "minutes") {
      setGuessMinutes("");
      // If minutes field is cleared and becomes empty, move focus back to hours if hours is also empty
      if (guessHours === "") {
        setFocusedField("hours");
        if (hoursInputRef.current) {
          hoursInputRef.current.focus();
        }
      }
    }
  };

  const handleFieldFocus = (field) => {
    if (feedback !== null) return; // Don't allow focus changes after feedback is shown
    setFocusedField(field);
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
    const numberColor = C.textPrimary;

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
          fontSize={isSmallScreen ? "14" : "18"}
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

  const renderNumpad = () => {
    return (
      <View style={styles.numpadContainer}>
        <View style={styles.numpadGrid}>
          {/* First row: 1-6 */}
          <View style={styles.numpadRow}>
            {[1, 2, 3, 4, 5, 6].map((digit) => (
              <TouchableOpacity
                key={digit}
                style={[styles.numpadButton, { backgroundColor: C.primary }]}
                onPress={() => handleNumpadPress(digit.toString())}
              >
                <Text
                  style={[styles.numpadButtonText, { color: C.buttonText }]}
                >
                  {digit}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Second row: 7, 8, 9, 0, Clear, Check/Next */}
          <View style={styles.numpadRow}>
            {[7, 8, 9].map((digit) => (
              <TouchableOpacity
                key={digit}
                style={[styles.numpadButton, { backgroundColor: C.primary }]}
                onPress={() => handleNumpadPress(digit.toString())}
              >
                <Text
                  style={[styles.numpadButtonText, { color: C.buttonText }]}
                >
                  {digit}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Zero button */}
            <TouchableOpacity
              style={[styles.numpadButton, { backgroundColor: C.primary }]}
              onPress={() => handleNumpadPress("0")}
            >
              <Text style={[styles.numpadButtonText, { color: C.buttonText }]}>
                0
              </Text>
            </TouchableOpacity>

            {/* Clear button */}
            <TouchableOpacity
              style={[styles.numpadButton, { backgroundColor: C.warning }]}
              onPress={handleClear}
            >
              <Text style={[styles.numpadButtonText, { color: C.buttonText }]}>
                ⌫
              </Text>
            </TouchableOpacity>

            {/* Check/Next button */}
            <TouchableOpacity
              style={[
                styles.numpadButton,
                {
                  backgroundColor:
                    feedback === null
                      ? guessHours && guessMinutes
                        ? C.success
                        : C.disabledBackground
                      : feedback === "correct"
                      ? C.success
                      : C.warning,
                },
              ]}
              onPress={feedback === null ? checkAnswer : generateRandomTime}
              disabled={feedback === null && (!guessHours || !guessMinutes)}
            >
              <Text style={[styles.numpadButtonText, { color: C.buttonText }]}>
                {feedback === null ? "✓" : "→"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Mode buttons - horizontal scrollable */}
      <View style={styles.modeContainer}>
        {modes.map((mode) => (
          <TouchableOpacity
            key={mode.key}
            style={[
              styles.modeButton,
              currentMode === mode.key
                ? { backgroundColor: C.accent }
                : { backgroundColor: C.primary },
            ]}
            onPress={() => setCurrentMode(mode.key)}
          >
            <Text style={[styles.modeButtonText, { color: C.buttonText }]}>
              {mode.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Clock */}
      <View
        style={[styles.clockContainer, { backgroundColor: C.cardBackground }]}
      >
        <Svg width={CLOCK_SIZE} height={CLOCK_SIZE}>
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={CENTER - 10}
            fill={C.cardBackground}
            stroke={C.primary}
            strokeWidth={6}
          />
          {renderTicks(12, 1, 0.9, 0.95, C.buttonText, 3)}
          {renderTicks(60, 1, 0.93, 0.95, C.buttonText, 1)}
          {renderClockNumbers()}
          <Line
            x1={CENTER}
            y1={CENTER}
            x2={hourX}
            y2={hourY}
            stroke={C.primary}
            strokeWidth={5}
            strokeLinecap="round"
          />
          <Line
            x1={CENTER}
            y1={CENTER}
            x2={minuteX}
            y2={minuteY}
            stroke={C.primary}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <Circle cx={CENTER} cy={CENTER} r="4" fill={C.textPrimary} />
        </Svg>
      </View>

      {/* Question */}
      <Text style={[styles.question, { color: C.primary }]}>
        What time is shown on the clock?
      </Text>

      {/* Correct answer display */}
      {feedback === "wrong" && (
        <Text style={[styles.correctAnswer, { color: C.warning }]}>
          {" "}
          {`${currentHours}:${currentMinutes.toString().padStart(2, "0")}`}
        </Text>
      )}

      {/* Input fields */}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => handleFieldFocus("hours")}>
          <TextInput
            ref={hoursInputRef}
            style={[
              styles.input,
              focusedField === "hours" && styles.focusedInput,
              {
                borderColor: focusedField === "hours" ? C.accent : C.border,
                backgroundColor: C.inputBackground,
                color: C.inputText,
              },
            ]}
            value={guessHours}
            onChangeText={() => {}} // Disabled direct text input
            placeholder="HH"
            placeholderTextColor={C.placeholder}
            editable={false}
            showSoftInputOnFocus={false}
            onFocus={() => handleFieldFocus("hours")}
            pointerEvents="none"
          />
        </TouchableOpacity>

        <Text style={[styles.separator, { color: C.textPrimary }]}>:</Text>

        <View style={styles.minutesContainer}>
          <TouchableOpacity onPress={() => handleFieldFocus("minutes")}>
            <TextInput
              ref={minutesInputRef}
              style={[
                styles.input,
                focusedField === "minutes" && styles.focusedInput,
                {
                  borderColor: focusedField === "minutes" ? C.accent : C.border,
                  backgroundColor: C.inputBackground,
                  color: C.inputText,
                },
              ]}
              value={guessMinutes}
              onChangeText={() => {}} // Disabled direct text input
              placeholder="MM"
              placeholderTextColor={C.placeholder}
              editable={false}
              showSoftInputOnFocus={false}
              onFocus={() => handleFieldFocus("minutes")}
              pointerEvents="none"
            />
          </TouchableOpacity>

          {/* Single feedback icon after MM field */}
          {feedback && (
            <Text
              style={[
                styles.feedbackIcon,
                { color: feedback === "correct" ? C.success : C.warning },
              ]}
            >
              {feedback === "correct" ? "✓" : "✗"}
            </Text>
          )}
        </View>
      </View>

      {/* Custom Numpad */}
      {renderNumpad()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    justifyContent: "space-between",
  },
  modeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  modeButton: {
    paddingVertical: isSmallScreen ? 8 : 10,
    paddingHorizontal: isSmallScreen ? 12 : 15,
    margin: 3,
    borderRadius: 20,
  },
  modeButtonText: {
    fontSize: isSmallScreen ? 12 : 14,
    fontWeight: "600",
  },
  clockContainer: {
    alignSelf: "center",
    borderRadius: CLOCK_SIZE / 2,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  question: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  input: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: isSmallScreen ? 8 : 10,
    paddingHorizontal: 12,
    fontSize: isSmallScreen ? 18 : 20,
    width: isSmallScreen ? 50 : 60,
    textAlign: "center",
    fontWeight: "bold",
  },
  focusedInput: {
    borderWidth: 3,
  },
  separator: {
    fontSize: isSmallScreen ? 20 : 24,
    marginHorizontal: 8,
    fontWeight: "bold",
  },
  minutesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  feedbackIcon: {
    fontSize: isSmallScreen ? 20 : 24,
    marginLeft: 8,
    fontWeight: "bold",
  },
  correctAnswer: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 5,
  },
  numpadContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  numpadGrid: {
    width: "100%",
  },
  numpadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  numpadButton: {
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flex: 1,
    marginHorizontal: 4,
    height: isSmallScreen ? 45 : 55,
  },
  numpadButtonText: {
    fontWeight: "bold",
    fontSize: isSmallScreen ? 18 : 22,
  },
});

export default ClockPracticeGenerator;

// components/quiz/Apprec8ReaderV2.js
import React, { useMemo, useRef, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import MarkdownDisplay from "react-native-markdown-display";
import LottieView from "lottie-react-native";

/**
 * An enhanced component to display markdown explanations alongside an animated mascot.
 *
 * @param {object} props - The component props.
 * @param {string} props.explanation - The markdown string to display.
 * @param {boolean} [props.isCorrect] - Optional: Used to show a specific animation state. True for correct, false for incorrect.
 * @returns {React.ReactElement}
 */
const Apprec8ReaderV2 = ({ explanation, isCorrect }) => {
  const { theme } = useTheme();
  const C = theme.appColors || theme;
  const animationRef = useRef(null);

  // This effect will play the animation once whenever the component appears or the 'isCorrect' status changes.
  useEffect(() => {
    animationRef.current?.play();
  }, [isCorrect]);

  const markdownStyles = useMemo(
    () =>
      StyleSheet.create({
        body: { fontSize: 16, color: C.textPrimary, fontFamily: "nunito" },
        heading1: {
          fontSize: 22,
          color: C.primary,
          fontFamily: "nunitoBold",
          marginTop: 10,
          borderBottomWidth: 1,
          borderColor: C.border,
        },
      }),
    [C]
  );

  return (
    <View style={styles.container}>
      <View style={styles.mascotContainer}>
        {/* The LottieView for your mascot animation. */}
        <LottieView
          ref={animationRef}
          source={require("../../assets/animations/mascot.json")} // IMPORTANT: Change this to your mascot's animation file path.
          autoPlay={false} // We will control playback with the ref.
          loop={false}
          style={styles.lottie}
        />
      </View>
      <View style={styles.textContainer}>
        <MarkdownDisplay style={markdownStyles}>{explanation}</MarkdownDisplay>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    marginVertical: 10,
    flexDirection: "row", // Arrange mascot and text side-by-side
    alignItems: "flex-start",
  },
  mascotContainer: {
    width: 80, // Fixed width for the mascot
    height: 80,
    marginRight: 10,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    flex: 1, // The text takes up the remaining space
  },
});

export default Apprec8ReaderV2;

// components/thought/CalmThought.js (or similar path)

import React, { useEffect, useMemo } from "react"; // Import useMemo
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { useTheme } from "../../context/ThemeContext"; // Import useTheme hook

const { width, height } = Dimensions.get("window");

const CalmThought = ({ thought }) => {
  const { theme } = useTheme(); // Use the theme hook

  // --- Reanimated logic (remains the same) ---
  // Background animation
  const backgroundAnimation = useSharedValue(0);
  useEffect(() => {
    backgroundAnimation.value = withRepeat(
      withTiming(1, { duration: 6000 }),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Keep dependency array empty if it should only run once

  const animatedBackground = useAnimatedStyle(() => ({
    opacity: backgroundAnimation.value * 0.4 + 0.6, // Adjust opacity range as needed
  }));

  // Floating animation for text
  const floatingText = useSharedValue(0);
  useEffect(() => {
    floatingText.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 2000 }),
        withTiming(5, { duration: 2000 })
      ),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Keep dependency array empty if it should only run once

  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatingText.value }],
  }));
  // --- End Reanimated Logic ---

  // --- Define Styles Inside Component with useMemo ---
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: width * 0.9,
          minHeight: height * 0.3,
          padding: 20,
          borderRadius: 20,
          overflow: "hidden",
          alignSelf: "center",
          marginVertical: 15,
          elevation: 5, // Keep elevation or use themed shadow
          shadowColor: theme.shadowColor || "#000", // Optional: use themed shadow color
        },
        background: {
          ...StyleSheet.absoluteFillObject,
          borderRadius: 20, // Match container
        },
        title: {
          fontSize: 22,
          fontWeight: "bold",
          // Determine text color based on theme (assuming gradient is generally darkish)
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          textAlign: "center",
          marginBottom: 15,
          fontFamily: "Poppins-Bold", // Ensure this font is loaded
        },
        thoughtContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 10,
        },
        thought: {
          fontSize: 18,
          fontWeight: "bold",
          // Determine text color based on theme (assuming gradient is generally darkish)
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          textAlign: "center",
          paddingHorizontal: 15,
          lineHeight: 40,
          fontFamily: "Poppins-SemiBold", // Ensure this font is loaded
          // Adjust shadow to match text color
          textShadowColor:
            (theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF") +
            "80", // Add alpha to text color
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 10,
          flexWrap: "wrap",
        },
      }),
    [theme]
  ); // Depend on theme

  // --- Render Logic ---
  return (
    // Apply opacity animation to the container
    <Animated.View style={[styles.container, animatedBackground]}>
      {/* Apply themed gradient */}
      <LinearGradient
        // Use theme gradient colors (ensure these keys exist in your theme objects)
        colors={[
          theme.gradientStart || "#3b0940",
          theme.gradientEnd || "#d7d1d3",
        ]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {/* Title text uses themed style */}
      <Text style={styles.title}>✨ Thought of the Day ✨</Text>
      {/* Apply floating animation to the thought container */}
      <Animated.View style={[styles.thoughtContainer, animatedTextStyle]}>
        {/* Thought text uses themed style */}
        <Text
          style={styles.thought}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
        >
          {thought}
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

export default CalmThought;

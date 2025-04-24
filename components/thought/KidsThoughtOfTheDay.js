// components/thought/KidsThoughtOfTheDay.js (or similar path)

import React, { useEffect, useMemo } from "react"; // Import useMemo
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
// import { Colors } from "../../config/colors"; // Remove legacy Colors import
import { useTheme } from "../../context/ThemeContext"; // Import useTheme hook

const { width } = Dimensions.get("window");

const KidsThoughtOfTheDay = ({ thought }) => {
  const { theme } = useTheme(); // Use the theme hook

  // --- Reanimated logic (remains the same) ---
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Keep dependency array empty

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value * 0.4 + 0.6, // Light shimmer effect
  }));
  // --- End Reanimated Logic ---

  // --- Define Styles Inside Component with useMemo ---
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: width * 0.9,
          padding: 20,
          borderRadius: 15,
          overflow: "hidden",
          alignSelf: "center",
          marginVertical: 15,
          elevation: 5, // Keep elevation or use themed shadow
          shadowColor: theme.shadowColor || "#000", // Optional: use themed shadow color
        },
        background: {
          ...StyleSheet.absoluteFillObject,
          borderRadius: 15, // Match container
        },
        title: {
          fontSize: 22,
          fontWeight: "bold",
          // Use themed text color suitable for gradient background
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          textAlign: "center",
          marginBottom: 10,
          fontFamily: "delius", // Ensure this font is loaded
        },
        thoughtContainer: {
          flexDirection: "row", // Lays words out left-to-right
          flexWrap: "wrap", // Allows words to move to the next line
          justifyContent: "center", // Centers the words/tiles horizontally
          alignItems: "center", // Aligns words vertically if they wrap
        },
        word: {
          fontSize: 20,
          fontWeight: "600",
          marginHorizontal: 4, // Provides space BETWEEN tiles
          marginVertical: 3, // Provides space BETWEEN rows of tiles
          color: theme.textOnSecondary || theme.primaryWhite || "#FFFFFF", // Text color
          // Background color for the tile effect:
          backgroundColor:
            theme.wordBackground || theme.primary + "40" || "rgba(0,0,0,0.2)",
          paddingVertical: 4, // Space INSIDE the tile (top/bottom)
          paddingHorizontal: 8, // Space INSIDE the tile (left/right)
          borderRadius: 5, // Rounds the corners of the tile
          fontFamily: "delius",
        },
      }),
    [theme]
  ); // Depend on theme

  // --- Render Logic ---
  // Add a check for the thought prop
  if (!thought || typeof thought !== "string") {
    // Optionally render nothing or a placeholder if thought is invalid
    return null;
    // Or: return <View style={styles.container}><Text>Loading thought...</Text></View>;
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Apply themed gradient */}
      <LinearGradient
        // Use theme gradient colors
        colors={[
          theme.gradientStart || "#3b0940",
          theme.gradientEnd || "#d7d1d3",
        ]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {/* Title uses themed style */}
      <Text style={styles.title}>✨ Thought of the Day ✨</Text>
      {/* Word container */}
      <View style={styles.thoughtContainer}>
        {/* Map over words, applying themed style */}
        {thought.split(" ").map((word, index) =>
          // Added check for empty strings from multiple spaces
          word ? (
            <Text key={`${word}-${index}`} style={styles.word}>
              {word}
            </Text>
          ) : null
        )}
      </View>
    </Animated.View>
  );
};

export default KidsThoughtOfTheDay;

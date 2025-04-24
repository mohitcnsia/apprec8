// components/PrimaryButton.js (or similar path)

import React, { useMemo } from "react"; // Import useMemo
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext"; // Import useTheme hook

function PrimaryButton({ children, onPress, style }) {
  // Added style prop
  const { theme } = useTheme(); // Use the theme hook

  // Define styles inside useMemo, depending on theme
  const styles = useMemo(
    () =>
      StyleSheet.create({
        buttonOuterContainer: {
          borderRadius: 28,
          margin: 4,
          overflow: "hidden", // Important for ripple and borderRadius
        },
        buttonInnerContainer: {
          // Use themed background color (e.g., theme.primary or theme.accent)
          backgroundColor: theme.primary || "#72063c", // Fallback to original color
          paddingVertical: 8,
          paddingHorizontal: 16,
          elevation: 2, // Keep elevation for Android shadow
          // Optional: Add iOS shadow based on theme
          shadowColor: theme.shadowColor,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.25,
          shadowRadius: 2,
        },
        buttonText: {
          // Use themed text color (should contrast with button background)
          color: theme.textOnPrimary || theme.primaryWhite || "white", // Fallback to white
          textAlign: "center",
          fontFamily: "delius", // Keep font
          fontWeight: "bold",
        },
        pressed: {
          // iOS pressed feedback
          opacity: 0.75,
        },
      }),
    [theme]
  ); // Depend on theme

  // Calculate ripple color based on theme
  const rippleColor =
    theme.rippleOnPrimary || (theme.primary ? theme.primary + "99" : "#640233"); // Example: use primary with alpha or a specific key

  return (
    // Allow passing external styles to the outer container
    <View style={[styles.buttonOuterContainer, style]}>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [styles.buttonInnerContainer, styles.pressed] // Apply pressed style for iOS
            : styles.buttonInnerContainer
        }
        onPress={onPress}
        android_ripple={{ color: rippleColor }} // Use themed ripple color
      >
        <Text style={styles.buttonText}>{children}</Text>
      </Pressable>
    </View>
  );
}

export default PrimaryButton;

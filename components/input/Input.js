// components/input/Input.js

import { StyleSheet, Text, View, TextInput } from "react-native"; // Import TextInput directly
import React, { useMemo } from "react";
// import { Colors } from "../../config/colors"; // Remove legacy Colors import
import { useTheme } from "../../context/ThemeContext"; // Import useTheme hook

const Input = ({ label, value, onChangeText, style, textInputConfig }) => {
  const { theme } = useTheme(); // Use theme hook

  // Define styles inside useMemo
  const styles = useMemo(
    () =>
      StyleSheet.create({
        inputContainer: {
          marginHorizontal: 10, // Keep margins or adjust as needed
          marginVertical: 10,
        },
        label: {
          // Use standard secondary text color for labels
          color: theme.textSecondary || "#555555",
          fontFamily: "delius", // Keep font
          fontSize: 16,
          marginBottom: 5,
        },
        input: {
          // Use themed background and text colors
          backgroundColor: theme.inputBackground || "#FFFFFF",
          color: theme.inputText || "#000000",
          paddingHorizontal: 10, // Adjust padding
          paddingVertical: 8, // Adjust padding
          borderRadius: 6,
          fontSize: 16, // Adjusted font size slightly
          borderWidth: 1, // Add border for visibility
          borderColor: theme.border || "#cccccc", // Use themed border color
        },
        inputMultiline: {
          minHeight: 100, // Adjusted minHeight
          textAlignVertical: "top",
        },
      }),
    [theme]
  ); // Depend on theme

  // Apply multiline style conditionally
  const inputStyles = [styles.input];
  if (textInputConfig && textInputConfig.multiline) {
    inputStyles.push(styles.inputMultiline);
  }

  return (
    // Allow external container style override
    <View style={[styles.inputContainer, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={inputStyles}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={theme.placeholder || "#999999"} // Theme placeholder text color
        {...textInputConfig} // Spread other TextInput props
      />
    </View>
  );
};

export default Input;

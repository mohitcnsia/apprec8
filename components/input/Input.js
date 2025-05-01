// components/input/Input.js

import { StyleSheet, Text, View, TextInput } from "react-native";
import React, { useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";

// Add isInvalid prop (defaults to false)
const Input = ({
  label,
  value,
  onChangeText,
  style,
  textInputConfig,
  isInvalid = false,
}) => {
  const { theme } = useTheme();

  // Define styles inside useMemo, now also depending on isInvalid
  const styles = useMemo(
    () =>
      StyleSheet.create({
        inputContainer: {
          marginHorizontal: 10,
          marginVertical: 10,
        },
        label: {
          // Conditionally change label color if invalid
          color: isInvalid ? theme.warning : theme.textSecondary || "#555555",
          fontFamily: "delius",
          fontSize: 16,
          marginBottom: 5,
        },
        input: {
          backgroundColor: theme.inputBackground || "#FFFFFF",
          color: theme.inputText || "#000000",
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderRadius: 6,
          fontSize: 16,
          borderWidth: 1,
          // Conditionally change border color if invalid
          borderColor: isInvalid ? theme.warning : theme.border || "#cccccc",
        },
        inputMultiline: {
          minHeight: 100,
          textAlignVertical: "top",
        },
        // Optional: Style for error text below input
        errorText: {
          color: theme.warning,
          fontSize: 12,
          marginTop: 4,
          marginLeft: 2, // Align slightly with input padding
        },
      }),
    [theme, isInvalid]
  ); // Add isInvalid dependency

  // Apply multiline style conditionally
  const inputStyles = [styles.input];
  if (textInputConfig && textInputConfig.multiline) {
    inputStyles.push(styles.inputMultiline);
  }

  return (
    <View style={[styles.inputContainer, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={inputStyles}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={theme.placeholder || "#999999"}
        {...textInputConfig}
      />
      {/* Optional: Conditionally render an error message */}
      {/* {isInvalid && <Text style={styles.errorText}>This field is required.</Text>} */}
    </View>
  );
};

export default Input;

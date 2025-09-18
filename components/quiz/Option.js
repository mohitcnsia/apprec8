// components/quiz/Option.js
import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
// Assuming this path is correct for your project structure
import { useTheme } from "../../context/ThemeContext";

/**
 * A reusable component to display a single quiz answer option. It now supports
 * rendering image options with a text caption underneath.
 *
 * @param {object} props - The component props.
 * @param {object} props.option - The option object, e.g., `{ type, content, mediaUrl, isCorrect }`.
 * @param {function} props.onPress - The function to call when the option is pressed.
 * @param {boolean} props.isSelected - Whether this option is the one currently selected by the user.
 * @param {boolean} props.showFeedback - True if the component should display feedback styles (correct/incorrect).
 * @param {boolean} props.isCorrect - Whether this option is the correct answer for the question.
 * @returns {React.ReactElement} A pressable, styled option view.
 */
const Option = ({ option, onPress, isSelected, showFeedback, isCorrect }) => {
  const { theme } = useTheme();
  const C = theme.appColors || theme;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        touchable: { marginVertical: 8 },
        viewBase: {
          borderWidth: 2,
          borderRadius: 25,
          padding: 12, // Use consistent padding for both types
          justifyContent: "center",
          alignItems: "center",
          minHeight: 50,
          overflow: "hidden", // Ensures image corners are rounded
        },
        textBase: {
          fontSize: 16,
          fontFamily: "nunitoBold",
          textAlign: "center",
        },
        // --- CHANGE 1: Renamed style and adjusted margin ---
        image: {
          width: "100%",
          height: 100,
          borderRadius: 15,
          marginBottom: 8, // Space between image and caption
        },
        // --- (The rest of your dynamic styles remain the same) ---
        optionViewDefault: {
          borderColor: C.primary,
          backgroundColor: C.cardBackground,
        },
        optionTextDefault: { color: C.textPrimary },
        optionViewSelected: {
          borderColor: C.primary,
          backgroundColor: C.primary,
        },
        optionTextSelected: { color: C.textOnPrimary || "#FFFFFF" },
        optionViewCorrect: {
          borderColor: C.success,
          backgroundColor: C.success,
        },
        optionViewIncorrect: {
          borderColor: C.warning,
          backgroundColor: C.warning,
        },
        optionTextFeedback: { color: C.textOnPrimary || "#FFFFFF" },
        optionViewDisabled: {
          borderColor: C.disabledBorder || C.border,
          backgroundColor: C.disabledBackground || C.placeholder,
          opacity: 0.6,
        },
        optionTextDisabled: { color: C.textDisabled || C.textSecondary },
      }),
    [C]
  );

  const getStyle = () => {
    if (showFeedback) {
      if (isCorrect)
        return {
          view: styles.optionViewCorrect,
          text: styles.optionTextFeedback,
        };
      if (isSelected && !isCorrect)
        return {
          view: styles.optionViewIncorrect,
          text: styles.optionTextFeedback,
        };
      return {
        view: styles.optionViewDisabled,
        text: styles.optionTextDisabled,
      };
    }
    if (isSelected)
      return {
        view: styles.optionViewSelected,
        text: styles.optionTextSelected,
      };
    return { view: styles.optionViewDefault, text: styles.optionTextDefault };
  };

  const { view: viewStyle, text: textStyle } = getStyle();

  // It's safer to provide a fallback to prevent crashes
  const optionType = option?.type || "text";
  const optionContent = option?.content || "";

  return (
    <TouchableOpacity
      style={styles.touchable}
      onPress={onPress}
      disabled={showFeedback}
      activeOpacity={0.7}
    >
      <View style={[styles.viewBase, viewStyle]}>
        {/* --- CHANGE 2: Updated rendering logic --- */}
        {optionType === "image" && option.mediaUrl ? (
          // If the option is an image, render both the Image and Text
          <>
            <Image
              source={{ uri: option.mediaUrl }}
              style={styles.image}
              resizeMode="contain"
            />
            {/* Also render the text, applying the dynamic text style */}
            <Text style={[styles.textBase, textStyle]}>{optionContent}</Text>
          </>
        ) : (
          // Otherwise, just render the text as before
          <Text style={[styles.textBase, textStyle]}>{optionContent}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Option;

// components/quiz/Option.js
import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useTheme } from "../../context/ThemeContext";

/**
 * A reusable component to display a single quiz answer option. It handles various
 * visual states (default, selected, correct, incorrect) and can render different
 * types of content like text or images.
 *
 * @param {object} props - The component props.
 * @param {object} props.option - The option object from the question, e.g., `{ type: 'text', content: 'Mars', isCorrect: true }`.
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
          paddingHorizontal: 15,
          justifyContent: "center",
          alignItems: "center",
          minHeight: 50,
          paddingVertical: 12,
          overflow: "hidden",
        },
        textBase: {
          fontSize: 16,
          fontFamily: "nunitoBold",
          textAlign: "center",
        },
        imageContent: { width: "100%", height: 100, borderRadius: 15 },
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

  return (
    <TouchableOpacity
      style={styles.touchable}
      onPress={onPress}
      disabled={showFeedback}
      activeOpacity={0.7}
    >
      <View style={[styles.viewBase, viewStyle]}>
        {option.type === "image" ? (
          <Image
            source={{ uri: option.content }}
            style={styles.imageContent}
            resizeMode="contain"
          />
        ) : (
          <Text style={[styles.textBase, textStyle]}>{option.content}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Option;

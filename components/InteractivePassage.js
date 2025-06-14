import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

/**
 * Renders a passage of text with interactive (tappable) words.
 * Applies styles based on selection state and feedback after submission.
 */
const InteractivePassage = ({
  passageUnits,
  selectedInstanceIds,
  feedbackMap,
  isSubmitted,
  onWordTap,
  theme, // Assuming theme object is passed for styling
}) => {
  const isDark = theme.mode === "dark"; // Extract isDark from theme

  const styles = useMemo(
    () =>
      StyleSheet.create({
        passageContainer: {
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "flex-start",
          paddingHorizontal: 10,
          paddingVertical: 5,
        },
        unitContainer: {
          marginEnd: 2,
          marginBottom: 4,
        },
        textUnit: {
          fontSize: 18,
          lineHeight: 28,
          color: theme.textPrimary || "#000000",
          fontFamily: "delius",
        },
        wordTextTappable: {},
        selected: {
          // Styles for a word when it is selected (before submission).
          // Background color: Use explicit hex for dark theme, primary maroon for light theme
          backgroundColor: isDark ? "#f5d2f8" : theme.primary, // This is primaryMaroon10 for dark.
          // Text color: black for dark theme selection, white for light theme selection
          color: isDark ? "#000000" : theme.textOnPrimary, // Explicit black for dark theme selection.
          borderRadius: 5,
          paddingHorizontal: 2,
          paddingVertical: 1,
          borderWidth: 1, // Added border
          borderColor: isDark ? theme.borderLight : theme.border, // Border color based on theme
        },
        correct: {
          backgroundColor: theme.success + "20",
          color: theme.success,
          borderRadius: 5,
          paddingHorizontal: 2,
          paddingVertical: 1,
        },
        incorrect: {
          backgroundColor: theme.warning + "20",
          color: theme.warning,
          borderRadius: 5,
          textDecorationLine: "line-through",
          paddingHorizontal: 2,
          paddingVertical: 1,
        },
        missed: {
          backgroundColor: "#FFEB3B", // Bright yellow for missed
          color: "#333333", // Dark gray text for missed
          borderRadius: 5,
          paddingHorizontal: 2,
          paddingVertical: 1,
        },
      }),
    [theme, isDark] // Added isDark to dependencies for styles
  );

  // Debugging logs for selected word colors (component-level, reflects styles.selected)
  console.log("DEBUG InteractivePassage (component-level) - isDark:", isDark);
  console.log(
    "DEBUG InteractivePassage (component-level) - selected.backgroundColor:",
    styles.selected.backgroundColor
  );
  console.log(
    "DEBUG InteractivePassage (component-level) - selected.color (text color):",
    styles.selected.color
  );
  console.log(
    "DEBUG InteractivePassage (component-level) - selected.borderColor:",
    styles.selected.borderColor
  );

  return (
    <View style={styles.passageContainer}>
      {passageUnits.map((unit) => {
        if (unit.isWord) {
          let currentWordPressableStyle = [styles.unitContainer];
          let currentWordTextStyle = [styles.textUnit, styles.wordTextTappable];
          const isSelected = selectedInstanceIds.has(unit.id);

          if (isSubmitted && feedbackMap && feedbackMap.has(unit.id)) {
            const feedbackType = feedbackMap.get(unit.id);
            if (feedbackType === "correct") {
              currentWordPressableStyle.push(styles.correct);
              currentWordTextStyle.push({ color: styles.correct.color });
            } else if (feedbackType === "incorrect") {
              currentWordPressableStyle.push(styles.incorrect);
              currentWordTextStyle.push({ color: styles.incorrect.color });
            } else if (feedbackType === "missed") {
              currentWordPressableStyle.push(styles.missed);
              currentWordTextStyle.push({ color: styles.missed.color });
            }
          } else if (!isSubmitted && isSelected) {
            currentWordPressableStyle.push(styles.selected);
            // NEW LOG: Log the color being applied right before pushing
            console.log(
              "Applying selected text color to unit:",
              unit.id,
              "color:",
              styles.selected.color
            );
            currentWordTextStyle.push({ color: styles.selected.color }); // Apply selected text color here
          }

          return (
            <Pressable
              key={unit.id}
              onPress={() => !isSubmitted && onWordTap(unit.id)}
              style={currentWordPressableStyle}
              disabled={isSubmitted}
              accessibilityLabel={unit.originalText}
              accessibilityRole="button"
              accessibilityState={{
                selected: isSelected,
                disabled: isSubmitted,
              }}
            >
              <Text style={currentWordTextStyle}>{unit.originalText}</Text>
            </Pressable>
          );
        } else {
          return (
            <Text key={unit.id} style={styles.textUnit}>
              {unit.originalText}
            </Text>
          );
        }
      })}
    </View>
  );
};

export default React.memo(InteractivePassage);

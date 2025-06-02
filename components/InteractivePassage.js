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
  const styles = useMemo(
    () =>
      StyleSheet.create({
        passageContainer: {
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "flex-start", // Align items at the start of the line
          paddingHorizontal: 10, // Example padding
          paddingVertical: 5,
        },
        unitContainer: {
          // For Pressable words, to handle background and potential borders
          // For non-words, Text component will be styled directly if needed
          marginEnd: 2, // Small space after each word/punctuation before a space unit
          marginBottom: 4, // Space below each line-wrapped unit
        },
        textUnit: {
          fontSize: 18, // Default text size
          lineHeight: 28, // For better readability and tap area
          color: theme.textPrimary || "#000000", // Default text color
          fontFamily: "delius", // Example from your project
        },
        wordTextTappable: {
          // Specific styles for tappable text if different from non-tappable
        },
        // --- Selection State (Before Submission) ---
        selected: {
          backgroundColor: theme.accentTranslucent || "rgba(0, 122, 255, 0.2)", // Example selection color
          borderRadius: 5,
          paddingHorizontal: 2, // Slight padding for selected background
          paddingVertical: 1,
        },
        // --- Feedback States (After Submission) ---
        correct: {
          backgroundColor: theme.successLight || "rgba(40, 167, 69, 0.2)",
          color: theme.successDark || "#155724", // Text color for correct items
          borderRadius: 5,
          paddingHorizontal: 2,
          paddingVertical: 1,
          // fontWeight: 'bold', // Optional: make correct words bold
        },
        incorrect: {
          backgroundColor: theme.errorLight || "rgba(220, 53, 69, 0.2)",
          color: theme.errorDark || "#721c24", // Text color for incorrect items
          borderRadius: 5,
          textDecorationLine: "line-through", // Strikethrough for incorrect
          paddingHorizontal: 2,
          paddingVertical: 1,
        },
        missed: {
          // For words that should have been selected but weren't
          // Option 1: Border
          // borderColor: theme.warning || 'orange',
          // borderWidth: 1,
          // borderRadius: 5,
          // Option 2: Underline or different text color
          color: theme.warningDark || "#856404",
          textDecorationLine: "underline",
          textDecorationStyle: "dotted",
          paddingHorizontal: 2, // Keep consistent if using padding
          paddingVertical: 1,
        },
        // 'neutral' feedback (correctly ignored non-target words) will just use default textUnit style
      }),
    [theme]
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
              currentWordPressableStyle.push(styles.correct); // Apply to Pressable for background
              // currentWordTextStyle.push(styles.correct); // Or apply to Text for text color if different
            } else if (feedbackType === "incorrect") {
              currentWordPressableStyle.push(styles.incorrect);
              // currentWordTextStyle.push(styles.incorrect);
            } else if (feedbackType === "missed") {
              // For 'missed', we might style the text directly if it's not a background change
              // Or style the Pressable if it should have a distinct background/border
              currentWordPressableStyle.push(styles.missed); // If missed has a background/border
              // currentWordTextStyle.push(styles.missed); // If missed primarily changes text color/decoration
            }
            // 'neutral' feedback uses default styles
          } else if (!isSubmitted && isSelected) {
            currentWordPressableStyle.push(styles.selected);
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
          // For spaces and punctuation
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

// Memoize the component if its props are complex and don't change often unless necessary
// This can prevent re-renders if the parent component re-renders for other reasons.
export default React.memo(InteractivePassage);

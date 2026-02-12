import React, { useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Button as PaperButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

// Import your custom components
import Apprec8ReaderV2 from "../../components/quiz/Apprec8ReaderV2";

/**
 * A dedicated screen to display the explanation for a quiz question.
 *
 * @param {object} props
 * @param {object} props.route - React Navigation route object, contains the explanation data.
 * @param {object} props.navigation - React Navigation navigation object.
 * @returns {React.ReactElement}
 */
const ExplanationScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const C = theme.appColors || theme;

  // Get the data passed from the QuizScreenV2
  const { explanation, isCorrect, isLastQuestion, onNext } = route.params;

  const handlePress = () => {
    // 1. Tell the quiz engine to move to the next state
    if (onNext) onNext();

    // 2. Close the explanation screen
    navigation.goBack();
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1 },
        scrollContainer: {
          flexGrow: 1,
          padding: 15,
          paddingTop: 60,
          justifyContent: "space-between",
        },
        button: { borderRadius: 25, paddingVertical: 8, marginTop: 20 },
      }),
    [C],
  );

  return (
    <LinearGradient
      colors={[C.gradientStart, C.gradientEnd]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Main content area for the explanation */}
        <View>
          <Apprec8ReaderV2 explanation={explanation} isCorrect={isCorrect} />
        </View>

        {/* Button at the bottom */}
        <View>
          <PaperButton
            mode="contained"
            style={styles.button}
            onPress={handlePress}
          >
            {isLastQuestion ? "Finish Quiz" : "Next Question"}
          </PaperButton>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ExplanationScreen;

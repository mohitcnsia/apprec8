import React, { useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Button as PaperButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Import your custom components
import Apprec8ReaderV2 from "../../components/quiz/Apprec8ReaderV2";
import FeedbackFAB from "../../components/common/FeedbackFAB";

/**
 * A dedicated screen to display the explanation for a quiz question.
 *
 * @param {object} props
 * @param {object} props.route - React Navigation route object, contains the explanation data.
 * @param {object} props.navigation - React Navigation navigation object.
 * @returns {React.ReactElement}
 */
const ExplanationScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const C = theme.appColors || theme;

  // Get the data passed from the QuizScreenV2
  const { explanation, isCorrect, isLastQuestion, onNext, quizId, questionId } = route.params;

  const contentContext = {
    type: "question",
    id: questionId,
    parentId: quizId,
  };

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
          paddingTop: Math.max(insets.top, 20) + 50, // Added 50 to clear the top FAB
          paddingBottom: Math.max(15, insets.bottom),
          justifyContent: "space-between",
        },
        button: { borderRadius: 25, paddingVertical: 8, marginTop: 20 },
      }),
    [C, insets.bottom],
  );

  const fabExtraActions = useMemo(() => [
    {
      icon: "close",
      label: "Exit Quiz",
      onPress: () => navigation.navigate("QuestMap"),
      color: "white",
      style: { backgroundColor: "#FF4B4B" },
      small: false,
    },
    {
      icon: "home",
      label: "Home",
      onPress: () => navigation.navigate("Apprec8"),
      color: "white",
      style: { backgroundColor: C.accent || "#1CB0F6" },
      small: false,
    },
  ], [navigation, C.accent]);

  return (
    <LinearGradient
      colors={[C.gradientStart, C.gradientEnd]}
      style={styles.container}
    >
      <FeedbackFAB 
        contentContext={contentContext} 
        style={{ position: 'absolute', top: Math.max(insets.top, 20) + 5, right: 10, bottom: undefined, zIndex: 10 }} 
        customIcon="menu"
        extraActions={fabExtraActions}
        customFabStyle={{ 
          width: 44, 
          height: 44, 
          borderRadius: 22, 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: "#FF9600" // Fun orange background
        }}
      />

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

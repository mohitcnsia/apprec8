// screens/quiz/ExplanationScreen.js
import React, { useMemo } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const { isDark, theme } = useTheme();
  const P = quizPalette(isDark);
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
        container: {
          flex: 1,
          backgroundColor: P.background,
        },
        scrollContainer: {
          flexGrow: 1,
          padding: 20,
          paddingTop: Math.max(insets.top, 20) + 50, // Clears the top FAB
          paddingBottom: Math.max(20, insets.bottom + 14),
          justifyContent: "space-between",
        },
        button: {
          height: 58,
          borderRadius: 18,
          borderBottomWidth: 5,
          backgroundColor: P.primary,
          borderBottomColor: P.primaryShadow,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        },
        buttonText: {
          color: P.onPrimary || "#FFFFFF",
          fontSize: 18,
          fontFamily: "nunitoBold",
          letterSpacing: 1,
        },
      }),
    [P, insets.top, insets.bottom]
  );

  const fabExtraActions = useMemo(() => [
    {
      icon: "close",
      label: "Exit Quiz",
      onPress: () => navigation.navigate("EnglishQuestMap"),
      color: "white",
      style: { backgroundColor: P.wrongBorder },
      small: false,
    },
    {
      icon: "home",
      label: "Home",
      onPress: () => navigation.navigate("Apprec8"),
      color: "white",
      style: { backgroundColor: P.primary },
      small: false,
    },
  ], [navigation, P]);

  return (
    <View style={styles.container}>
      <FeedbackFAB 
        contentContext={contentContext} 
        style={{ position: 'absolute', top: Math.max(insets.top, 20) + 5, right: 16, bottom: undefined, zIndex: 10 }} 
        customIcon="menu"
        extraActions={fabExtraActions}
        customFabStyle={{ 
          width: 44, 
          height: 44, 
          borderRadius: 22, 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: P.gold,
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Main content area for the explanation */}
        <View>
          <Apprec8ReaderV2 explanation={explanation} isCorrect={isCorrect} />
        </View>

        {/* Button at the bottom */}
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={handlePress}
            activeOpacity={0.85}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>
              {isLastQuestion ? "Finish Quiz" : "Next Question"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ExplanationScreen;

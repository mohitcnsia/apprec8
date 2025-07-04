// screens/quest/QuestScreen.js

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext"; // Adjust path if needed

const QuestScreen = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        My Learning Quest
      </Text>
      <Text style={[styles.subtitle, { color: theme.text }]}>
        Your adventure will appear here soon!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: "nunitoBold", // Using the font from your theme plan
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "nunito", // Using the font from your theme plan
    textAlign: "center",
  },
});

export default QuestScreen;

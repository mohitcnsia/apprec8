// src/screens/StatsScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors";
import QuizButton from "../../components/quiz/QuizButton";

const StatsScreen = ({ route, navigation }) => {
  const [username, setUsername] = useState("Pratha");
  const { score, totalQuestions, quizId } = route.params;

  useEffect(() => {
    const getUsername = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      // if (storedUsername) {
      //   setUsername(storedUsername);
      // }
    };
    getUsername();
  }, []);

  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <Text style={styles.header}>Quiz Over</Text>
      <Image
        style={styles.imageContainer}
        source={require("../../assets/images/success.png")}
      />
      <Text style={styles.text}>Hello, {username}!</Text>
      <Text style={styles.text}>
        You scored <Text style={styles.highlight}>{score}</Text> out of{" "}
        <Text style={styles.highlight}>{totalQuestions}</Text>.
      </Text>
      <QuizButton
        style={styles.nextButton}
        label={"Play Again"}
        handlePress={() => navigation.navigate("Quiz", { itemId: quizId })}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0e3b0",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "white",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  highlight: {
    fontFamily: "open-sans-bold",
    color: Colors.primaryOrange,
  },
  imageContainer: {
    borderRadius: 200,
    borderWidth: 2,
    overflow: "hidden",
    height: "40%",
    width: "80%",
  },
});

export default StatsScreen;

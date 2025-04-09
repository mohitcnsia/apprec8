// screens/quiz/QuizResultScreen.js (Dynamic & Circular Image)

import React, { useState, useEffect } from "react";
// Import Dimensions
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors"; // Adjust path
import { authInstance } from "../../config/firebaseConfig"; // Adjust path

// --- Get screen width ---
const screenWidth = Dimensions.get("window").width;
// --- Calculate dynamic size (e.g., 40% of screen width) ---
const imageDiameter = screenWidth * 0.7; // Adjust 0.4 (40%) as needed

const QuizResultScreen = ({ route, navigation }) => {
  const [username, setUsername] = useState("User");
  const { score, totalQuestions, topicId } = route.params;

  useEffect(() => {
    const currentUser = authInstance.currentUser;
    if (currentUser?.email) {
      const nameFromEmail = currentUser.email.split("@")[0];
      setUsername(nameFromEmail);
    } else {
      console.log("QuizResultScreen: No authenticated user found.");
      setUsername("User");
    }
  }, []);

  const handlePlayAgain = () => {
    if (topicId) {
      console.log(`Playing again for topicId: ${topicId}`);
      navigation.replace("Quiz", { topicId: topicId });
    } else {
      console.error("Cannot play again: topicId is missing from route params.");
      navigation.popToTop();
    }
  };

  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <Text style={styles.header}>Quiz Over!</Text>
      {/* Apply the updated style here */}
      <Image
        style={styles.imageContainer}
        source={require("../../assets/images/success.png")} // Ensure path is correct
      />
      <Text style={styles.text}>Well done, {username}!</Text>
      <Text style={styles.text}>
        You scored <Text style={styles.highlight}>{score}</Text> out of{" "}
        <Text style={styles.highlight}>{totalQuestions}</Text>.
      </Text>
      <PaperButton
        mode="contained"
        style={styles.button}
        labelStyle={styles.buttonText}
        onPress={handlePlayAgain}
      >
        Play Again
      </PaperButton>
      <PaperButton
        mode="outlined"
        style={styles.button}
        labelStyle={[styles.buttonText, { color: Colors.primaryWhite }]}
        onPress={() => navigation.popToTop()}
      >
        Back to Topics / Home
      </PaperButton>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontFamily: "pacifico",
    color: Colors.primaryWhite,
    marginBottom: 20,
    textAlign: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    color: Colors.primaryWhite,
    fontFamily: "delius",
  },
  highlight: {
    fontFamily: "deliusBold",
    color: Colors.primaryOrange,
    fontSize: 20,
  },
  // --- Updated imageContainer Style ---
  imageContainer: {
    height: imageDiameter, // Use calculated diameter
    width: imageDiameter, // Use calculated diameter (makes it square)
    borderRadius: imageDiameter / 2, // Half the diameter makes it circular
    resizeMode: "cover", // 'cover' often looks better for circles than 'contain'
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.primaryWhite,
  },
  // --- End Update ---
  button: {
    marginTop: 15,
    paddingVertical: 5,
    width: "70%",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "deliusBold",
  },
});

export default QuizResultScreen;

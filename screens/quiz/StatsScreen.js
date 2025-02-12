// src/screens/StatsScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StatsScreen = ({ route, navigation }) => {
  const [username, setUsername] = useState("Pratha");
  const { score, totalQuestions } = route.params;

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
    <View style={styles.container}>
      <Text style={styles.header}>Quiz Stats</Text>
      <Text style={styles.text}>Hello, {username}!</Text>
      <Text style={styles.text}>
        You scored {score} out of {totalQuestions}.
      </Text>
      <Button title="Go Back" onPress={() => navigation.navigate("Quiz")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f0e3b0",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default StatsScreen;

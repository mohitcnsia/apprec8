import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "../../config/colors";
import { LinearGradient } from "expo-linear-gradient";

const GuestProfileScreen = ({ signoutHandler }) => {
  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]} // Dark maroon background
      style={styles.container}
    >
      {/* Card View - Contains Icons & Message */}
      <View style={styles.card}>
        {/* Top Row - Feature Icons */}
        <View style={styles.iconRow}>
          <MaterialIcons name="schedule" size={40} color="#fff" />
          <MaterialIcons name="event" size={40} color="#fff" />
          <MaterialIcons name="favorite" size={40} color="#fff" />
          <MaterialIcons name="visibility" size={40} color="#fff" />
          <MaterialIcons name="class" size={40} color="#fff" />
        </View>

        {/* Second Row - Message */}
        <Text style={styles.message}>
          Create an account to save your progress, see your stats, and unlock
          the world of learning and well-being
        </Text>

        {/* Third Row - Sign Up/Login Button */}
        <Pressable style={styles.signInButton} onPress={signoutHandler}>
          <MaterialIcons name="person" size={24} color={Colors.blackText} />
          <Text style={styles.buttonText}>Sign Up or Log In</Text>
        </Pressable>
      </View>
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
  card: {
    backgroundColor: Colors.primaryDarkMaroon, // Semi-transparent maroon
    padding: 30,
    borderRadius: 12,
    width: "95%",
    alignItems: "center",
    marginBottom: 30,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#fff",
    fontFamily: "delius",
    // fontWeight: "500",
    marginBottom: 30, // Added margin to create spacing before the button
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryWhite,
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  buttonText: {
    color: Colors.blackText,
    fontSize: 16,
    fontWeight: "900",
    fontFamily: "delius-bold",
    marginLeft: 10,
  },
});

export default GuestProfileScreen;

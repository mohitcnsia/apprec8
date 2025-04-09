import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "../../config/colors"; // Adjust path if needed
import { LinearGradient } from "expo-linear-gradient";

// Receive the correct handler as a prop named onExitGuestMode
const GuestProfileScreen = ({ onExitGuestMode }) => {
  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <View style={styles.card}>
        <View style={styles.iconRow}>
          <MaterialIcons name="schedule" size={40} color="#fff" />
          <MaterialIcons name="event" size={40} color="#fff" />
          <MaterialIcons name="favorite" size={40} color="#fff" />
          <MaterialIcons name="visibility" size={40} color="#fff" />
          <MaterialIcons name="class" size={40} color="#fff" />
        </View>

        <Text style={styles.message}>
          Create an account to save your progress, see your stats, and unlock
          the world of learning and well-being
        </Text>

        {/* Use the correct handler passed via props */}
        <Pressable style={styles.signInButton} onPress={onExitGuestMode}>
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
    backgroundColor: Colors.primaryDarkMaroon,
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
    marginBottom: 30,
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

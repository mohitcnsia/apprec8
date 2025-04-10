import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../config/colors"; // Adjust path if needed

const EditProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit Profile Screen</Text>
      <Text style={styles.text}>
        (Inputs for Name, Image Upload will go here)
      </Text>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.primaryLightGray, // Example background
  },
  text: {
    fontSize: 18,
    color: Colors.primaryDarkMaroon, // Example text color
    textAlign: "center",
    marginBottom: 10,
  },
});

import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";

const TestScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.box1}>
          <Text style={styles.text}>Box 1</Text>
        </View>
        <View style={styles.box2}>
          <Text style={styles.text}>Box 2</Text>
        </View>
        <View style={styles.box3}>
          <Text style={styles.text}>Box 3 (Should be at the bottom)</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // This container ensures the ScrollView has a defined space to fill.
  container: {
    flex: 1,
    backgroundColor: "#111", // Dark background for visibility
  },
  // This is the key style we are testing.
  contentContainer: {
    flexGrow: 1,
    justifyContent: "flex-end", // This should push all content to the bottom.
  },
  box1: {
    backgroundColor: "maroon",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  box2: {
    backgroundColor: "darkslateblue",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  box3: {
    backgroundColor: "darkgreen",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  text: {
    color: "white",
    fontSize: 20,
  },
});

export default TestScreen;

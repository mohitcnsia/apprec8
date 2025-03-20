import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Badge = ({ label }) => {
  if (!label) return null;

  return (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#FF0000", // Red Color for the badge
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderTopLeftRadius: 6,
    borderBottomRightRadius: 6,
    zIndex: 10,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default Badge;

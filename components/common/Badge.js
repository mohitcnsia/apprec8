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
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 10,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Badge;

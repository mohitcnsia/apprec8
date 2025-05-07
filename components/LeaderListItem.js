// components/common/LeaderListItem.js (New)

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext"; // Adjust path

// Helper to generate fallback avatar
const generateAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "User"
  )}&background=random&color=fff&size=64`;

const LeaderListItem = ({ item, index }) => {
  // item is leader data, index is 0-based for items 4+
  const { theme } = useTheme();
  const rank = index + 4; // Calculate actual rank (since data is sliced from index 3)

  const dynamicStyles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 15,
      backgroundColor:
        theme.listItemBackground || theme.background || "#FFFFFF", // Theme list item bg
      borderBottomWidth: 1,
      borderBottomColor: theme.border || "#EEEEEE", // Theme border
    },
    rank: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.textSecondary, // Theme color
      minWidth: 25, // Ensure alignment
      textAlign: "center",
      marginRight: 10,
    },
    image: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
      backgroundColor: theme.placeholder || "#CCCCCC", // Theme placeholder
    },
    nameContainer: {
      flex: 1, // Take remaining space
      marginRight: 10,
    },
    name: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.textPrimary, // Theme color
    },
    points: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.primaryOrange || "orange", // Use theme primary or accent
      minWidth: 60, // Ensure alignment
      textAlign: "right",
    },
  });

  const imageSourceUri = item.photoURL || generateAvatarUrl(item.name);

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.rank}>{rank}</Text>
      <Image source={{ uri: imageSourceUri }} style={dynamicStyles.image} />
      <View style={dynamicStyles.nameContainer}>
        <Text style={dynamicStyles.name} numberOfLines={1}>
          {item.name || "User"}
        </Text>
      </View>
      <Text style={dynamicStyles.points}>
        {item.points?.toLocaleString() || 0}
      </Text>
    </View>
  );
};

export default React.memo(LeaderListItem); // Memoize list items

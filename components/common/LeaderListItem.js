// components/common/LeaderListItem.js

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext"; // Adjust path
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Helper to generate fallback avatar
const generateAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "U"
  )}&background=random&color=fff&size=64`;

const LeaderListItem = ({ item, isCurrentUser = false }) => {
  const { theme } = useTheme();

  if (!item || typeof item !== "object") {
    console.warn("LeaderListItem: Invalid or missing item prop", item);
    return (
      <View style={styles(theme, isCurrentUser).container}>
        <Text style={{ color: theme.textSecondary }}>Error loading item</Text>
      </View>
    );
  }

  const { rank, name = "Anonymous User", points = 0, photoURL } = item;
  const imageSourceUri = photoURL || generateAvatarUrl(name);
  const specificStyles = styles(theme, isCurrentUser); // Get themed styles

  return (
    <View style={specificStyles.container}>
      <Text style={specificStyles.rank}>{rank}</Text>
      <Image source={{ uri: imageSourceUri }} style={specificStyles.image} />
      <View style={specificStyles.nameContainer}>
        <Text
          style={specificStyles.name}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name}
        </Text>
      </View>
      <Text style={specificStyles.points}>{points?.toLocaleString()}</Text>
      {/* Optional: Add a small star icon next to points */}
      <MaterialCommunityIcons
        name="star-circle"
        size={16}
        color={theme.primaryOrange || "orange"}
        style={{ marginLeft: 3 }}
      />
    </View>
  );
};

// Dynamic styles function
const styles = (theme, isCurrentUser) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: isCurrentUser
        ? theme.currentUserListItemBackground || "#503040"
        : theme.listItemBackground || theme.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight || "#444444",
      marginHorizontal: 5, // Give some horizontal margin if used in a list that doesn't have it
      borderRadius: isCurrentUser ? 8 : 0, // Highlight current user row
    },
    rank: {
      fontSize: 14,
      fontWeight: "bold",
      color: isCurrentUser
        ? theme.textOnPrimary || theme.textPrimary
        : theme.textSecondary,
      minWidth: 30, // Ensure alignment
      textAlign: "center",
      marginRight: 12,
    },
    image: {
      width: 44,
      height: 44,
      borderRadius: 22,
      marginRight: 12,
      backgroundColor: theme.placeholder || "#666666",
    },
    nameContainer: {
      flex: 1,
      marginRight: 10,
    },
    name: {
      fontSize: 16,
      fontWeight: "600",
      color: isCurrentUser
        ? theme.textOnPrimary || theme.textPrimary
        : theme.textPrimary,
    },
    points: {
      fontSize: 15,
      fontWeight: "bold",
      color: isCurrentUser
        ? theme.primaryOrange || "orange"
        : theme.primaryOrange || "orange", // Keep points color consistent or theme it
      minWidth: 60, // Ensure alignment
      textAlign: "right",
    },
    // Example style for highlighting current user (if isCurrentUser is true)
    currentUserContainer: {
      backgroundColor:
        theme.currentUserHighlight || theme.primaryDarkMaroon || "#6a0dad44", // A subtle highlight color
      borderLeftWidth: 3,
      borderLeftColor: theme.primaryOrange || "orange",
    },
    currentUserText: {
      // fontWeight: 'bold', // Already bold or handled by individual text styles
      color: theme.textOnCurrentUserHighlight || theme.textPrimary,
    },
  });

export default React.memo(LeaderListItem);

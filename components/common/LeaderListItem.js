// components/common/LeaderListItem.js (Review for theme key usage)
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const generateAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "U"
  )}&background=random&color=fff&size=64`;

const LeaderListItem = ({ item, isCurrentUser = false }) => {
  const { theme } = useTheme(); // Already using theme!

  if (!item || typeof item !== "object") {
    // ... (error handling remains the same)
    return (
      <View style={dynamicStyles(theme, isCurrentUser).container}>
        <Text style={{ color: theme.textSecondary || "#888" }}>
          Error loading item
        </Text>
      </View>
    );
  }

  const { rank, name = "Anonymous User", points = 0, photoURL } = item;
  const imageSourceUri = photoURL || generateAvatarUrl(name);
  const dynamicStyles = styles(theme, isCurrentUser);

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.rank}>#{rank}</Text>
      <Image source={{ uri: imageSourceUri }} style={dynamicStyles.image} />
      <View style={dynamicStyles.nameContainer}>
        <Text style={dynamicStyles.name} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
      </View>
      <Text style={dynamicStyles.points}>{points?.toLocaleString()}</Text>
      <MaterialCommunityIcons
        name="star-circle"
        size={16}
        color={theme.accent || theme.primaryOrange || "orange"} // MODIFIED: Ensure accent exists
        style={{ marginLeft: 3 }}
      />
    </View>
  );
};

// Dynamic styles function - review theme keys
const styles = (theme, isCurrentUser) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12, // Slightly more padding
      paddingHorizontal: 16,
      backgroundColor: isCurrentUser
        ? theme.currentUserListItemBackground || theme.primaryMaroon100 // Use more distinct theme key if available
        : theme.listItemBackground || theme.cardBackground || theme.background, // Fallback to cardBackground or background
      // borderBottomWidth: 1, // Consider removing if list items have margin/padding or if cards are used
      // borderBottomColor: theme.borderLight || "#444444",
      marginHorizontal: 10, // Added margin
      marginVertical: 4, // Added margin
      borderRadius: isCurrentUser ? 10 : 8, // Consistent rounding
      elevation: isCurrentUser ? 3 : 1, // Add some elevation
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    rank: {
      fontSize: 16, // Slightly larger
      fontWeight: "bold",
      color: isCurrentUser
        ? theme.textOnPrimary || theme.textPrimary // Ensure textOnPrimary provides contrast for currentUserListItemBackground
        : theme.textSecondary,
      minWidth: 35, // Ensure alignment
      textAlign: "center",
      marginRight: 12,
    },
    image: {
      width: 48, // Slightly larger
      height: 48,
      borderRadius: 24,
      marginRight: 12,
      backgroundColor: theme.placeholder || "#666666",
    },
    nameContainer: {
      flex: 1,
      marginRight: 10,
    },
    name: {
      fontSize: 17, // Slightly larger
      fontWeight: "600", // Semibold
      color: isCurrentUser
        ? theme.textOnPrimary || theme.textPrimary
        : theme.textPrimary,
    },
    points: {
      fontSize: 16, // Slightly larger
      fontWeight: "bold",
      color: theme.accent || theme.primaryOrange || "orange", // Use theme.accent consistently
      minWidth: 60,
      textAlign: "right",
    },
    // Removed specific currentUserContainer/currentUserText as styling is now part of main 'container', 'rank', 'name' etc.
  });

export default React.memo(LeaderListItem);

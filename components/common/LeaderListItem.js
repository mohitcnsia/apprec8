// components/common/LeaderListItem.js
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const generateAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "U"
  )}&background=random&color=fff&size=64`;

const LeaderListItem = ({ item, isCurrentUser = false }) => {
  const { theme } = useTheme();

  if (!item || typeof item !== "object") {
    const localStyles = styles(theme, isCurrentUser);
    return (
      <View style={localStyles.container}>
        <Text style={{ color: theme.textSecondary || "#888" }}>
          Error loading item data.
        </Text>
      </View>
    );
  }

  const nameToDisplay = item.computedDisplayName || "User";
  const { rank, points = 0, photoURL } = item;

  const avatarNameSource =
    item.computedDisplayName !== "User"
      ? item.computedDisplayName
      : item.firstName || item.username || item.name || "U";
  const imageSourceUri = photoURL || generateAvatarUrl(avatarNameSource);

  const dynamicStyles = styles(theme, isCurrentUser);

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.rank}>#{rank}</Text>
      <Image source={{ uri: imageSourceUri }} style={dynamicStyles.image} />
      <View style={dynamicStyles.nameContainer}>
        <Text style={dynamicStyles.name} numberOfLines={1} ellipsizeMode="tail">
          {nameToDisplay}
        </Text>
      </View>
      <Text style={dynamicStyles.points}>{points?.toLocaleString()}</Text>
      <MaterialCommunityIcons
        name="star-circle"
        size={16}
        color={theme.accent || theme.primaryOrange || "orange"}
        style={{ marginLeft: 3 }}
      />
    </View>
  );
};

const styles = (theme, isCurrentUser) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: isCurrentUser
        ? theme.currentUserListItemBackground || theme.primaryMaroon100 // More distinct for current user
        : theme.listItemBackground ||
          theme.cardBackground ||
          theme.backgroundLighter ||
          "#fff", // Lighter background for items
      marginHorizontal: 10,
      marginVertical: 4,
      borderRadius: isCurrentUser ? 12 : 10, // Slightly more rounding for current user
      elevation: isCurrentUser ? 4 : 2, // More elevation for current user
      shadowColor: theme.shadowColor || "#000",
      shadowOffset: { width: 0, height: isCurrentUser ? 2 : 1 },
      shadowOpacity: isCurrentUser ? 0.15 : 0.1,
      shadowRadius: isCurrentUser ? 3 : 2,
    },
    rank: {
      fontSize: 16,
      fontWeight: "bold",
      color: isCurrentUser
        ? theme.textOnCurrentUserListItem || theme.accent2 || theme.textPrimary // High contrast text
        : theme.textSecondary,
      minWidth: 35,
      textAlign: "center",
      marginRight: 12,
    },
    image: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 12,
      backgroundColor: theme.placeholder || "#e0e0e0",
    },
    nameContainer: {
      flex: 1,
      marginRight: 10,
    },
    name: {
      fontSize: 17,
      fontWeight: "600",
      color: isCurrentUser
        ? theme.textOnCurrentUserListItem || theme.accent2 || theme.textPrimary
        : theme.textPrimary,
    },
    points: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.accent || theme.primaryOrange || "orange",
      minWidth: 50, // Adjusted minWidth
      textAlign: "right",
    },
  });

export default React.memo(LeaderListItem);

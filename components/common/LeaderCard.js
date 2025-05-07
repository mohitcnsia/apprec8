// components/common/LeaderCard.js

import React from "react";
import { View, Text, Image, Dimensions, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext"; // Adjust path
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Example for trophy icons

const windowWidth = Dimensions.get("window").width;

// --- Fallback Avatar Generator ---
const generateAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "U" // Short fallback for avatar if name is also null
  )}&background=random&color=fff&size=128&bold=true`;

// --- Trophy Icons & Colors (Examples) ---
const trophyIcons = {
  1: "trophy", // Gold
  2: "trophy-variant", // Silver
  3: "trophy-outline", // Bronze
};

const LeaderCard = ({ leader, cardStyle }) => {
  const { theme } = useTheme();

  if (!leader || typeof leader !== "object") {
    // Return a placeholder or null if leader data is missing or invalid
    // This helps prevent the "Text strings must be rendered within a <Text> component" error
    // if leader data is accidentally a string or undefined.
    console.warn("LeaderCard: Invalid or missing leader prop", leader);
    return (
      <View
        style={[
          styles(theme).cardBase,
          styles(theme).placeholderCard,
          cardStyle,
        ]}
      />
    );
  }

  const { rank, name = "Anonymous User", points = 0, photoURL } = leader;

  const isGold = rank === 1;
  const imageSize = windowWidth * (isGold ? 0.2 : 0.15); // Larger image for rank 1
  const imageOffset = imageSize * 0.5;

  const imageSourceUri = photoURL || generateAvatarUrl(name);
  const trophyName = trophyIcons[rank];
  const trophyColor = isGold
    ? theme.gold || "#FFD700"
    : rank === 2
    ? theme.silver || "#C0C0C0"
    : theme.bronze || "#CD7F32";

  const specificStyles = styles(
    theme,
    imageSize,
    imageOffset,
    isGold,
    trophyColor
  );

  return (
    <View style={[specificStyles.cardBase, cardStyle]}>
      <Image
        source={{ uri: imageSourceUri }}
        style={specificStyles.userImage}
        onError={(e) =>
          console.log(
            `LeaderCard Image Error (ID: ${leader.id}):`,
            e.nativeEvent.error
          )
        }
      />
      <Text style={specificStyles.name} numberOfLines={2} ellipsizeMode="tail">
        {name}
      </Text>
      <Text style={specificStyles.points}>{points?.toLocaleString()} pts</Text>

      {rank <= 3 && trophyName && (
        <MaterialCommunityIcons
          name={trophyName}
          size={24}
          color={trophyColor}
          style={specificStyles.trophyIcon}
        />
      )}
      <View
        style={[
          specificStyles.rankBadge,
          { backgroundColor: trophyColor || theme.textSecondary },
        ]}
      >
        <Text style={specificStyles.rankText}>#{rank}</Text>
      </View>
    </View>
  );
};

// Dynamic styles function to incorporate theme and calculated values
const styles = (theme, imageSize, imageOffset, isGold, trophyColor) =>
  StyleSheet.create({
    cardBase: {
      width: windowWidth * 0.28, // Card width
      height: windowWidth * 0.28 * (isGold ? 1.9 : 1.7), // Card height, gold is taller
      backgroundColor: theme.cardBackground || "#4A4A4A",
      borderColor: theme.borderLight || "#555555",
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "flex-end", // Content towards bottom
      paddingBottom: 28, // Space for rank badge
      marginHorizontal: 5,
      borderRadius: 12,
      overflow: "visible", // Important for the absolutely positioned image
      elevation: 5, // Android shadow
      shadowColor: theme.shadowColor || "#000", // iOS shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    placeholderCard: {
      // Style for when leader data is missing
      opacity: 0.5,
    },
    userImage: {
      position: "absolute",
      alignSelf: "center",
      width: imageSize,
      height: imageSize,
      borderRadius: imageSize / 2,
      top: -imageOffset,
      backgroundColor: theme.placeholder || "#666666",
      borderWidth: isGold ? 3 : 2,
      borderColor: isGold
        ? theme.gold || "#FFD700"
        : theme.borderStrong || "#777777",
    },
    name: {
      fontWeight: "bold",
      color: theme.textPrimary,
      fontSize: 12,
      textAlign: "center",
      marginTop: imageOffset * 0.1, // Space below image before text starts
      paddingHorizontal: 4,
    },
    points: {
      fontSize: 11,
      color: theme.textSecondary,
      textAlign: "center",
      marginTop: 2,
    },
    trophyIcon: {
      position: "absolute",
      bottom: 30, // Position above rank badge
      alignSelf: "center",
    },
    rankBadge: {
      position: "absolute",
      bottom: 8,
      alignSelf: "center",
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    rankText: {
      fontSize: 12,
      fontWeight: "bold",
      color: theme.textOnPrimary || "#FFFFFF", // Text color that contrasts with badge
    },
  });

export default React.memo(LeaderCard);

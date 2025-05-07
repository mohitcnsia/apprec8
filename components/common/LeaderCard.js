// components/common/LeaderCard.js (Refactored)

import React from "react";
import { View, Text, Image, Dimensions, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext"; // Adjust path
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Example for trophy

const windowWidth = Dimensions.get("window").width;
const CARD_WIDTH_FACTOR = 0.28; // Width relative to screen
const IMAGE_SIZE_FACTOR = 0.15; // Image size relative to screen
const GOLD_IMAGE_FACTOR = 0.2; // Larger image for rank 1

// Helper to generate fallback avatar
const generateAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "User"
  )}&background=random&color=fff&size=128`;

// --- Trophy Icons (Example) ---
const trophies = {
  1: "trophy-variant", // Gold
  2: "trophy-variant-outline", // Silver-ish outline
  3: "trophy-outline", // Bronze-ish outline
};
const trophyColors = {
  1: "#FFD700", // Gold
  2: "#C0C0C0", // Silver
  3: "#CD7F32", // Bronze
};
// --- End Trophies ---

export default function LeaderCard({ leader, style }) {
  // Accept leader object and external style
  const { theme } = useTheme(); // Get theme context

  if (!leader) return null; // Don't render if no leader data

  const { rank, name, points, photoURL } = leader; // Destructure leader data

  const isGold = rank === 1;
  const imageSize =
    windowWidth * (isGold ? GOLD_IMAGE_FACTOR : IMAGE_SIZE_FACTOR);
  const imageOffset = imageSize * 0.5; // Move half the image out

  const dynamicStyles = StyleSheet.create({
    card: {
      width: windowWidth * CARD_WIDTH_FACTOR,
      height: windowWidth * CARD_WIDTH_FACTOR * (isGold ? 1.8 : 1.6), // Adjust height ratio
      backgroundColor: theme.cardBackground || "#444444", // Use theme color
      borderColor: theme.border || "#666666", // Use theme color
      borderWidth: 1,
      shadowColor: theme.shadowColor || "#000", // Use theme color (might not show well on dark)
      shadowOpacity: 0.3,
      elevation: 4,
      alignItems: "center",
      justifyContent: "flex-end", // Align content to bottom (name, points etc)
      paddingBottom: 10, // Padding at the bottom
      marginHorizontal: 5,
      borderRadius: 10,
      overflow: "visible", // Still needed for positioned image
    },
    userImage: {
      position: "absolute",
      alignSelf: "center", // Center horizontally
      borderRadius: imageSize / 2,
      backgroundColor: theme.placeholder || "#555555", // Theme placeholder
      width: imageSize,
      height: imageSize,
      top: -imageOffset, // Position half out
      borderWidth: isGold ? 3 : 2, // Thicker border for gold
      borderColor: isGold ? theme.gold || "#FFD700" : theme.border || "#666666",
    },
    name: {
      fontWeight: "bold",
      color: theme.textPrimary, // Use theme color
      fontSize: 12, // Adjust size as needed
      textAlign: "center",
      marginTop: 5, // Space below image
    },
    points: {
      fontSize: 11,
      color: theme.textSecondary, // Use theme color
      textAlign: "center",
    },
    rankContainer: {
      position: "absolute",
      bottom: 5,
      right: 5,
      backgroundColor: trophyColors[rank] || theme.textSecondary, // Use trophy color or fallback
      borderRadius: 10,
      paddingHorizontal: 5,
      paddingVertical: 1,
    },
    rankText: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#FFFFFF", // White text usually works on trophy colors
    },
    trophyIcon: {
      position: "absolute",
      bottom: 5,
      left: 5,
    },
  });

  const imageSourceUri = photoURL || generateAvatarUrl(name);
  const trophyName = trophies[rank];
  const trophyColor = trophyColors[rank] || theme.textSecondary;

  return (
    // Outer view still needed for overflow context if absolutely necessary, but often avoidable
    <View style={[dynamicStyles.card, style]}>
      {/* Positioned Image */}
      <Image
        source={{ uri: imageSourceUri }}
        style={dynamicStyles.userImage}
        onError={(e) =>
          console.log("LeaderCard Image Error:", e.nativeEvent.error)
        }
      />

      {/* Content inside card */}
      <Text style={dynamicStyles.name} numberOfLines={1}>
        {name || "User"}
      </Text>
      <Text style={dynamicStyles.points}>
        {points?.toLocaleString() || 0} pts
      </Text>

      {/* Rank Badge (Example) */}
      {rank <= 3 &&
        trophyName && ( // Show trophy icon only for top 3
          <MaterialCommunityIcons
            name={trophyName}
            size={20}
            color={trophyColor}
            style={dynamicStyles.trophyIcon}
          />
        )}
      {/* Rank Text (Example) */}
      <View style={dynamicStyles.rankContainer}>
        <Text style={dynamicStyles.rankText}>#{rank}</Text>
      </View>
    </View>
  );
}

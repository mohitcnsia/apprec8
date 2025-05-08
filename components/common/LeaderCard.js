// components/common/LeaderCard.js
import React from "react";
import { View, Text, Image, Dimensions, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;

const generateAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "U"
  )}&background=random&color=fff&size=128&bold=true`;

const trophyIcons = {
  1: "trophy",
  2: "trophy-variant",
  3: "trophy-outline",
};

const LeaderCard = ({ leader }) => {
  // Removed cardStyle prop, theme is handled internally
  const { theme } = useTheme();

  if (!leader || typeof leader !== "object") {
    // ... placeholder logic ...
    // Fallback styles for placeholder can also use theme.placeholder or theme.cardBackground
    const placeholderDynamicStyles = styles(
      theme,
      windowWidth * 0.15,
      windowWidth * 0.15 * 0.5,
      false,
      theme.placeholder || "#AAA"
    );
    return (
      <View
        style={[
          placeholderDynamicStyles.cardBase,
          placeholderDynamicStyles.placeholderCard,
        ]}
      />
    );
  }

  const { rank, name = "Anonymous User", points = 0, photoURL } = leader;

  const isGold = rank === 1;
  const imageSize = windowWidth * (isGold ? 0.22 : 0.18); // Slightly adjusted sizes
  const imageOffset = imageSize * 0.5; // Used for top positioning of image

  const imageSourceUri = photoURL || generateAvatarUrl(name);
  const trophyName = trophyIcons[rank];

  // MODIFIED: Determine card background and trophy/rank colors from theme
  let cardBackgroundColor = theme.cardBackground;
  let rankBadgeColor = theme.accent || theme.primaryOrange; // Default accent
  let trophyIconColor = theme.accent || theme.primaryOrange;
  let imageBorderColor = theme.borderStrong || "#777";

  if (rank === 1) {
    cardBackgroundColor = theme.goldBackground || theme.cardBackground; // Use specific theme keys
    rankBadgeColor = theme.goldAccent || theme.goldBackground || "#FFD700"; // Use a gold accent or background
    trophyIconColor = theme.goldAccent || theme.goldBackground || "#FFD700";
    imageBorderColor = theme.goldAccent || theme.goldBackground || "#FFD700";
  } else if (rank === 2) {
    cardBackgroundColor = theme.silverBackground || theme.cardBackground;
    rankBadgeColor = theme.silverAccent || theme.silverBackground || "#C0C0C0";
    trophyIconColor = theme.silverAccent || theme.silverBackground || "#C0C0C0";
    imageBorderColor =
      theme.silverAccent || theme.silverBackground || "#C0C0C0";
  } else if (rank === 3) {
    cardBackgroundColor = theme.bronzeBackground || theme.cardBackground;
    rankBadgeColor = theme.bronzeAccent || theme.bronzeBackground || "#CD7F32";
    trophyIconColor = theme.bronzeAccent || theme.bronzeBackground || "#CD7F32";
    imageBorderColor =
      theme.bronzeAccent || theme.bronzeBackground || "#CD7F32";
  }

  const dynamicStyles = styles(
    theme,
    imageSize,
    imageOffset,
    isGold,
    cardBackgroundColor, // Pass the determined background
    rankBadgeColor,
    imageBorderColor
  );

  return (
    <View style={dynamicStyles.cardBase}>
      <Image
        source={{ uri: imageSourceUri }}
        style={dynamicStyles.userImage}
        onError={(e) =>
          console.log(
            `LeaderCard Image Error (ID: ${leader.id}):`,
            e.nativeEvent.error
          )
        }
      />
      <Text style={dynamicStyles.name} numberOfLines={2} ellipsizeMode="tail">
        {name}
      </Text>
      <Text style={dynamicStyles.points}>{points?.toLocaleString()} pts</Text>

      {rank <= 3 && trophyName && (
        <MaterialCommunityIcons
          name={trophyName}
          size={isGold ? 28 : 24} // Larger trophy for gold
          color={trophyIconColor} // Use determined trophy color
          style={dynamicStyles.trophyIcon}
        />
      )}
      <View style={dynamicStyles.rankBadge}>
        <Text style={dynamicStyles.rankText}>#{rank}</Text>
      </View>
    </View>
  );
};

const styles = (
  theme,
  imageSize,
  imageOffset,
  isGold,
  cardBackgroundColor, // Receive themed card background
  rankBadgeColor, // Receive themed rank badge color
  imageBorderColor // Receive themed image border color
) =>
  StyleSheet.create({
    cardBase: {
      width: windowWidth * 0.28,
      height: windowWidth * 0.28 * (isGold ? 2.0 : 1.75), // Adjusted height for better visual
      backgroundColor: cardBackgroundColor, // MODIFIED: Use themed background
      borderColor: theme.border || theme.borderLight, // Use general theme border
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "flex-end",
      paddingBottom: 32, // Increased for rank badge and trophy
      marginHorizontal: 5,
      borderRadius: 16, // More rounded
      overflow: "visible",
      elevation: isGold ? 8 : 5,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: isGold ? 4 : 2 },
      shadowOpacity: isGold ? 0.3 : 0.2,
      shadowRadius: isGold ? 5 : 3,
    },
    placeholderCard: {
      backgroundColor: theme.placeholder || "#DDD", // Use theme placeholder
      opacity: 0.5,
    },
    userImage: {
      position: "absolute",
      alignSelf: "center",
      width: imageSize,
      height: imageSize,
      borderRadius: imageSize / 2,
      top: -imageOffset,
      backgroundColor: theme.placeholder || "#BBB",
      borderWidth: isGold ? 4 : 3, // Thicker border for gold
      borderColor: imageBorderColor, // MODIFIED: Use themed border color
    },
    name: {
      fontWeight: "bold",
      color: theme.textPrimary,
      fontSize: 13, // Adjusted
      textAlign: "center",
      marginTop: imageOffset * 0.1, // Make sure it's below the image
      paddingHorizontal: 5, // More padding
    },
    points: {
      fontSize: 12, // Adjusted
      color: theme.textSecondary,
      textAlign: "center",
      marginTop: 3,
    },
    trophyIcon: {
      position: "absolute",
      bottom: 35, // Adjusted position
      alignSelf: "center",
      opacity: 0.9,
    },
    rankBadge: {
      position: "absolute",
      bottom: 10, // Adjusted position
      alignSelf: "center",
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 3,
      backgroundColor: rankBadgeColor, // MODIFIED: Use themed rank badge color
    },
    rankText: {
      fontSize: 13, // Adjusted
      fontWeight: "bold",
      color: theme.textOnPrimary || "#FFFFFF", // Ensure contrast
    },
  });

export default React.memo(LeaderCard);

// components/common/LeaderCard.js
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

const generateAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "U"
  )}&background=random&color=fff&size=128`;

const LeaderCard = ({
  leader,
  rankNumber,
  cardStyle,
  isCurrentUser = false,
}) => {
  const { theme } = useTheme();

  // Use passed cardStyle for dimensions, with sensible defaults
  const effectiveCardStyle = {
    width: cardStyle?.width || 110,
    height: cardStyle?.height || 180,
    ...cardStyle, // Spread other potential style props from cardStyle
  };

  if (!leader || typeof leader !== "object") {
    const errorStyles = styles(
      theme,
      rankNumber,
      effectiveCardStyle,
      theme.textSecondary,
      isCurrentUser
    );
    return (
      <View
        style={[
          errorStyles.cardBase,
          effectiveCardStyle,
          errorStyles.errorCard,
        ]}
      >
        <Text style={errorStyles.errorText}>N/A</Text>
      </View>
    );
  }

  const nameToDisplay = leader.computedDisplayName || "User";
  const { points = 0, photoURL } = leader;
  const avatarNameSource =
    leader.computedDisplayName !== "User"
      ? leader.computedDisplayName
      : leader.firstName || leader.username || "U";
  const imageSourceUri = photoURL || generateAvatarUrl(avatarNameSource);

  const trophyDetails = {
    1: { icon: "trophy", color: theme.gold || "#FFD700", sizeMultiplier: 1.0 },
    2: {
      icon: "trophy-variant",
      color: theme.silver || "#C0C0C0",
      sizeMultiplier: 0.9,
    },
    3: {
      icon: "trophy-variant",
      color: theme.bronze || "#CD7F32",
      sizeMultiplier: 0.8,
    },
  };
  const currentTrophy = trophyDetails[rankNumber] || trophyDetails[3];

  const dynamicStyles = styles(
    theme,
    rankNumber,
    effectiveCardStyle, // Pass the calculated effectiveCardStyle
    currentTrophy.color,
    isCurrentUser
  );

  // Define background based on rank, with fallback to theme.cardBackground
  let cardBackgroundColor = theme.cardBackground || "#A0522D"; // Default podium card
  if (rankNumber === 1) cardBackgroundColor = theme.cardBackground || "#FFD700";
  else if (rankNumber === 2)
    cardBackgroundColor = theme.cardBackground || "#C0C0C0";
  else if (rankNumber === 3)
    cardBackgroundColor = theme.cardBackground || "#CD7F32";

  // Override if it's the current user and a specific style is defined
  if (isCurrentUser && theme.currentUserPodiumCardBackground) {
    cardBackgroundColor = theme.currentUserPodiumCardBackground;
  }

  return (
    <View
      style={[
        dynamicStyles.cardBase,
        { backgroundColor: cardBackgroundColor },
        effectiveCardStyle,
      ]}
    >
      <View style={dynamicStyles.rankCircle}>
        <Text style={dynamicStyles.rankText}>#{rankNumber}</Text>
      </View>
      <MaterialCommunityIcons
        name={currentTrophy.icon}
        size={effectiveCardStyle.width * 0.45 * currentTrophy.sizeMultiplier} // Trophy size relative to card width
        color={currentTrophy.color} // Use trophy color directly for the icon itself
        style={dynamicStyles.trophyIcon}
      />
      <Image source={{ uri: imageSourceUri }} style={dynamicStyles.avatar} />
      <Text style={dynamicStyles.name} numberOfLines={2} ellipsizeMode="tail">
        {nameToDisplay}
      </Text>
      <View style={dynamicStyles.pointsContainer}>
        <Text
          style={dynamicStyles.points}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {points?.toLocaleString()}
        </Text>
        <MaterialCommunityIcons
          name="star-circle"
          size={dynamicStyles.pointsIconSize}
          color={dynamicStyles.points.color} // Use same color as points text for consistency
          style={dynamicStyles.pointsIconStyle}
        />
      </View>
    </View>
  );
};

const styles = (theme, rankNumber, cardStyle, trophyColor, isCurrentUser) => {
  const cardH = cardStyle.height;
  const cardW = cardStyle.width;

  const pointsFontSize = Math.max(12, Math.min(cardW * 0.15, cardH * 0.08));
  const pointsIconSize = pointsFontSize * 1.1;
  const avatarSize = cardW * 0.55; // Avatar size relative to card width

  return StyleSheet.create({
    cardBase: {
      alignItems: "center",
      justifyContent: "space-between", // Use space-between or space-around
      paddingVertical: cardH * 0.05,
      paddingHorizontal: cardW * 0.05,
      borderRadius: 15, // Slightly more rounded
      elevation: rankNumber === 1 ? 10 : rankNumber === 2 ? 7 : 5,
      shadowColor: theme.shadowColor || "#000",
      shadowOffset: { width: 0, height: rankNumber === 1 ? 5 : 3 },
      shadowOpacity: rankNumber === 1 ? 0.35 : 0.25,
      shadowRadius: rankNumber === 1 ? 6 : 4,
      // marginHorizontal is handled by TopThreeDisplay's cardWrapper
      position: "relative",
      borderColor: isCurrentUser ? theme.accent2 : "transparent",
    },
    errorCard: {
      justifyContent: "center",
      backgroundColor: theme.placeholderCard || "#e0e0e0",
    },
    errorText: {
      color: theme.textSecondary || "#777",
      fontSize: cardW * 0.2,
      fontWeight: "bold",
    },
    rankCircle: {
      position: "absolute",
      top: -cardW * 0.1, // Position outside card
      left: -cardW * 0.1,
      backgroundColor: trophyColor,
      width: cardW * 0.3,
      height: cardW * 0.3,
      borderRadius: cardW * 0.15,
      justifyContent: "center",
      alignItems: "center",
      elevation: 12,
      borderColor: theme.background || "#fff",
      borderWidth: 2,
    },
    rankText: {
      fontSize: cardW * 0.12,
      fontWeight: "bold",
      color: theme.textOnEmphasis || "#fff", // Generic color for text on bright/dark backgrounds
    },
    trophyIcon: {
      // Removed fixed margins, rely on space-around/between in cardBase
    },
    avatar: {
      width: avatarSize,
      height: avatarSize,
      borderRadius: avatarSize / 2,
      borderWidth: 2.5,
      borderColor: trophyColor, // Use trophy color for avatar border
      marginBottom: cardH * 0.02, // Space below avatar
    },
    name: {
      fontSize: Math.max(12, Math.min(cardW * 0.14, cardH * 0.07)),
      fontWeight: "bold",
      color: theme.textPrimaryOnPodiumCard || theme.textPrimary || "#333", // Specific theme key
      textAlign: "center",
      paddingHorizontal: 2,
      marginBottom: cardH * 0.02, // Space below name
    },
    pointsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    points: {
      fontSize: pointsFontSize,
      fontWeight: "bold",
      color: theme.accentOnPodiumCard || theme.accent || "orange", // Specific theme key
      textAlign: "right", // Align points to the right before the star
      marginRight: 2,
    },
    pointsIconSize: pointsIconSize,
    pointsIconStyle: {
      /* marginLeft can be removed if points text is right-aligned */
    },
  });
};

export default React.memo(LeaderCard);

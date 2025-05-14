// components/common/LeaderCard.js
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native"; // Removed Dimensions as it's passed via cardStyle
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext"; // Adjust path if necessary

const generateAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "U"
  )}&background=random&color=fff&size=128`;

const LeaderCard = ({ leader, rankNumber, cardStyle }) => {
  const { theme } = useTheme();

  if (!leader || typeof leader !== "object") {
    return (
      <View
        style={[
          styles(theme, rankNumber, cardStyle).cardBase,
          cardStyle,
          styles(theme, rankNumber, cardStyle).errorCard,
        ]}
      >
        <Text style={styles(theme, rankNumber, cardStyle).errorText}>N/A</Text>
      </View>
    );
  }

  const { name = "Anonymous", points = 0, photoURL } = leader;
  const imageSourceUri = photoURL || generateAvatarUrl(name);

  const trophyDetails = {
    1: { icon: "trophy", color: theme.gold || "#FFD700", sizeMultiplier: 1 },
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
    cardStyle,
    currentTrophy.color
  ); // Pass currentTrophy.color for avatar border

  return (
    <View style={[dynamicStyles.cardBase, cardStyle]}>
      <View style={dynamicStyles.rankCircle}>
        <Text style={dynamicStyles.rankText}>#{rankNumber}</Text>
      </View>
      <MaterialCommunityIcons
        name={currentTrophy.icon}
        size={
          (cardStyle && cardStyle.width ? cardStyle.width * 0.5 : 55) *
          currentTrophy.sizeMultiplier
        }
        color={currentTrophy.color}
        style={dynamicStyles.trophyIcon}
      />
      <Image source={{ uri: imageSourceUri }} style={dynamicStyles.avatar} />
      <Text style={dynamicStyles.name} numberOfLines={2} ellipsizeMode="tail">
        {name}
      </Text>
      <View style={dynamicStyles.pointsContainer}>
        <Text
          style={dynamicStyles.points}
          numberOfLines={1}
          ellipsizeMode="clip"
        >
          {points?.toLocaleString()}
        </Text>
        <MaterialCommunityIcons
          name="star-circle"
          size={dynamicStyles.pointsStar.size} // Access pre-calculated size
          color={theme.accent || theme.primaryOrange || "orange"}
          style={dynamicStyles.pointsStarIcon} // Renamed to avoid conflict
        />
      </View>
    </View>
  );
};

const styles = (
  theme,
  rankNumber,
  cardStyleProps,
  avatarBorderColorFromTrophy
) => {
  const cardHeight =
    cardStyleProps && cardStyleProps.height ? cardStyleProps.height : 180; // Default height if not passed
  const cardWidth =
    cardStyleProps && cardStyleProps.width ? cardStyleProps.width : 110; // Default width if not passed

  const pointsFontSize = Math.max(13, cardHeight * 0.075);

  return StyleSheet.create({
    cardBase: {
      alignItems: "center",
      justifyContent: "space-around",
      padding: 10,
      borderRadius: 12,
      backgroundColor:
        theme.cardBackground || theme.cardBackground || "#9c6262",
      elevation: rankNumber === 1 ? 8 : rankNumber === 2 ? 6 : 4,
      shadowColor: theme.shadowColor || "#000000",
      shadowOffset: { width: 0, height: rankNumber === 1 ? 4 : 2 },
      shadowOpacity: rankNumber === 1 ? 0.3 : 0.2,
      shadowRadius: rankNumber === 1 ? 5 : 3,
      marginHorizontal: 5,
      position: "relative",
    },
    errorCard: {
      justifyContent: "center",
    },
    errorText: {
      color: theme.textSecondary || "#888888",
      fontSize: 16,
    },
    rankCircle: {
      position: "absolute",
      top: cardHeight * -0.05, // Adjusted for dynamic height
      left: cardWidth * -0.05, // Adjusted for dynamic width
      backgroundColor:
        rankNumber === 1
          ? theme.gold || "#FFD700"
          : rankNumber === 2
          ? theme.silver || "#C0C0C0"
          : theme.bronze || "#CD7F32",
      borderRadius: Math.min(cardWidth, cardHeight) * 0.15, // Proportional radius
      width: Math.min(cardWidth, cardHeight) * 0.3, // Proportional size
      height: Math.min(cardWidth, cardHeight) * 0.3, // Proportional size
      justifyContent: "center",
      alignItems: "center",
      elevation: 10,
      borderColor: theme.background || "#FFFFFF",
      borderWidth: 2,
    },
    rankText: {
      fontSize: Math.min(cardWidth, cardHeight) * 0.1, // Proportional font size
      fontWeight: "bold",
      color:
        theme.textOnGoldSilverBronze ||
        (rankNumber === 1 ? "#000000" : "#FFFFFF"),
    },
    trophyIcon: {
      marginTop: cardHeight * 0.05,
      marginBottom: cardHeight * 0.02,
    },
    avatar: {
      width: cardHeight * 0.25,
      height: cardHeight * 0.25,
      borderRadius: cardHeight * 0.125,
      marginBottom: cardHeight * 0.03,
      borderWidth: 2,
      borderColor:
        theme.podiumAvatarBorder ||
        avatarBorderColorFromTrophy ||
        theme.accent ||
        "transparent",
    },
    name: {
      fontSize: Math.max(13, cardHeight * 0.07),
      fontWeight: "bold",
      color: theme.textPrimary || "#000000",
      textAlign: "center",
      minHeight: cardHeight * 0.07 * 2.2, // Approx 2 lines
      marginBottom: cardHeight * 0.02,
      paddingHorizontal: 3, // Prevent text touching edges
    },
    pointsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 5,
    },
    points: {
      fontSize: pointsFontSize,
      fontWeight: "bold",
      color: theme.accent || theme.primaryOrange || "orange",
      textAlign: "center",
    },
    pointsStar: {
      size: pointsFontSize * 1.5,
      marginLeft: 3,
    },
  });
};

export default React.memo(LeaderCard);

// components/common/TopThreeDisplay.js
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import LeaderCard from "./LeaderCard";
import { useTheme } from "../../context/ThemeContext";

const { width: screenWidth } = Dimensions.get("window");

const TopThreeDisplay = ({ topLeaders = [], currentUserId }) => {
  const { theme } = useTheme();

  const leader1 = topLeaders[0] || null;
  const leader2 = topLeaders[1] || null;
  const leader3 = topLeaders[2] || null;

  // Define base dimensions more clearly
  const baseCardWidth = screenWidth * 0.28; // Slightly smaller base for better spacing
  const spacing = screenWidth * 0.03; // Spacing between cards

  const goldCardWidth = baseCardWidth * 1.1; // Gold card slightly wider
  const goldCardHeight = goldCardWidth * 2.1; // Adjusted height aspect ratio

  const silverCardWidth = baseCardWidth;
  const silverCardHeight = goldCardHeight * 0.85;

  const bronzeCardWidth = baseCardWidth;
  const bronzeCardHeight = goldCardHeight * 0.7;

  const dynamicStyles = StyleSheet.create({
    topThreeContainer: {
      flexDirection: "row",
      justifyContent: "space-around", // Use space-around for better distribution
      alignItems: "flex-end",
      paddingTop: 30, // Space for trophies/rank circles
      paddingBottom: 20,
      paddingHorizontal: spacing / 2, // Overall padding for the container
      marginBottom: 15,
      minHeight: goldCardHeight + 40, // Ensure enough height
      backgroundColor: theme.podiumAreaBackground || "transparent",
    },
    // Placeholder styling can be simplified if LeaderCard handles its own empty state
    placeholderView: {
      // width and height will be set dynamically
      backgroundColor:
        theme.placeholderCard || theme.cardBackground || "#f0f0f0",
      borderRadius: 12,
      marginHorizontal: spacing / 2, // Apply consistent spacing
      alignItems: "center",
      justifyContent: "center",
    },
    cardWrapper: {
      // This wrapper can help manage individual card positions if needed
      marginHorizontal: spacing / 2, // Consistent spacing
    },
  });

  return (
    <View style={dynamicStyles.topThreeContainer}>
      {/* Rank 2 (Silver) - Left */}
      <View style={dynamicStyles.cardWrapper}>
        {leader2 ? (
          <LeaderCard
            leader={leader2}
            rankNumber={2}
            cardStyle={{ width: silverCardWidth, height: silverCardHeight }}
            isCurrentUser={leader2.id === currentUserId}
          />
        ) : (
          <View
            style={[
              dynamicStyles.placeholderView,
              { width: silverCardWidth, height: silverCardHeight },
            ]}
          />
        )}
      </View>

      {/* Rank 1 (Gold) - Center */}
      <View style={dynamicStyles.cardWrapper}>
        {leader1 ? (
          <LeaderCard
            leader={leader1}
            rankNumber={1}
            cardStyle={{ width: goldCardWidth, height: goldCardHeight }}
            isCurrentUser={leader1.id === currentUserId}
          />
        ) : (
          <View
            style={[
              dynamicStyles.placeholderView,
              { width: goldCardWidth, height: goldCardHeight },
            ]}
          />
        )}
      </View>

      {/* Rank 3 (Bronze) - Right */}
      <View style={dynamicStyles.cardWrapper}>
        {leader3 ? (
          <LeaderCard
            leader={leader3}
            rankNumber={3}
            cardStyle={{ width: bronzeCardWidth, height: bronzeCardHeight }}
            isCurrentUser={leader3.id === currentUserId}
          />
        ) : (
          <View
            style={[
              dynamicStyles.placeholderView,
              { width: bronzeCardWidth, height: bronzeCardHeight },
            ]}
          />
        )}
      </View>
    </View>
  );
};

export default React.memo(TopThreeDisplay);

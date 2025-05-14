// components/common/TopThreeDisplay.js
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import LeaderCard from "./LeaderCard"; // Adjust path if necessary
import { useTheme } from "../../context/ThemeContext"; // Adjust path if necessary

const { width: screenWidth } = Dimensions.get("window");

const TopThreeDisplay = ({ topLeaders = [] }) => {
  const { theme } = useTheme();

  const leader1 = topLeaders[0] || null;
  const leader2 = topLeaders[1] || null;
  const leader3 = topLeaders[2] || null;

  // Define base dimensions
  const baseCardWidth = screenWidth * 0.3;
  const goldCardHeight = baseCardWidth * 2.2;

  // Height Ratios (Rank 1 is 100%)
  // Original request: Silver 70%, Bronze 50%
  // Adjusted for better visual balance: Silver 85%, Bronze 70%
  // You can change these ratios as desired:
  const silverCardHeight = goldCardHeight * 0.85; // e.g., 0.70 for 70%
  const bronzeCardHeight = goldCardHeight * 0.7; // e.g., 0.50 for 50%

  const dynamicStyles = StyleSheet.create({
    topThreeContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "flex-end",
      paddingTop: 30,
      paddingBottom: 20,
      marginBottom: 15,
      minHeight: goldCardHeight + 50, // Accommodate tallest card and padding
      backgroundColor: theme.podiumAreaBackground || "transparent",
    },
    placeholderView: {
      width: baseCardWidth,
      marginHorizontal: 5,
      backgroundColor: theme.placeholderCard || "transparent", // Use transparent or a subtle themed placeholder
      borderRadius: 12,
      // Ensure placeholder has some visible style if not transparent
      // borderStyle: 'dashed',
      // borderColor: theme.border || '#cccccc',
      // borderWidth: 1,
    },
    cardWrapper: {
      // This wrapper is useful if you need to add specific transforms or absolute positioning
      // relative to the flex item, but for simple height/width, direct child is fine.
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
            cardStyle={{ width: baseCardWidth, height: silverCardHeight }}
          />
        ) : (
          <View
            style={[
              dynamicStyles.placeholderView,
              { height: silverCardHeight },
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
            cardStyle={{ width: baseCardWidth * 1.08, height: goldCardHeight }} // Gold card slightly wider
          />
        ) : (
          <View
            style={[
              dynamicStyles.placeholderView,
              { width: baseCardWidth * 1.08, height: goldCardHeight },
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
            cardStyle={{ width: baseCardWidth, height: bronzeCardHeight }}
          />
        ) : (
          <View
            style={[
              dynamicStyles.placeholderView,
              { height: bronzeCardHeight },
            ]}
          />
        )}
      </View>
    </View>
  );
};

export default React.memo(TopThreeDisplay);

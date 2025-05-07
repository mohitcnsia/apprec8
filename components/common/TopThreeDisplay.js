// components/common/TopThreeDisplay.js

import React from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native"; // Added Text for placeholders
import LeaderCard from "./LeaderCard"; // Adjust path
import { useTheme } from "../../context/ThemeContext"; // Adjust path

const TopThreeDisplay = ({ topLeaders = [] }) => {
  const { theme } = useTheme();

  // Ensure we have data or placeholders for rendering
  const leader1 = topLeaders[0] || null; // Rank 1
  const leader2 = topLeaders[1] || null; // Rank 2
  const leader3 = topLeaders[2] || null; // Rank 3

  const cardWidth = Dimensions.get("window").width * 0.28;
  const cardMargin = 5;

  const dynamicStyles = StyleSheet.create({
    topThreeContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "flex-end",
      paddingTop: Dimensions.get("window").width * 0.2 * 0.5 + 20, // Top padding for gold card image
      paddingBottom: 10,
      marginBottom: 10, // Space below the podium
      minHeight: Dimensions.get("window").width * 0.28 * 1.9 + 30, // Ensure enough height
    },
    placeholderView: {
      // For when a leader is missing in top 3
      width: cardWidth,
      marginHorizontal: cardMargin,
      // You can add a border or different background to show it's a placeholder
      // height: Dimensions.get('window').width * 0.28 * 1.6, // Match other cards approx
    },
    // Define rank-specific styles (mainly for background or slight elevation differences)
    silverCardStyle: {
      backgroundColor:
        theme.silverBackground || theme.cardBackground || "#B0C4DE", // Light steel blue / silver
      // You can add specific border or shadow for silver if desired
    },
    goldCardStyle: {
      backgroundColor:
        theme.goldBackground || theme.cardBackground || "#FFEC8B", // Light goldenrod
      // Gold card is made taller by LeaderCard logic for rank 1
    },
    bronzeCardStyle: {
      backgroundColor:
        theme.bronzeBackground || theme.cardBackground || "#D2B48C", // Tan / bronze
    },
  });

  return (
    <View style={dynamicStyles.topThreeContainer}>
      {/* Rank 2 (Silver) - slightly lower */}
      <View style={{ alignSelf: "flex-end", marginBottom: 20 }}>
        {leader2 ? (
          <LeaderCard
            leader={leader2}
            cardStyle={dynamicStyles.silverCardStyle}
          />
        ) : (
          <View style={dynamicStyles.placeholderView} />
        )}
      </View>

      {/* Rank 1 (Gold) - centered and slightly more prominent */}
      {leader1 ? (
        <LeaderCard leader={leader1} cardStyle={dynamicStyles.goldCardStyle} />
      ) : (
        <View style={dynamicStyles.placeholderView} />
      )}

      {/* Rank 3 (Bronze) - slightly lower */}
      <View style={{ alignSelf: "flex-end", marginBottom: 30 }}>
        {leader3 ? (
          <LeaderCard
            leader={leader3}
            cardStyle={dynamicStyles.bronzeCardStyle}
          />
        ) : (
          <View style={dynamicStyles.placeholderView} />
        )}
      </View>
    </View>
  );
};

export default React.memo(TopThreeDisplay);

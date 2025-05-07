// components/common/TopThreeDisplay.js (New)

import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import LeaderCard from "./LeaderCard"; // Adjust path
import { useTheme } from "../../context/ThemeContext"; // Adjust path

const TopThreeDisplay = ({ topLeaders = [] }) => {
  // Expects array of top 3 leaders
  const { theme } = useTheme();

  // Ensure we have placeholders if data is less than 3
  const leader1 = topLeaders[0]; // Rank 1
  const leader2 = topLeaders[1]; // Rank 2
  const leader3 = topLeaders[2]; // Rank 3

  // Define theme-based styles for podium cards if needed
  const dynamicStyles = StyleSheet.create({
    topThreeContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "flex-end", // Align bottoms
      paddingHorizontal: 10,
      paddingTop: Dimensions.get("window").width * 0.2 * 0.5 + 10, // Dynamic top padding based on gold image size/offset
      paddingBottom: 10,
      minHeight: Dimensions.get("window").width * 0.28 * 1.8 + 20, // Ensure container is tall enough
    },
    // Define rank-specific background/border colors from theme if available
    silver: { backgroundColor: theme.silver || "#C0C0C0" },
    gold: {
      backgroundColor: theme.gold || "#FFD700",
      height: Dimensions.get("window").width * 0.28 * 1.8,
    }, // Gold slightly taller
    bronze: { backgroundColor: theme.bronze || "#CD7F32" },
  });

  return (
    <View style={dynamicStyles.topThreeContainer}>
      {/* Rank 2 (Silver) - Render only if leader2 exists */}
      <View style={{ marginTop: 30 }}>
        {/* Push silver down slightly */}
        {leader2 ? (
          <LeaderCard leader={leader2} style={dynamicStyles.silver} />
        ) : (
          <View
            style={{
              width: Dimensions.get("window").width * 0.28,
              marginHorizontal: 5,
            }}
          />
        )}
      </View>

      {/* Rank 1 (Gold) - Render only if leader1 exists */}
      {leader1 ? (
        <LeaderCard leader={leader1} style={dynamicStyles.gold} />
      ) : (
        <View
          style={{
            width: Dimensions.get("window").width * 0.28,
            marginHorizontal: 5,
          }}
        />
      )}

      {/* Rank 3 (Bronze) - Render only if leader3 exists */}
      <View style={{ marginTop: 40 }}>
        {/* Push bronze down slightly */}
        {leader3 ? (
          <LeaderCard leader={leader3} style={dynamicStyles.bronze} />
        ) : (
          <View
            style={{
              width: Dimensions.get("window").width * 0.28,
              marginHorizontal: 5,
            }}
          />
        )}
      </View>
    </View>
  );
};

export default React.memo(TopThreeDisplay);

// components/common/TopThreeDisplay.js
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import LeaderCard from "./LeaderCard";
import { useTheme } from "../../context/ThemeContext";

const TopThreeDisplay = ({ topLeaders = [] }) => {
  const { theme } = useTheme();

  const leader1 = topLeaders[0] || null;
  const leader2 = topLeaders[1] || null;
  const leader3 = topLeaders[2] || null;

  const cardWidth = Dimensions.get("window").width * 0.28; // Keep dynamic sizing

  // MODIFIED: Use theme for podium styles
  const dynamicStyles = StyleSheet.create({
    topThreeContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "flex-end", // Podium effect
      paddingTop: Dimensions.get("window").width * 0.2 * 0.5 + 30, // Increased top padding for gold card image
      paddingBottom: 20, // Increased bottom padding
      marginBottom: 15,
      minHeight: Dimensions.get("window").width * 0.28 * 1.9 + 40, // Adjusted min height
      // backgroundColor: theme.podiumAreaBackground || theme.transparent, // Optional background for podium area
    },
    placeholderView: {
      width: cardWidth,
      marginHorizontal: 5, // Consistent with LeaderCard margin
      height: Dimensions.get("window").width * 0.28 * 1.6, // Approximate height
      // backgroundColor: theme.placeholder, // Can add placeholder styling
      // borderRadius: 12,
    },
    // Define rank-specific styles using theme (mainly for background or slight elevation differences)
    // These are passed to LeaderCard which will apply them to its base style
    silverCardStyle: {
      // For LeaderCard's cardStyle prop
      // Specific styles for silver if needed, beyond what LeaderCard does by default
      // Example: theme.silverPodiumBorder, etc.
      // LeaderCard will use its own background if this is not set,
      // or we can enforce one here from theme.
    },
    goldCardStyle: {
      // For LeaderCard's cardStyle prop
    },
    bronzeCardStyle: {
      // For LeaderCard's cardStyle prop
    },
  });

  return (
    <View style={dynamicStyles.topThreeContainer}>
      <View style={{ alignSelf: "flex-end", marginBottom: 20 }}>
        {leader2 ? (
          <LeaderCard
            leader={leader2}
            // cardStyle prop on LeaderCard is for *additional* styling to its base.
            // The theme for podium backgrounds (gold, silver, bronze) will be handled *inside* LeaderCard.
          />
        ) : (
          <View style={dynamicStyles.placeholderView} />
        )}
      </View>

      {leader1 ? (
        <LeaderCard leader={leader1} />
      ) : (
        <View style={dynamicStyles.placeholderView} />
      )}

      <View style={{ alignSelf: "flex-end", marginBottom: 30 }}>
        {leader3 ? (
          <LeaderCard leader={leader3} />
        ) : (
          <View style={dynamicStyles.placeholderView} />
        )}
      </View>
    </View>
  );
};

export default React.memo(TopThreeDisplay);

import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
// import { LinearGradient } from "expo-linear-gradient";
// import TopThreeDisplay from "../../components/common/TopThreeDisplay"; // Adjust path
// import LeaderListItem from "../../components/LeaderListItem"; // Adjust path
import { useTheme } from "../../context/ThemeContext"; // Adjust path

// Number of leaders to fetch/display
const LEADERBOARD_LIMIT = 20; // Show Top 20 for example

const LeaderboardTab = ({ route }) => {
  // Receives route prop from navigator
  // Get timePeriod ('daily', 'weekly', 'monthly', 'allTime') passed from StatsScreen
  const { timePeriod } = route.params;
  const { theme } = useTheme(); // Get theme colors

  // State for leaderboard data, loading, and errors
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(
      `LeaderboardTab: Fetching leaderboard for period: ${timePeriod}`
    );
    setLoading(true);
    setError(null);
    setLeaders([]); // Clear previous leaders

    // --- Firestore Query Definition ---
    // !!! IMPORTANT: Currently ONLY implements "All Time" logic !!!
    // TODO: Add conditional logic here based on 'timePeriod' prop
    // to query different fields or date ranges for Daily/Weekly/Monthly.
    let query = firestore()
      .collection("userStats")
      // Always order by the primary metric for ranking
      .orderBy("totalStars", "desc")
      // Add time-based filtering here for Daily/Weekly/Monthly later
      // .where('lastActivityDate', '>=', startDate)
      .limit(LEADERBOARD_LIMIT);
    // --- End Query Definition ---

    // Subscribe to query updates (or use .get() for one-time fetch)
    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        const fetchedData = [];
        querySnapshot.forEach((doc, index) => {
          // Assume necessary display info is in userStats
          // If not, you'd need additional fetches here (less efficient)
          fetchedData.push({
            id: doc.id, // userId
            rank: index + 1, // Calculate rank based on position in ordered list
            points: doc.data()?.totalStars || 0, // Use optional chaining and default
            name:
              doc.data()?.username ||
              doc.data()?.displayName ||
              `User ${doc.id.substring(0, 4)}`, // Need name!
            photoURL: doc.data()?.photoURL || null, // Need photoURL!
          });
        });
        setLeaders(fetchedData);
        setLoading(false);
        console.log(
          `LeaderboardTab: Fetched ${fetchedData.length} users for ${timePeriod}`
        );
      },
      (err) => {
        console.error(`LeaderboardTab: Fetch error for ${timePeriod}:`, err);
        setError(
          "Could not load leaderboard. Please check connection and permissions."
        );
        setLoading(false);
      }
    );

    // Cleanup function to detach listener when component unmounts or timePeriod changes
    return () => {
      console.log(`LeaderboardTab: Unsubscribing listener for ${timePeriod}`);
      unsubscribe();
    };
  }, [timePeriod]); // Re-run effect if timePeriod changes

  // --- Prepare data for rendering ---
  const topThree = leaders.slice(0, 3);
  const restOfList = leaders.slice(3);

  // --- Render Loading State ---
  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.textPrimary} />
      </View>
    );
  }

  // --- Render Error State ---
  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text
          style={[styles.centeredText, { color: theme.warningRed || "red" }]}
        >
          {error}
        </Text>
      </View>
    );
  }

  // --- Render Empty State ---
  if (leaders.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.centeredText, { color: theme.textSecondary }]}>
          Leaderboard is empty.
        </Text>
      </View>
    );
  }

  // --- Render Leaderboard List ---
  return (
    <View style={[styles.centered, { backgroundColor: theme.background }]}>
      <Text style={[styles.centeredText, { color: theme.textSecondary }]}>
        Leaderboard is Minimal.
      </Text>
    </View>
    // <LinearGradient
    //   colors={theme.backgroundGradient || ["#8B0000", "#D3D3D3"]} // Use theme gradient with fallback
    //   style={styles.gradientFill}
    // >
    //   <FlatList
    //     data={restOfList}
    //     keyExtractor={(item) => item.id}
    //     renderItem={({ item, index }) => (
    //       // Pass the actual rank based on the index in the *rest* of the list
    //       <LeaderListItem item={item} index={index + 3} />
    //     )}
    //     ListHeaderComponent={<TopThreeDisplay topLeaders={topThree} />}
    //     contentContainerStyle={styles.listContent}
    //     showsVerticalScrollIndicator={false}
    //     // Optional performance props (adjust as needed)
    //     // getItemLayout={(data, index) => ({ length: 60, offset: 60 * index, index })} // Adjust length based on estimated LeaderListItem height
    //     // initialNumToRender={10}
    //     // maxToRenderPerBatch={10}
    //     // windowSize={10} // Typically 10 or 21
    //   />
    // </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientFill: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20, // Add padding to centered content
  },
  centeredText: {
    // Removed flex: 1 from here, parent View handles flex
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20, // Space at the bottom of the list
  },
});

export default LeaderboardTab;

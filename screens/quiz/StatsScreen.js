// screens/quiz/StatsScreen.js (Refactored - No Top Tabs)

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
  ScrollView,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { Timestamp } from "@react-native-firebase/firestore"; // For date comparisons
import { LinearGradient } from "expo-linear-gradient";
import TopThreeDisplay from "../../components/common/TopThreeDisplay"; // Adjust path
import LeaderListItem from "../../components/common/LeaderListItem"; // Adjust path
import { useTheme } from "../../context/ThemeContext"; // Adjust path
import { authInstance } from "../../config/firebaseConfig"; // Adjust path

const LEADERBOARD_TOP_N = 10; // Show Top 10

const StatsScreen = ({ navigation }) => {
  // Added navigation for potential future use
  const { theme } = useTheme();
  const [leaders, setLeaders] = useState([]); // Top N leaders
  const [currentUserData, setCurrentUserData] = useState(null); // Logged-in user if not in top N
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const currentUserId = authInstance.currentUser?.uid;

  const fetchLeaderboard = useCallback(async () => {
    console.log("StatsScreen: Fetching leaderboard data...");
    setError(null);
    // Don't set isLoading to true if it's just a refresh, only for initial load
    // setRefreshing will handle the pull-to-refresh indicator

    try {
      // 1. Fetch Top N leaders
      const topNQuery = firestore()
        .collection("userStats")
        .orderBy("totalStars", "desc")
        .limit(LEADERBOARD_TOP_N);

      const topNSnapshot = await topNQuery.get();
      const fetchedTopNLeaders = [];
      let isCurrentUserInTopN = false;

      topNSnapshot.forEach((doc, index) => {
        const leaderData = {
          id: doc.id,
          rank: index + 1,
          points: doc.data()?.totalStars || 0,
          name:
            doc.data()?.username ||
            doc.data()?.displayName ||
            `User ${doc.id.substring(0, 4)}`,
          photoURL: doc.data()?.photoURL || null,
        };
        fetchedTopNLeaders.push(leaderData);
        if (doc.id === currentUserId) {
          isCurrentUserInTopN = true;
        }
      });
      setLeaders(fetchedTopNLeaders);
      setCurrentUserData(null); // Reset current user data if they fall out of top N display

      // 2. If logged-in user is not in Top N, fetch their data and rank
      if (currentUserId && !isCurrentUserInTopN) {
        const currentUserStatsSnap = await firestore()
          .collection("userStats")
          .doc(currentUserId)
          .get();

        if (currentUserStatsSnap.exists) {
          const currentUserStats = currentUserStatsSnap.data();
          const currentUserScore = currentUserStats.totalStars || 0;

          // Get count of users with more stars than current user
          const rankQuery = firestore()
            .collection("userStats")
            .where("totalStars", ">", currentUserScore);

          const rankSnapshot = await rankQuery.count().get(); // Use count()
          const usersAhead = rankSnapshot.data().count;
          const currentUserRank = usersAhead + 1;

          setCurrentUserData({
            id: currentUserId,
            rank: currentUserRank,
            points: currentUserScore,
            name:
              currentUserStats.username ||
              currentUserStats.displayName ||
              `User ${currentUserId.substring(0, 4)}`,
            photoURL: currentUserStats.photoURL || null,
            isCurrentUser: true, // Flag to style differently if needed
          });
          console.log(
            `Current user (${currentUserId}) rank: ${currentUserRank}, score: ${currentUserScore}`
          );
        } else {
          console.log(`Current user (${currentUserId}) stats not found.`);
          setCurrentUserData(null); // No data for current user
        }
      } else if (currentUserId && isCurrentUserInTopN) {
        setCurrentUserData(null); // User is in top N, clear separate display data
      }
    } catch (err) {
      console.error("StatsScreen: Leaderboard fetch error:", err);
      setError("Could not load leaderboard. Please try again.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [currentUserId]); // Re-fetch if currentUserId changes (e.g., login/logout while screen is cached)

  useEffect(() => {
    setIsLoading(true); // Set loading for initial fetch
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // --- Prepare data for rendering ---
  const topThree = leaders.slice(0, 3);
  const restOfList = leaders.slice(3, LEADERBOARD_TOP_N); // Only show up to Top N from 'leaders'

  // --- Render States ---
  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.textPrimary} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text
          style={[styles.centeredText, { color: theme.warningRed || "red" }]}
        >
          {error}
        </Text>
        <Button
          title="Retry"
          onPress={fetchLeaderboard}
          color={theme.primaryOrange}
        />
      </View>
    );
  }
  if (leaders.length === 0 && !currentUserData) {
    // Check both leader list and current user data
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.centeredText, { color: theme.textSecondary }]}>
          Leaderboard is currently empty.
        </Text>
        <Button
          title="Refresh"
          onPress={onRefresh}
          color={theme.primaryOrange}
        />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={theme.backgroundGradient || ["#8B0000", "#D3D3D3"]}
      style={styles.gradientFill}
    >
      <FlatList
        data={restOfList}
        keyExtractor={(item) => item.id}
        renderItem={(
          { item } // 'index' here is for 'restOfList', so rank is already in item.rank
        ) => (
          <LeaderListItem item={item} /> // Pass the whole item which includes rank
        )}
        ListHeaderComponent={
          <>
            <TopThreeDisplay topLeaders={topThree} />
            {/* Add a small separator if there are more leaders after top 3 */}
            {restOfList.length > 0 && (
              <View
                style={[
                  styles.listSeparator,
                  { backgroundColor: theme.border || "#ccc" },
                ]}
              />
            )}
          </>
        }
        ListFooterComponent={
          currentUserData && ( // Render current user at the bottom if they exist and are not in top N
            <>
              <View
                style={[
                  styles.listSeparator,
                  {
                    backgroundColor: theme.border || "#ccc",
                    marginVertical: 15,
                  },
                ]}
              />
              <Text
                style={[
                  styles.currentUserSectionTitle,
                  { color: theme.textPrimary },
                ]}
              >
                Your Rank
              </Text>
              <LeaderListItem item={currentUserData} isCurrentUser={true} />
            </>
          )
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primaryOrange}
          />
        }
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientFill: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  centeredText: { textAlign: "center", fontSize: 16, padding: 20 },
  listContent: { paddingBottom: 20 },
  listSeparator: {
    height: 1,
    marginHorizontal: 20, // Or full width
    marginTop: 10, // Space after top three before list starts
  },
  currentUserSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  // Container for StatsScreen itself is removed if not needed (e.g. if BottomTabNavigator provides background)
  // Or defined in BottomTabNavigator screenOptions
});

export default StatsScreen;

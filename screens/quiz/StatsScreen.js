// screens/quiz/StatsScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
  Button,
} from "react-native";
// REMOVE direct firestore import for leaderboard queries
// import firestore from "@react-native-firebase/firestore";
import functions from "@react-native-firebase/functions"; // MODIFIED: Import Firebase Functions
import { LinearGradient } from "expo-linear-gradient";
import TopThreeDisplay from "../../components/common/TopThreeDisplay";
import LeaderListItem from "../../components/common/LeaderListItem";
import { useTheme } from "../../context/ThemeContext";
import { authInstance } from "../../config/firebaseConfig";

const LEADERBOARD_TOP_N = 10;

const StatsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [leaders, setLeaders] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null); // For user NOT in top N, or null
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // currentUserId is still useful for client-side highlighting if needed
  const currentUserId = authInstance.currentUser?.uid;

  const fetchLeaderboard = useCallback(async () => {
    console.log("StatsScreen: Fetching leaderboard data via Cloud Function...");
    setError(null);

    try {
      // MODIFIED: Call the Cloud Function
      const getLeaderboardDataCallable =
        functions().httpsCallable("getLeaderboardData");
      const response = await getLeaderboardDataCallable({
        topN: LEADERBOARD_TOP_N,
      });

      // console.log(
      //   "Data received from Cloud Function by client:",
      //   JSON.stringify(response.data, null, 2)
      // );

      // Ensure response.data exists and has the expected structure
      if (response && response.data) {
        setLeaders(response.data.leaderboard || []);
        setCurrentUserData(response.data.currentUserData || null); // Will be null if user in topN or no data
        // console.log(
        //   "StatsScreen: Data received from Cloud Function:",
        //   response.data
        // );
      } else {
        throw new Error("Invalid response structure from Cloud Function.");
      }
    } catch (err) {
      console.error(
        "StatsScreen: Leaderboard fetch error (Cloud Function):",
        err
      );
      let errorMessage = "Could not load leaderboard. Please try again.";
      if (err.message) {
        errorMessage = err.message; // Show more specific error from function if available
      }
      if (err.details && err.details.originalErrorMessage) {
        // For HttpsError details
        console.error(
          "Original error details:",
          err.details.originalErrorMessage
        );
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []); // Removed currentUserId from dependency array as function call doesn't directly use it on client side.
  // The Cloud Function uses the authenticated user's context.

  useEffect(() => {
    setIsLoading(true);
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // --- Prepare data for rendering (no change here) ---
  const topThree = leaders.slice(0, 3);
  const restOfList = leaders.slice(3, LEADERBOARD_TOP_N);

  // --- Render States (no major change here, just ensure theme keys are robust) ---
  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator
          size="large"
          color={theme.accent || theme.primaryOrange || "blue"}
        />
      </View>
    );
  }
  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text
          style={[
            styles.errorText,
            { color: theme.warning || theme.errorRed || "red" },
          ]}
        >
          {error}
        </Text>
        <Button
          title="Retry"
          onPress={fetchLeaderboard}
          color={theme.accent || theme.primaryOrange || "blue"}
        />
      </View>
    );
  }
  // Check if leaders array itself is empty AND there's no separate currentUserData
  if (leaders.length === 0 && !currentUserData) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text
          style={[
            styles.centeredText,
            { color: theme.textSecondary || "#666" },
          ]}
        >
          Leaderboard is currently empty or could not be loaded.
        </Text>
        <Button
          title="Refresh"
          onPress={onRefresh}
          color={theme.accent || theme.primaryOrange || "blue"}
        />
      </View>
    );
  }

  // The rest of your return () and styles remain the same as previously refactored for theming.
  // Ensure LeaderListItem and TopThreeDisplay correctly use their theme props or useTheme hook.

  return (
    <LinearGradient
      colors={
        theme.gradientStart && theme.gradientEnd
          ? [theme.gradientStart, theme.gradientEnd]
          : ["#4c669f", "#3b5998"]
      }
      style={styles.gradientFill}
    >
      <FlatList
        data={restOfList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LeaderListItem
            item={item}
            isCurrentUser={item.id === currentUserId}
          />
        )}
        ListHeaderComponent={
          <>
            <TopThreeDisplay topLeaders={topThree} />
            {restOfList.length > 0 && leaders.length > 3 && (
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
          currentUserData && ( // Only render if currentUserData is populated (meaning user NOT in topN)
            <>
              <View
                style={[
                  styles.listSeparator,
                  {
                    height: 2,
                    backgroundColor: theme.border || "#ccc",
                    marginVertical: 20,
                    marginHorizontal: 20,
                  },
                ]}
              />
              <Text
                style={[
                  styles.currentUserSectionTitle,
                  { color: theme.textPrimary },
                ]}
              >
                {" "}
                Your Rank{" "}
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
            tintColor={theme.accent || theme.primaryOrange}
            colors={[theme.accent || theme.primaryOrange]}
            progressBackgroundColor={theme.cardBackground}
          />
        }
      />
    </LinearGradient>
  );
};

// Your StyleSheet (styles) should remain the same as previously refactored for theming
// Make sure the styles.gradientFill, styles.centered, styles.errorText etc. are defined
const styles = StyleSheet.create({
  gradientFill: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  centeredText: { textAlign: "center", fontSize: 16, paddingVertical: 10 },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    paddingVertical: 10,
    marginBottom: 10,
  },
  listContent: { paddingBottom: 20 },
  listSeparator: {
    height: 1,
    marginHorizontal: 30,
    marginTop: 15,
    marginBottom: 5,
  },
  currentUserSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 0,
  },
});

export default StatsScreen;

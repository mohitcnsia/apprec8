// screens/quiz/StatsScreen.js
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
  Button,
  Animated,
} from "react-native";
import functions from "@react-native-firebase/functions";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

import TopThreeDisplay from "../../components/common/TopThreeDisplay"; // Adjust path
import LeaderListItem from "../../components/common/LeaderListItem"; // Adjust path
import { useTheme } from "../../context/ThemeContext"; // Adjust path
import { authInstance } from "../../config/firebaseConfig"; // Adjust path

const LEADERBOARD_TOP_N = 10;
const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes (or 30 * 60 * 1000 for 30)
const INFO_LABEL_DURATION = 5000; // 5 seconds

const ASYNC_STORAGE_CACHE_KEY = "leaderboardCache";
const ASYNC_STORAGE_TIMESTAMP_KEY = "leaderboardCacheTimestamp";

const StatsScreen = ({ navigation }) => {
  const { theme } = useTheme();

  // State Variables
  const [leaders, setLeaders] = useState([]); // Holds the top N list
  const [currentUserData, setCurrentUserData] = useState(null); // Holds current user's rank data if NOT in top N
  const [isLoading, setIsLoading] = useState(true); // Primarily for initial load when no cache exists
  const [error, setError] = useState(null); // Holds error messages
  const [refreshing, setRefreshing] = useState(false); // Controls RefreshControl spinner
  const [lastSuccessfulFetchTimestamp, setLastSuccessfulFetchTimestamp] =
    useState(null); // Tracks last server fetch time
  const [showRefreshInfoLabel, setShowRefreshInfoLabel] = useState(false); // Controls info label visibility

  // Refs
  const refreshInfoOpacity = useRef(new Animated.Value(0)).current; // For label animation
  const isActiveRef = useRef(true); // To track if component is mounted/focused for async operations

  const currentUserId = authInstance.currentUser?.uid;

  // Styles dependent on theme
  const componentStyles = useMemo(
    () =>
      StyleSheet.create({
        gradientFill: { flex: 1 },
        centered: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        },
        centeredText: {
          textAlign: "center",
          fontSize: 16,
          paddingVertical: 10,
        },
        errorText: {
          textAlign: "center",
          fontSize: 16,
          paddingVertical: 10,
          marginBottom: 10,
          fontWeight: "bold",
        },
        inlineErrorView: {
          padding: 10,
          marginHorizontal: 15,
          backgroundColor: theme.warningBackground || "#ffcccb40",
          borderRadius: 5,
          marginBottom: 10,
        },
        inlineErrorText: {
          textAlign: "center",
          fontSize: 14,
        },
        listContent: {
          paddingTop: 10,
          paddingBottom: 20,
        },
        listSeparator: {
          height: 1,
          marginHorizontal: 30,
          marginTop: 15,
          marginBottom: 5,
          // backgroundColor applied inline using theme.border
        },
        currentUserSectionTitle: {
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 10,
          marginTop: 0,
          // color applied inline using theme.textPrimary
        },
        refreshInfoContainer: {
          position: "absolute",
          top: 0, // Adjust if you have a header
          left: 0,
          right: 0,
          backgroundColor: theme.infoBlockBackground || "#00000090",
          paddingVertical: 8, // Adjusted padding
          paddingHorizontal: 15,
          alignItems: "center",
          zIndex: 10,
        },
        refreshInfoText: {
          fontSize: 13,
          textAlign: "center",
          // color applied inline using theme.textPrimaryOnGradient or theme.textPrimary
        },
        loadingText: {
          // Added style for loading text
          marginTop: 10,
          // color applied inline using theme.textSecondary
        },
      }),
    [theme]
  );

  // --- Data Fetching and Caching ---

  // Fetches data from Cloud Function
  const fetchLeaderboardDataFromServer = useCallback(async () => {
    console.log(
      "StatsScreen: Fetching leaderboard data from Cloud Function..."
    );
    try {
      const getLeaderboardDataCallable =
        functions().httpsCallable("getLeaderboardData");
      const response = await getLeaderboardDataCallable({
        topN: LEADERBOARD_TOP_N,
      });
      if (response?.data?.leaderboard) {
        // Check if response structure is valid
        const fetchedData = {
          leaders: Array.isArray(response.data.leaderboard)
            ? response.data.leaderboard
            : [], // Ensure array
          currentUserData: response.data.currentUserData || null,
        };
        console.log(
          "StatsScreen: Data successfully received from Cloud Function."
        );
        return fetchedData;
      } else {
        console.error(
          "StatsScreen: Invalid response structure from Cloud Function.",
          response
        );
        throw new Error("Invalid data format from server.");
      }
    } catch (err) {
      console.error(
        "StatsScreen: Leaderboard fetch error (Cloud Function call):",
        err
      );
      let UImessage = "Could not load leaderboard.";
      if (err.message) {
        UImessage =
          err.code === "functions/internal" ||
          err.message.toLowerCase().includes("internal")
            ? "Leaderboard update failed. Please try again."
            : err.message;
      }
      err.UImessage = UImessage;
      throw err;
    }
  }, []);

  // Updates component state and saves to AsyncStorage
  const updateStateAndCache = useCallback(async (data) => {
    if (data && typeof data === "object" && isActiveRef.current) {
      // Check active ref
      const leadersToSet = Array.isArray(data.leaders) ? data.leaders : [];
      const currentUserToSet = data.currentUserData || null;

      setLeaders(leadersToSet);
      setCurrentUserData(currentUserToSet);

      const now = Date.now();
      setLastSuccessfulFetchTimestamp(now); // Update timestamp state

      const dataToCache = {
        leaders: leadersToSet,
        currentUserData: currentUserToSet,
      };
      try {
        await AsyncStorage.setItem(
          ASYNC_STORAGE_CACHE_KEY,
          JSON.stringify(dataToCache)
        );
        await AsyncStorage.setItem(ASYNC_STORAGE_TIMESTAMP_KEY, now.toString());
        console.log("StatsScreen: Cache updated in AsyncStorage.");
      } catch (e) {
        console.warn("StatsScreen: Failed to save data to AsyncStorage:", e);
      }
    } else if (isActiveRef.current) {
      console.warn(
        "StatsScreen: updateStateAndCache called with invalid data",
        data
      );
    }
  }, []); // Removed state setters from deps, they are stable

  // --- Effects ---

  // Effect to manage mounted state for async operations/timeouts
  useEffect(() => {
    isActiveRef.current = true;
    return () => {
      isActiveRef.current = false;
    };
  }, []);

  // Effect for focus/blur: Load initial data (cache or network) and set interval
  useFocusEffect(
    useCallback(() => {
      isActiveRef.current = true;
      console.log("StatsScreen: Screen focused.");

      const loadData = async () => {
        let loadedFromCacheAndFresh = false;
        if (!isActiveRef.current) return;
        // Assume loading initially, but might be set to false quickly if cache is hit
        setIsLoading(true);
        setError(null); // Clear errors on focus load attempt

        try {
          // 1. Try to load from AsyncStorage
          const cachedDataJSON = await AsyncStorage.getItem(
            ASYNC_STORAGE_CACHE_KEY
          );
          const cachedTimestampJSON = await AsyncStorage.getItem(
            ASYNC_STORAGE_TIMESTAMP_KEY
          );

          if (cachedDataJSON && cachedTimestampJSON) {
            let cache = null;
            try {
              cache = JSON.parse(cachedDataJSON);
            } catch (e) {
              console.error("StatsScreen: Cache parse error:", e);
            }

            if (cache && typeof cache === "object") {
              const timestamp = parseInt(cachedTimestampJSON, 10);
              if (
                !isNaN(timestamp) &&
                Date.now() - timestamp < REFRESH_INTERVAL &&
                Array.isArray(cache.leaders)
              ) {
                if (isActiveRef.current) {
                  console.log(
                    "StatsScreen: Using fresh data from AsyncStorage cache."
                  );
                  await updateStateAndCache(cache); // Update state and timestamp from cache
                  setIsLoading(false); // Loaded from cache, no full loader needed
                  loadedFromCacheAndFresh = true;
                }
              } else {
                console.log(
                  "StatsScreen: Cache found but is stale or invalid."
                );
              }
            }
          } else {
            console.log("StatsScreen: No cache found.");
          }
        } catch (e) {
          console.warn("StatsScreen: Error reading AsyncStorage cache:", e);
        }

        // 2. Fetch from network if needed
        if (isActiveRef.current) {
          if (!loadedFromCacheAndFresh) {
            console.log("StatsScreen: No fresh cache, fetching from network.");
            // setIsLoading(true) should already be set
          } else {
            console.log(
              "StatsScreen: Fresh cache loaded, triggering background update."
            );
            // Optionally trigger background fetch immediately
          }

          // Always fetch on focus (either initial or background) unless cache was just loaded AND we decide not to background fetch
          try {
            const freshData = await fetchLeaderboardDataFromServer();
            if (isActiveRef.current) {
              await updateStateAndCache(freshData);
              setError(null); // Clear errors on success
            }
          } catch (e) {
            console.error(
              "StatsScreen: Error during focused fetch from server:",
              e
            );
            if (isActiveRef.current) {
              setError(e.UImessage || "Failed to fetch leaderboard.");
            }
          } finally {
            // Ensure loader is off only if we are sure we aren't still loading initial cache
            if (isActiveRef.current) setIsLoading(false);
          }
        }
      };

      loadData(); // Run load sequence on focus

      // 3. Setup periodic refresh interval
      const intervalId = setInterval(async () => {
        if (isActiveRef.current) {
          console.log("StatsScreen: Periodic refresh triggered.");
          try {
            const freshData = await fetchLeaderboardDataFromServer();
            if (isActiveRef.current) {
              await updateStateAndCache(freshData);
              setError(null); // Clear error on successful background refresh
            }
          } catch (e) {
            if (isActiveRef.current) {
              console.warn(
                "StatsScreen: Periodic background refresh failed:",
                e.UImessage
              );
              setError(e.UImessage || "Failed to update leaderboard.");
            }
          }
        } else {
          // If not active, clear interval just in case (should be cleared by cleanup)
          console.log(
            "StatsScreen: Interval fired but screen not active, clearing."
          );
          clearInterval(intervalId);
        }
      }, REFRESH_INTERVAL);

      // 4. Return cleanup function
      return () => {
        isActiveRef.current = false;
        console.log("StatsScreen: Screen blurred, clearing interval.");
        clearInterval(intervalId);
      };
    }, [fetchLeaderboardDataFromServer, updateStateAndCache]) // Dependencies
  );

  // --- UI Event Handlers ---

  // Displays the info label and fades it out
  const displayRefreshInfo = useCallback(() => {
    if (isActiveRef.current) {
      setShowRefreshInfoLabel(true);
      refreshInfoOpacity.setValue(0);
      Animated.timing(refreshInfoOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      const timerId = setTimeout(() => {
        if (isActiveRef.current) {
          Animated.timing(refreshInfoOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            if (isActiveRef.current) setShowRefreshInfoLabel(false);
          });
        }
      }, INFO_LABEL_DURATION);
      // Could store timerId in a ref and clear in cleanup if needed, but likely okay
    }
  }, [refreshInfoOpacity]);

  // Handles pull-to-refresh, checking timestamp first
  const onRefresh = useCallback(async () => {
    console.log("StatsScreen: Manual pull-to-refresh initiated.");
    const now = Date.now();
    const intervalToUse = REFRESH_INTERVAL || 30 * 60 * 1000;

    if (
      lastSuccessfulFetchTimestamp &&
      now - lastSuccessfulFetchTimestamp < intervalToUse
    ) {
      console.log(
        `StatsScreen: Manual refresh too soon. Skipping server fetch.`
      );
      displayRefreshInfo(); // Show the info label
      setRefreshing(true);
      const quickHideTimer = setTimeout(() => {
        if (isActiveRef.current) setRefreshing(false);
      }, 500);
      return;
    }

    console.log("StatsScreen: Refresh interval passed, fetching from server.");
    setRefreshing(true);
    setError(null);

    try {
      const freshData = await fetchLeaderboardDataFromServer();
      if (isActiveRef.current) await updateStateAndCache(freshData);
    } catch (e) {
      console.error("StatsScreen: Error during manual refresh:", e);
      if (isActiveRef.current)
        setError(e.UImessage || "Failed to refresh leaderboard.");
    } finally {
      if (isActiveRef.current) setRefreshing(false);
    }
  }, [
    lastSuccessfulFetchTimestamp,
    fetchLeaderboardDataFromServer,
    updateStateAndCache,
    displayRefreshInfo,
  ]);

  // --- Render Logic ---
  const topThree = Array.isArray(leaders) ? leaders.slice(0, 3) : [];
  const restOfList = Array.isArray(leaders)
    ? leaders.slice(3, Math.min(leaders.length, LEADERBOARD_TOP_N))
    : [];

  // Loading State
  if (isLoading) {
    return (
      <View
        style={[
          componentStyles.centered,
          { backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={theme.accent || theme.primaryOrange || "blue"}
        />
        <Text
          style={[componentStyles.loadingText, { color: theme.textSecondary }]}
        >
          Loading Leaderboard...
        </Text>
      </View>
    );
  }

  // Error State (only if no data to display at all)
  if (error && leaders.length === 0 && !currentUserData) {
    return (
      <View
        style={[
          componentStyles.centered,
          { backgroundColor: theme.background },
        ]}
      >
        <Text
          style={[
            componentStyles.errorText,
            { color: theme.warning || theme.errorRed || "red" },
          ]}
        >
          {error}
        </Text>
        <Button
          title="Retry"
          onPress={async () => {
            // Make retry async
            if (!isLoading) {
              // Basic debounce for retry button
              setIsLoading(true);
              setError(null);
              try {
                const freshData = await fetchLeaderboardDataFromServer();
                if (isActiveRef.current) await updateStateAndCache(freshData);
              } catch (e) {
                if (isActiveRef.current)
                  setError(e.UImessage || "Failed to fetch.");
              } finally {
                if (isActiveRef.current) setIsLoading(false);
              }
            }
          }}
          color={theme.accent || theme.primaryOrange || "blue"}
        />
      </View>
    );
  }

  // Empty State (no data, not loading, no error)
  if (leaders.length === 0 && !currentUserData && !error && !isLoading) {
    return (
      <View
        style={[
          componentStyles.centered,
          { backgroundColor: theme.background },
        ]}
      >
        <Text
          style={[
            componentStyles.centeredText,
            { color: theme.textSecondary || "#666" },
          ]}
        >
          Leaderboard is currently empty.
        </Text>
        <Button
          title="Refresh"
          onPress={onRefresh}
          color={theme.accent || theme.primaryOrange || "blue"}
        />
      </View>
    );
  }

  // Main UI Render
  return (
    <LinearGradient
      colors={
        theme.gradientStart && theme.gradientEnd
          ? [theme.gradientStart, theme.gradientEnd]
          : ["#4c669f", "#3b5998"]
      }
      style={componentStyles.gradientFill}
    >
      {showRefreshInfoLabel && (
        <Animated.View
          style={[
            componentStyles.refreshInfoContainer,
            { opacity: refreshInfoOpacity },
          ]}
        >
          <Text
            style={[
              componentStyles.refreshInfoText,
              { color: theme.textPrimaryOnGradient || theme.textPrimary },
            ]}
          >
            The Leaderboard updates every {REFRESH_INTERVAL / 60 / 1000}{" "}
            minutes.
          </Text>
        </Animated.View>
      )}
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
            {/* Inline error display if showing potentially stale data */}
            {error && (leaders.length > 0 || currentUserData) && (
              <View style={componentStyles.inlineErrorView}>
                <Text
                  style={[
                    componentStyles.inlineErrorText,
                    { color: theme.warning || theme.errorRed },
                  ]}
                >
                  {error}. Displaying last loaded data.
                </Text>
              </View>
            )}
            <TopThreeDisplay topLeaders={topThree} />
            {restOfList.length > 0 && leaders.length > 3 && (
              <View
                style={[
                  componentStyles.listSeparator,
                  { backgroundColor: theme.border || "#ccc" },
                ]}
              />
            )}
          </>
        }
        ListFooterComponent={
          currentUserData && (
            <>
              <View
                style={[
                  componentStyles.listSeparator,
                  {
                    height: 1,
                    backgroundColor: theme.border || "#ccc",
                    marginVertical: 15,
                    marginHorizontal: 20,
                  },
                ]}
              />
              <Text
                style={[
                  componentStyles.currentUserSectionTitle,
                  { color: theme.textPrimary },
                ]}
              >
                Your Rank
              </Text>
              <LeaderListItem item={currentUserData} isCurrentUser={true} />
            </>
          )
        }
        contentContainerStyle={componentStyles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.accent || theme.primaryOrange} // iOS spinner color
            colors={[theme.accent || theme.primaryOrange]} // Android spinner color(s)
            progressBackgroundColor={theme.cardBackground} // Android spinner background
          />
        }
      />
    </LinearGradient>
  );
};

export default StatsScreen;

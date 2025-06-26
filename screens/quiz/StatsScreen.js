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
import { getApp } from "@react-native-firebase/app";
import { getFunctions, httpsCallable } from "@react-native-firebase/functions";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import TopThreeDisplay from "../../components/common/TopThreeDisplay";
import LeaderListItem from "../../components/common/LeaderListItem";
import { useTheme } from "../../context/ThemeContext";
import { authInstance } from "../../config/firebaseConfig";

const LEADERBOARD_DISPLAY_LIMIT = 10; // How many users to show in the main list
const REFRESH_INTERVAL = 10 * 60 * 1000;
const INFO_LABEL_DURATION = 5000;

const ASYNC_STORAGE_CACHE_KEY = "leaderboardCache_v3_split"; // Changed key for new data structure
const ASYNC_STORAGE_TIMESTAMP_KEY = "leaderboardCacheTimestamp_v3";

const getDisplayName = (leaderObject) => {
  if (!leaderObject) return "User";
  const firstName = leaderObject.firstName?.trim();
  const lastName = leaderObject.lastName?.trim();
  const username = leaderObject.username?.trim();
  const originalNameField = leaderObject.name?.trim();
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  if (username) return username;
  if (originalNameField) return originalNameField;
  return `User #${(leaderObject.id || "anon").substring(0, 4)}`;
};

const StatsScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const [leaders, setLeaders] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSuccessfulFetchTimestamp, setLastSuccessfulFetchTimestamp] =
    useState(null);
  const [showRefreshInfoLabel, setShowRefreshInfoLabel] = useState(false);

  const refreshInfoOpacity = useRef(new Animated.Value(0)).current;
  const isActiveRef = useRef(true);
  const currentUserId = authInstance.currentUser?.uid;

  const componentStyles = useMemo(() => getStyles(theme), [theme]);

  const updateStateAndCache = useCallback(
    async (data) => {
      if (!isActiveRef.current || !data || typeof data !== "object") return;
      const rawLeaders = Array.isArray(data.leaders) ? data.leaders : [];
      const rawCurrentUser = data.currentUserData || null;

      const processedLeaders = rawLeaders.map((leader) => ({
        ...leader,
        id: String(leader.id || leader.userId || Math.random()),
        computedDisplayName: getDisplayName(leader),
      }));
      const processedCurrentUser = rawCurrentUser
        ? {
            ...rawCurrentUser,
            id: String(
              rawCurrentUser.id || rawCurrentUser.userId || currentUserId
            ),
            computedDisplayName: getDisplayName(rawCurrentUser),
          }
        : null;

      setLeaders(processedLeaders);
      setCurrentUserData(processedCurrentUser);
      const now = Date.now();
      setLastSuccessfulFetchTimestamp(now);
      try {
        await AsyncStorage.setItem(
          ASYNC_STORAGE_CACHE_KEY,
          JSON.stringify({
            leaders: processedLeaders,
            currentUserData: processedCurrentUser,
          })
        );
        await AsyncStorage.setItem(ASYNC_STORAGE_TIMESTAMP_KEY, now.toString());
      } catch (e) {
        console.warn("StatsScreen: Failed to save to AsyncStorage:", e);
      }
    },
    [currentUserId]
  );

  const fetchLeaderboardDataFromServer = useCallback(async () => {
    console.log(
      "StatsScreen: Fetching leaderboard and user rank data in parallel..."
    );
    if (!currentUserId) {
      throw new Error("User not authenticated.");
    }
    try {
      // --- FIX: Initialize functions service explicitly ---
      const app = getApp();
      const funcs = getFunctions(app);

      // Use the new modular httpsCallable
      const getLeaderboard = httpsCallable(funcs, "getLeaderboard");
      const getCurrentUserRank = httpsCallable(funcs, "getCurrentUserRank");

      // The rest of the logic is the same
      const [leaderboardResponse, userRankResponse] = await Promise.all([
        getLeaderboard({ topN: LEADERBOARD_DISPLAY_LIMIT }),
        getCurrentUserRank(),
      ]);

      const freshLeaders = leaderboardResponse?.data?.leaderboard || [];
      const freshCurrentUser = userRankResponse?.data || null;

      const isCurrentUserInTopList = freshLeaders.some(
        (leader) => leader.id === currentUserId
      );
      const finalCurrentUser = isCurrentUserInTopList ? null : freshCurrentUser;

      return {
        leaders: freshLeaders,
        currentUserData: finalCurrentUser,
      };
    } catch (err) {
      console.error("StatsScreen: Leaderboard fetch error:", err);
      const UImessage = (
        err.details?.message ||
        err.message ||
        "Could not load leaderboard."
      ).toString();
      const errorToThrow = new Error(UImessage);
      errorToThrow.code = err.code;
      throw errorToThrow;
    }
  }, [currentUserId]);

  useEffect(() => {
    isActiveRef.current = true;
    return () => {
      isActiveRef.current = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      console.log("StatsScreen: Focused.");
      setError(null);
      let initialLoad = true;

      const loadData = async () => {
        let loadedFromCacheAndFresh = false;
        if (!isMounted) return;

        try {
          const cachedDataJSON = await AsyncStorage.getItem(
            ASYNC_STORAGE_CACHE_KEY
          );
          const cachedTimestampJSON = await AsyncStorage.getItem(
            ASYNC_STORAGE_TIMESTAMP_KEY
          );
          if (cachedDataJSON && cachedTimestampJSON) {
            const cache = JSON.parse(cachedDataJSON);
            const timestamp = parseInt(cachedTimestampJSON, 10);
            if (
              cache &&
              Array.isArray(cache.leaders) &&
              !isNaN(timestamp) &&
              Date.now() - timestamp < REFRESH_INTERVAL
            ) {
              if (!isMounted) return;
              console.log("StatsScreen: Using fresh cache.");
              setLeaders(cache.leaders);
              setCurrentUserData(cache.currentUserData);
              setLastSuccessfulFetchTimestamp(timestamp);
              setIsLoading(false);
              initialLoad = false;
              loadedFromCacheAndFresh = true;
            } else if (cache && Array.isArray(cache.leaders)) {
              if (!isMounted) return;
              console.log("StatsScreen: Using stale cache while fetching.");
              setLeaders(cache.leaders);
              setCurrentUserData(cache.currentUserData);
              setIsLoading(false);
              initialLoad = false;
            }
          }
        } catch (e) {
          console.warn("StatsScreen: Cache read error:", e);
        }

        if (initialLoad && isMounted) {
          setIsLoading(true);
        }

        if (isMounted && !loadedFromCacheAndFresh) {
          console.log("StatsScreen: Fetching from network (initial or stale).");
          try {
            const freshData = await fetchLeaderboardDataFromServer();
            if (isMounted) {
              await updateStateAndCache(freshData);
              setError(null);
            }
          } catch (e) {
            if (isMounted) {
              const errorMessage = (
                e.message || "Failed to fetch leaderboard."
              ).toString();
              setError(
                leaders.length > 0
                  ? `${errorMessage} (displaying older data)`
                  : errorMessage
              );
            }
          } finally {
            if (isMounted) setIsLoading(false);
          }
        } else if (isMounted) {
          setIsLoading(false);
        }
      };

      loadData();
      const intervalId = setInterval(async () => {
        if (isMounted && isActiveRef.current) {
          console.log("StatsScreen: Periodic refresh.");
          try {
            const freshData = await fetchLeaderboardDataFromServer();
            if (isMounted && isActiveRef.current) {
              await updateStateAndCache(freshData);
              setError(null);
            }
          } catch (e) {
            if (isMounted && isActiveRef.current)
              console.warn("StatsScreen: Periodic refresh failed:", e.message);
          }
        } else {
          clearInterval(intervalId);
        }
      }, REFRESH_INTERVAL);
      return () => {
        isMounted = false;
        clearInterval(intervalId);
      };
    }, [fetchLeaderboardDataFromServer, updateStateAndCache, leaders.length])
  );

  const onRefresh = useCallback(async () => {
    if (!isActiveRef.current) return;
    console.log("StatsScreen: Manual refresh.");
    setRefreshing(true);
    setError(null);
    try {
      const freshData = await fetchLeaderboardDataFromServer();
      if (isActiveRef.current) await updateStateAndCache(freshData);
    } catch (e) {
      if (isActiveRef.current)
        setError((e.message || "Failed to refresh.").toString());
    } finally {
      if (isActiveRef.current) setRefreshing(false);
    }
  }, [fetchLeaderboardDataFromServer, updateStateAndCache]);

  const topThree = Array.isArray(leaders) ? leaders.slice(0, 3) : [];
  const restOfList = Array.isArray(leaders)
    ? leaders.slice(3, Math.min(leaders.length, LEADERBOARD_DISPLAY_LIMIT))
    : [];

  const renderListHeader = () => (
    <>
      {error && (leaders.length > 0 || currentUserData) && (
        <View style={componentStyles.inlineErrorView}>
          <Text style={componentStyles.inlineErrorText}>{error}</Text>
        </View>
      )}
      <TopThreeDisplay topLeaders={topThree} currentUserId={currentUserId} />
      {restOfList.length > 0 && leaders.length > 3 && (
        <View style={componentStyles.listSeparator} />
      )}
    </>
  );

  const renderListFooter = () =>
    currentUserData && (
      <>
        <View style={componentStyles.listSeparator} />
        <Text style={componentStyles.currentUserSectionTitle}>Your Rank</Text>
        <LeaderListItem item={currentUserData} isCurrentUser={true} />
      </>
    );

  if (isLoading) {
    return (
      <LinearGradient
        colors={
          theme.gradientStart && theme.gradientEnd
            ? [theme.gradientStart, theme.gradientEnd]
            : ["#4c669f", "#3b5998"]
        }
        style={componentStyles.gradientFill}
      >
        <View style={componentStyles.centered}>
          <ActivityIndicator size="large" color={theme.accent || "#FFA500"} />
          <Text style={componentStyles.loadingText}>
            Loading Leaderboard...
          </Text>
        </View>
      </LinearGradient>
    );
  }

  if (error && leaders.length === 0 && !currentUserData) {
    return (
      <LinearGradient
        colors={
          theme.gradientStart && theme.gradientEnd
            ? [theme.gradientStart, theme.gradientEnd]
            : ["#4c669f", "#3b5998"]
        }
        style={componentStyles.gradientFill}
      >
        <View style={componentStyles.centered}>
          <Text style={componentStyles.errorText}>{error}</Text>
          <Button
            title="Retry"
            onPress={onRefresh}
            color={theme.accent || "#FFA500"}
          />
        </View>
      </LinearGradient>
    );
  }

  if (leaders.length === 0 && !currentUserData && !error && !isLoading) {
    return (
      <LinearGradient
        colors={
          theme.gradientStart && theme.gradientEnd
            ? [theme.gradientStart, theme.gradientEnd]
            : ["#4c669f", "#3b5998"]
        }
        style={componentStyles.gradientFill}
      >
        <View style={componentStyles.centered}>
          <Text style={componentStyles.centeredText}>
            Leaderboard is currently empty.
          </Text>
          <Button
            title="Refresh"
            onPress={onRefresh}
            color={theme.accent || "#FFA500"}
          />
        </View>
      </LinearGradient>
    );
  }

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
          {/* This part of the component was not provided, so it is commented out. */}
          {/* <Text style={componentStyles.refreshInfoText}>Leaderboard updates every {REFRESH_INTERVAL / 60 / 1000} min.</Text> */}
        </Animated.View>
      )}
      <FlatList
        data={restOfList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <LeaderListItem
            item={item}
            isCurrentUser={item.id === currentUserId}
          />
        )}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        contentContainerStyle={componentStyles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.accent || "#FFA500"}
            colors={[theme.accent || "#FFA500"]}
            progressBackgroundColor={theme.cardBackground}
          />
        }
      />
    </LinearGradient>
  );
};

const getStyles = (theme) =>
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
      color: theme.textSecondary || "#666",
    },
    errorText: {
      textAlign: "center",
      fontSize: 16,
      paddingVertical: 10,
      marginBottom: 10,
      fontWeight: "bold",
      color: theme.warning || "#FF6B6B",
    },
    inlineErrorView: {
      padding: 10,
      marginHorizontal: 15,
      backgroundColor: theme.warningBackground || "#ffeeee",
      borderRadius: 5,
      marginBottom: 10,
    },
    inlineErrorText: {
      textAlign: "center",
      fontSize: 14,
      color: theme.warning || "#FF6B6B",
    },
    listContent: { paddingTop: 10, paddingBottom: 80, flexGrow: 1 },
    listSeparator: {
      height: 1,
      marginHorizontal: 30,
      marginTop: 15,
      marginBottom: 5,
      backgroundColor: theme.border || "#e0e0e0",
    },
    currentUserSectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
      marginTop: 20,
      color: theme.textPrimary || "#000",
    },
    refreshInfoContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.infoBlockBackground || "rgba(0,0,0,0.7)",
      paddingVertical: 8,
      paddingHorizontal: 15,
      alignItems: "center",
      zIndex: 10,
    },
    refreshInfoText: {
      fontSize: 13,
      textAlign: "center",
      color: theme.textPrimaryOnGradient || "#fff",
    }, // Corrected color key
    loadingText: { marginTop: 10, color: theme.textSecondary || "#666" },
  });

export default StatsScreen;

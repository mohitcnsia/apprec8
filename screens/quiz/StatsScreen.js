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
import AsyncStorage from "@react-native-async-storage/async-storage";

import TopThreeDisplay from "../../components/common/TopThreeDisplay";
import LeaderListItem from "../../components/common/LeaderListItem";
import { useTheme } from "../../context/ThemeContext";
import { authInstance } from "../../config/firebaseConfig";

const LEADERBOARD_TOP_N = 10;
const REFRESH_INTERVAL = 10 * 60 * 1000;
const INFO_LABEL_DURATION = 5000;

const ASYNC_STORAGE_CACHE_KEY = "leaderboardCache_v2_processed";
const ASYNC_STORAGE_TIMESTAMP_KEY = "leaderboardCacheTimestamp_v2";

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
  const [error, setError] = useState(null); // Ensure this is always a string or null
  const [refreshing, setRefreshing] = useState(false);
  const [lastSuccessfulFetchTimestamp, setLastSuccessfulFetchTimestamp] =
    useState(null);
  const [showRefreshInfoLabel, setShowRefreshInfoLabel] = useState(false);

  const refreshInfoOpacity = useRef(new Animated.Value(0)).current;
  const isActiveRef = useRef(true);
  const currentUserId = authInstance.currentUser?.uid;

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
        listContent: { paddingTop: 10, paddingBottom: 80, flexGrow: 1 }, // Added more paddingBottom, flexGrow
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
          color: theme.textPrimaryOnGradient || theme.textLight || "#fff",
        },
        loadingText: { marginTop: 10, color: theme.textSecondary || "#666" },
      }),
    [theme]
  );

  const fetchLeaderboardDataFromServer = useCallback(async () => {
    console.log("StatsScreen: Fetching leaderboard data...");
    try {
      const getLeaderboardDataCallable =
        functions().httpsCallable("getLeaderboardData");
      const response = await getLeaderboardDataCallable({
        topN: LEADERBOARD_TOP_N,
      });
      if (response?.data) {
        return {
          leaders: Array.isArray(response.data.leaderboard)
            ? response.data.leaderboard
            : [],
          currentUserData: response.data.currentUserData || null,
        };
      }
      console.error("StatsScreen: Invalid response structure.", response);
      throw new Error("Invalid data format from server.");
    } catch (err) {
      console.error("StatsScreen: Leaderboard fetch error:", err);
      const UImessage = (
        err.details?.UImessage ||
        err.message ||
        "Could not load leaderboard."
      ).toString();
      const errorToThrow = new Error(UImessage);
      errorToThrow.code = err.code; // Preserve original code if available
      throw errorToThrow;
    }
  }, []);

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
              initialLoad = false; // Not "initial loading" anymore
            }
          }
        } catch (e) {
          console.warn("StatsScreen: Cache read error:", e);
        }

        if (initialLoad && isMounted) {
          setIsLoading(true);
        } // Show loader only if no cache at all

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
          // Cache was fresh, but still ensure loader is off
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
    }, [fetchLeaderboardDataFromServer, updateStateAndCache])
  );

  const displayRefreshInfo = useCallback(() => {
    /* ... As previously provided ... */
    if (!isActiveRef.current) return;
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
  }, [refreshInfoOpacity]);

  const onRefresh = useCallback(async () => {
    /* ... As previously provided ... */
    if (!isActiveRef.current) return;
    console.log("StatsScreen: Manual refresh.");
    const now = Date.now();
    if (
      lastSuccessfulFetchTimestamp &&
      now - lastSuccessfulFetchTimestamp < REFRESH_INTERVAL / 2
    ) {
      displayRefreshInfo();
      setRefreshing(true);
      setTimeout(() => {
        if (isActiveRef.current) setRefreshing(false);
      }, 500);
      return;
    }
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
  }, [
    lastSuccessfulFetchTimestamp,
    fetchLeaderboardDataFromServer,
    updateStateAndCache,
    displayRefreshInfo,
  ]);

  const topThree = Array.isArray(leaders) ? leaders.slice(0, 3) : [];
  const restOfList = Array.isArray(leaders)
    ? leaders.slice(3, Math.min(leaders.length, LEADERBOARD_TOP_N))
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
    currentUserData && ( // Only render if currentUserData exists (meaning user is NOT in top N)
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
            onPress={() => {
              if (isActiveRef.current) {
                setIsLoading(true);
                setError(null);
                fetchLeaderboardDataFromServer()
                  .then((d) => updateStateAndCache(d))
                  .catch((e) =>
                    setError((e.message || "Failed to fetch").toString())
                  )
                  .finally(() => setIsLoading(false));
              }
            }}
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
          <Text style={componentStyles.refreshInfoText}>
            Leaderboard updates every {REFRESH_INTERVAL / 60 / 1000} min.
          </Text>
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

export default StatsScreen;

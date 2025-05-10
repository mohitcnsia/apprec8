// screens/profile/ProfileScreen.js

import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Switch,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { helpTopics } from "../../data/app-topic-data"; // Assuming this path is correct
import ConfirmationModal from "../../components/common/ConfirmationModel"; // Assuming path correct
import { authInstance } from "../../config/firebaseConfig";
import { useTheme } from "../../context/ThemeContext";

const generateAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "App Rec" // Fallback name
  )}&background=random&color=fff&size=128`;

const defaultStatsValues = {
  // Renamed for clarity
  currentStreak: 0,
  totalQuizzesCompleted: 0,
  totalStars: 0,
  // Add other stats from your schema with defaults if needed
  lastQuizCompletionDate: null,
  lastActivityCompletionDate: null,
  lastDailyBonusDate: null,
};

const ProfileScreen = ({ navigation, signoutHandler }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null); // Will hold the entire user document
  // userStats will be derived from userData.stats
  const [userStats, setUserStats] = useState(defaultStatsValues);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const currentAuthUser = authInstance.currentUser;
  const userId = currentAuthUser?.uid;

  // useEffect for real-time listener on the 'users' document
  useEffect(() => {
    if (!userId) {
      setError("Not authenticated. Please sign in.");
      setLoading(false);
      setUserData(null);
      setUserStats(defaultStatsValues);
      return;
    }

    console.log(
      `ProfileScreen: Setting up listener for user document: ${userId}`
    );
    setLoading(true);
    setError(null);

    const userDocumentListener = firestore()
      .collection("users")
      .doc(userId)
      .onSnapshot(
        (documentSnapshot) => {
          console.log("ProfileScreen: User document snapshot received.");
          if (documentSnapshot.exists) {
            const data = documentSnapshot.data();
            setUserData(data); // Store the entire user document

            // Extract stats from the nested data.stats object or use defaults
            const statsData = data.stats || {}; // Handle case where stats object might be missing
            setUserStats({
              currentStreak:
                statsData.currentStreak ?? defaultStatsValues.currentStreak,
              totalQuizzesCompleted:
                statsData.totalQuizzesCompleted ??
                defaultStatsValues.totalQuizzesCompleted,
              totalStars: statsData.totalStars ?? defaultStatsValues.totalStars,
              lastQuizCompletionDate:
                statsData.lastQuizCompletionDate ??
                defaultStatsValues.lastQuizCompletionDate,
              lastActivityCompletionDate:
                statsData.lastActivityCompletionDate ??
                defaultStatsValues.lastActivityCompletionDate,
              lastDailyBonusDate:
                statsData.lastDailyBonusDate ??
                defaultStatsValues.lastDailyBonusDate,
            });
            console.log("Updated userData:", data);
            console.log("Derived userStats:", {
              currentStreak:
                statsData.currentStreak ?? defaultStatsValues.currentStreak,
              totalQuizzesCompleted:
                statsData.totalQuizzesCompleted ??
                defaultStatsValues.totalQuizzesCompleted,
              totalStars: statsData.totalStars ?? defaultStatsValues.totalStars,
            });
          } else {
            console.warn(`User document not found for userId: ${userId}`);
            setUserData(null);
            setUserStats(defaultStatsValues);
          }
          setLoading(false); // Data processed, stop loading
        },
        (err) => {
          console.error("Error fetching user document snapshot:", err);
          setError("Failed to load profile data.");
          setLoading(false);
        }
      );

    // Unsubscribe from listener when the component unmounts or userId changes
    return () => {
      console.log(
        `ProfileScreen: Unsubscribing user document listener for userId: ${userId}`
      );
      userDocumentListener();
    };
  }, [userId]);

  const onRefresh = useCallback(() => {
    console.log("ProfileScreen: Manual refresh triggered.");
    setRefreshing(true);
    // With onSnapshot, data updates in real-time.
    // For now, just simulate the refresh ending as data is live.
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // --- Determine Display Values ---
  const displayName =
    userData?.username || // From Firestore user document's username field
    currentAuthUser?.displayName || // Fallback to Firebase Auth display name
    currentAuthUser?.email?.split("@")[0] ||
    "User";

  const profileImageUri =
    userData?.photoURL || // Use photoURL from Firestore user document
    currentAuthUser?.photoURL || // Fallback to Firebase Auth photoURL
    generateAvatarUrl(displayName);

  const enrollmentDate = useMemo(() => {
    let dateToFormat = null;
    if (userData?.createdAt?.toDate) {
      dateToFormat = userData.createdAt.toDate();
    } else if (currentAuthUser?.metadata?.creationTime) {
      try {
        dateToFormat = new Date(currentAuthUser.metadata.creationTime);
        if (isNaN(dateToFormat.getTime())) dateToFormat = null;
      } catch {
        dateToFormat = null;
      }
    }
    if (dateToFormat) {
      try {
        return dateToFormat.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch {
        /* ignore format error */
      }
    }
    return "Date Unavailable";
  }, [userData?.createdAt, currentAuthUser?.metadata?.creationTime]);

  // --- Navigation Handlers ---
  function helpPressHandler() {
    navigation.navigate("LinkScreen", { data: helpTopics });
  }
  function myTasksPressHandler() {
    navigation.navigate("Tasks");
  }
  function editProfileHandler() {
    navigation.navigate("EditProfile", {
      currentUsername: userData?.username, // From Firestore user document
      currentPhone: userData?.phone, // From Firestore user document
    });
  }

  // --- Styles ---
  const styles = useMemo(
    () =>
      StyleSheet.create({
        gradientContainer: { flex: 1 },
        container: {
          flex: 1,
          padding: 16,
          paddingTop: Platform.OS === "android" ? 40 : 50,
        },
        loadingContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        },
        errorText: {
          color: theme.warning || "#FF6B6B",
          fontSize: 16,
          textAlign: "center",
          marginBottom: 20,
          paddingHorizontal: 20,
          fontFamily: "delius",
        },
        inlineErrorText: {
          color: theme.warning || "#FF6B6B",
          fontSize: 12,
          textAlign: "center",
          marginTop: 5,
          fontFamily: "delius",
        },
        retryButton: {
          marginTop: 15,
          backgroundColor: theme.accent,
          paddingVertical: 10,
          paddingHorizontal: 25,
          borderRadius: 20,
        },
        retryButtonText: {
          color: theme.buttonText || "#FFFFFF",
          fontSize: 16,
          fontWeight: "bold",
        },
        scrollContainer: { flexGrow: 1, paddingBottom: 20 },
        profileSection: { alignItems: "center", marginBottom: 30 },
        profileImageContainer: { position: "relative", marginBottom: 8 },
        profileImage: {
          width: 100,
          height: 100,
          borderRadius: 50,
          borderWidth: 4,
          borderColor: theme.primary || "#800000",
          backgroundColor: theme.placeholder || "#cccccc",
        },
        editIcon: {
          position: "absolute",
          right: 0,
          bottom: 0,
          backgroundColor: theme.background,
          borderRadius: 15,
          padding: 5,
          borderWidth: 1,
          borderColor: theme.primary || "#800000",
          shadowColor: theme.shadowColor || "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2,
        },
        editIconIcon: { color: theme.primary || "#800000" },
        name: {
          fontSize: 22,
          fontWeight: "bold",
          marginTop: 10,
          color: theme.textPrimaryOnGradient || theme.textPrimary || "#FFFFFF",
          fontFamily: "sans-serif-medium",
        },
        memberSince: {
          color:
            theme.textSecondaryOnGradient || theme.textSecondary || "#E0E0E0",
          fontSize: 13,
          marginTop: 4,
        },
        statsContainer: {
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginBottom: 30,
        },
        statCard: {
          width: "31%",
          backgroundColor: theme.cardBackground || "#A0522D80",
          paddingVertical: 16,
          paddingHorizontal: 8,
          alignItems: "center",
          borderRadius: 10,
          marginBottom: 12,
          shadowColor: theme.shadowColor || "#000",
          shadowOpacity: 0.1,
          shadowRadius: 1,
          elevation: 1,
          minHeight: 110,
          justifyContent: "center",
        },
        statIcon: { color: theme.textSecondary || "#E0E0E0", marginBottom: 5 },
        statValue: {
          fontSize: 20,
          fontWeight: "bold",
          color: theme.textPrimary || "#FFFFFF",
          marginTop: 4,
          textAlign: "center",
        },
        statLabel: {
          color: theme.textSecondary || "#E0E0E0",
          fontSize: 11,
          textAlign: "center",
          marginTop: 2,
        },
        sectionTitle: {
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 15,
          color: theme.primary || "#800000",
        },
        card: {
          backgroundColor: theme.cardBackground || "#A0522D80",
          borderRadius: 10,
          marginBottom: 12,
          shadowColor: theme.shadowColor || "#000",
          shadowOpacity: 0.1,
          shadowRadius: 1,
          elevation: 2,
          overflow: "hidden",
        },
        cardContent: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 16,
          paddingHorizontal: 16,
        },
        cardIcon: { marginRight: 15, color: theme.textSecondary || "#E0E0E0" },
        cardText: {
          color: theme.textPrimary || "#FFFFFF",
          fontSize: 16,
          flex: 1,
        },
        signOutCard: {
          backgroundColor: theme.warningBackground || "#FFDEDE",
        },
        signOutIcon: { marginRight: 15, color: theme.warning || "#CC0000" },
        signOutText: { color: theme.warning || "#CC0000", fontWeight: "bold" },
        copyright: {
          textAlign: "center",
          color: theme.textSecondary || "#A0A0A0",
          marginTop: 30,
          marginBottom: 10,
          fontSize: 12,
        },
        pressedCard: { opacity: 0.75 },
        themeToggleCard: {
          backgroundColor: theme.cardBackground || "#A0522D80",
          borderRadius: 10,
          marginBottom: 12,
          elevation: 2,
          overflow: "hidden",
        },
        themeToggleContent: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 12,
          paddingHorizontal: 16,
        },
        themeToggleLabelContainer: {
          flexDirection: "row",
          alignItems: "center",
        },
        themeToggleText: {
          color: theme.textPrimary || "#FFFFFF",
          fontSize: 16,
        },
      }),
    [theme]
  );

  // --- Render Logic ---
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.accent || "#FFA500"} />
      </View>
    );
  }

  if (error && !userData) {
    // Show full error screen only if no userData at all
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // --- Main Screen Render ---
  return (
    <LinearGradient
      colors={[
        theme.gradientStart || "#8B0000",
        theme.gradientEnd || "#D3D3D3",
      ]}
      style={styles.gradientContainer}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.accent || "#FFA500"}
            colors={[theme.accent || "#FFA500", theme.primary || "#800000"]}
          />
        }
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: profileImageUri }}
              style={styles.profileImage}
              onError={(e) =>
                console.log("Error loading image:", e.nativeEvent.error)
              }
            />
            {userData && ( // Only show edit icon if userData is loaded
              <TouchableOpacity
                style={styles.editIcon}
                onPress={editProfileHandler}
              >
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={20}
                  style={styles.editIconIcon}
                />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.memberSince}>Enrolled {enrollmentDate}</Text>
          {error &&
            userData && ( // Show inline error if some userData is present but there was an issue
              <Text style={styles.inlineErrorText}>{error}</Text>
            )}
        </View>

        {/* Stats Section - uses userStats state which is derived from userData.stats */}
        <View style={styles.statsContainer}>
          {[
            {
              label: "Day Streak",
              value: userStats.currentStreak, // Access directly from userStats state
              icon: "calendar-check-outline",
            },
            {
              label: "Quizzes",
              value: userStats.totalQuizzesCompleted.toLocaleString(), // Access directly
              icon: "help-circle-outline",
            },
            {
              label: "Stars",
              value: userStats.totalStars.toLocaleString(), // Access directly
              icon: "star-outline",
            },
          ].map((item, index) => (
            <View key={index} style={styles.statCard}>
              <MaterialCommunityIcons
                name={item.icon}
                size={28}
                style={styles.statIcon}
              />
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Settings & Support Section */}
        <Text style={styles.sectionTitle}>Settings & Support</Text>
        <Pressable
          onPress={myTasksPressHandler}
          style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}
        >
          <View style={styles.cardContent}>
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={22}
              style={styles.cardIcon}
            />
            <Text style={styles.cardText}>My Tasks</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={helpPressHandler}
          style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}
        >
          <View style={styles.cardContent}>
            <Ionicons
              name="help-circle-outline"
              size={24}
              style={styles.cardIcon}
            />
            <Text style={styles.cardText}>Help</Text>
          </View>
        </Pressable>

        <View style={styles.themeToggleCard}>
          <View style={styles.themeToggleContent}>
            <View style={styles.themeToggleLabelContainer}>
              <Ionicons
                name="contrast-outline"
                size={24}
                style={styles.cardIcon}
              />
              <Text style={styles.themeToggleText}>Dark Mode</Text>
            </View>
            <Switch
              trackColor={{
                false: theme.switchTrackOff || "#767577",
                true: theme.switchTrackOn || "#81b0ff",
              }}
              thumbColor={
                isDark
                  ? theme.switchThumbOn || "#f5dd4b"
                  : theme.switchThumbOff || "#f4f3f4"
              }
              ios_backgroundColor={theme.switchTrackOff || "#767577"}
              onValueChange={toggleTheme}
              value={isDark}
            />
          </View>
        </View>

        {typeof signoutHandler === "function" && (
          <Pressable
            onPress={() => setModalVisible(true)}
            style={({ pressed }) => [
              styles.card,
              styles.signOutCard,
              pressed && styles.pressedCard,
            ]}
          >
            <View style={styles.cardContent}>
              <MaterialCommunityIcons
                name="logout"
                size={22}
                style={styles.signOutIcon}
              />
              <Text style={[styles.cardText, styles.signOutText]}>
                Sign out
              </Text>
            </View>
          </Pressable>
        )}

        <Text style={styles.copyright}>
          © {new Date().getFullYear()} Apprec8. All rights reserved.
        </Text>

        <ConfirmationModal
          visible={modalVisible}
          title="Are you sure you want to sign out?"
          onCancel={() => setModalVisible(false)}
          onConfirm={() => {
            setModalVisible(false);
            if (typeof signoutHandler === "function") signoutHandler();
          }}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default ProfileScreen;

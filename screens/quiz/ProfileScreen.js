// screens/profile/ProfileScreen.js

import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useMemo, useEffect, useCallback } from "react"; // Import useCallback
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
  Switch, // Import Switch
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { helpTopics } from "../../data/app-topic-data";
import Badge from "../../components/common/Badge";
import ConfirmationModal from "../../components/common/ConfirmationModel";
import { authInstance } from "../../config/firebaseConfig";
import { useTheme } from "../../context/ThemeContext";

const generateAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "App Rec" // Fallback name
  )}&background=random&color=fff&size=128`;

const defaultStats = {
  currentStreak: 0,
  totalQuizzesCompleted: 0,
  totalStars: 0,
};

const ProfileScreen = ({ navigation, signoutHandler, user: authUserProp }) => {
  const { theme, toggleTheme, isDark } = useTheme(); // Use the theme hook
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const currentAuthUser = authInstance.currentUser;
  const userId = currentAuthUser?.uid;

  // --- Data Fetching Logic (remains mostly the same) ---
  const fetchData = async (isRefreshing = false) => {
    if (!userId) {
      setError("Not authenticated.");
      setLoading(false);
      if (isRefreshing) setRefreshing(false);
      return;
    }
    if (!isRefreshing) setLoading(true);
    setError(null);
    try {
      const userRef = firestore().collection("users").doc(userId);
      const statsRef = firestore().collection("userStats").doc(userId);
      const [userDoc, statsDoc] = await Promise.all([
        userRef.get(),
        statsRef.get(),
      ]);
      if (userDoc.exists) setUserData(userDoc.data());
      else {
        console.warn(`User document not found for userId: ${userId}`);
        setUserData(null);
      }
      if (statsDoc.exists) setUserStats(statsDoc.data());
      else {
        console.warn(`User stats document not found for userId: ${userId}`);
        setUserStats(defaultStats);
      }
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
      if (isRefreshing) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData(true);
  }, [userId]);

  // --- Determine Display Values (remains the same) ---
  const displayName =
    userData?.username ||
    currentAuthUser?.displayName ||
    currentAuthUser?.email?.split("@")[0] ||
    "User";
  const profileImageUri =
    userData?.profileImageUrl ||
    currentAuthUser?.photoURL ||
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

  // --- Navigation Handlers (remain the same) ---
  function helpPressHandler() {
    navigation.navigate("LinkScreen", { data: helpTopics });
  }
  function myTasksPressHandler() {
    navigation.navigate("Tasks");
  }
  function editProfileHandler() {
    navigation.navigate("EditProfile", {
      currentUsername: userData?.username,
      currentPhone: userData?.phone,
    });
  }

  // --- Define Styles Inside Component with useMemo ---
  const styles = useMemo(
    () =>
      StyleSheet.create({
        // Container for Gradient
        gradientContainer: {
          flex: 1,
        },
        // Actual content container with padding
        container: {
          flex: 1,
          padding: 16,
          paddingTop: Platform.OS === "android" ? 40 : 50,
        },
        loadingContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background, // Use theme background
        },
        errorText: {
          color: theme.warning || "#FF6B6B", // Use theme warning color
          fontSize: 16,
          textAlign: "center",
          marginBottom: 20,
          paddingHorizontal: 20,
          fontFamily: "delius",
        },
        inlineErrorText: {
          color: theme.warning || "#FF6B6B", // Use theme warning color
          fontSize: 12,
          textAlign: "center",
          marginTop: 5,
          fontFamily: "delius",
        },
        retryButton: {
          marginTop: 15,
          backgroundColor: theme.accent, // Use theme accent color (e.g., Orange)
          paddingVertical: 10,
          paddingHorizontal: 25,
          borderRadius: 20,
        },
        retryButtonText: {
          color: theme.buttonText || "#FFFFFF", // Use theme button text color
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
          borderColor: theme.primary || "#800000", // Use theme primary color (e.g., Maroon)
          backgroundColor: theme.placeholder || "#cccccc", // Use theme placeholder color
        },
        editIcon: {
          position: "absolute",
          right: 0,
          bottom: 0,
          backgroundColor: theme.background, // Use theme background
          borderRadius: 15,
          padding: 5,
          borderWidth: 1,
          borderColor: theme.primary || "#800000", // Use theme primary
          // Shadow might need theme adjustments if desired
          shadowColor: theme.shadowColor || "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2,
        },
        editIconIcon: {
          // Style for the icon itself if needed
          color: theme.primary || "#800000", // Use theme primary
        },
        name: {
          fontSize: 22,
          fontWeight: "bold",
          marginTop: 10,
          color: theme.textPrimaryOnGradient || theme.textPrimary || "#FFFFFF", // Use specific theme color or fallback
          fontFamily: "sans-serif-medium", // Ensure font loaded
        },
        memberSince: {
          color:
            theme.textSecondaryOnGradient || theme.textSecondary || "#E0E0E0", // Use specific theme color or fallback
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
          backgroundColor: theme.cardBackground || "#A0522D80", // Use theme card background
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
        statIcon: {
          color: theme.textSecondary || "#E0E0E0", // Use theme text secondary
          marginBottom: 5,
        },
        statValue: {
          fontSize: 20,
          fontWeight: "bold",
          color: theme.textPrimary || "#FFFFFF", // Use theme text primary
          marginTop: 4,
          textAlign: "center",
        },
        statLabel: {
          color: theme.textSecondary || "#E0E0E0", // Use theme text secondary
          fontSize: 11,
          textAlign: "center",
          marginTop: 2,
        },
        sectionTitle: {
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 15,
          color: theme.primary || "#800000", // Use theme primary
        },
        card: {
          backgroundColor: theme.cardBackground || "#A0522D80", // Use theme card background
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
        cardIcon: {
          marginRight: 15,
          color: theme.textSecondary || "#E0E0E0", // Use theme text secondary
        },
        cardText: {
          color: theme.textPrimary || "#FFFFFF", // Use theme text primary
          fontSize: 16,
          flex: 1,
        },
        signOutCard: {
          backgroundColor: theme.warningBackground || "#FFDEDE", // Use theme warning background
        },
        signOutIcon: {
          marginRight: 15,
          color: theme.warning || "#CC0000", // Use theme warning color
        },
        signOutText: {
          color: theme.warning || "#CC0000", // Use theme warning color
          fontWeight: "bold",
        },
        copyright: {
          textAlign: "center",
          color: theme.textSecondary || "#A0A0A0", // Use theme text secondary
          marginTop: 30,
          marginBottom: 10,
          fontSize: 12,
        },
        pressedCard: {
          opacity: 0.75,
        },
        // --- Theme Toggle Styles ---
        themeToggleCard: {
          backgroundColor: theme.cardBackground || "#A0522D80",
          borderRadius: 10,
          marginBottom: 12,
          elevation: 2,
          overflow: "hidden",
        },
        themeToggleContent: {
          // Parent container for label group and switch
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between", // Pushes label group left, switch right
          paddingVertical: 12, // Adjusted padding slightly if needed
          paddingHorizontal: 16,
        },
        themeToggleLabelContainer: {
          // New container for Icon and Text
          flexDirection: "row",
          alignItems: "center",
          // No justifyContent needed here
        },
        themeToggleText: {
          // Text style (marginRight removed)
          color: theme.textPrimary || "#FFFFFF",
          fontSize: 16,
        },
      }),
    [theme]
  ); // Depend on theme object

  // --- Render Logic ---
  if (loading) {
    // Show loading indicator against themed background
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.accent || "#FFA500"} />
      </View>
    );
  }

  if (error && !userData) {
    // Show full error screen against themed background
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          onPress={() => fetchData()}
          style={styles.retryButton}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Main Screen Render ---
  return (
    <LinearGradient
      // Use theme gradient colors
      colors={[
        theme.gradientStart || "#8B0000",
        theme.gradientEnd || "#D3D3D3",
      ]}
      style={styles.gradientContainer}
    >
      <ScrollView
        style={styles.container} // Add padding etc. here
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.accent || "#FFA500"} // Use theme accent
            colors={[theme.accent || "#FFA500", theme.primary || "#800000"]} // Use theme colors
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
            {userData && (
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
          {error && <Text style={styles.inlineErrorText}>{error}</Text>}
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          {[
            {
              label: "Day Streak",
              value: userStats.currentStreak ?? 0,
              icon: "calendar-check-outline",
            },
            {
              label: "Quizzes",
              value: (userStats.totalQuizzesCompleted ?? 0).toLocaleString(),
              icon: "help-circle-outline",
            },
            {
              label: "Stars",
              value: (userStats.totalStars ?? 0).toLocaleString(),
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
        {/* My Tasks Card */}
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
        {/* Help Card */}
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

        {/* --- Theme Toggle Button --- */}
        <View style={styles.themeToggleCard}>
          <View style={styles.themeToggleContent}>
            {/* Group 1: Icon and Text */}
            <View style={styles.themeToggleLabelContainer}>
              {/* <-- New Wrapper View */}
              <Ionicons
                name="contrast-outline" // Changed icon to be theme-related
                size={24}
                style={styles.cardIcon} // Style for icon color and margin
              />
              <Text style={styles.themeToggleText}>Dark Mode</Text>
            </View>

            {/* Group 2: Switch (remains the same) */}
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

        {/* Sign out Button */}
        {typeof signoutHandler === "function" && (
          <Pressable
            onPress={() => setModalVisible(true)}
            style={({ pressed }) => [
              styles.card, // Reuse base card style
              styles.signOutCard, // Apply sign-out specific background
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

        {/* Footer */}
        <Text style={styles.copyright}>
          © {new Date().getFullYear()} Apprec8. All rights reserved.
        </Text>

        {/* Sign-Out Confirmation Modal */}
        <ConfirmationModal
          visible={modalVisible}
          title="Are you sure you want to sign out?"
          onCancel={() => setModalVisible(false)}
          onConfirm={() => {
            setModalVisible(false);
            if (typeof signoutHandler === "function") signoutHandler();
          }}
          // Pass theme or use hook internally if Modal needs theming
          // theme={theme}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default ProfileScreen;

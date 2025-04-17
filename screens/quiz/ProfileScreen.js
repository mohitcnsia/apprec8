// screens/profile/ProfileScreen.js

import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useMemo, useEffect } from "react"; // Import useEffect
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ActivityIndicator, // Import ActivityIndicator
  RefreshControl, // Import RefreshControl for pull-to-refresh
  Platform,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore"; // Import firestore
import { Colors } from "../../config/colors";
import { helpTopics } from "../../data/app-topic-data";
import Badge from "../../components/common/Badge";
import ConfirmationModal from "../../components/common/ConfirmationModel";
import { authInstance } from "../../config/firebaseConfig"; // Import auth instance

const generateAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "App Rec" // Fallback name
  )}&background=random&color=fff&size=128`;

// Define default/empty stats structure
const defaultStats = {
  currentStreak: 0,
  totalQuizzesCompleted: 0,
  totalStars: 0,
  // Add other stats with defaults if needed (e.g., globalRank: 'N/A', hours: 0)
};

const ProfileScreen = ({ navigation, signoutHandler, user: authUserProp }) => {
  // Rename user prop to avoid conflict
  const [modalVisible, setModalVisible] = useState(false);

  // --- State for Firestore Data ---
  const [userData, setUserData] = useState(null); // Data from /users/{userId}
  const [userStats, setUserStats] = useState(defaultStats); // Data from /userStats/{userId}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh

  // Use auth instance directly to get current user reliably
  const currentAuthUser = authInstance.currentUser;
  const userId = currentAuthUser?.uid;

  // --- Data Fetching Logic ---
  const fetchData = async (isRefreshing = false) => {
    if (!userId) {
      setError("Not authenticated.");
      setLoading(false);
      if (isRefreshing) setRefreshing(false);
      return;
    }

    if (!isRefreshing) setLoading(true); // Only show initial loading indicator
    setError(null);

    try {
      const userRef = firestore().collection("users").doc(userId);
      const statsRef = firestore().collection("userStats").doc(userId);

      // Fetch both documents
      const userDocPromise = userRef.get();
      const statsDocPromise = statsRef.get();

      const [userDoc, statsDoc] = await Promise.all([
        userDocPromise,
        statsDocPromise,
      ]);

      if (userDoc.exists) {
        setUserData(userDoc.data());
      } else {
        console.warn(`User document not found for userId: ${userId}`);
        setError("User profile data not found."); // Consider if this is an error state
        setUserData(null); // Explicitly set to null if not found
      }

      if (statsDoc.exists) {
        setUserStats(statsDoc.data());
      } else {
        console.warn(`User stats document not found for userId: ${userId}`);
        // Don't set error, just use default stats
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

  // Initial data fetch on mount
  useEffect(() => {
    fetchData();

    // Optional: Set up listeners for real-time updates (more complex state management)
    // Replace fetchData() call above with listener setup if needed.
    // Example Listener Setup (add error handling and combine loading states):
    /*
    if (!userId) { setLoading(false); return; }
    const userUnsubscribe = firestore().collection('users').doc(userId).onSnapshot(doc => setUserData(doc.exists ? doc.data() : null));
    const statsUnsubscribe = firestore().collection('userStats').doc(userId).onSnapshot(doc => {
        setUserStats(doc.exists ? doc.data() : defaultStats);
        setLoading(false); // Consider loading done after first stats snapshot
    });
    return () => { userUnsubscribe(); statsUnsubscribe(); };
    */
  }, [userId]); // Re-fetch if userId changes (e.g., re-authentication)

  // Handler for pull-to-refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData(true); // Pass flag indicating refresh
  }, [userId]); // Dependency array for useCallback

  // --- Determine Display Values (using fetched data with fallbacks) ---
  const displayName =
    userData?.username ||
    currentAuthUser?.displayName ||
    currentAuthUser?.email?.split("@")[0] ||
    "User";
  // Use userData.profileImageUrl if you store it, otherwise fallback
  const profileImageUri =
    userData?.profileImageUrl ||
    currentAuthUser?.photoURL ||
    generateAvatarUrl(displayName);

  const enrollmentDate = useMemo(() => {
    let dateToFormat = null;

    if (
      userData?.createdAt &&
      typeof userData.createdAt.toDate === "function"
    ) {
      // If userData.createdAt exists and is a Firestore Timestamp, use it
      dateToFormat = userData.createdAt.toDate();
    } else if (currentAuthUser?.metadata?.creationTime) {
      // Otherwise, try using the auth metadata creation time (which is likely a string)
      // Convert it directly to a JS Date object
      try {
        dateToFormat = new Date(currentAuthUser.metadata.creationTime);
        // Optional: Check if the date is valid after conversion
        if (isNaN(dateToFormat.getTime())) {
          dateToFormat = null; // Invalidate if parsing failed
          console.warn(
            "Failed to parse creationTime string:",
            currentAuthUser.metadata.creationTime
          );
        }
      } catch (parseError) {
        console.error("Error creating Date from creationTime:", parseError);
        dateToFormat = null;
      }
    }

    // Now format the valid date object, if we have one
    if (dateToFormat) {
      try {
        return dateToFormat.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch (formatError) {
        console.error("Error formatting date:", formatError);
      }
    }

    // Fallback if no valid date could be determined
    return "Date Unavailable";
  }, [userData?.createdAt, currentAuthUser?.metadata?.creationTime]); // Dependencies

  // --- Navigation Handlers (Keep Existing) ---
  function helpPressHandler() {
    navigation.navigate("LinkScreen", { data: helpTopics });
  }
  function myTasksPressHandler() {
    navigation.navigate("Tasks");
  }
  function editProfileHandler() {
    // Pass current userData to EditProfile screen if needed
    navigation.navigate("EditProfile", {
      currentUsername: userData?.username,
      currentPhone: userData?.phone,
    });
  }

  // --- Render Logic ---
  if (loading) {
    return (
      <LinearGradient
        colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color={Colors.primaryOrange} />
      </LinearGradient>
    );
  }

  // You might want a more prominent error display
  if (error && !userData) {
    // Show error if loading failed and no data is available
    return (
      <LinearGradient
        colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
        style={styles.loadingContainer}
      >
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          onPress={() => fetchData()}
          style={styles.retryButton}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          // Add RefreshControl
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primaryOrange} // iOS tint color
            colors={[Colors.primaryOrange, Colors.primaryDarkMaroon]} // Android colors
          />
        }
      >
        {/* Profile Section - Use fetched/derived data */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: profileImageUri }}
              style={styles.profileImage}
              onError={(e) =>
                console.log("Error loading profile image:", e.nativeEvent.error)
              } // Add error handling for image
            />
            {/* Only show edit button if profile data loaded successfully */}
            {userData && (
              <TouchableOpacity
                style={styles.editIcon}
                onPress={editProfileHandler}
              >
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={20}
                  color={Colors.primaryDarkMaroon}
                />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.memberSince}>Enrolled {enrollmentDate}</Text>
          {/* Display error inline if data is partially loaded */}
          {error && <Text style={styles.inlineErrorText}>{error}</Text>}
        </View>

        {/* Stats Section - Use fetched userStats */}
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
            }, // Format number
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
                color={Colors.primaryLightGray}
                style={{ marginBottom: 5 }}
              />
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Achievements Section (Keep Existing) */}
        {/* <Text style={styles.sectionTitle}>Achievements</Text>
        <Pressable
          onPress={() =>
            navigation.navigate("DummyScreen", { title: "Practice Time" })
          }
          style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}
        >
          <View style={styles.cardContent}>
            <Ionicons
              name="time-outline"
              size={20}
              color={Colors.primaryLightGray}
              style={styles.cardIcon}
            />
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.cardText}>Practice Time</Text>
              <Badge label="Coming Soon" />
            </View>
          </View>
        </Pressable>
        <Pressable
          onPress={() =>
            navigation.navigate("DummyScreen", { title: "Your Badges are " })
          }
          style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}
        >
          <View style={styles.cardContent}>
            <Ionicons
              name="ribbon-outline"
              size={20}
              color={Colors.primaryLightGray}
              style={styles.cardIcon}
            />
            <Text style={styles.cardText}>Badge Collection</Text>
          </View>
        </Pressable> */}

        {/* Settings & Support Section (Keep Existing) */}
        <Text style={styles.sectionTitle}>Settings & Support</Text>
        <Pressable
          onPress={myTasksPressHandler}
          style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}
        >
          <View style={styles.cardContent}>
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={22}
              color={Colors.primaryLightGray}
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
              color={Colors.primaryLightGray}
              style={styles.cardIcon}
            />
            <Text style={styles.cardText}>Help</Text>
          </View>
        </Pressable>
        {/* Sign out Button */}
        {typeof signoutHandler === "function" && ( // Only show if handler is provided
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
                color={Colors.warningRed}
                style={styles.cardIcon}
              />
              <Text style={[styles.cardText, styles.signOutText]}>
                Sign out
              </Text>
            </View>
          </Pressable>
        )}

        {/* Footer (Keep Existing) */}
        <Text style={styles.copyright}>
          © {new Date().getFullYear()} Apprec8. All rights reserved.
        </Text>

        {/* Sign-Out Confirmation Modal (Keep Existing) */}
        <ConfirmationModal
          visible={modalVisible}
          title="Are you sure you want to sign out?"
          onCancel={() => setModalVisible(false)}
          onConfirm={() => {
            setModalVisible(false);
            if (typeof signoutHandler === "function") {
              signoutHandler();
            }
          }}
        />
      </ScrollView>
    </LinearGradient>
  );
};

// --- Styles (Keep Existing, Add loading/error styles) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: Platform.OS === "android" ? 40 : 50,
  }, // Adjust paddingTop for status bar
  loadingContainer: {
    // Style for loading/error states
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    // Style for error message on full screen error
    color: Colors.warningRed || "#FF6B6B",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    fontFamily: "delius", // Use your font
  },
  inlineErrorText: {
    // Style for error message below profile info
    color: Colors.warningRed || "#FF6B6B",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
    fontFamily: "delius", // Use your font
  },
  retryButton: {
    marginTop: 15,
    backgroundColor: Colors.primaryOrange,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  retryButtonText: {
    color: Colors.primaryWhite,
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollContainer: { flexGrow: 1, paddingBottom: 20 },
  profileSection: { alignItems: "center", marginBottom: 30 },
  profileImageContainer: {
    position: "relative",
    marginBottom: 8,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: Colors.primaryMaroon200,
    backgroundColor: Colors.primaryLightGray, // Add a background color while loading/error
  },
  editIcon: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primaryWhite,
    borderRadius: 15,
    padding: 5,
    borderWidth: 1,
    borderColor: Colors.primaryDarkMaroon,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    color: Colors.primaryWhite,
    fontFamily: "sans-serif-medium",
  },
  memberSince: {
    color: Colors.primaryLightGray,
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
    backgroundColor: Colors.primaryMaroon100 + "dd",
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    minHeight: 110, // Ensure cards have a minimum height
    justifyContent: "center", // Center content vertically
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primaryLightGray,
    marginTop: 4,
    textAlign: "center", // Ensure value is centered
  },
  statLabel: {
    color: Colors.primaryLightGray,
    fontSize: 11,
    textAlign: "center",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: Colors.primaryDarkMaroon,
  },
  card: {
    backgroundColor: Colors.primaryMaroon100 + "dd",
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
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
  },
  cardText: {
    color: Colors.primaryLightGray,
    fontSize: 16,
    flex: 1,
  },
  signOutCard: {
    backgroundColor: Colors.warningRedLight + "aa",
  },
  signOutText: {
    color: Colors.warningRed,
    fontWeight: "bold",
  },
  copyright: {
    textAlign: "center",
    color: Colors.primaryDarkMaroon,
    marginTop: 30,
    marginBottom: 10,
    fontSize: 12,
  },
  pressedCard: {
    opacity: 0.75,
  },
});

export default ProfileScreen;

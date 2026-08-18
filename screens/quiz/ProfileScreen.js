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
  ActivityIndicator as NativeActivityIndicator,
  RefreshControl,
  Platform,
  Switch,
  Alert, // Keep Alert if used elsewhere, though not for delete button directly here now
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import SeedDataFixButton from "../../components/quiz/SeedDataFixButton";
import SeedQuestNodesButton from "../../components/quiz/SeedQuestNodesButton";
import SeedDataButton from "../../components/quiz/SeedDataButton";
import firestore from "@react-native-firebase/firestore";
import { helpTopics } from "../../data/app-topic-data"; // Assuming this path is correct
import ConfirmationModal from "../../components/common/ConfirmationModel";
import { authInstance } from "../../config/firebaseConfig";
import { useTheme } from "../../context/ThemeContext";
import { useV2 } from "../../context/V2Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SEEN_MESSAGES_KEY } from "../../hooks/useInAppMessaging";
import InfoModal from "../../components/common/InfoModal";

const generateAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "App Rec"
  )}&background=random&color=fff&size=128`;

const defaultStatsValues = {
  currentStreak: 0,
  totalQuizzesCompleted: 0,
  totalStars: 0,
  lastQuizCompletionDate: null,
  lastActivityCompletionDate: null,
  lastDailyBonusDate: null,
};

const ProfileScreen = ({ navigation, signoutHandler }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { isV2Enabled, toggleV2 } = useV2();
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] = useState(defaultStatsValues);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoModalContent, setInfoModalContent] = useState({
    title: "",
    message: "",
  });

  const currentAuthUser = authInstance.currentUser;
  const userId = currentAuthUser?.uid;

  const getDisplayName = (userDoc, authUser) => {
    const firestoreFirstName = userDoc?.firstName?.trim();
    const firestoreLastName = userDoc?.lastName?.trim();
    if (firestoreFirstName && firestoreLastName)
      return `${firestoreFirstName} ${firestoreLastName}`;
    if (firestoreFirstName) return firestoreFirstName;
    if (userDoc?.username) return userDoc.username;
    if (authUser?.displayName) return authUser.displayName;
    if (authUser?.email) return authUser.email.split("@")[0];
    return "User";
  };

  useEffect(() => {
    if (!userId) {
      setError("Not authenticated. Please sign in.");
      setLoading(false);
      setUserData(null);
      setUserStats(defaultStatsValues);
      return;
    }
    setLoading(true);
    setError(null);
    const userDocumentListener = firestore()
      .collection("users")
      .doc(userId)
      .onSnapshot(
        (documentSnapshot) => {
          if (documentSnapshot.exists) {
            const data = documentSnapshot.data();
            setUserData(data);
            const statsData = data.stats || {};
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
          } else {
            console.warn(`User document not found for userId: ${userId}`);
            setUserData(null);
            setUserStats(defaultStatsValues);
          }
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching user document snapshot:", err);
          setError("Failed to load profile data.");
          setLoading(false);
        }
      );
    return () => userDocumentListener();
  }, [userId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const displayName = getDisplayName(userData, currentAuthUser);
  const profileImageUri =
    userData?.photoURL ||
    currentAuthUser?.photoURL ||
    generateAvatarUrl(displayName);

  const handleResetSeenMessages = async () => {
    try {
      await AsyncStorage.removeItem(SEEN_MESSAGES_KEY);
      // Set the content for the modal
      setInfoModalContent({
        title: "Success",
        message:
          "The 'seen messages' list has been cleared. Please completely restart your app to see the pop-up again.",
      });
      // Show the modal
      setInfoModalVisible(true);
    } catch (error) {
      console.error("Failed to reset seen messages:", error);
      setInfoModalContent({
        title: "Error",
        message: "Could not clear the seen messages list.",
      });
      setInfoModalVisible(true);
    }
  };

  const enrollmentDate = useMemo(() => {
    let dateToFormat = null;
    if (userData?.createdAt?.toDate) dateToFormat = userData.createdAt.toDate();
    else if (currentAuthUser?.metadata?.creationTime) {
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
        /* ignore */
      }
    }
    return "Date Unavailable";
  }, [userData?.createdAt, currentAuthUser?.metadata?.creationTime]);

  function helpPressHandler() {
    const emailToPass = userData?.email || currentAuthUser?.email || "";
    if (!helpTopics || !Array.isArray(helpTopics)) {
      Alert.alert(
        "Error",
        "Help data is missing or invalid. Cannot open Help screen."
      );
      return;
    }

    navigation.navigate("LinkScreen", {
      data: helpTopics,
      title: "Help & Support",
      userEmail: emailToPass,
    });
  }

  function myTasksPressHandler() {
    navigation.navigate("Tasks");
  }

  function editProfileHandler() {
    if (!userData) {
      console.log("Cannot edit profile, user data not loaded yet.");
      return;
    }
    navigation.navigate("EditProfile", {
      currentFirstName: userData.firstName || "",
      currentLastName: userData.lastName || "",
      currentPhotoURL: userData.photoURL || "",
      currentProfileLastSavedAt: userData.profileLastSavedAt || null,
    });
  }

  const styles = useMemo(
    () =>
      StyleSheet.create({
        gradientContainer: { flex: 1 },
        container: {
          flex: 1,
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
        scrollContainer: {
          flexGrow: 1,
          paddingHorizontal: 16, // For left and right spacing
          paddingTop: Platform.OS === "android" ? 40 : 50, // Keep original top padding
          paddingBottom: 60, // A larger bottom padding to prevent clipping
        },
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
          fontFamily: "delius",
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
          fontFamily: "delius",
        },
        sectionTitle: {
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 15,
          color: theme.primary || "#800000",
          fontFamily: "deliusBold",
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
          fontFamily: "delius",
        },
        signOutCard: { backgroundColor: theme.warningBackground || "#FFDEDE" },
        signOutIcon: { marginRight: 15, color: theme.warning || "#CC0000" },
        signOutText: {
          color: theme.warning || "#CC0000",
          fontWeight: "bold",
          fontFamily: "deliusBold",
        },
        // REMOVED deleteAccountCard, deleteAccountIcon, deleteAccountText styles as the button is moved
        copyright: {
          textAlign: "center",
          color: theme.textSecondary || "#A0A0A0",
          marginTop: 30,
          marginBottom: 10,
          fontSize: 12,
          fontFamily: "delius",
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
          fontFamily: "delius",
        },
      }),
    [theme]
  );

  if (loading && !refreshing && !userData) {
    return (
      <LinearGradient
        colors={
          theme.gradientStart && theme.gradientEnd
            ? [theme.gradientStart, theme.gradientEnd]
            : ["#8B0000", "#D3D3D3"]
        }
        style={styles.gradientContainer}
      >
        <View style={styles.loadingContainer}>
          <NativeActivityIndicator
            size="large"
            color={theme.accent || "#FFA500"}
          />
        </View>
      </LinearGradient>
    );
  }
  if (error && !userData) {
    return (
      <LinearGradient
        colors={
          theme.gradientStart && theme.gradientEnd
            ? [theme.gradientStart, theme.gradientEnd]
            : ["#8B0000", "#D3D3D3"]
        }
        style={styles.gradientContainer}
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </LinearGradient>
    );
  }
  if (!userData && !error && !loading) {
    return (
      <LinearGradient
        colors={
          theme.gradientStart && theme.gradientEnd
            ? [theme.gradientStart, theme.gradientEnd]
            : ["#8B0000", "#D3D3D3"]
        }
        style={styles.gradientContainer}
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>
            Profile data not found. Please sign out and sign in again.
          </Text>
          {typeof signoutHandler === "function" && (
            <Pressable
              onPress={() => signoutHandler()}
              style={{ marginTop: 20 }}
            >
              <Text
                style={{ color: theme.accent, textDecorationLine: "underline" }}
              >
                Sign Out
              </Text>
            </Pressable>
          )}
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={
        theme.gradientStart && theme.gradientEnd
          ? [theme.gradientStart, theme.gradientEnd]
          : ["#8B0000", "#D3D3D3"]
      }
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
        {/* Profile Section ... */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: profileImageUri }}
              style={styles.profileImage}
              onError={(e) =>
                console.log("Error loading profile image:", e.nativeEvent.error)
              }
            />
            {userData && (
              <TouchableOpacity
                style={styles.editIcon}
                onPress={editProfileHandler}
              >
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={18}
                  style={styles.editIconIcon}
                />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.memberSince}>Enrolled {enrollmentDate}</Text>
          {error && userData && (
            <Text style={styles.inlineErrorText}>{error}</Text>
          )}
        </View>

        {/* Stats Section ... */}
        <View style={styles.statsContainer}>
          {[
            {
              label: "Day Streak",
              value: userStats.currentStreak,
              icon: "calendar-check-outline",
            },
            {
              label: "Quizzes",
              value: userStats.totalQuizzesCompleted.toLocaleString(),
              icon: "help-circle-outline",
            },
            {
              label: "Stars",
              value: userStats.totalStars.toLocaleString(),
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
          onPress={() => navigation.navigate("MessageCenter")} // <-- This is the new code
          style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}
        >
          <View style={styles.cardContent}>
            <MaterialCommunityIcons
              name="email-outline"
              size={22}
              style={styles.cardIcon}
            />
            <Text style={styles.cardText}>My Messages</Text>
          </View>
        </Pressable>
        {/* --- ADD THIS NEW BUTTON --- */}
        {/* The __DEV__ global variable ensures this only ever renders in development mode */}
        {/* {__DEV__ && (
          <Pressable
            onPress={handleResetSeenMessages}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: "#333" },
              pressed && styles.pressedCard,
            ]}
          >
            <View style={styles.cardContent}>
              <MaterialCommunityIcons
                name="bug-check-outline"
                size={22}
                style={[styles.cardIcon, { color: "#fff" }]}
              />
              <Text
                style={[styles.cardText, { color: "#fff", fontWeight: "bold" }]}
              >
                DEV: Reset Seen Messages
              </Text>
            </View>
          </Pressable>
        )} */}
        {/* --- END OF NEW BUTTON --- */}
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
        
        <View style={styles.themeToggleCard}>
          <View style={styles.themeToggleContent}>
            <View style={styles.themeToggleLabelContainer}>
              <Ionicons
                name="flask-outline"
                size={24}
                style={styles.cardIcon}
              />
              <Text style={styles.themeToggleText}>Quest Mode (V2)</Text>
            </View>
            <Switch
              trackColor={{
                false: theme.switchTrackOff || "#767577",
                true: theme.switchTrackOn || "#81b0ff",
              }}
              thumbColor={
                isV2Enabled
                  ? theme.switchThumbOn || "#f5dd4b"
                  : theme.switchThumbOff || "#f4f3f4"
              }
              ios_backgroundColor={theme.switchTrackOff || "#767577"}
              onValueChange={toggleV2}
              value={isV2Enabled}
            />
          </View>
        </View>

        {/* REMOVED Delete Account Button from here */}
        <SeedDataFixButton />
        <SeedQuestNodesButton />
        <SeedDataButton />

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
      <InfoModal
        visible={infoModalVisible}
        title={infoModalContent.title}
        message={infoModalContent.message}
        onDismiss={() => setInfoModalVisible(false)}
      />
    </LinearGradient>
  );
};

export default ProfileScreen;

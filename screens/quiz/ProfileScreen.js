// screens/quiz/ProfileScreen.js

import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useMemo } from "react"; // Import useMemo
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
// Import desired icon set(s)
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Colors } from "../../config/colors";
import { helpTopics } from "../../data/app-topic-data";
import Badge from "../../components/common/Badge";
import ConfirmationModal from "../../components/common/ConfirmationModel";

const generateAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "App Rec"
  )}&background=random&color=fff&size=128`;

const ProfileScreen = ({ navigation, signoutHandler, user }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const userName = user?.displayName || user?.email?.split("@")[0] || "User";
  const profileImageUri = user?.photoURL || generateAvatarUrl(userName);

  // --- Format Enrollment Date ---
  const enrollmentDate = useMemo(() => {
    if (user?.metadata?.creationTime) {
      try {
        const date = new Date(user.metadata.creationTime);
        // Format as Month Day, Year (e.g., Apr 10, 2025)
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short", // 'short' for 'Apr', 'long' for 'April'
          day: "numeric",
        });
      } catch (error) {
        console.error("Error parsing creationTime:", error);
        return "Date Unavailable"; // Fallback on error
      }
    }
    return "Enrolled Date Unavailable"; // Fallback if no creationTime
  }, [user?.metadata?.creationTime]); // Recalculate only if creationTime changes

  function helpPressHandler() {
    navigation.navigate("LinkScreen", { data: helpTopics });
  }

  function myTasksPressHandler() {
    navigation.navigate("Tasks");
  }

  function editProfileHandler() {
    navigation.navigate("EditProfile");
  }

  function contactUsPressHandler() {
    navigation.navigate("cntct"); // Navigate to Contact Us form
  }

  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: profileImageUri }}
              style={styles.profileImage}
            />
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
          </View>
          <Text style={styles.name}>{userName}</Text>
          {/* --- Use dynamic enrollmentDate --- */}
          <Text style={styles.memberSince}>Enrolled {enrollmentDate}</Text>
        </View>

        {/* --- Stats Section --- Optional: Add icons here too */}
        <View style={styles.statsContainer}>
          {[
            // Example with icons
            {
              label: "Day Streak",
              value: "223",
              icon: "calendar-check-outline",
            },
            { label: "Questions", value: "3,000", icon: "help-circle-outline" },
            { label: "Stars", value: "1,57,899", icon: "star-outline" },
            { label: "Exp Level", value: "200", icon: "trending-up" },
            { label: "Global Rank", value: "1", icon: "earth" },
            { label: "Hours", value: "47", icon: "timer-outline" },
          ].map((item, index) => (
            <View key={index} style={styles.statCard}>
              {/* Add Icon to Stat Card */}
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

        {/* --- Achievements Section --- */}
        <Text style={styles.sectionTitle}>Achievements</Text>
        {/* Consider adding icons to these cards too */}
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
            navigation.navigate("DummyScreen", {
              title: "Your Badges are ",
            })
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
        </Pressable>

        {/* --- Settings & Support Section --- */}
        <Text style={styles.sectionTitle}>Settings & Support</Text>
        {/* My Tasks with Icon */}
        <Pressable
          onPress={myTasksPressHandler}
          style={({ pressed }) => [
            styles.card,
            pressed && styles.pressedCard, // Use consistent pressed style
          ]}
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
        {/* Contact Us with Icon */}
        <Pressable
          onPress={contactUsPressHandler}
          style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}
        >
          <View style={styles.cardContent}>
            <MaterialCommunityIcons
              name="email-outline"
              size={22}
              color={Colors.primaryLightGray}
              style={styles.cardIcon}
            />
            <Text style={styles.cardText}>Contact Us</Text>
          </View>
        </Pressable>
        {/* Help with Icon */}
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
        {/* Sign out with Icon */}
        <Pressable
          onPress={() => setModalVisible(true)}
          style={({ pressed }) => [
            styles.card,
            styles.signOutCard, // Optional different style for sign out
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
            <Text style={[styles.cardText, styles.signOutText]}>Sign out</Text>
          </View>
        </Pressable>

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
            signoutHandler();
          }}
        />
      </ScrollView>
    </LinearGradient>
  );
};

// --- Update Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30 }, // Added paddingTop
  scrollContainer: { flexGrow: 1, paddingBottom: 20 },
  profileSection: { alignItems: "center", marginBottom: 30 }, // Increased marginBottom
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
    // Add shadow for elevation effect (optional)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  name: {
    fontSize: 22, // Slightly larger
    fontWeight: "bold",
    marginTop: 10, // Increased marginTop
    color: Colors.primaryWhite,
    fontFamily: "sans-serif-medium", // Example font
  },
  memberSince: {
    color: Colors.primaryLightGray,
    fontSize: 13, // Slightly smaller
    marginTop: 4, // Added marginTop
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Keeps space between items
    marginBottom: 30, // Increased marginBottom
    // Add negative margin to counteract card margin if needed for alignment
    // marginHorizontal: -5,
  },
  statCard: {
    width: "31%", // Adjusted width for 3 cards per row (approx)
    backgroundColor: Colors.primaryMaroon100 + "dd", // Added transparency
    paddingVertical: 16,
    paddingHorizontal: 8, // Adjusted padding
    alignItems: "center",
    borderRadius: 10, // Slightly more rounded
    marginBottom: 12, // Increased spacing
    // marginHorizontal: 5, // Add horizontal margin for spacing
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Increased elevation
  },
  statValue: {
    fontSize: 20, // Adjusted size
    fontWeight: "bold",
    color: Colors.primaryLightGray,
    marginTop: 4, // Spacing below icon
  },
  statLabel: {
    color: Colors.primaryLightGray,
    fontSize: 11, // Smaller label
    textAlign: "center", // Center label text
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18, // Keep size or adjust
    fontWeight: "600", // Slightly bolder
    marginBottom: 15, // Increased spacing
    color: Colors.primaryDarkMaroon,
    // borderBottomWidth: 1, // Optional separator
    // borderBottomColor: Colors.primaryMaroon200,
    // paddingBottom: 5,
  },
  card: {
    backgroundColor: Colors.primaryMaroon100 + "dd", // Added transparency
    borderRadius: 10,
    marginBottom: 12, // Consistent spacing
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden", // Ensures Pressable ripple effect stays within bounds
  },
  cardContent: {
    // Use this View inside Pressable for padding and layout
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  cardIcon: {
    marginRight: 15, // Space between icon and text
  },
  cardText: {
    color: Colors.primaryLightGray,
    fontSize: 16, // Slightly larger text
    flex: 1, // Allow text to take available space if needed (e.g., with badge)
  },
  signOutCard: {
    backgroundColor: Colors.warningRedLight + "aa", // Different background for sign out
  },
  signOutText: {
    color: Colors.warningRed, // Different text color for sign out
    fontWeight: "bold",
  },
  copyright: {
    textAlign: "center",
    color: Colors.primaryDarkMaroon, // Match section title color
    marginTop: 30, // Increased spacing
    marginBottom: 10,
    fontSize: 12,
  },
  pressedCard: {
    // Define the pressed style for reuse
    opacity: 0.75,
  },
});

export default ProfileScreen;

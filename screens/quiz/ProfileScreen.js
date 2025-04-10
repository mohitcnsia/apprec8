import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  TouchableOpacity, // Use TouchableOpacity for icon button
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Import icons
import { Colors } from "../../config/colors";
import { helpTopics } from "../../data/app-topic-data";
import Badge from "../../components/common/Badge";
import ConfirmationModal from "../../components/common/ConfirmationModel";

// --- Define Placeholder URIs ---
// Option 1: Use a service like ui-avatars.com
// (Generates initials-based avatars)
const generateAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "App Rec" // Use initials from name or default
  )}&background=random&color=fff&size=128`;

// Option 2: Use local assets (make sure you have these images in your assets folder)
// const DEFAULT_USER_AVATAR = require('../../assets/images/default-avatar.png');
// const GUEST_AVATAR = require('../../assets/images/guest-avatar.png'); // If needed elsewhere

const ProfileScreen = ({ navigation, signoutHandler, user }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // --- Determine User Name ---
  // Priority: 1. Firebase Auth displayName, 2. Email prefix
  // Later, we can add Firestore display name as priority 1
  const userName = user?.displayName || user?.email?.split("@")[0] || "User";

  // --- Determine Profile Image URI ---
  const profileImageUri = user?.photoURL || generateAvatarUrl(userName);
  // If using local assets:
  // const profileImageSource = user?.photoURL ? { uri: user.photoURL } : DEFAULT_USER_AVATAR;

  function helpPressHandler() {
    console.log("Help Clicked");
    navigation.navigate("LinkScreen", { data: helpTopics });
  }

  function myTasksPressHandler() {
    navigation.navigate("Tasks");
  }

  // --- Navigate to Edit Profile Screen ---
  function editProfileHandler() {
    navigation.navigate("EditProfile"); // Navigate to the new screen
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
              // If using local assets, use source={profileImageSource}
              source={{ uri: profileImageUri }}
              style={styles.profileImage}
              // Add defaultSource for better UX while image loads (optional)
              // defaultSource={DEFAULT_USER_AVATAR} // If using local assets
            />
            {/* --- Add Edit Icon Button --- */}
            <TouchableOpacity
              style={styles.editIcon}
              onPress={editProfileHandler} // Add onPress handler
            >
              <MaterialCommunityIcons
                name="pencil-outline"
                size={20}
                color={Colors.primaryDarkMaroon}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{userName}</Text>
          {/* TODO: Add dynamic enrollment date here later */}
          <Text style={styles.memberSince}>Enrolled Jan 01, 2024</Text>
        </View>

        {/* Stats Section (Keep as is for now) */}
        {/* ... existing stats code ... */}
        <View style={styles.statsContainer}>
          {[
            { label: "Day Streak", value: "223" },
            { label: "Questions", value: "3,000" },
            { label: "Stars", value: "1,57,899" },
            { label: "Exp Level", value: "200" },
            { label: "Global Rank", value: "1" },
            { label: "Hours", value: "47" },
          ].map((item, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Achievements Section (Keep as is for now) */}
        {/* ... existing achievements code ... */}
        <Text style={styles.sectionTitle}>Achievements</Text>
        <Pressable
          onPress={() =>
            navigation.navigate("DummyScreen", { title: "Practice Time" })
          }
          style={({ pressed }) => [
            styles.card,
            pressed && { opacity: 0.7 }, // Visual feedback when pressed
          ]}
        >
          <Badge label="Coming Soon" />
          <Text style={styles.cardText}>Practice Time</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            navigation.navigate("DummyScreen", {
              title: "Your Badges are ",
            })
          }
          style={({ pressed }) => [
            styles.card,
            pressed && { opacity: 0.7 }, // Visual feedback when pressed
          ]}
        >
          <Text style={styles.cardText}>Badge Collection</Text>
        </Pressable>

        {/* Support Section (Keep as is for now) */}
        {/* ... existing support code ... */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <Pressable
          onPress={myTasksPressHandler}
          style={({ pressed }) => [
            styles.card,
            pressed && { opacity: 0.7 }, // Visual feedback when pressed
          ]}
        >
          <Text style={styles.cardText}>My Tasks</Text>
        </Pressable>
        <Pressable
          onPress={helpPressHandler}
          style={({ pressed }) => [
            styles.card,
            pressed && { opacity: 0.7 }, // Visual feedback when pressed
          ]}
        >
          <Text style={styles.cardText}>Help</Text>
        </Pressable>
        <Pressable
          onPress={() => setModalVisible(true)}
          style={({ pressed }) => [
            styles.card,
            pressed && { opacity: 0.7 }, // Visual feedback when pressed
          ]}
        >
          <Text style={styles.cardText}>Sign out</Text>
        </Pressable>

        {/* Footer (Keep as is for now) */}
        {/* ... existing copyright code ... */}
        <Text style={styles.copyright}>
          © 2025 Apprec8. All rights reserved.
        </Text>

        {/* Sign-Out Confirmation Modal (Keep as is) */}
        {/* ... existing modal code ... */}
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
  container: { flex: 1, padding: 16 },
  scrollContainer: { flexGrow: 1, paddingBottom: 20 },
  profileSection: { alignItems: "center", marginBottom: 20 },
  profileImageContainer: {
    // Added container for positioning edit icon
    position: "relative",
    marginBottom: 8, // Add some space below image container
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: Colors.primaryMaroon200,
  },
  editIcon: {
    // Style for the edit icon button
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primaryWhite, // White background
    borderRadius: 15, // Make it circular
    padding: 5, // Padding around the icon
    borderWidth: 1,
    borderColor: Colors.primaryDarkMaroon,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
    color: Colors.primaryWhite,
  },
  memberSince: { color: Colors.primaryLightGray },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    width: "48%",
    backgroundColor: Colors.primaryMaroon100,
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primaryLightGray,
  },
  statLabel: { color: Colors.primaryLightGray },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.primaryDarkMaroon, // Match header style perhaps?
  },
  card: {
    backgroundColor: Colors.primaryMaroon100,
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: { color: Colors.primaryLightGray },
  copyright: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
    marginBottom: 10,
    color: Colors.primaryDarkMaroon,
  },
  // pressedCard style was unused, remove or implement if needed
});

export default ProfileScreen;

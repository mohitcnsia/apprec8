import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { Colors } from "../../config/colors";

const ProfileScreen = () => {
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
          <Image
            source={{
              uri: "https://images.pexels.com/photos/1470677/pexels-photo-1470677.jpeg",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>Pratha Chilkoti</Text>
          <Text style={styles.memberSince}>Member since 2025</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          {[
            { label: "Day Streak", value: "10" },
            { label: "Questions", value: "300" },
            { label: "Stars", value: "5789" },
            { label: "Exp Level", value: "20" },
            { label: "Global Rank", value: "200" },
          ].map((item, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Achievements Section */}
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>Practice Time</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardText}>Badge Collection</Text>
        </View>

        {/* Support Section */}
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>Contact Us</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardText}>Help</Text>
        </View>

        {/* Footer */}
        <Text style={styles.copyright}>
          © 2025 Apprec8. All rights reserved.
        </Text>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  scrollContainer: { flexGrow: 1, paddingBottom: 20 },
  profileSection: { alignItems: "center", marginBottom: 20 },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "white",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
    color: Colors.primaryWhite,
  },
  memberSince: { color: Colors.primaryWhite },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    width: "48%",
    backgroundColor: "white",
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
    color: Colors.primaryDarkMaroon,
  },
  statLabel: { color: Colors.primaryDarkMaroon },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.primaryDarkMaroon,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: { color: Colors.primaryDarkMaroon },
  copyright: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
    marginBottom: 10,
    color: Colors.primaryDarkMaroon,
  },
});

export default ProfileScreen;

import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, Text, StyleSheet, FlatList } from "react-native";
import LeaderCard from "../../components/common/LeaderCard";
import CustomListItem from "../../components/common/CustomListItem";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors";

const Tab = createMaterialTopTabNavigator();

// 🔹 Mock Data for Leaderboard
const leaderboardData = [
  { id: "1", name: "Pratha Chilkoti", points: 8000, rank: 1 },
  { id: "2", name: "Jeffery Bezos", points: 7000, rank: 2 },
  { id: "3", name: "Cristiano Ronaldo", points: 6500, rank: 3 },
  { id: "4", name: "Mark Zuckerberg", points: 4000, rank: 4 },
  { id: "5", name: "Jeff Bezos", points: 2400, rank: 5 },
  { id: "6", name: "Frank Muller", points: 1680, rank: 6 },
  { id: "7", name: "Seema Joshi", points: 1680, rank: 7 },
  { id: "8", name: "Mohit Chilkoti", points: 1680, rank: 8 },
  { id: "9", name: "Elon Musk", points: 1680, rank: 9 },
  { id: "10", name: "Sundar Pichai", points: 1680, rank: 10 },
];

// 🔹 Top 3 Cards Component
const TopThree = () => {
  return (
    <View style={styles.topThreeContainer}>
      {/* Silver - 2nd Rank */}

      <LeaderCard
        name={leaderboardData[1].name}
        points={leaderboardData[1].points}
        rank={leaderboardData[1].rank}
        style={styles.silver}
      />

      {/* Gold - 1st Rank */}
      <LeaderCard
        name={leaderboardData[0].name}
        points={leaderboardData[0].points}
        rank={leaderboardData[0].rank}
        userImageUri="https://images.pexels.com/photos/1470677/pexels-photo-1470677.jpeg"
        style={styles.gold}
      />

      {/* Bronze - 3rd Rank */}

      <LeaderCard
        name={leaderboardData[2].name}
        points={leaderboardData[2].points}
        rank={leaderboardData[2].rank}
        style={styles.bronze}
      />
    </View>
  );
};

// 🔹 Tab Screens
const CustomLeaderboard = () => {
  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container} // Ensure full-screen coverage
    >
      <FlatList
        data={leaderboardData.slice(3)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CustomListItem item={item} />}
        ListHeaderComponent={<TopThree />}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};

// 🔹 Main Leaderboard with Tabs
const LeaderBoard = () => {
  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: "transparent" },
          tabBarIndicatorStyle: {
            backgroundColor: Colors.primaryWhite,
            height: 3,
          },
          tabBarLabelStyle: { fontWeight: "bold", color: Colors.primaryWhite },
        }}
      >
        <Tab.Screen name="Daily" component={CustomLeaderboard} />
        <Tab.Screen name="Weekly" component={CustomLeaderboard} />
        <Tab.Screen name="Monthly" component={CustomLeaderboard} />
      </Tab.Navigator>
    </LinearGradient>
  );
};

// 🔹 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  gradientContainer: {
    flex: 1,
    backgroundColor: "transparent", // Ensures gradient visibility
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  // Fixed Top 3
  fixedTopThree: {
    position: "absolute",
    width: "100%",
    zIndex: 10,
  },
  topThreeContainer: {
    margin: 20,
  },
  // Leaderboard Items
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    // backgroundColor: "#fff",
    marginBottom: 5,
    borderRadius: 10,
  },

  // 🎖️ Top 3 Cards
  topThreeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    padding: 20,
  },
  silver: { backgroundColor: "#C0C0C0", height: 250 }, // Silver card
  gold: { backgroundColor: "#FFD700", height: 300 }, // Gold card (highest)
  bronze: { backgroundColor: "#CD7F32", height: 230 }, // Bronze card (lowest)
  userImage: { width: 60, height: 60, borderRadius: 30, marginBottom: 5 },
  name: { fontWeight: "bold", color: "#333" },
  points: { fontSize: 14, color: "#666" },
  rank: { fontSize: 20, fontWeight: "bold", color: "#222", marginTop: 5 },

  // 🏅 Rank List
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    // backgroundColor: "#fff",
    marginBottom: 5,
    borderRadius: 10,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: "bold",
    width: 40,
    textAlign: "center",
  },
  rowImage: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 10 },
  rankName: { flex: 1, fontSize: 16, fontWeight: "500", color: "#333" },
  rankPoints: { fontSize: 14, color: "#666" },
});

export default LeaderBoard;

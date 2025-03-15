import React, { memo } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, FlatList, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LeaderCard from "../../components/common/LeaderCard";
import CustomListItem from "../../components/common/CustomListItem";
import { Colors } from "../../config/colors";

const Tab = createMaterialTopTabNavigator();

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

// memo() prevents unnecessary re-renders by only updating the components when their props change.
// Without memo(), every time the parent (LeaderBoard) re-renders, TopThree and CustomLeaderboard would also re-render—even if their data hasn’t changed.
const TopThreeLeaders = memo(() => (
  <View style={styles.topThreeContainer}>
    <LeaderCard
      name={leaderboardData[1].name}
      points={leaderboardData[1].points}
      rank={2}
      style={styles.silver}
    />
    <LeaderCard
      name={leaderboardData[0].name}
      points={leaderboardData[0].points}
      rank={1}
      userImageUri="https://images.pexels.com/photos/1470677/pexels-photo-1470677.jpeg"
      style={styles.gold}
    />
    <LeaderCard
      name={leaderboardData[2].name}
      points={leaderboardData[2].points}
      rank={3}
      style={styles.bronze}
    />
  </View>
));

const CustomLeaderboard = memo(() => (
  <LinearGradient
    colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
    style={StyleSheet.absoluteFillObject}
  >
    <FlatList
      data={leaderboardData.slice(3)}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <CustomListItem item={item} />}
      ListHeaderComponent={<TopThreeLeaders />}
      contentContainerStyle={styles.listContent}
      // Provides precomputed layout information (height, offset, index) for each list item.
      // Helps React Native optimize scrolling by avoiding layout recalculations.
      getItemLayout={(data, index) => ({
        length: 60,
        offset: 60 * index,
        index,
      })}
      initialNumToRender={7}
      maxToRenderPerBatch={10}
      windowSize={5}
      style={styles.transparentBg}
      showsVerticalScrollIndicator={false}
    />
  </LinearGradient>
));

const Stats = () => (
  <View style={styles.container}>
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: Colors.primaryDarkMaroon },
        tabBarIndicatorStyle: { backgroundColor: "#007AFF", height: 3 },
        tabBarLabelStyle: { fontWeight: "bold", color: Colors.primaryWhite },
      }}
    >
      <Tab.Screen name="Daily" component={CustomLeaderboard} />
      <Tab.Screen name="Weekly" component={CustomLeaderboard} />
      <Tab.Screen name="Monthly" component={CustomLeaderboard} />
    </Tab.Navigator>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  transparentBg: { backgroundColor: "transparent" },
  listContent: { paddingBottom: 20 },
  topThreeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    padding: 20,
  },
  silver: { backgroundColor: "#C0C0C0", height: 250 },
  gold: { backgroundColor: "#FFD700", height: 300 },
  bronze: { backgroundColor: "#CD7F32", height: 230 },
});

export default Stats;

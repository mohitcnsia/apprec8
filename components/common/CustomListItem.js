import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors";

export default function CustomListItem({ item }) {
  return (
    <LinearGradient
      colors={[Colors.primaryMaroon100, Colors.primaryLightGray]}
      style={styles.gradientBackground}
    >
      <Pressable
        android_ripple={{ color: "#CCC" }}
        style={({ pressed }) => (pressed ? styles.buttonPressed : null)}
      >
        <View style={styles.rankRow}>
          <Text style={styles.rankNumber}>#{item.rank}</Text>
          <Image
            source={{
              uri: "https://images.pexels.com/photos/289923/pexels-photo-289923.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            }}
            style={styles.rowImage}
          />
          <Text style={styles.rankName}>{item.name}</Text>
          <Text style={styles.rankPoints}>{item.points} pts</Text>
        </View>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    margin: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 5,
    borderRadius: 10,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: "bold",
    width: 40,
    textAlign: "center",
    color: Colors.primaryDarkMaroon,
  },
  rowImage: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 10 },
  rankName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: Colors.primaryDarkMaroon,
  },
  rankPoints: { fontSize: 14, color: Colors.primaryDarkMaroon },
  buttonPressed: {
    opacity: 0.5,
  },
});

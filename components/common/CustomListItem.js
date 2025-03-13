import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import React from "react";

export default function CustomListItem({ item }) {
  return (
    <View style={styles.customListItem}>
      <Pressable
        android_ripple={{ color: "#CCC" }}
        style={({ pressed }) => {
          pressed ? styles.buttonPressed : null;
        }}
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
    </View>
  );
}

// https://images.pexels.com/photos/289923/pexels-photo-289923.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
// https://images.pexels.com/photos/19435364/pexels-photo-19435364/free-photo-of-a-red-cat-with-a-collar-on-looking-up.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1

const styles = StyleSheet.create({
  customListItem: {
    margin: 16,
    borderRadius: 8,
    overflow: "scroll",
    backgroundColor: "white",
  },
  // 🏅 Rank List
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
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
  buttonPressed: {
    opacity: 0.5,
  },
});

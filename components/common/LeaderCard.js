import { View, Text, Image, Dimensions } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { Colors } from "../../config/colors";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const IMAGE_SIZE = windowWidth * 0.15; // Scale dynamically
const IMAGE_OFFSET = IMAGE_SIZE * 0.5; // Move half the image out

export default function LeaderCard({
  name,
  points,
  rank,
  userImageUri,
  trophyImageUri,
  style,
}) {
  return (
    <View style={{ overflow: "visible" }}>
      <View style={[styles.card, { paddingTop: IMAGE_OFFSET }, style]}>
        <Image
          source={{ uri: userImageUri }}
          style={rank == 1 ? styles.goldUserImage : styles.userImage}
        />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.points}>{points} points</Text>
        <Text style={styles.rank}>#{rank}</Text>

        <Image source={trophyImageUri} style={styles.trophyImage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: windowWidth * 0.28,
    height: windowHeight * 0.3,
    backgroundColor: Colors.primaryMaroon100,
    borderColor: Colors.primaryLightGray,
    borderWidth: 2,
    shadowColor: "black",
    shadowOpacity: 0.5,
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    marginVertical: "20%",
    borderRadius: 10,
    overflow: "visible",
  },
  userImage: {
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -IMAGE_SIZE / 2 }], // Center the image
    borderRadius: IMAGE_SIZE / 2,
    backgroundColor: Colors.primaryLightPink,
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    top: -IMAGE_OFFSET,
  },
  goldUserImage: {
    position: "absolute",
    left: "40%",
    transform: [{ translateX: -IMAGE_SIZE / 2 }], // Center the image
    borderRadius: (windowWidth * 0.2) / 2,
    backgroundColor: Colors.primaryLightPink,
    width: windowWidth * 0.2,
    height: windowWidth * 0.2,
    top: -IMAGE_OFFSET * 1.2,
  },
  trophyImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  name: { fontWeight: "bold", color: "#333" },
  points: { fontSize: 14, color: "#666" },
  rank: { fontSize: 20, fontWeight: "bold", color: "#222", marginTop: 5 },
});

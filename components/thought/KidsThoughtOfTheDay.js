import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "../../config/colors";

const { width } = Dimensions.get("window");

const KidsThoughtOfTheDay = ({ thought }) => {
  const shimmer = useSharedValue(0);

  // Looping background animation
  React.useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value * 0.4 + 0.6, // Light shimmer effect
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LinearGradient
        colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Text style={styles.title}>✨ Thought of the Day ✨</Text>
      <View style={styles.thoughtContainer}>
        {thought.split(" ").map((word, index) => (
          <Text key={index} style={styles.word}>
            {word}
          </Text>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    padding: 20,
    borderRadius: 15,
    overflow: "hidden",
    alignSelf: "center",
    marginVertical: 15,
    elevation: 5,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "delius",
  },
  thoughtContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  word: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 5,
    marginVertical: 2,
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 5,
    borderRadius: 5,
    fontFamily: "delius",
  },
});

export default KidsThoughtOfTheDay;

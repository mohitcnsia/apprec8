import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { Colors } from "../../config/colors";

const { width, height } = Dimensions.get("window");

const CalmThought = ({ thought }) => {
  // Background animation
  const backgroundAnimation = useSharedValue(0);
  useEffect(() => {
    backgroundAnimation.value = withRepeat(
      withTiming(1, { duration: 6000 }),
      -1,
      true
    );
  }, []);

  const animatedBackground = useAnimatedStyle(() => ({
    opacity: backgroundAnimation.value * 0.4 + 0.6,
  }));

  // Floating animation for text
  const floatingText = useSharedValue(0);
  useEffect(() => {
    floatingText.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 2000 }),
        withTiming(5, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatingText.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedBackground]}>
      <LinearGradient
        colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Text style={styles.title}>✨ Thought of the Day ✨</Text>
      <Animated.View style={[styles.thoughtContainer, animatedTextStyle]}>
        <Text
          style={styles.thought}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
        >
          {thought}
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    minHeight: height * 0.3, // Increased height for better text fit
    padding: 20,
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "center",
    marginVertical: 15,
    elevation: 5,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "Poppins-Bold",
  },
  thoughtContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  thought: {
    fontSize: 18, // Increased for better readability
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 15,
    lineHeight: 40, // Ensures good spacing
    fontFamily: "Poppins-SemiBold",
    textShadowColor: "rgba(255, 255, 255, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    flexWrap: "wrap",
  },
});

export default CalmThought;

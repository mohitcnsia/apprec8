import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { Colors } from "../../config/colors";

export default function CalmLoader() {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    breathe.start();
    return () => breathe.stop();
  }, [scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[styles.text, { transform: [{ scale: scaleAnim }] }]}
      >
        Take a deep breath
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDarkMaroon,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "pacifico",
    fontSize: 24,
    color: Colors.primaryWhite,
  },
});

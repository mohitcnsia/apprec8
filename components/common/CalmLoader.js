import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { useTheme } from "../../context/ThemeContext"; // Import the custom hook

export default function CalmLoader() {
  // Access the current theme object and the toggle function
  const { theme } = useTheme();
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

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.background, // Use theme from hook
          justifyContent: "center",
          alignItems: "center",
        },
        text: {
          fontFamily: "pacifico", // Ensure this font is linked in your project
          fontSize: 24,
          color: theme.textPrimary, // Use theme from hook
          textAlign: "center", // Good practice for centered text
        },
        animatedText: {
          // Separate animated properties if preferred
          transform: [{ scale: scaleAnim }],
        },
      }),
    [theme]
  ); // Dependency array ensures regeneration on theme change

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[styles.text, styles.animatedText]} // Combine base text styles and animation transform
      >
        Appreciate
      </Animated.Text>
    </View>
  );
}

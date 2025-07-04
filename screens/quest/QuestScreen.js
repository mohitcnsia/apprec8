// screens/quest/QuestScreen.js
import React, { useState, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../context/ThemeContext"; // Adjust path if needed
import { questData } from "./dummyQuestData"; // Import our dummy data
import Ionicons from "@expo/vector-icons/Ionicons";
import { Svg, Path } from "react-native-svg";
import LottieView from "lottie-react-native";

const activityIcons = {
  Quiz: "school",
  SoundSpell: "musical-notes",
  Minesweeper: "keypad",
  Sudoku: "grid",
  ReadRecord: "mic",
  Game: "game-controller",
};

const QuestScreen = () => {
  const { theme } = useTheme();
  const [showConfetti, setShowConfetti] = useState(false);
  const animation = useRef(null);

  const handleNodePress = (item) => {
    if (item.status !== "unlocked") return;

    // In a real app, you'd navigate to the activity
    console.log("Navigating to:", item.type, item.title);

    // On completion, you would trigger this
    setShowConfetti(true);
    animation.current?.play();
  };

  const onConfettiFinish = () => {
    setShowConfetti(false);
    // Here you would update your state to mark the node as 'completed'
    // and unlock the next one.
  };

  const getNodeStyles = (status) => {
    switch (status) {
      case "completed":
        return {
          node: [
            styles.node,
            { backgroundColor: theme.primary, borderColor: theme.primary },
          ],
          icon: <Ionicons name="checkmark-sharp" size={40} color="#ffffff" />,
        };
      case "unlocked":
        return {
          node: [
            styles.node,
            { backgroundColor: theme.accent, borderColor: theme.accent },
          ],
          icon: (
            <Ionicons
              name={activityIcons.Minesweeper}
              size={40}
              color="#ffffff"
            />
          ), // Example for unlocked
        };
      case "locked":
      default:
        return {
          node: [
            styles.node,
            {
              backgroundColor: theme.tabBarBackground,
              borderColor: theme.border,
            },
          ],
          icon: (
            <Ionicons
              name="lock-closed"
              size={40}
              color={theme.tabBarInactiveTint}
            />
          ),
        };
    }
  };

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={styles.contentContainer}>
          {/* SVG Path goes here, BEHIND the nodes */}
          <Svg style={StyleSheet.absoluteFill}>
            <Path
              d="M 120 100 C 120 200, 280 200, 280 300 S 120 400, 120 500 S 280 600, 280 700 S 120 800, 120 900" // <-- This is an example path string
              stroke={theme.border}
              strokeWidth="5"
              strokeDasharray="10"
              fill="transparent"
            />
          </Svg>

          {/* The nodes map goes here, rendered ON TOP of the SVG */}
          {questData.map((item, index) => {
            const { node, icon } = getNodeStyles(item.status);
            const isLeft = index % 2 === 0;

            return (
              <View
                key={item.id}
                style={[
                  styles.nodeContainer,
                  isLeft ? styles.left : styles.right,
                ]}
              >
                <TouchableOpacity
                  style={node}
                  disabled={item.status === "locked"}
                  onPress={() => handleNodePress(item)}
                >
                  {icon}
                </TouchableOpacity>
                <Text style={[styles.nodeTitle, { color: theme.text }]}>
                  {item.title}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
      {showConfetti && (
        <LottieView
          ref={animation}
          source={require("../../assets/animations/confetti.json")} // <-- Path to your Lottie JSON
          autoPlay={true}
          loop={false}
          onAnimationFinish={() => {
            console.log("Animation finished!");
            setShowConfetti(false);
          }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            zIndex: 10,
            pointerEvents: "none",
          }}
          // Adding an error handler for more insight
          onError={(error) => console.log("Lottie Error:", error)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  nodeContainer: {
    marginBottom: 80, // Increase space between nodes
    width: "50%",
    alignItems: "center",
  },
  left: {
    alignSelf: "flex-start",
  },
  right: {
    alignSelf: "flex-end",
  },
  node: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nodeTitle: {
    fontFamily: "nunitoBold",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
});

export default QuestScreen;

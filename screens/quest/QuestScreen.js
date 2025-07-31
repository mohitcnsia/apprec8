/**
 * @file QuestScreen.js
 * @description The main screen for the Duolingo-style quest map.
 *
 * MODIFICATIONS:
 * 1. Imported `useRoute` hook from React Navigation to access route params.
 * 2. Added a new `useEffect` hook that listens for `route.params.completedQuizId`.
 * 3. When a `completedQuizId` is received, it finds the corresponding node in `questData`.
 * 4. It then calls `handleActivityCompletion` with the NODE's ID to update the map.
 * 5. It clears the `completedQuizId` param to prevent the effect from running again.
 */
import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { questData as initialQuestData } from "./dummyQuestData";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Svg, Path } from "react-native-svg";
import LottieView from "lottie-react-native";

// --- Mock Theme Hook ---
const useTheme = () => ({
  theme: {
    primary: "#58CC02",
    accent: "#1CB0F6",
    border: "#E5E5E5",
    tabBarBackground: "#FFFFFF",
    tabBarInactiveTint: "#999999",
    dark: false,
  },
});

// --- Constants ---
const NODE_CONTAINER_MARGIN_BOTTOM = 80;
const NODE_SIZE = 80;
const PADDING_VERTICAL = 80;
const PADDING_HORIZONTAL = 30;
const { width: screenWidth } = Dimensions.get("window");

// --- Activity Icons ---
const activityIcons = {
  Quiz: "school",
  SoundSpell: "musical-notes",
  Minesweeper: "keypad",
  Sudoku: "grid",
  ReadRecord: "mic",
  Game: "game-controller",
};

const QuestScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();

  // --- State and Refs ---
  const [questData, setQuestData] = useState(initialQuestData);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const animation = useRef(null);
  const scrollViewRef = useRef(null);

  /**
   * DOCUMENTATION:
   * This is the "listener" hook. It runs whenever the route parameters change.
   * 1. It checks if the `completedQuizId` parameter exists.
   * 2. It finds the quest node that has that `quizId`.
   * 3. It calls our `handleActivityCompletion` function with the node's ID.
   * 4. It clears the parameter so this logic doesn't run again by accident.
   */
  useEffect(() => {
    if (route.params?.completedQuizId) {
      const completedQuizId = route.params.completedQuizId;

      const completedNode = questData.find(
        (node) => node.quizId === completedQuizId
      );

      if (completedNode && completedNode.status !== "completed") {
        handleActivityCompletion(completedNode.id);
      }

      navigation.setParams({ completedQuizId: null });
    }
  }, [route.params?.completedQuizId]);

  // --- Add a useEffect to handle quiz completion ---
  useEffect(() => {
    // Check if the screen was navigated to with a 'completedQuizId' param.
    if (route.params?.completedQuizId) {
      const completedQuizId = route.params.completedQuizId;

      // Find the node in our questData that corresponds to the completed quiz.
      const completedNode = questData.find(
        (node) => node.quizId === completedQuizId
      );

      // If we found a matching node, and it's not already completed...
      if (completedNode && completedNode.status !== "completed") {
        // ...call the completion handler with the NODE's ID (e.g., 'node_1').
        handleActivityCompletion(completedNode.id);
      }

      // Important: Clear the parameter so this doesn't run again
      // if the user leaves and returns to the screen.
      navigation.setParams({ completedQuizId: null });
    }
  }, [route.params?.completedQuizId]); // Effect dependencies

  // --- CORRECTED DYNAMIC SVG PATH ---
  const questPath = useMemo(() => {
    // 1. Find the "Coming Soon!" node. The path will start on the node AFTER it.
    const pathStartIndex =
      questData.findIndex((item) => item.title === "Coming Soon!") + 1;

    // If "Coming Soon!" isn't found or is the last item, there's no path to draw.
    if (pathStartIndex >= questData.length) {
      return "";
    }

    // 2. The path should be drawn for all nodes after "Coming Soon!".
    const nodesForPath = questData.slice(pathStartIndex);

    // Path must have at least two points to draw.
    if (nodesForPath.length < 2) return "";

    // 3. Calculate the coordinates for each point in the path
    const points = nodesForPath.map((item) => {
      // We must use the item's index from the original questData array
      // to ensure the path's X/Y coordinates match the rendered node's position.
      const originalIndex = questData.findIndex((q) => q.id === item.id);
      const isLeft = originalIndex % 2 === 0;
      const x = isLeft ? screenWidth * 0.25 : screenWidth * 0.75;
      const y =
        PADDING_VERTICAL +
        NODE_SIZE / 2 +
        originalIndex * (NODE_SIZE + NODE_CONTAINER_MARGIN_BOTTOM);
      return { x, y };
    });

    // 4. Build the path string from the points
    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      const curveHardness = 60;

      // Create a smooth S-curve going downward.
      path += ` C ${prevPoint.x} ${prevPoint.y + curveHardness}, ${
        currentPoint.x
      } ${currentPoint.y - curveHardness}, ${currentPoint.x} ${currentPoint.y}`;
    }

    return path;
  }, [questData]);

  // --- Auto-scroll Effect ---
  useEffect(() => {
    if (scrollViewHeight === 0) return;
    const activeNodeIndex = questData.findIndex(
      (item) => item.status === "unlocked"
    );

    if (activeNodeIndex === -1) {
      const lastCompleted = questData.findIndex(
        (item) => item.status === "completed"
      );
      if (lastCompleted !== -1) {
        const nodeY =
          PADDING_VERTICAL +
          lastCompleted * (NODE_SIZE + NODE_CONTAINER_MARGIN_BOTTOM);
        const scrollToY = nodeY - scrollViewHeight / 2 + NODE_SIZE / 2;
        scrollViewRef.current?.scrollTo({ y: scrollToY, animated: true });
      }
      return;
    }

    const nodeY =
      PADDING_VERTICAL +
      activeNodeIndex * (NODE_SIZE + NODE_CONTAINER_MARGIN_BOTTOM);
    const scrollToY = nodeY - scrollViewHeight / 2 + NODE_SIZE / 2;

    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: scrollToY, animated: true });
    }, 300);
  }, [questData, scrollViewHeight]);

  /**
   * DOCUMENTATION:
   * This function handles the logic for updating the quest map.
   * It finds the completed node by its ID, marks it as 'completed',
   * and then finds the next node in the list to mark as 'unlocked'.
   * Using setQuestData with a function (prevData => ...) is the safest
   * way to update state in React.
   */
  const handleActivityCompletion = (completedNodeId) => {
    setQuestData((prevData) => {
      const updatedData = [...prevData];
      const completedIndex = updatedData.findIndex(
        (item) => item.id === completedNodeId
      );

      if (completedIndex !== -1) {
        updatedData[completedIndex].status = "completed";
        // Unlock the previous node in the array (which is the next node visually)
        if (completedIndex > 0) {
          const nextNodeToUnlock = updatedData[completedIndex - 1];
          if (nextNodeToUnlock.title !== "Coming Soon!") {
            nextNodeToUnlock.status = "unlocked";
          }
        }
      }
      return updatedData;
    });

    // Trigger confetti animation
    // setShowConfetti(true);
    animation.current?.play(0);
  };

  /**
   * DOCUMENTATION:
   * We are changing the condition to allow interaction if a node's
   * status is 'unlocked' OR 'completed'. This lets users replay
   * levels they have already finished.
   */
  const handleNodePress = (item) => {
    // A node must be unlocked to be interactive
    if (item.status !== "unlocked" && item.status !== "completed") {
      console.log(`Node "${item.title}" is locked.`);
      return;
    }

    // Check if the pressed node is a Quiz and has a quizId
    if (item.type === "Quiz" && item.quizId) {
      console.log(`Navigating to Quiz: ${item.title}`);

      // Navigate to our new details screen
      navigation.navigate("QuizDetails", {
        quiz: {
          id: item.quizId,
          title: item.title,
          description: item.description || `A quiz about ${item.title}.`, // Pass a description
          config: item.config || {
            shuffleQuestions: true,
            shuffleOptions: true,
          },
        },
      });
    } else {
      // Handle other activity types here in the future
      alert(
        `Activity "${item.title}" of type "${item.type}" is not ready yet.`
      );

      // For testing, we can keep the old logic to see the map update
      // handleActivityCompletion(item.id);
    }
  };

  const getNodeStyles = (status, itemType) => {
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
        const iconName = activityIcons[itemType] || "star";
        return {
          node: [
            styles.node,
            { backgroundColor: theme.accent, borderColor: theme.accent },
          ],
          icon: <Ionicons name={iconName} size={40} color="#ffffff" />,
        };
      case "locked":
        const lockIconColor = theme.dark ? "#777777" : theme.tabBarInactiveTint;
        return {
          node: [
            styles.node,
            {
              backgroundColor: theme.tabBarBackground,
              borderColor: theme.border,
            },
          ],
          icon: <Ionicons name="lock-closed" size={40} color={lockIconColor} />,
        };
      default:
        return {
          node: [
            styles.node,
            {
              backgroundColor: theme.tabBarBackground,
              borderColor: theme.border,
            },
          ],
          icon: null,
        };
    }
  };

  const onConfettiFinish = () => {
    setShowConfetti(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        onLayout={(event) =>
          setScrollViewHeight(event.nativeEvent.layout.height)
        }
        contentContainerStyle={styles.contentContainer}
      >
        <Svg
          height={
            (NODE_SIZE + NODE_CONTAINER_MARGIN_BOTTOM) * questData.length +
            PADDING_VERTICAL * 2
          }
          width={screenWidth}
          style={styles.svg}
        >
          <Path
            d={questPath}
            stroke={theme.border}
            strokeWidth="5"
            strokeDasharray="10"
            fill="transparent"
          />
        </Svg>

        {questData.map((item, index) => {
          const { node, icon } = getNodeStyles(item.status, item.type);
          // The side alignment now depends on the node's index in the main array
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
                disabled={
                  item.status !== "unlocked" && item.status !== "completed"
                }
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
      </ScrollView>

      {showConfetti && (
        <LottieView
          // Make sure you have this file in your assets
          source={require("../../assets/animations/confetti.json")}
          loop={false}
          onAnimationFinish={onConfettiFinish}
          autoPlay
          speed={2}
          style={styles.lottieOverlay}
        />
      )}
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingVertical: PADDING_VERTICAL,
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1, // Keep path behind nodes
  },
  nodeContainer: {
    marginBottom: NODE_CONTAINER_MARGIN_BOTTOM,
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
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    elevation: 5,
    backgroundColor: "#fff",
  },
  nodeTitle: {
    // fontFamily: "nunitoBold", // Make sure you have this font loaded
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  lottieOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 10,
    pointerEvents: "none",
  },
});

export default QuestScreen;

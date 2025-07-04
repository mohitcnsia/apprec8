import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// Assuming useTheme is in a file like this
// import { useTheme } from "../../context/ThemeContext";
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
  const { theme } = useTheme();

  // --- State and Refs ---
  const [questData, setQuestData] = useState(initialQuestData);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const animation = useRef(null);
  const scrollViewRef = useRef(null);

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

  // --- Functions ---
  const handleActivityCompletion = (completedActivityId) => {
    const updatedData = [...questData];
    const completedIndex = updatedData.findIndex(
      (item) => item.id === completedActivityId
    );

    // If the completed node is found in the array
    if (completedIndex !== -1) {
      // 1. Mark the current quest node as 'completed'
      updatedData[completedIndex].status = "completed";

      // 2. Unlock the next quest, which is the previous item in the array (e.g., index 5 after 6)
      if (completedIndex > 0) {
        const nextNode = updatedData[completedIndex - 1];
        // Ensure the next node isn't the "Coming Soon!" placeholder
        if (nextNode.title !== "Coming Soon!") {
          nextNode.status = "unlocked";
        }
      }
    }

    // 3. Update the state to re-render the screen
    setQuestData(updatedData);
    setShowConfetti(true);
    animation.current?.play(0);
  };
  const handleNodePress = (item) => {
    if (item.status !== "unlocked") return;
    // NOTE: Your completion logic needs to be reversed as well.
    // Completing "Alphabet Master" (index 6) should unlock "Listen & Spell" (index 5).
    const updatedData = [...questData];
    const completedIndex = updatedData.findIndex((q) => q.id === item.id);

    if (completedIndex !== -1) {
      updatedData[completedIndex].status = "completed";
      // Unlock the previous item in the array if it exists
      if (completedIndex > 0) {
        updatedData[completedIndex - 1].status = "unlocked";
      }
    }

    setQuestData(updatedData);
    setShowConfetti(true);
    animation.current?.play(0);
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
                disabled={item.status !== "unlocked"}
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

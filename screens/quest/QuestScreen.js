import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Svg, Path } from "react-native-svg";
import LottieView from "lottie-react-native";
import { listenToQuestNodes, listenToUserDocument, markQuizCompleted } from "../../services/firestoreContentApi";

// --- Mock Theme Hook ---
const useTheme = () => ({
  theme: {
    primary: "#58CC02",
    accent: "#1CB0F6",
    border: "#E5E5E5",
    text: "#000000",
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
const activityIcons = {
  Quiz: "school",
  SoundSpell: "musical-notes",
  Minesweeper: "keypad",
  Sudoku: "grid",
  ReadRecord: "mic",
  Game: "game-controller",
};

const QuestScreen = () => {
  // --- SECTION 1: ALL HOOKS AND STATE AT THE TOP ---
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();

  const [questData, setQuestData] = useState([]);
  const [questNodesRaw, setQuestNodesRaw] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const animation = useRef(null);
  const scrollViewRef = useRef(null);

  // --- HOOK 1: Data fetching from Firestore (Quest Nodes) ---
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = listenToQuestNodes(
      (nodes) => {
        setQuestNodesRaw(nodes.reverse());
        setIsLoading(false);
      },
      (err) => {
        setError("Failed to load the quest map.");
        setIsLoading(false);
        console.error(err);
      }
    );
    return () => unsubscribe();
  }, []);

  // --- HOOK 1b: Data fetching from Firestore (User Document) ---
  useEffect(() => {
    const unsubscribe = listenToUserDocument(
      (userData) => {
        if (userData) {
          setCompletedQuizzes(userData.completedQuizzes || []);
        }
      },
      (err) => console.error(err)
    );
    return () => unsubscribe();
  }, []);

  // --- HOOK 1c: Combine Raw Nodes and Completed Quizzes to set Quest Data ---
  useEffect(() => {
    if (questNodesRaw.length === 0) return;

    let hasFoundUnlocked = false;
    
    // Nodes are reversed (bottom-up view usually in maps). 
    // We iterate from the "start" of the map to the "end". Wait, the original code reversed them.
    // Let's assume the last element of the reversed array is the "first" node in the journey? No, usually the first element is the start (at the top or bottom).
    // The original code did: index === 0 ? 'unlocked' : 'locked' on the raw array, then reversed it.
    // So the FIRST node fetched (before reverse) is the start.
    
    // We will map over the raw nodes (before reverse).
    const rawUnreversed = [...questNodesRaw].reverse();
    const processedNodes = rawUnreversed.map((node) => {
      if (completedQuizzes.includes(node.quizId)) {
        return { ...node, status: "completed" };
      }
      
      if (!hasFoundUnlocked && node.title !== "Coming Soon!") {
        hasFoundUnlocked = true;
        return { ...node, status: "unlocked" };
      }

      return { ...node, status: "locked" };
    });

    setQuestData(processedNodes.reverse());
  }, [questNodesRaw, completedQuizzes]);

  // --- HOOK 2: Listening for completed quizzes from navigation ---
  useEffect(() => {
    if (route.params?.completedQuizId) {
      const completedQuizId = route.params.completedQuizId;
      if (!completedQuizzes.includes(completedQuizId)) {
        markQuizCompleted(completedQuizId);
        setShowConfetti(true);
        animation.current?.play(0);
      }
      navigation.setParams({ completedQuizId: null });
    }
  }, [route.params?.completedQuizId, completedQuizzes]);

  // --- HOOK 3: Path calculation ---
  const questPath = useMemo(() => {
    if (questData.length < 2) return "";
    const points = questData.map((item, index) => {
      const isLeft = index % 2 === 0;
      const x = isLeft ? screenWidth * 0.25 : screenWidth * 0.75;
      const y =
        PADDING_VERTICAL +
        NODE_SIZE / 2 +
        index * (NODE_SIZE + NODE_CONTAINER_MARGIN_BOTTOM);
      return { x, y };
    });
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      const curveHardness = 60;
      path += ` C ${prevPoint.x} ${prevPoint.y + curveHardness}, ${
        currentPoint.x
      } ${currentPoint.y - curveHardness}, ${currentPoint.x} ${currentPoint.y}`;
    }
    return path;
  }, [questData]);

  // --- HOOK 4: Auto-scroll effect ---
  useEffect(() => {
    if (scrollViewHeight === 0 || questData.length === 0) return;
    const activeNodeIndex = questData.findIndex(
      (item) => item.status === "unlocked"
    );
    if (activeNodeIndex === -1) return;
    const nodeY =
      PADDING_VERTICAL +
      activeNodeIndex * (NODE_SIZE + NODE_CONTAINER_MARGIN_BOTTOM);
    const scrollToY = nodeY - scrollViewHeight / 2 + NODE_SIZE / 2;
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: scrollToY, animated: true });
    }, 300);
  }, [questData, scrollViewHeight]);

  // --- SECTION 2: ALL FUNCTION DEFINITIONS ---
  const handleActivityCompletion = (completedNodeId) => {
    // This is now handled mostly by the useEffect and markQuizCompleted.
    // Keeping for backwards compatibility if called elsewhere.
    const completedNode = questData.find((node) => node.id === completedNodeId);
    if (completedNode && completedNode.quizId) {
       markQuizCompleted(completedNode.quizId);
       setShowConfetti(true);
       animation.current?.play(0);
    }
  };

  const handleNodePress = (item) => {
    if (item.status !== "unlocked" && item.status !== "completed") {
      return;
    }
    if (item.type === "Quiz" && item.quizId) {
      navigation.navigate("QuizDetails", {
        quiz: {
          id: item.quizId,
          title: item.title,
          description: item.description || `A quiz about ${item.title}.`,
          config: item.config || {
            shuffleQuestions: true,
            shuffleOptions: true,
          },
        },
      });
    } else {
      alert(
        `Activity "${item.title}" of type "${item.type}" is not ready yet.`
      );
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

  // --- SECTION 3: CONDITIONAL RETURNS (LOADING/ERROR) ---
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading Quest...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // --- SECTION 4: FINAL RENDER ---
  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
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
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, fontFamily: "nunito" },
  errorText: { fontSize: 16, fontFamily: "nunitoBold", color: "red" },
  contentContainer: {
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingVertical: PADDING_VERTICAL,
  },
  svg: { position: "absolute", top: 0, left: 0, zIndex: -1 },
  nodeContainer: {
    marginBottom: NODE_CONTAINER_MARGIN_BOTTOM,
    width: "50%",
    alignItems: "center",
  },
  left: { alignSelf: "flex-start" },
  right: { alignSelf: "flex-end" },
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

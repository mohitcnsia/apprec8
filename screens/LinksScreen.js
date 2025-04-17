// screens/LinksScreen.js (Refactored for @r-n-firebase listeners)

import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import AppFlatList from "../components/common/list/AppFlatList";
// Import listener function for topics
import { listenToCategoryTopics } from "../services/firestoreContentApi";
import { Colors } from "../config/colors";
const LinksScreen = ({ route, navigation }) => {
  // Get parameters: either direct data (activity choices) or categoryId to fetch topics
  const activityData = route?.params?.data;
  const categoryId = route?.params?.categoryId;
  const screenTitle = route?.params?.categoryTitle || "Details"; // Use passed title or default

  // State for list items, loading, error
  const [itemsToDisplay, setItemsToDisplay] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effect to set title and fetch topics if categoryId is provided
  useEffect(() => {
    navigation.setOptions({ title: screenTitle }); // Set header title

    let unsubscribe = () => {}; // Placeholder for cleanup

    if (categoryId) {
      // Fetch topics for this category
      setIsLoading(true);
      setError(null);
      let isMounted = true; // Prevent state update if unmounted quickly

      unsubscribe = listenToCategoryTopics(
        categoryId,
        (fetchedTopics) => {
          if (isMounted) {
            // Format data for display (can use a helper if complex)
            const formatted = fetchedTopics.map((topic) => ({
              id: topic.id,
              title: topic.title,
              // Include necessary fields for handleLinkPress logic below
              hasStudy: topic.hasStudy,
              hasQuiz: topic.hasQuiz,
              type: topic.type || "ACTIVITY", // Pass original type
              otherActivities: topic.otherActivities || [],
            }));
            setItemsToDisplay(formatted);
            setIsLoading(false);
          }
        },
        (fetchError) => {
          if (isMounted) {
            console.error(
              `Failed to load topics for ${categoryId}:`,
              fetchError
            );
            setError("Could not fetch topics.");
            setIsLoading(false);
          }
        }
      );

      // Cleanup function
      return () => {
        console.log(
          `Unsubscribing from topics listener for category ${categoryId}`
        );
        isMounted = false;
        unsubscribe();
      };
    } else if (activityData) {
      // If activity data was passed directly, just display it
      setItemsToDisplay(activityData);
      setIsLoading(false);
    } else {
      // No categoryId and no direct data - show empty or error
      console.warn("LinksScreen loaded without categoryId or data param.");
      setError("No content specified.");
      setIsLoading(false);
    }
  }, [categoryId, screenTitle, navigation]); // Re-run if categoryId changes

  // Refactored press handler: Determines target screen and passes ID
  const handleLinkPress = (item) => {
    console.log("LinksScreen item pressed:", JSON.stringify(item));

    // Check if it's a Topic with MULTIPLE activities that needs an intermediate step
    // Check !item.topicId to ensure it's not already an activity choice object
    const isMultiActivityTopic =
      item.hasStudy === true && item.hasQuiz === true && !item.topicId;

    if (isMultiActivityTopic) {
      console.log(
        `Topic ${item.id} has multiple activities. Generating choices.`
      );
      const activities = [];
      if (item.hasStudy)
        activities.push({
          id: `${item.id}-study`,
          title: "Study Material",
          type: "STUDY",
          topicId: item.id,
        });
      if (item.hasQuiz)
        activities.push({
          id: `${item.id}-quiz`,
          title: "Quiz",
          type: "QUIZ",
          topicId: item.id,
        });
      // TODO: Add logic for item.otherActivities if needed

      if (activities.length > 0) {
        // Navigate recursively to LinksScreen, passing activity choices as 'data'
        navigation.push("LinkScreen", {
          data: activities,
          categoryTitle: item.title,
        }); // Use push to allow going back
      } else {
        console.warn("Multi-activity topic has no activities generated?", item);
        navigation.navigate("DummyScreen", {
          errorMessage: `No activities found for "${item.title}".`,
        });
      }
      return; // Stop processing here
    }

    // --- Handle single-activity Topic or an Activity Choice ---
    let targetScreen = null;
    let params = {};
    let actionType = item.type?.toUpperCase();
    let topicId = item.topicId || item.id; // Use topicId if available (activity choice), else use item's id (topic)

    // If it's a topic object, derive action type from flags
    if (item.hasStudy === true && !item.topicId) actionType = "STUDY";
    else if (item.hasQuiz === true && !item.topicId) actionType = "QUIZ";

    console.log(`Determined action: ${actionType} for topicId: ${topicId}`);

    switch (actionType) {
      case "STUDY":
        targetScreen = "Apprec8Reader";
        params = { topicId: topicId }; // Pass only the ID
        break;
      case "QUIZ":
        targetScreen = "Quiz";
        params = { topicId: topicId }; // Pass only the ID
        break;
      case "COURSE": // Clicking a category tile (should ideally navigate here from elsewhere now)
        targetScreen = "LinkScreen";
        params = { categoryId: item.id, categoryTitle: item.title }; // Pass category details
        break;
      // Add cases for COMPLEX, ACTIVITY if they lead to specific screens or recursive LinkScreen
      default:
        console.warn("Unhandled item type in LinksScreen:", item.type);
        targetScreen = "DummyScreen";
        params = { errorMessage: `No action defined for "${item.title}".` };
        break;
    }

    if (topicId === "cntct") targetScreen = "cntct";
    else if (topicId === "faq") targetScreen = "DummyScreen";
    else if (topicId === "tnc") targetScreen = "DummyScreen";

    if (targetScreen) {
      navigation.push(targetScreen, params); // Use push for better back navigation experience
    }
  };

  // --- Render Logic ---
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primaryDarkMaroon} />
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
  if (itemsToDisplay.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>No items found.</Text>
      </View>
    );
  }

  return (
    <AppFlatList
      data={itemsToDisplay}
      isPressable={true}
      onItemPress={handleLinkPress}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    // Add background color if needed, depends on navigator style
    // backgroundColor: Colors.primaryLightGray,
  },
  errorText: { color: "red", fontSize: 16, textAlign: "center" },
  infoText: { color: "#666", fontSize: 16, textAlign: "center" }, // Style for no items message
});

export default LinksScreen;

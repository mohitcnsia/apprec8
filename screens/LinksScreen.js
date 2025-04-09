// screens/LinksScreen.js

import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native"; // Add imports
import AppFlatList from "../components/common/list/AppFlatList";
// Import the topic fetching function
import { getCategoryTopics } from "../services/firestoreContentApi"; // Adjust path if needed
import { Colors } from "../config/colors";
// Add these imports (adjust path if needed)
import {
  getStudyContent,
  getQuizQuestions,
} from "../services/firestoreContentApi";

// Keep old data imports for now, they are used inside handleLinkPress
import { getTopicQuiz, getTopicStudy } from "../data/app-topic-detail-data";

const LinksScreen = ({ route, navigation }) => {
  // Get potential parameters from navigation
  const hardcodedData = route?.params?.data; // Data passed directly (old way)
  const categoryId = route?.params?.categoryId; // ID passed from category press
  const categoryTitle = route?.params?.categoryTitle; // Title passed from category press

  // --- Add State ---
  const [itemsToDisplay, setItemsToDisplay] = useState(hardcodedData || []); // Hold items for the list
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Add useEffect to fetch topics if categoryId exists ---
  useEffect(() => {
    // Set the screen title if passed
    if (categoryTitle) {
      navigation.setOptions({ title: categoryTitle });
    }

    // Only fetch if categoryId is provided and no hardcoded data was passed
    if (categoryId && !hardcodedData) {
      const loadTopics = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Fetch topics for the given categoryId
          const fetchedTopics = await getCategoryTopics(categoryId);
          setItemsToDisplay(fetchedTopics); // Update state with fetched topics
        } catch (err) {
          console.error(`Failed to load topics for ${categoryId}:`, err);
          setError("Could not fetch topics.");
        } finally {
          setIsLoading(false);
        }
      };
      loadTopics();
    } else if (hardcodedData) {
      // If hardcoded data was passed, use it directly (maintains old functionality if needed)
      setItemsToDisplay(hardcodedData);
    }
    // Re-run if categoryId changes
  }, [categoryId, categoryTitle, navigation, hardcodedData]);

  // In LinksScreen.js - REPLACE the entire handleLinkPress function

  // In screens/LinksScreen.js - REPLACE the entire handleLinkPress function

  // Mark the function as async
  const handleLinkPress = async (item) => {
    // Renamed 'link' to 'item'
    console.log("Item pressed:", JSON.stringify(item));

    // --- Check if this is a Topic with MULTIPLE primary activities ---
    // Ensure hasStudy/hasQuiz are explicitly true (booleans from Firestore)
    const isMultiActivityTopic =
      item.hasStudy === true && item.hasQuiz === true;
    // You could expand this later e.g. || (item.otherActivities && item.otherActivities.length > 0)

    if (isMultiActivityTopic && !item.topicId) {
      // --- It's a topic with multiple activities, show choices ---
      console.log(
        `Topic ${item.id} has multiple activities. Generating choices.`
      );
      const activities = [];

      if (item.hasStudy) {
        activities.push({
          id: `${item.id}-study`, // Unique key for the list item
          title: "Study Material", // Text displayed in the list
          type: "STUDY", // Action type for the *next* press
          topicId: item.id, // Store original topic ID for fetching later
          // You can pass the original topic title if needed by the next screen
          // topicTitle: item.title
        });
      }
      if (item.hasQuiz) {
        activities.push({
          id: `${item.id}-quiz`,
          title: "Quiz",
          type: "QUIZ",
          topicId: item.id,
          // topicTitle: item.title
        });
      }
      // Add logic here to push items for otherActivities like FLASHCARDS if needed

      if (activities.length > 0) {
        // Navigate recursively to LinksScreen (acting as ActivityScreen)
        // Use the original topic's title for the next screen's header
        navigation.navigate("LinkScreen", {
          data: activities,
          categoryTitle: item.title,
        });
      } else {
        // Should not happen if isMultiActivityTopic is true, but good fallback
        console.warn("Multi-activity topic has no activities generated?", item);
        navigation.navigate("DummyScreen", {
          errorMessage: `No activities found for "${item.title}".`,
        });
      }
    } else {
      // --- It's a topic with a SINGLE primary activity OR an activity choice ---
      // Determine the action type and the actual topicId to use for fetching content/quiz
      let actionType = item.type; // Use item.type if it's an activity choice like { type: "STUDY", topicId: "..." }
      let fetchTopicId = item.topicId || item.id; // Use topicId if passed (from activity choice), otherwise use item's own id (if it's a single-activity topic)

      // If it was a topic object from Firestore, determine type from boolean flags
      // This handles cases where user clicks a topic with only study OR only quiz
      if (item.hasStudy === true && !item.topicId) {
        // Check !item.topicId to ensure it's the topic itself, not the activity choice
        actionType = "STUDY";
      } else if (item.hasQuiz === true && !item.topicId) {
        // Use else if to maintain study priority if somehow both flags were true but isMultiActivityTopic was false
        actionType = "QUIZ";
      }

      console.log(
        `Handling action type: "${actionType}" for topicId: "${fetchTopicId}"`
      );

      // Perform action based on type
      switch (actionType) {
        case "STUDY":
          console.log("Fetching Study Content for topicId:", fetchTopicId);
          try {
            const studyData = await getStudyContent(fetchTopicId);
            if (studyData) {
              navigation.navigate("Apprec8Reader", { data: studyData });
            } else {
              console.warn(
                `Study content not found in Firestore for topicId: ${fetchTopicId}`
              );
              navigation.navigate("DummyScreen", {
                errorMessage: `Study content for "${item.title}" not found.`,
              });
            }
          } catch (error) {
            console.error("Error fetching study content:", error);
            navigation.navigate("DummyScreen", {
              errorMessage: `Could not load study content for "${item.title}".`,
            });
          }
          break;

        case "QUIZ":
          console.log("Fetching Quiz Questions for topicId:", fetchTopicId);
          try {
            const questions = await getQuizQuestions(fetchTopicId);
            if (questions && questions.length > 0) {
              navigation.navigate("Quiz", { data: questions });
            } else {
              console.warn(
                `Quiz questions not found in Firestore for topicId: ${fetchTopicId}`
              );
              navigation.navigate("DummyScreen", {
                errorMessage: `Quiz questions for "${item.title}" not found.`,
              });
            }
          } catch (error) {
            console.error("Error fetching quiz questions:", error);
            navigation.navigate("DummyScreen", {
              errorMessage: `Could not load quiz for "${item.title}".`,
            });
          }
          break;

        // Add cases for "FLASHCARDS", "ASSIGNMENT", etc. if you implement them later
        // case "FLASHCARDS":
        //   navigation.navigate("FlashcardScreen", { topicId: fetchTopicId });
        //   break;

        default:
          console.warn(
            "Unhandled action type or item in handleLinkPress:",
            item
          );
          navigation.navigate("DummyScreen", {
            errorMessage: `Action "${
              item.title || actionType
            }" not implemented yet.`,
          });
          break;
      }
    }
  };

  // --- Render Loading/Error/List ---
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

  return (
    <AppFlatList
      data={itemsToDisplay} // Use the state variable
      isPressable={true}
      onItemPress={handleLinkPress}
    />
  );
};

// Add StyleSheet if not already present or merge styles
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default LinksScreen;

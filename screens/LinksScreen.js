// screens/LinksScreen.js (Rewritten to handle single activity navigation directly)

import React, { useState, useEffect, useRef } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import AppFlatList from "../components/common/list/AppFlatList"; // Adjust path
import {
  listenToCategoryTopics,
  listenToSubtopics,
} from "../services/firestoreContentApi"; // Adjust path
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../config/colors"; // Adjust path

const LinksScreen = ({ route, navigation }) => {
  // --- Parameters ---
  const categoryId = route?.params?.categoryId;
  const parentTopicId = route?.params?.parentTopicId;
  const passedData = route?.params?.data;
  const screenTitle =
    route?.params?.screenTitle || route?.params?.categoryTitle || "Details";

  // --- State ---
  const [itemsToDisplay, setItemsToDisplay] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchType, setFetchType] = useState("NONE");

  // --- Ref to track mounted status ---
  const isMounted = useRef(true);

  console.log(
    `LINKS SCREEN RENDER: isLoading=${isLoading}, error=${JSON.stringify(
      error
    )}, items=${itemsToDisplay.length}, fetchType=${fetchType}`
  );

  // --- Effect for Mount/Unmount Tracking ---
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      console.log(
        `LinksScreen Cleanup: Unmounting or params changed (Fetch type: ${fetchType})`
      );
    };
  }, [categoryId, parentTopicId, passedData]);

  // --- Effect to Fetch Data ---
  useEffect(() => {
    console.log("--- useEffect Data Fetch Running ---");
    console.log(
      "Dependencies: categoryId=",
      categoryId,
      "parentTopicId=",
      parentTopicId,
      "passedData exists=",
      !!passedData,
      "screenTitle=",
      screenTitle
    );
    navigation.setOptions({ title: screenTitle });

    let unsubscribe = () => {};
    setIsLoading(true);
    setError(null);
    setItemsToDisplay([]);

    const handleTopicData = (fetchedTopics) => {
      /* ... (Callback with setTimeout fix as before) ... */
      console.log(
        `LINKS SCREEN CALLBACK (Topics - onDataReceived): Received ${fetchedTopics?.length} items.`
      );
      if (isMounted.current) {
        try {
          const formatted = fetchedTopics
            .map((topic) => {
              if (
                !topic ||
                typeof topic !== "object" ||
                !topic.id ||
                !topic.title
              ) {
                console.warn("Skipping malformed topic:", topic);
                return null;
              }
              return {
                id: topic.id,
                title: topic.title,
                hasStudy: topic.hasStudy === true,
                hasQuiz: topic.hasQuiz === true,
                hasSubtopics: topic.hasSubtopics === true,
                type: "TOPIC",
              };
            })
            .filter(Boolean);
          console.log(
            `Mapping topics complete. ${formatted.length} valid items. Setting items...`
          );
          setItemsToDisplay(formatted);
          setTimeout(() => {
            if (isMounted.current) {
              setIsLoading(false);
              console.log("setTimeout (Topics): Set isLoading=false.");
            }
          }, 0);
        } catch (mapError) {
          console.error(
            "LINKS SCREEN CALLBACK (Topics): Error processing!",
            mapError
          );
          setError("Error processing topic data.");
          setItemsToDisplay([]);
          setIsLoading(false);
        }
      } else {
        console.log("LINKS SCREEN CALLBACK (Topics): Unmounted.");
      }
    };
    const handleTopicError = (fetchError) => {
      /* ... (Callback as before) ... */
      console.error(
        `LinksScreen: Error listening to topics for ${categoryId}:`,
        fetchError
      );
      if (isMounted.current) {
        setError("Could not fetch topics.");
        setItemsToDisplay([]);
        setIsLoading(false);
      } else {
        console.log("LINKS SCREEN CALLBACK (onError - Topics): Unmounted.");
      }
    };
    const handleSubtopicData = (fetchedSubtopics) => {
      /* ... (Callback with setTimeout fix as before) ... */
      console.log(
        `LINKS SCREEN CALLBACK (Subtopics - onDataReceived): Received ${fetchedSubtopics?.length} items.`
      );
      if (isMounted.current) {
        try {
          const formatted = fetchedSubtopics
            .map((sub) => {
              if (!sub || typeof sub !== "object" || !sub.id || !sub.title) {
                console.warn("Skipping malformed subtopic:", sub);
                return null;
              }
              return {
                id: sub.id,
                title: sub.title,
                parentTopicId: parentTopicId,
                hasStudy: sub.hasStudy === true,
                hasQuiz: sub.hasQuiz === true,
                hasSubtopics: sub.hasSubtopics === true,
                type: "SUBTOPIC",
              };
            })
            .filter(Boolean);
          console.log(
            `Mapping subtopics complete. ${formatted.length} valid items. Setting items...`
          );
          setItemsToDisplay(formatted);
          setTimeout(() => {
            if (isMounted.current) {
              setIsLoading(false);
              console.log("setTimeout (Subtopics): Set isLoading=false.");
            }
          }, 0);
        } catch (mapError) {
          console.error(
            "LINKS SCREEN CALLBACK (Subtopics): Error processing!",
            mapError
          );
          setError("Error processing subtopic data.");
          setItemsToDisplay([]);
          setIsLoading(false);
        }
      } else {
        console.log("LINKS SCREEN CALLBACK (Subtopics): Unmounted.");
      }
    };
    const handleSubtopicError = (fetchError) => {
      /* ... (Callback as before) ... */
      console.error(
        `LinksScreen: Error listening to subtopics for ${parentTopicId}:`,
        fetchError
      );
      if (isMounted.current) {
        setError("Could not fetch subtopics.");
        setItemsToDisplay([]);
        setIsLoading(false);
      } else {
        console.log("LINKS SCREEN CALLBACK (onError - Subtopics): Unmounted.");
      }
    };

    // Determine fetch type and attach listener
    if (categoryId) {
      setFetchType("TOPICS");
      unsubscribe = listenToCategoryTopics(
        categoryId,
        handleTopicData,
        handleTopicError
      );
    } else if (parentTopicId) {
      setFetchType("SUBTOPICS");
      unsubscribe = listenToSubtopics(
        parentTopicId,
        handleSubtopicData,
        handleSubtopicError
      );
    } else if (passedData) {
      setFetchType("DATA");
      setItemsToDisplay(Array.isArray(passedData) ? passedData : []);
      setIsLoading(false);
    } else {
      setFetchType("NONE");
      setError("No content specified.");
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        console.log(`LinksScreen: Cleaning up listener.`);
        unsubscribe();
      }
    };
  }, [categoryId, parentTopicId, passedData, screenTitle, navigation]);

  // --- handleLinkPress - MODIFIED LOGIC for TOPIC and SUBTOPIC ---
  const handleLinkPress = (item) => {
    console.log(
      `LinksScreen (${fetchType}) item pressed:`,
      JSON.stringify(item)
    );

    switch (item?.type) {
      case "TOPIC":
        if (item.hasSubtopics) {
          // --- Has Subtopics: Navigate to fetch subtopics ---
          console.log(
            `Topic ${item.id} has subtopics. Navigating to fetch subtopics...`
          );
          navigation.push("LinkScreen", {
            parentTopicId: item.id,
            screenTitle: item.title,
          });
        } else {
          // --- No Subtopics: Check for direct activities ---
          const hasStudy = item.hasStudy === true;
          const hasQuiz = item.hasQuiz === true;
          const activityCount = (hasStudy ? 1 : 0) + (hasQuiz ? 1 : 0);
          // TODO: Add otherActivities to count if applicable

          if (activityCount === 1) {
            // --- Exactly ONE Activity: Navigate Directly ---
            console.log(
              `Topic ${item.id} has exactly ONE activity. Navigating directly...`
            );
            if (hasStudy) {
              navigation.push("Apprec8Reader", { topicId: item.id });
            } else {
              navigation.push("Quiz", { topicId: item.id });
            } // Must be quiz
          } else if (activityCount > 1) {
            // --- MORE than one Activity: Show Choices Screen ---
            console.log(
              `Topic ${item.id} has multiple (${activityCount}) activities. Generating choices...`
            );
            const activities = [];
            if (hasStudy)
              activities.push({
                id: `${item.id}-study`,
                title: "Study Material",
                type: "STUDY",
                topicId: item.id,
              });
            if (hasQuiz)
              activities.push({
                id: `${item.id}-quiz`,
                title: "Quiz",
                type: "QUIZ",
                topicId: item.id,
              });
            // TODO: Add otherActivities if needed
            navigation.push("LinkScreen", {
              data: activities,
              screenTitle: item.title,
            });
          } else {
            // --- No Subtopics AND No Activities ---
            console.log(`Topic ${item.id} has no subtopics or activities.`);
            navigation.navigate("DummyScreen", {
              errorMessage: `Content for "${item.title}" is not yet available.`,
            });
          }
        }
        break; // End TOPIC case

      case "SUBTOPIC":
        const hasSubtopicStudy = item.hasStudy === true;
        const hasSubtopicQuiz = item.hasQuiz === true;
        const subtopicActivityCount =
          (hasSubtopicStudy ? 1 : 0) + (hasSubtopicQuiz ? 1 : 0);
        // TODO: Add otherActivities to count if applicable

        if (subtopicActivityCount === 1) {
          // --- Exactly ONE Activity: Navigate Directly ---
          console.log(
            `Subtopic ${item.id} has exactly ONE activity. Navigating directly...`
          );
          if (hasSubtopicStudy) {
            navigation.push("Apprec8Reader", {
              subtopicId: item.id,
              topicId: item.parentTopicId,
            });
          } else {
            navigation.push("Quiz", {
              subtopicId: item.id,
              topicId: item.parentTopicId,
            });
          } // Must be quiz
        } else if (subtopicActivityCount > 1) {
          // --- MORE than one Activity: Show Choices Screen ---
          console.log(
            `Subtopic ${item.id} has multiple (${subtopicActivityCount}) activities. Generating choices...`
          );
          const subtopicActivities = [];
          if (hasSubtopicStudy)
            subtopicActivities.push({
              id: `${item.id}-study`,
              title: "Study Material",
              type: "STUDY",
              subtopicId: item.id,
              topicId: item.parentTopicId,
            });
          if (hasSubtopicQuiz)
            subtopicActivities.push({
              id: `${item.id}-quiz`,
              title: "Quiz",
              type: "QUIZ",
              subtopicId: item.id,
              topicId: item.parentTopicId,
            });
          // TODO: Add otherActivities if needed
          navigation.push("LinkScreen", {
            data: subtopicActivities,
            screenTitle: item.title,
          });
        } else {
          // --- No Activities for Subtopic ---
          console.log(`Subtopic ${item.id} has no activities.`);
          navigation.navigate("DummyScreen", {
            errorMessage: `Content for "${item.title}" is not yet available.`,
          });
        }
        break; // End SUBTOPIC case

      // --- Other cases (STUDY, QUIZ, CONTACT, etc.) remain the same ---
      case "STUDY":
      case "QUIZ":
      case "ACTIVITY":
        console.log(`Navigating to activity: ${item.type}`);
        const targetScreen = item.type === "STUDY" ? "Apprec8Reader" : "Quiz";
        navigation.push(targetScreen, {
          topicId: item.topicId,
          subtopicId: item.subtopicId,
        });
        break;
      case "CONTACT":
      case "FAQ":
      case "TNC":
        if (item.id === "cntct" || item.type === "CONTACT")
          navigation.push("cntct");
        else navigation.push("DummyScreen", { title: item.title });
        break;
      default:
        if (passedData && item.id) {
          /* ... handle other passed data items ... */
        } else {
          /* ... unhandled item ... */
        }
        break;
    }
  };

  // --- Render Logic (Keep Back buttons) ---
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
        {/* {navigation.canGoBack() && (
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        )} */}
      </View>
    );
  }
  if (!isLoading && itemsToDisplay.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>No items found for this section.</Text>
        {/* {navigation.canGoBack() && (
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        )} */}
      </View>
    );
  }

  // --- Main list ---
  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <AppFlatList
        data={itemsToDisplay}
        isPressable={true}
        onItemPress={handleLinkPress}
        textStyle={{ fontFamily: "nunitoBold", color: Colors.primaryWhite }} // Keep text bold
        itemStyle={{
          backgroundColor: "#2c0527ff",
          borderRadius: 10,
          padding: 15,
          margin: 1,
        }}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    marginBottom: 15,
  },
  infoText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
});

export default LinksScreen;

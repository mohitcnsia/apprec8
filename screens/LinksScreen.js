// screens/LinksScreen.js (Rewritten for Approach 2 - Child Docs Only, Fully Documented)

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Button, // Using react-native Button for simplicity in error/empty states
} from "react-native";
import AppFlatList from "../components/common/list/AppFlatList"; // Adjust path
import {
  listenToCategoryTopics, // Fetches top-level topics (parentTopicId == null) for a category
  listenToSubtopics, // Fetches children (subtopics or activities) for a parent topic/subtopic
} from "../services/firestoreContentApi"; // Adjust path
import { Colors } from "../config/colors"; // Adjust path
import { LinearGradient } from "expo-linear-gradient";

/**
 * @component LinksScreen
 * @description A dynamic screen that displays lists of items based on navigation parameters.
 * It can show:
 * 1. Top-level topics for a given category (`categoryId` param).
 * 2. Sub-items (subtopics or activities) for a given parent topic/subtopic (`parentTopicId` param).
 * 3. A predefined list of items passed directly (`passedData` param, e.g., for Help links).
 * It uses Firestore listeners for fetching topics/subtopics and handles navigation
 * based on the `type` and `hasSubtopics` properties of the displayed items.
 *
 * @param {object} route - React Navigation route object containing parameters.
 * @param {object} route.params - Parameters passed during navigation.
 * @param {string} [route.params.categoryId] - ID of the category to fetch top-level topics for.
 * @param {string} [route.params.parentTopicId] - ID of the parent topic/subtopic to fetch children for.
 * @param {Array<object>} [route.params.data] - An array of item objects to display directly.
 * @param {string} [route.params.screenTitle] - Explicit title for the screen header.
 * @param {string} [route.params.categoryTitle] - Title used if screenTitle is not provided.
 *
 * @param {object} navigation - React Navigation navigation object.
 */
const LinksScreen = ({ route, navigation }) => {
  // --- Parameters ---
  // Extract parameters from the route, providing undefined if not present.
  const categoryId = route?.params?.categoryId;
  const parentTopicId = route?.params?.parentTopicId;
  const passedData = route?.params?.data;
  // Determine screen title, falling back through options.
  const screenTitle =
    route?.params?.screenTitle || route?.params?.categoryTitle || "Details";

  // --- State ---
  // Holds the array of items (topics, subtopics, activities, links) currently displayed.
  const [itemsToDisplay, setItemsToDisplay] = useState([]);
  // Tracks whether data is currently being fetched from Firestore.
  const [isLoading, setIsLoading] = useState(false);
  // Holds any error message encountered during fetching or processing.
  const [error, setError] = useState(null);
  // Tracks the type of fetch being performed (for logging/debugging).
  const [fetchType, setFetchType] = useState("NONE");

  // --- Ref for Mounted Status ---
  // Used to prevent state updates on unmounted components in async callbacks.
  const isMounted = useRef(true);

  // Log initial render and state for debugging.
  console.log(
    `LINKS SCREEN RENDER: isLoading=${isLoading}, error=${JSON.stringify(
      error
    )}, items=${itemsToDisplay.length}, fetchType=${fetchType}`
  );

  // --- Effect for Mount/Unmount Tracking ---
  // This effect runs when the component mounts and when key dependencies change.
  // It sets the ref to true on mount/update and returns a cleanup function.
  useEffect(() => {
    console.log(
      "LinksScreen: Mounting or dependencies changed, setting isMounted=true."
    );
    isMounted.current = true;
    // Cleanup function runs when component unmounts or BEFORE the effect re-runs.
    return () => {
      isMounted.current = false; // Set ref to false on cleanup.
      console.log(
        `LinksScreen Cleanup: Unmounting or relevant params changed.`
      );
    };
    // Dependencies determine when the mount status needs resetting.
  }, [categoryId, parentTopicId, passedData]);

  // --- Effect to Fetch Data and Handle Updates ---
  // This effect runs when the component mounts or when data source parameters change.
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

    // Set the header title for the screen.
    navigation.setOptions({ title: screenTitle });

    // Initialize unsubscribe function (to detach listener later).
    let unsubscribe = () => {};

    // Reset state variables before starting a new fetch.
    console.log("Setting isLoading=true and resetting state.");
    setIsLoading(true);
    setError(null);
    setItemsToDisplay([]); // Clear previous items.

    /**
     * @function handleData
     * @description Processes successfully fetched data from Firestore listeners.
     * Formats data, updates state, and handles loading indicator.
     * @param {Array<object>} fetchedItems - Array of documents from Firestore.
     * @param {string} itemTypeContext - Context string ('TOPICS' or 'SUBTOPICS_OR_ACTIVITIES').
     */
    const handleData = (fetchedItems, itemTypeContext) => {
      console.log(
        `LINKS SCREEN CALLBACK (${itemTypeContext} - onDataReceived): Received ${fetchedItems?.length} items.`
      );
      // Only update state if the component is still mounted.
      if (isMounted.current) {
        try {
          console.log(`Mapping ${itemTypeContext}...`);
          // Map Firestore data to a consistent format for the list.
          const formatted = fetchedItems
            .map((item) => {
              // Basic validation for essential fields.
              if (
                !item ||
                typeof item !== "object" ||
                !item.id ||
                !item.title
              ) {
                console.warn(`Skipping malformed ${itemTypeContext}:`, item);
                return null; // Skip invalid items.
              }
              // Return the formatted object for the list item.
              return {
                id: item.id,
                title: item.title,
                parentTopicId: item.parentTopicId || parentTopicId || null, // Include parent ID context
                hasSubtopics: item.hasSubtopics === true, // Ensure boolean, needed for navigation
                type:
                  item.type ||
                  (itemTypeContext === "TOPICS" ? "TOPIC" : "UNKNOWN"), // Assign type from data or context
                categoryId: item.categoryId || categoryId || null, // Include categoryId for context
                // Include other fields needed by handleLinkPress or AppFlatList if necessary
              };
            })
            .filter(Boolean); // Remove null entries from mapping errors.

          console.log(
            `Mapping ${itemTypeContext} complete. ${formatted.length} valid items. Attempting setItemsToDisplay...`
          );
          setItemsToDisplay(formatted); // Update the list items state.
          console.log(
            `setItemsToDisplay (${itemTypeContext}) potentially queued.`
          );

          // Use setTimeout workaround for potential state update timing issues.
          // This schedules setIsLoading(false) for the next event loop tick.
          console.log(
            `Scheduling setIsLoading(false) via setTimeout (${itemTypeContext}).`
          );
          setTimeout(() => {
            // Re-check if mounted inside the timeout callback.
            if (isMounted.current) {
              console.log(
                `setTimeout (${itemTypeContext}) executing: Setting isLoading=false.`
              );
              setIsLoading(false); // Update loading state.
            } else {
              console.log(
                `setTimeout (${itemTypeContext}): Unmounted before execution.`
              );
            }
          }, 0);
        } catch (mapError) {
          // Catch errors during the .map() or data processing stage.
          console.error(
            `LINKS SCREEN CALLBACK (${itemTypeContext}): Error during processing!`,
            mapError
          );
          setError(`Error processing ${itemTypeContext.toLowerCase()} data.`);
          setItemsToDisplay([]); // Clear items on error.
          setIsLoading(false); // Ensure loading stops on processing error.
          console.log(`Set isLoading=false after CATCH (${itemTypeContext}).`);
        }
      } else {
        // Log if the component unmounted before the callback could update state.
        console.log(
          `LINKS SCREEN CALLBACK (${itemTypeContext}): Unmounted, skipping state update.`
        );
      }
    };

    /**
     * @function handleError
     * @description Handles errors received from Firestore listeners.
     * @param {Error} fetchError - The error object from Firestore.
     * @param {string} fetchContext - Context string ('topics' or 'subtopics/activities').
     */
    const handleError = (fetchError, fetchContext) => {
      console.error(
        `LinksScreen: Error listening to ${fetchContext}:`,
        fetchError
      );
      // Only update state if the component is still mounted.
      if (isMounted.current) {
        setError(`Could not fetch ${fetchContext}.`);
        setItemsToDisplay([]); // Clear items on error.
        setIsLoading(false); // Ensure loading stops on error.
        console.log(`Set isLoading=false after ERROR (${fetchContext}).`);
      } else {
        console.log(
          `LINKS SCREEN CALLBACK (onError - ${fetchContext}): Unmounted.`
        );
      }
    };

    // --- Determine Fetch Logic based on Route Parameters ---
    if (categoryId) {
      // Fetch top-level topics if categoryId is provided.
      setFetchType("TOPICS");
      console.log(
        `Attaching listener for TOPICS in Category ID: ${categoryId}`
      );
      unsubscribe = listenToCategoryTopics(
        categoryId,
        (d) => handleData(d, "TOPICS"),
        (e) => handleError(e, "topics")
      );
    } else if (parentTopicId) {
      // Fetch children (subtopics or activities) if parentTopicId is provided.
      setFetchType("SUBTOPICS_OR_ACTIVITIES");
      console.log(
        `Attaching listener for CHILDREN of Parent Topic ID: ${parentTopicId}`
      );
      unsubscribe = listenToSubtopics(
        parentTopicId,
        (d) => handleData(d, "SUBTOPICS_OR_ACTIVITIES"),
        (e) => handleError(e, "subtopics/activities")
      );
    } else if (passedData) {
      // Display data passed directly via parameters (e.g., Help links).
      setFetchType("DATA");
      console.log("LinksScreen: Displaying passed data immediately.");
      setItemsToDisplay(Array.isArray(passedData) ? passedData : []); // Ensure data is array.
      setIsLoading(false); // Stop loading immediately.
    } else {
      // No valid parameters provided to fetch or display data.
      setFetchType("NONE");
      console.warn(
        "LinksScreen loaded without categoryId, parentTopicId, or data param."
      );
      setError("No content specified.");
      setIsLoading(false); // Stop loading.
    }

    // Return the Firestore listener's unsubscribe function for cleanup.
    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        console.log(
          `LinksScreen: useEffect cleanup running. Unsubscribing listener.`
        );
        unsubscribe();
      }
    };
    // Effect dependencies: Re-run effect if the data source parameters change.
    // Also includes navigation/screenTitle for setOptions.
  }, [categoryId, parentTopicId, passedData, screenTitle, navigation]);

  /**
   * @function handleLinkPress
   * @description Handles the press action on any item in the list. Determines the
   * next navigation step based on the item's `type` and `hasSubtopics` properties.
   * @param {object} item - The data object for the pressed list item.
   */
  const handleLinkPress = (item) => {
    // Log the pressed item details for debugging.
    console.log(
      `LinksScreen (${fetchType}) item pressed: Type=${item?.type}, ID=${item?.id}, Title=${item?.title}`
    );

    // VVV Add detailed logging VVV
    console.log("--- handleLinkPress ---"); // Clear marker for the start
    // Log the entire item structure to see exactly what's passed in
    console.log("Item received:", JSON.stringify(item, null, 2));

    // Use optional chaining for safety in case item or item.type is null/undefined.
    switch (item?.type) {
      // Handle clicking on a Topic or a Subtopic (which might itself have children)
      case "TOPIC":
      case "SUBTOPIC":
        // Check if this item has children (subtopics or activity links) defined under it.
        if (item.hasSubtopics === true) {
          // If yes, navigate recursively to LinksScreen to display those children.
          // Pass the current item's ID as the parentTopicId for the next fetch.
          console.log(
            `Item ${item.id} (type ${item.type}) has children. Fetching children...`
          );
          navigation.push("LinkScreen", {
            // Use push for hierarchical navigation
            parentTopicId: item.id,
            screenTitle: item.title, // Use current item's title for the next screen header
            // Pass categoryId along if needed for context, though parentTopicId is primary now
            // categoryId: item.categoryId
          });
        } else {
          // If no (hasSubtopics is false), this is a leaf node in the hierarchy.
          // Display a message indicating no further content here.
          console.log(
            `Item ${item.id} (type ${item.type}) has no subtopics/activities listed under it.`
          );
          navigation.navigate("DummyScreen", {
            // Use navigate or push
            errorMessage: `Content for "${item.title}" is not yet available or is accessed differently.`,
          });
        }
        console.log(`Handling type: ${item.type}`);
        break; // End TOPIC/SUBTOPIC case

      // Handle clicking on a specific activity type link (STUDY)
      case "STUDY":
        // VVV Log specifically within the STUDY case VVV
        console.log(">>> Entering STUDY case <<<");
        // Log the specific values *just before* navigating
        console.log(`  > Item ID to send: ${item.id}`);
        console.log(`  > Parameter name: contentId`);
        console.log(`  > ParentTopicId to send: ${item.parentTopicId}`);
        console.log("  > Calling navigation.push('Apprec8Reader', ...)");

        console.log(`Navigating to activity: STUDY (ID: ${item.id})`);
        // Navigate to the Apprec8Reader screen.
        // Pass the ID of this STUDY document as 'contentId'.
        // Also pass the original parent's ID for context if needed by the reader.
        navigation.push("Apprec8Reader", {
          contentId: item.id, // ID for fetching studyContent
          parentTopicId: item.parentTopicId, // Contextual parent ID
        });
        break; // End STUDY case

      // Handle clicking on a specific activity type link (QUIZ)
      case "QUIZ":
        console.log(`Navigating to activity: QUIZ (ID: ${item.id})`);
        // Navigate to the QuizScreen.
        // Pass the ID of this QUIZ document as 'quizContentId'.
        // Also pass the original parent's ID for context if needed.
        navigation.push("Quiz", {
          quizContentId: item.id, // ID for fetching quizQuestions
          parentTopicId: item.parentTopicId, // Contextual parent ID
        });
        break; // End QUIZ case

      // Add cases for other specific activity types here if needed (e.g., VIDEO, FLASHCARDS)
      // case "VIDEO":
      //   navigation.push("VideoPlayerScreen", { videoId: item.id, ... });
      //   break;

      // Handle specific links often passed via `passedData` (e.g., from Help section)
      case "CONTACT":
      case "FAQ":
      case "TNC": // Assuming these types are set in the passedData array
        if (item.id === "cntct" || item.type === "CONTACT") {
          navigation.push("cntct"); // Navigate to specific Contact Us screen
        } else {
          // Navigate to a generic screen or DummyScreen for FAQ/TNC
          navigation.push("DummyScreen", { title: item.title });
        }
        break; // End CONTACT/FAQ/TNC case

      // Default case for unknown types or items passed via `data` without a type
      default:
        // VVV Log if default is hit VVV
        console.log(
          `Unhandled item type or default case for item ID: ${item?.id}, Type: ${item?.type}`
        );

        // Check if it came from passedData and has an ID (likely a Help link)
        if (passedData && item.id) {
          console.log(
            `Handling untyped item from passedData with id: ${item.id}`
          );
          if (item.id === "cntct") {
            // Handle specific known IDs
            navigation.push("cntct");
          }
          // Add other specific ID checks if needed
          else {
            // Default navigation for unknown passedData items
            navigation.push("DummyScreen", { title: item.title || "Details" });
          }
        } else {
          // Truly unhandled item - navigate to DummyScreen with an error
          console.warn(
            `Unhandled item type "${item?.type}" or invalid item structure in LinksScreen:`,
            item
          );
          navigation.navigate("DummyScreen", {
            errorMessage: `Cannot determine action for "${
              item?.title || "this item"
            }".`,
          });
        }
        break; // End default case
    }
    console.log("--- handleLinkPress finished ---");
  };

  // --- Render Logic ---
  // Log state just before making render decisions.
  console.log(
    `Render decision: isLoading=${isLoading}, error=${!!error}, items length=${
      itemsToDisplay.length
    }`
  );

  // Display loading indicator while fetching data.
  if (isLoading) {
    console.log("RENDER: Showing Loading UI");
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primaryDarkMaroon} />
      </View>
    );
  }

  // Display error message if fetching failed. Includes a back button.
  if (error) {
    console.log(`RENDER: Showing Error UI: ${error}`);
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        {navigation.canGoBack() && ( // Check if navigation back is possible
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            color={Colors.primaryDarkMaroon}
          />
        )}
      </View>
    );
  }

  // Display "No items found" if loading is finished, there's no error, but the list is empty.
  // Includes a back button.
  if (!isLoading && itemsToDisplay.length === 0) {
    console.log("RENDER: Showing No Items UI");
    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>No items found for this section.</Text>
        {navigation.canGoBack() && ( // Check if navigation back is possible
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            color={Colors.primaryDarkMaroon}
          />
        )}
      </View>
    );
  }

  // --- Main list rendering ---
  // If loading is finished, no error, and items exist, render the list.
  console.log(
    `RENDER: Showing AppFlatList with ${itemsToDisplay.length} items`
  );
  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <AppFlatList
        data={itemsToDisplay}
        isPressable={true} // Make items pressable
        onItemPress={handleLinkPress} // Use the defined handler
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

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.primaryLightGray,
  }, // Added background for context
  errorText: {
    color: Colors.errorRed || "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  infoText: {
    color: Colors.mediumGray || "#666",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
});

export default LinksScreen;

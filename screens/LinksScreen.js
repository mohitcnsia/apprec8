// screens/LinksScreen.js

import React, { useState, useEffect, useRef, useMemo } from "react"; // Import useMemo
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Button, // Keep react-native Button for error/empty states
} from "react-native";
import AppFlatList from "../components/common/list/AppFlatList";
import {
  listenToCategoryTopics,
  listenToSubtopics,
} from "../services/firestoreContentApi";
// import { Colors } from "../config/colors"; // Remove legacy Colors import
import { useTheme } from "../context/ThemeContext"; // Import useTheme hook
import { LinearGradient } from "expo-linear-gradient";

const LinksScreen = ({ route, navigation }) => {
  const { theme } = useTheme(); // Use the theme hook

  // --- Parameters and State (remain the same) ---
  const categoryId = route?.params?.categoryId;
  const parentTopicId = route?.params?.parentTopicId;
  const passedData = route?.params?.data;
  const screenTitle =
    route?.params?.screenTitle || route?.params?.categoryTitle || "Details";
  const [itemsToDisplay, setItemsToDisplay] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchType, setFetchType] = useState("NONE");
  const isMounted = useRef(true);

  // --- useEffects and Handlers (remain the same, logic untouched) ---
  useEffect(() => {
    // Mount/Unmount tracking
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Data Fetching
    navigation.setOptions({ title: screenTitle });
    let unsubscribe = () => {};
    setIsLoading(true);
    setError(null);
    setItemsToDisplay([]);

    const handleData = (fetchedItems, itemTypeContext) => {
      if (isMounted.current) {
        try {
          const formatted = fetchedItems
            .map((item) => {
              if (!item?.id || !item.title) return null;
              return {
                id: item.id,
                title: item.title,
                parentTopicId: item.parentTopicId || parentTopicId || null,
                hasSubtopics: item.hasSubtopics === true,
                type:
                  item.type ||
                  (itemTypeContext === "TOPICS" ? "TOPIC" : "UNKNOWN"),
                categoryId: item.categoryId || categoryId || null,
              };
            })
            .filter(Boolean);
          setItemsToDisplay(formatted);
          setTimeout(() => {
            if (isMounted.current) setIsLoading(false);
          }, 0);
        } catch (mapError) {
          setError(`Error processing ${itemTypeContext.toLowerCase()} data.`);
          setItemsToDisplay([]);
          setIsLoading(false);
        }
      }
    };
    const handleError = (fetchError, fetchContext) => {
      if (isMounted.current) {
        setError(`Could not fetch ${fetchContext}.`);
        setItemsToDisplay([]);
        setIsLoading(false);
      }
    };

    if (categoryId) {
      setFetchType("TOPICS");
      unsubscribe = listenToCategoryTopics(
        categoryId,
        (d) => handleData(d, "TOPICS"),
        (e) => handleError(e, "topics")
      );
    } else if (parentTopicId) {
      setFetchType("SUBTOPICS_OR_ACTIVITIES");
      unsubscribe = listenToSubtopics(
        parentTopicId,
        (d) => handleData(d, "SUBTOPICS_OR_ACTIVITIES"),
        (e) => handleError(e, "subtopics/activities")
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

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [categoryId, parentTopicId, passedData, screenTitle, navigation]);

  const handleLinkPress = (item) => {
    // Navigation logic remains the same
    console.log(
      `LinksScreen item pressed: Type=${item?.type}, ID=${item?.id}, Title=${item?.title}`
    );
    switch (item?.type) {
      case "TOPIC":
      case "SUBTOPIC":
        if (item.hasSubtopics === true) {
          navigation.push("LinkScreen", {
            parentTopicId: item.id,
            screenTitle: item.title,
          });
        } else {
          navigation.navigate("DummyScreen", {
            errorMessage: `Content for "${item.title}" is not yet available.`,
          });
        }
        break;
      case "STUDY":
        console.log(`pushing to apprec8reader with id "${item.id}"`);
        navigation.push("Apprec8Reader", {
          contentId: item.id,
          parentTopicId: item.parentTopicId,
        });
        break;
      case "QUIZ":
        navigation.push("Quiz", {
          quizContentId: item.id,
          parentTopicId: item.parentTopicId,
        });
        break;
      case "CONTACT":
      case "FAQ":
      case "TNC":
        if (item.id === "cntct" || item.type === "CONTACT") {
          navigation.push("cntct");
        } else {
          navigation.push("DummyScreen", { title: item.title });
        }
        break;
      default:
        if (passedData && item.id) {
          if (item.id === "cntct") {
            navigation.push("cntct");
          } else {
            navigation.push("DummyScreen", { title: item.title || "Details" });
          }
        } else {
          navigation.navigate("DummyScreen", {
            errorMessage: `Cannot determine action for "${
              item?.title || "this item"
            }".`,
          });
        }
        break;
    }
  };

  // --- Define Styles Inside Component with useMemo ---
  const styles = useMemo(
    () =>
      StyleSheet.create({
        // Style for the main LinearGradient container
        container: {
          flex: 1,
        },
        // Style for the View used in Loading/Error/Empty states
        centered: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: theme.background, // Use theme background for these states
        },
        errorText: {
          color: theme.warning || "red", // Use theme warning color
          fontSize: 16,
          textAlign: "center",
          marginBottom: 15,
        },
        infoText: {
          color: theme.textSecondary || "#666", // Use theme secondary text color
          fontSize: 16,
          textAlign: "center",
          marginBottom: 15,
        },
        // Specific styles passed to AppFlatList
        listItemStyle: {
          // Use a subtle background, maybe derived from primary or card bg
          backgroundColor:
            theme.cardBackgroundListItem ||
            theme.primary + "20" ||
            "rgba(0,0,0,0.1)",
          borderRadius: 10,
          padding: 15,
          marginVertical: 5, // Add vertical margin
          marginHorizontal: 10, // Add horizontal margin
        },
        listTextStyle: {
          fontFamily: "nunitoBold", // Keep font
          // Use text color suitable for the main gradient background
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
        },
      }),
    [theme]
  ); // Depend on theme

  // --- Render Logic ---
  // Display loading indicator.
  if (isLoading) {
    return (
      <View style={styles.centered}>
        {/* Use themed color for indicator */}
        <ActivityIndicator size="large" color={theme.primary || "#800000"} />
      </View>
    );
  }

  // Display error message.
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        {navigation.canGoBack() && (
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            color={theme.primary || "#800000"} // Use theme color for button
          />
        )}
      </View>
    );
  }

  // Display "No items found".
  if (!isLoading && itemsToDisplay.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>No items found for this section.</Text>
        {navigation.canGoBack() && (
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            color={theme.primary || "#800000"} // Use theme color for button
          />
        )}
      </View>
    );
  }

  // --- Main list rendering ---
  return (
    // Apply themed gradient background
    <LinearGradient
      colors={[
        theme.gradientStart || "#3b0940",
        theme.gradientEnd || "#d7d1d3",
      ]}
      style={styles.container}
    >
      <AppFlatList
        data={itemsToDisplay}
        isPressable={true}
        onItemPress={handleLinkPress}
        // Pass themed styles to the custom list component
        textStyle={styles.listTextStyle}
        itemStyle={styles.listItemStyle}
        // Optionally add ListHeaderComponent, etc. here if needed
      />
    </LinearGradient>
  );
};

export default LinksScreen;

// screens/LinksScreen.js
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Button,
  Linking,
  TouchableOpacity, // Using TouchableOpacity for custom rendering
  Alert,
} from "react-native";
import { FlatList } from "react-native"; // Using standard FlatList for renderItem control
import {
  listenToCategoryTopics,
  listenToSubtopics,
} from "../services/firestoreContentApi";
import { useTheme } from "../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const LinksScreen = ({ route, navigation }) => {
  const { theme } = useTheme();

  const categoryId = route?.params?.categoryId;
  const parentTopicId = route?.params?.parentTopicId;
  const passedData = route?.params?.data; // This will be helpTopics
  const screenTitleFromParams =
    route?.params?.screenTitle || route?.params?.categoryTitle || "Details";
  const userEmail = route?.params?.userEmail; // For "Delete My Account" flow

  const [itemsToDisplay, setItemsToDisplay] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({ title: screenTitleFromParams });
    let unsubscribe = () => {};
    setIsLoading(true);
    setError(null);
    setItemsToDisplay([]);

    const handleData = (fetchedItems, itemTypeContext) => {
      if (isMounted.current) {
        try {
          const formatted = fetchedItems
            .map((item) => {
              if (!item?.id || typeof item.title === "undefined") return null;

              let finalType = item.type;
              let finalIcon = item.icon || null; // Start with icon from data or null
              let finalActionId = item.actionId;

              if (itemTypeContext === "PASSED_DATA") {
                // Processing helpTopics
                switch (item.id) {
                  case "deleteAccount":
                    finalType = "ACTION_DELETE_ACCOUNT";
                    finalActionId = "NAV_TO_DELETE_ACCOUNT_CONFIRMATION";
                    finalIcon = item.icon || "account-remove-outline";
                    break;
                  case "cntct":
                    finalType = "ACTION_CONTACT_US";
                    finalIcon = item.icon || "email-outline";
                    break;
                  case "faq":
                    finalType = "INFO_PAGE";
                    finalIcon = item.icon || "help-circle-outline";
                    break;
                  case "tnc":
                    finalType = "INFO_PAGE";
                    finalIcon = item.icon || "file-document-outline";
                    break;
                  default: // Any other items passed in helpTopics
                    finalType = item.type || "INFO"; // Keep original type or default to INFO
                    finalIcon = item.icon || null; // No default icon
                }
              } else if (
                itemTypeContext === "TOPICS_FROM_CATEGORY" ||
                itemTypeContext === "SUBTOPICS_FROM_PARENT"
              ) {
                // For regular topics/subtopics fetched from Firestore
                finalType =
                  item.type || (item.hasSubtopics ? "TOPIC" : "STUDY"); // Default leaf topics to STUDY, folders to TOPIC
                finalIcon =
                  item.icon || (item.hasSubtopics ? "chevron-right" : null); // Chevron only if it has subtopics and no icon
                if (finalType === "STUDY" && !item.icon)
                  finalIcon = "book-open-page-variant-outline"; // Default icon for STUDY type
                if (finalType === "QUIZ" && !item.icon)
                  finalIcon = "frequently-asked-questions"; // Default icon for QUIZ type
              } else {
                // Should not happen if context is always one of the above
                finalType = item.type || "UNKNOWN";
                finalIcon = item.icon || null;
              }

              return {
                id: String(item.id),
                title: String(item.title),
                parentTopicId: item.parentTopicId || parentTopicId || null,
                hasSubtopics: item.hasSubtopics === true,
                type: finalType,
                categoryId: item.categoryId || categoryId || null,
                url: item.url || null,
                actionId: finalActionId,
                icon: finalIcon,
              };
            })
            .filter(Boolean);
          setItemsToDisplay(formatted);
        } catch (mapError) {
          console.error("Error in handleData mapping:", mapError);
          setError(`Error processing list data.`);
        } finally {
          if (isMounted.current) setIsLoading(false);
        }
      }
    };

    const handleError = (fetchError, fetchContext) => {
      if (isMounted.current) {
        setError(`Could not fetch ${fetchContext}.`);
        setIsLoading(false);
      }
    };

    if (passedData) {
      handleData(Array.isArray(passedData) ? passedData : [], "PASSED_DATA");
    } else if (categoryId) {
      unsubscribe = listenToCategoryTopics(
        categoryId,
        (d) => handleData(d, "TOPICS_FROM_CATEGORY"),
        (e) => handleError(e, "topics")
      );
    } else if (parentTopicId) {
      unsubscribe = listenToSubtopics(
        parentTopicId,
        (d) => handleData(d, "SUBTOPICS_FROM_PARENT"),
        (e) => handleError(e, "subtopics/activities")
      );
    } else {
      setError("No content specified.");
      setIsLoading(false);
    }

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [
    categoryId,
    parentTopicId,
    passedData,
    screenTitleFromParams,
    navigation,
  ]);

  const handleLinkPress = (item) => {
    console.log(
      `LinksScreen item pressed: ID=${item?.id}, Title=${item?.title}, ActionID=${item?.actionId}, Type=${item?.type}`
    );

    // Handle "Delete My Account" first
    if (item.actionId === "NAV_TO_DELETE_ACCOUNT_CONFIRMATION") {
      if (userEmail !== undefined && userEmail !== null) {
        navigation.navigate("DeleteAccountConfirmation", { userEmail });
      } else {
        Alert.alert("Error", "User information is missing. Cannot proceed.");
      }
      return;
    }

    if (item.url) {
      // Handle external URLs next
      Linking.openURL(item.url).catch((err) => {
        console.error("Failed to open URL:", err);
        Alert.alert("Error", "Could not open the link.");
      });
      return;
    }

    // Navigation logic based on item.type
    switch (item?.type) {
      case "TOPIC": // Typically, a folder-like item that leads to another LinkScreen
      case "SUBTOPIC":
        if (item.hasSubtopics) {
          navigation.push("LinkScreen", {
            parentTopicId: item.id,
            screenTitle: item.title,
            userEmail: userEmail, // Pass userEmail along if needed
          });
        } else {
          // If it's marked as TOPIC/SUBTOPIC but has no subtopics,
          // it might be content that should have been type STUDY or leads to a placeholder.
          navigation.navigate("DummyScreen", {
            title: item.title,
            errorMessage: `Content for "${item.title}" is not yet available or is a category.`,
          });
        }
        break;
      case "STUDY": // For items that should go to Apprec8Reader (like book summaries)
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
      case "ACTION_CONTACT_US": // For "Contact Us" from helpTopics
        navigation.push("cntct");
        break;
      case "INFO_PAGE": // For "FAQs", "TNC" from helpTopics
        navigation.navigate("DummyScreen", { title: item.title });
        break;
      // ACTION_DELETE_ACCOUNT is handled by actionId check above
      default:
        console.warn(
          "LinksScreen: Unhandled item type or action for item:",
          item
        );
        navigation.navigate("DummyScreen", {
          title: item.title || "Information",
          errorMessage: `This link is not configured yet. Type: ${item?.type}`,
        });
        break;
    }
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1 },
        centered: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: "transparent",
        },
        errorText: {
          fontSize: 16,
          textAlign: "center",
          marginBottom: 15,
          color: theme.textPrimaryOnGradient || theme.textLight || "#FFFFFF",
        },
        infoText: {
          fontSize: 16,
          textAlign: "center",
          marginBottom: 15,
          color: theme.textPrimaryOnGradient || theme.textLight || "#FFFFFF",
        },
        listItemStyle: {
          // Card-like style for all items
          backgroundColor: theme.cardBackground || "rgba(0,0,0,0.2)",
          borderRadius: 10,
          marginBottom: 12,
          marginHorizontal: 12,
          shadowColor: theme.shadowColor || "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
          overflow: "hidden", // Important for borderRadius with shadow
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 16,
          paddingHorizontal: 16,
        },
        iconStyle: {
          // Default icon style
          color: theme.textSecondary || "#E0E0E0", // Color from ProfileScreen cards
          marginRight: 15, // Space between icon and text, like ProfileScreen cards
          width: 24, // Give icon a fixed width for alignment if some items have no icon
          textAlign: "center",
        },
        listTextStyle: {
          // Default text style, mimicking ProfileScreen cardText
          fontFamily: "delius",
          color: theme.textPrimary || "#FFFFFF",
          fontSize: 16,
          flex: 1, // Allows text to take remaining space
        },
        // Styles for "Delete My Account" item
        dangerousIconStyle: {
          color: theme.error || theme.warning || "#D32F2F",
          marginRight: 15,
          width: 24,
          textAlign: "center",
        },
        dangerousTextStyle: {
          fontFamily: "deliusBold",
          color: theme.error || theme.warning || "#D32F2F",
          fontSize: 16,
          flex: 1,
        },
      }),
    [theme]
  );

  const renderCustomItem = ({ item }) => {
    const isDangerousAction =
      item.actionId === "NAV_TO_DELETE_ACCOUNT_CONFIRMATION";

    return (
      <TouchableOpacity
        onPress={() => handleLinkPress(item)}
        style={styles.listItemStyle} // All items get the base card style
      >
        {item.icon ? ( // Render icon only if it exists
          <MaterialCommunityIcons
            name={item.icon}
            size={24}
            style={
              isDangerousAction ? styles.dangerousIconStyle : styles.iconStyle
            }
          />
        ) : (
          <View style={{ width: 24 + 15 }} /> // Placeholder for spacing if no icon, to keep text aligned
        )}
        <Text
          style={
            isDangerousAction ? styles.dangerousTextStyle : styles.listTextStyle
          }
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={
          theme.gradientStart && theme.gradientEnd
            ? [theme.gradientStart, theme.gradientEnd]
            : ["#3b0940", "#d7d1d3"]
        }
        style={styles.container}
      >
        <View style={styles.centered}>
          <ActivityIndicator
            size="large"
            color={theme.accent || theme.primaryWhite || "#FFFFFF"}
          />
        </View>
      </LinearGradient>
    );
  }
  if (error) {
    return (
      <LinearGradient
        colors={
          theme.gradientStart && theme.gradientEnd
            ? [theme.gradientStart, theme.gradientEnd]
            : ["#3b0940", "#d7d1d3"]
        }
        style={styles.container}
      >
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          {navigation.canGoBack() && (
            <Button
              title="Go Back"
              onPress={() => navigation.goBack()}
              color={theme.accent || theme.primaryWhite || "#FFFFFF"}
            />
          )}
        </View>
      </LinearGradient>
    );
  }
  if (!isLoading && !error && itemsToDisplay.length === 0) {
    return (
      <LinearGradient
        colors={
          theme.gradientStart && theme.gradientEnd
            ? [theme.gradientStart, theme.gradientEnd]
            : ["#3b0940", "#d7d1d3"]
        }
        style={styles.container}
      >
        <View style={styles.centered}>
          <Text style={styles.infoText}>No items found for this section.</Text>
          {navigation.canGoBack() && (
            <Button
              title="Go Back"
              onPress={() => navigation.goBack()}
              color={theme.accent || theme.primaryWhite || "#FFFFFF"}
            />
          )}
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={
        theme.gradientStart && theme.gradientEnd
          ? [theme.gradientStart, theme.gradientEnd]
          : ["#3b0940", "#d7d1d3"]
      }
      style={styles.container}
    >
      <FlatList
        data={itemsToDisplay}
        renderItem={renderCustomItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </LinearGradient>
  );
};

export default LinksScreen;

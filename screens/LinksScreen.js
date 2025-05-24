// screens/LinksScreen.js
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Button,
  Linking,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FlatList } from "react-native"; // Using standard FlatList
import {
  listenToCategoryTopics,
  listenToSubtopics,
} from "../services/firestoreContentApi"; // Adjust path as per your project
import { useTheme } from "../context/ThemeContext"; // Adjust path
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const LinksScreen = ({ route, navigation }) => {
  console.log("-----------------------------------------");
  console.log("LinksScreen: MOUNTED / RENDERED.");
  console.log(
    "LinksScreen: Received route.params:",
    JSON.stringify(route.params, null, 2)
  );
  console.log("-----------------------------------------");

  const { theme } = useTheme();

  const categoryId = route?.params?.categoryId;
  const parentTopicId = route?.params?.parentTopicId;
  const passedData = route?.params?.data;
  const screenTitleFromParams =
    route?.params?.screenTitle ||
    route?.params?.categoryTitle ||
    route?.params?.title;
  const userEmail = route?.params?.userEmail;

  const [itemsToDisplay, setItemsToDisplay] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const screenTitle = screenTitleFromParams || "Details";
    navigation.setOptions({ title: screenTitle });

    let unsubscribe = () => {};
    setIsLoading(true);
    setError(null);
    setItemsToDisplay([]);
    console.log(
      "LinksScreen useEffect: categoryId=",
      categoryId,
      "parentTopicId=",
      parentTopicId,
      "passedData=",
      !!passedData
    );

    const handleData = (fetchedItems, itemTypeContext) => {
      if (isMounted.current) {
        try {
          const formatted = fetchedItems
            .map((item) => {
              if (
                !item ||
                typeof item !== "object" ||
                !item.id ||
                typeof item.title === "undefined"
              ) {
                return null;
              }
              let itemType = item.type;
              let itemIcon = item.icon; // Preserve icon from data if present
              let itemActionId = item.actionId;

              if (itemTypeContext === "PASSED_DATA") {
                if (item.id === "deleteAccount") {
                  itemType = "ACTION_DELETE_ACCOUNT";
                  itemActionId =
                    item.actionId || "NAV_TO_DELETE_ACCOUNT_CONFIRMATION";
                  itemIcon = item.icon || "account-remove-outline";
                } else if (item.id === "cntct") {
                  itemType = "ACTION_CONTACT_US";
                  itemIcon = item.icon || "email-outline";
                } else if (item.id === "faq" || item.id === "tnc") {
                  itemType = "INFO_PAGE";
                  itemIcon =
                    item.icon ||
                    (item.id === "faq"
                      ? "help-circle-outline"
                      : "file-document-outline");
                } else {
                  itemType = item.type || "INFO"; // Default for other passed_data items
                  itemIcon = item.icon || null; // No default icon for generic INFO items
                }
              } else if (itemTypeContext === "TOPICS") {
                itemType = "TOPIC";
                itemIcon =
                  item.icon ||
                  (item.hasSubtopics
                    ? "chevron-right-circle-outline"
                    : "circle-medium"); // Example icons for topics
              } else if (itemTypeContext === "SUBTOPICS_OR_ACTIVITIES") {
                // Could be SUBTOPIC, STUDY, QUIZ, etc.
                itemType = item.type || "UNKNOWN_ACTIVITY";
                itemIcon =
                  item.icon ||
                  (item.hasSubtopics
                    ? "chevron-right-circle-outline"
                    : "circle-medium");
              } else {
                itemType = item.type || "UNKNOWN";
                itemIcon = item.icon || null;
              }

              return {
                id: String(item.id),
                title: String(item.title),
                parentTopicId: item.parentTopicId || parentTopicId || null,
                hasSubtopics: item.hasSubtopics === true,
                type: itemType,
                categoryId: item.categoryId || categoryId || null,
                url: item.url || null,
                actionId: itemActionId,
                icon: itemIcon,
              };
            })
            .filter((item) => item !== null);
          console.log(
            "LinksScreen: Formatted items to display:",
            JSON.stringify(formatted, null, 2)
          );
          setItemsToDisplay(formatted);
        } catch (mapError) {
          console.error("Error processing data in LinksScreen:", mapError);
          setError(`Error processing ${itemTypeContext.toLowerCase()} data.`);
          setItemsToDisplay([]);
        } finally {
          setTimeout(() => {
            if (isMounted.current) setIsLoading(false);
          }, 0);
        }
      }
    };

    const handleError = (fetchError, fetchContext) => {
      if (isMounted.current) {
        console.error(`Error fetching ${fetchContext}:`, fetchError);
        setError(`Could not fetch ${fetchContext}.`);
        setItemsToDisplay([]);
        setIsLoading(false);
      }
    };

    if (passedData) {
      // Prioritize passedData for Help screen context
      console.log("LinksScreen: Processing passedData");
      handleData(Array.isArray(passedData) ? passedData : [], "PASSED_DATA");
    } else if (categoryId) {
      console.log(
        "LinksScreen: Listening to category topics for categoryId:",
        categoryId
      );
      unsubscribe = listenToCategoryTopics(
        categoryId,
        (d) => handleData(d, "TOPICS"),
        (e) => handleError(e, "topics")
      );
    } else if (parentTopicId) {
      console.log(
        "LinksScreen: Listening to subtopics for parentTopicId:",
        parentTopicId
      );
      unsubscribe = listenToSubtopics(
        parentTopicId,
        (d) => handleData(d, "SUBTOPICS_OR_ACTIVITIES"),
        (e) => handleError(e, "subtopics/activities")
      );
    } else {
      console.log("LinksScreen: No content specified.");
      setError("No content specified.");
      setIsLoading(false);
    }

    return () => {
      if (typeof unsubscribe === "function") {
        console.log("LinksScreen: Unsubscribing listener.");
        unsubscribe();
      }
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

    if (item.actionId === "NAV_TO_DELETE_ACCOUNT_CONFIRMATION") {
      if (userEmail !== undefined && userEmail !== null) {
        navigation.navigate("DeleteAccountConfirmation", { userEmail });
      } else {
        Alert.alert("Error", "User information is missing. Cannot proceed.");
      }
      return;
    }

    if (item.url) {
      Linking.openURL(item.url).catch((err) => {
        console.error("Failed to open URL:", err);
        Alert.alert("Error", "Could not open the link.");
      });
      return;
    }

    switch (item?.type) {
      case "TOPIC":
      case "SUBTOPIC": // Assuming SUBTOPIC type might be assigned if fetched from DB
        if (item.hasSubtopics === true) {
          console.log(
            "!!! PUSHING LinkScreen from LinkScreen for item:",
            JSON.stringify(item)
          );
          navigation.push("LinkScreen", {
            parentTopicId: item.id,
            screenTitle: item.title,
            userEmail: userEmail,
          });
        } else {
          navigation.navigate("DummyScreen", {
            title: item.title,
            errorMessage: `Content for "${item.title}" is not yet available.`,
          });
        }
        break;
      case "STUDY":
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
      case "ACTION_CONTACT_US": // Type assigned in handleData for 'cntct'
        navigation.push("cntct");
        break;
      case "INFO_PAGE": // Type assigned in handleData for 'faq', 'tnc'
        console.log("Navigating INFO_PAGE to DummyScreen:", item.title);
        navigation.navigate("DummyScreen", { title: item.title });
        break;
      default:
        // This will catch items with type 'INFO' or 'UNKNOWN' or unhandled types
        console.log(
          "LinksScreen: Default action for item:",
          item.title,
          "Type:",
          item.type
        );
        navigation.navigate("DummyScreen", {
          title: item.title || "Details",
          errorMessage: `Information for "${
            item?.title || "this item"
          }" is not currently available.`,
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
          backgroundColor: theme.cardBackground || "rgba(0,0,0,0.2)",
          borderRadius: 10,
          marginBottom: 12,
          marginHorizontal: 12,
          shadowColor: theme.shadowColor || "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
          overflow: "hidden",
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 16,
          paddingHorizontal: 16,
        },
        listTextStyle: {
          fontFamily: "delius",
          color: theme.textPrimary || "#FFFFFF",
          fontSize: 16,
          marginLeft: 15,
          flex: 1,
        },
        listTextStyleNoIcon: {
          fontFamily: "delius",
          color: theme.textPrimary || "#FFFFFF",
          fontSize: 16,
          marginLeft: 0,
          flex: 1,
        },
        iconStyle: {
          color: theme.textSecondary || "#E0E0E0",
        },
        dangerousTextStyle: {
          fontFamily: "delius",
          color: theme.error || theme.warning || "#D32F2F",
          fontSize: 16,
          marginLeft: 15,
          flex: 1,
        },
        dangerousTextStyleNoIcon: {
          fontFamily: "deliusBold",
          color: theme.error || theme.warning || "#D32F2F",
          fontSize: 16,
          marginLeft: 0,
          flex: 1,
        },
        dangerousIconStyle: {
          color: theme.error || theme.warning || "#D32F2F",
        },
      }),
    [theme]
  );

  const renderCustomItem = ({ item }) => {
    const isDangerousAction =
      item.actionId === "NAV_TO_DELETE_ACCOUNT_CONFIRMATION";

    let currentTextStyle = styles.listTextStyle;
    if (isDangerousAction) {
      currentTextStyle = item.icon
        ? styles.dangerousTextStyle
        : styles.dangerousTextStyleNoIcon;
    } else {
      currentTextStyle = item.icon
        ? styles.listTextStyle
        : styles.listTextStyleNoIcon;
    }

    return (
      <TouchableOpacity
        onPress={() => handleLinkPress(item)}
        style={styles.listItemStyle}
      >
        {item.icon && (
          <MaterialCommunityIcons
            name={item.icon}
            size={24}
            style={[
              styles.iconStyle,
              isDangerousAction && styles.dangerousIconStyle,
            ]}
          />
        )}
        <Text style={currentTextStyle}>{item.title}</Text>
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
  if (!isLoading && itemsToDisplay.length === 0) {
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
        contentContainerStyle={{ paddingVertical: 10 }} // Adjusted padding
      />
    </LinearGradient>
  );
};

export default LinksScreen;

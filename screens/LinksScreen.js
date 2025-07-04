import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  listenToCategoryTopics,
  listenToSubtopics,
  listenToUserDocument, // UPDATED IMPORT
} from "../services/firestoreContentApi"; // Adjust path as needed
import { useTheme } from "../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { authInstance } from "../config/firebaseConfig"; // Adjust path as needed

const LinksScreen = ({ route, navigation }) => {
  const { theme } = useTheme();

  // Route parameters
  const categoryId = route?.params?.categoryId;
  const parentTopicId = route?.params?.parentTopicId;
  const passedData = route?.params?.data;
  const screenTitleFromParams =
    route?.params?.screenTitle || route?.params?.categoryTitle || "Details";
  const userEmail = route?.params?.userEmail;

  // State variables
  const [itemsToDisplay, setItemsToDisplay] = useState([]);
  const [userData, setUserData] = useState(null); // To store the full user document
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isMounted = useRef(true);
  const userId = authInstance.currentUser?.uid;

  // Refs to track if data sources have loaded
  const contentLoadedRef = useRef(false);
  const userDocLoadedRef = useRef(false); // Tracks if user document is loaded/checked

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: screenTitleFromParams,
      headerStyle: { backgroundColor: theme.headerBackground || theme.primary },
      headerTintColor: theme.headerTint || "#ffffff",
      headerTitleStyle: { fontFamily: "nunitoBold" },
    });

    setIsLoading(true);
    setError(null);
    setItemsToDisplay([]);
    setUserData(null); // Reset user data on new load
    contentLoadedRef.current = false;
    userDocLoadedRef.current = false; // Reset loaded flag for user doc

    if (!userId) {
      // If no user, userDoc is considered "loaded" as it won't be fetched
      userDocLoadedRef.current = true;
    }

    let unsubscribeContent = () => {};
    let unsubscribeUserDoc = () => {};

    const checkAllDataLoaded = () => {
      if (
        isMounted.current &&
        contentLoadedRef.current &&
        userDocLoadedRef.current
      ) {
        setIsLoading(false);
        console.log("LinksScreen: All necessary data loaded.");
      }
    };

    const handleItemData = (fetchedItems, itemTypeContext) => {
      if (isMounted.current) {
        try {
          const formatted = fetchedItems
            .map((item) => {
              if (!item?.id || typeof item.title === "undefined") return null;
              // Your existing item formatting logic...
              let finalType = item.type;
              let finalIcon = item.icon || null;
              let finalActionId = item.actionId;

              if (itemTypeContext === "PASSED_DATA") {
                /* ... your existing case logic ... */
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
                  default:
                    finalType = item.type || "INFO";
                    finalIcon = item.icon || null;
                }
              } else if (
                itemTypeContext === "TOPICS_FROM_CATEGORY" ||
                itemTypeContext === "SUBTOPICS_FROM_PARENT"
              ) {
                /* ... your existing case logic ... */
                finalType =
                  item.type || (item.hasSubtopics ? "TOPIC" : "STUDY");
                finalIcon =
                  item.icon || (item.hasSubtopics ? "chevron-right" : null);
                if (finalType === "STUDY" && !item.icon)
                  finalIcon = "book-open-page-variant-outline";
                if (finalType === "QUIZ" && !item.icon)
                  finalIcon = "frequently-asked-questions";
              } else {
                finalType = item.type || "UNKNOWN";
                finalIcon = item.icon || null;
              }
              return {
                /* ... your full formatted item structure ... */
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
          console.error(
            "LinksScreen: Error in handleItemData mapping:",
            mapError
          );
          setError(`Error processing list items.`);
        } finally {
          contentLoadedRef.current = true;
          checkAllDataLoaded();
        }
      }
    };

    const handleError = (fetchError, fetchContext) => {
      if (isMounted.current) {
        console.error(
          `LinksScreen: Error fetching ${fetchContext}:`,
          fetchError
        );
        setError(`Could not load ${fetchContext}. Please try again.`);
        contentLoadedRef.current = true; // Mark as "done" to potentially unblock loading
        userDocLoadedRef.current = true; // Mark as "done"
        setIsLoading(false);
      }
    };

    // Fetch main list content
    if (passedData) {
      handleItemData(
        Array.isArray(passedData) ? passedData : [],
        "PASSED_DATA"
      );
    } else if (categoryId) {
      unsubscribeContent = listenToCategoryTopics(
        categoryId,
        (d) => handleItemData(d, "TOPICS_FROM_CATEGORY"),
        (e) => handleError(e, "topics")
      );
    } else if (parentTopicId) {
      unsubscribeContent = listenToSubtopics(
        parentTopicId,
        (d) => handleItemData(d, "SUBTOPICS_FROM_PARENT"),
        (e) => handleError(e, "subtopics/activities")
      );
    } else {
      contentLoadedRef.current = true; // No specific content to load
      checkAllDataLoaded();
    }

    // Fetch user document (for perfectQuizCompletions map) if user is logged in
    if (userId) {
      unsubscribeUserDoc = listenToUserDocument(
        (data) => {
          if (isMounted.current) {
            setUserData(data);
            console.log(
              "LinksScreen: User document received:",
              data
                ? `has perfectQuizCompletions: ${!!data.perfectQuizCompletions}`
                : "null"
            );
            userDocLoadedRef.current = true;
            checkAllDataLoaded();
          }
        },
        (e) => {
          console.error(
            "LinksScreen: Error fetching user document. Checkmarks may not be available.",
            e
          );
          // setError("Could not load user progress."); // Optionally set a non-blocking error
          userDocLoadedRef.current = true; // Mark as loaded even on error to unblock UI
          checkAllDataLoaded();
        }
      );
    }

    return () => {
      if (typeof unsubscribeContent === "function") unsubscribeContent();
      if (typeof unsubscribeUserDoc === "function") unsubscribeUserDoc();
    };
  }, [
    categoryId,
    parentTopicId,
    passedData,
    screenTitleFromParams,
    navigation,
    userId,
  ]);

  const handleLinkPress = (item) => {
    // Your existing handleLinkPress logic (remains unchanged)
    console.log(
      `LinksScreen item pressed: ID=${item?.id}, Title=${item?.title}, ActionID=${item?.actionId}, Type=${item?.type}`
    );
    if (item.actionId === "NAV_TO_DELETE_ACCOUNT_CONFIRMATION") {
      /* ... */
    }
    if (item.url) {
      /* ... */
    }
    switch (item?.type?.toUpperCase() /* ... your existing cases ... */) {
      case "TOPIC":
      case "SUBTOPIC":
        if (item.hasSubtopics) {
          navigation.push("LinkScreen", {
            parentTopicId: item.id,
            screenTitle: item.title,
            userEmail: userEmail,
          });
        } else {
          navigation.navigate("DummyScreen", {
            title: item.title,
            errorMessage: `Content for "${item.title}" is not yet available or is a category.`,
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
      case "WORD_INSPECTOR":
        navigation.push("WordInspector", {
          quizId: item.id,
          parentTopicId: item.parentTopicId,
        });
        break;
      case "CLOCK":
        navigation.push("ClockPracticeGenerator", {});
        break;
      case "SUDOKU":
        navigation.push("SudokuGame", {});
        break;
      case "MINESWEEPER":
        navigation.push("Minesweeper", {});
        break;
      case "VOCAB_BUILDER":
        navigation.push("VocabBuilder", {});
        break;
      case "SPELLBEE":
        navigation.navigate("SpellingBeeGame", {});
        break;
      case "ACTION_CONTACT_US":
        navigation.push("cntct");
        break;
      case "INFO_PAGE":
        navigation.navigate("DummyScreen", { title: item.title });
        break;

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
    // Your existing styles (remains unchanged)
    () =>
      StyleSheet.create({
        container: { flex: 1 },
        centered: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        },
        errorText: {
          fontSize: 16,
          textAlign: "center",
          marginBottom: 15,
          color: theme.textPrimaryOnGradient || theme.textLight || "#FFFFFF",
          fontFamily: "nunito",
        },
        infoText: {
          fontSize: 16,
          textAlign: "center",
          marginBottom: 15,
          color: theme.textPrimaryOnGradient || theme.textLight || "#FFFFFF",
          fontFamily: "nunito",
        },
        listItemStyle: {
          backgroundColor: theme.cardBackground || "rgba(255,255,255,0.15)",
          borderRadius: 10,
          marginBottom: 12,
          marginHorizontal: 16,
          shadowColor: theme.shadowColor || "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 3,
          elevation: 3,
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 16,
          paddingHorizontal: 16,
        },
        iconStyle: {
          color: theme.iconDefault || theme.textSecondary || "#E0E0E0",
          marginRight: 15,
          width: 24,
          textAlign: "center",
        },
        listTextStyle: {
          fontFamily: "delius",
          color: theme.textPrimary || "#FFFFFF",
          fontSize: 16,
          flex: 1,
        },
        dangerousIconStyle: {
          color: theme.error || "#D32F2F",
          marginRight: 15,
          width: 24,
          textAlign: "center",
        },
        dangerousTextStyle: {
          fontFamily: "deliusBold",
          color: theme.error || "#D32F2F",
          fontSize: 16,
          flex: 1,
        },
        checkmarkStyle: { marginLeft: "auto", paddingLeft: 10 }, // Pushed to the right
      }),
    [theme]
  );

  const renderCustomItem = ({ item }) => {
    const isDangerousAction =
      item.actionId === "NAV_TO_DELETE_ACCOUNT_CONFIRMATION";

    // --- Checkmark Logic for Quiz Type using perfectQuizCompletions from userData ---
    const isQuizType = item.type?.toUpperCase() === "QUIZ";
    let checkmarkColor = null;
    const perfectQuizCompletions = userData?.perfectQuizCompletions || {};

    if (isQuizType && userId && item.id) {
      // Check userId to ensure completions map is relevant
      const lastPerfectScoreTimestamp = perfectQuizCompletions[item.id]; // item.id is quizId

      if (
        lastPerfectScoreTimestamp &&
        typeof lastPerfectScoreTimestamp.toDate === "function"
      ) {
        const lastPerfectScoreDate = lastPerfectScoreTimestamp.toDate();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        if (lastPerfectScoreDate > sevenDaysAgo) {
          checkmarkColor = theme.success || "green"; // Fresh 100%
        } else {
          checkmarkColor = theme.textDisabled || "gray"; // Older 100%
        }
      }
    }
    // --- End Checkmark Logic ---

    return (
      <TouchableOpacity
        onPress={() => handleLinkPress(item)}
        style={styles.listItemStyle}
        activeOpacity={0.7}
      >
        {item.icon ? (
          <MaterialCommunityIcons
            name={item.icon}
            size={24}
            style={
              isDangerousAction ? styles.dangerousIconStyle : styles.iconStyle
            }
          />
        ) : (
          <View style={{ width: 24 + 15, marginRight: 0 }} /> // Placeholder for alignment
        )}
        <Text
          style={
            isDangerousAction ? styles.dangerousTextStyle : styles.listTextStyle
          }
          numberOfLines={2}
        >
          {item.title}
        </Text>
        {checkmarkColor && isQuizType && (
          <MaterialCommunityIcons
            name="check-circle"
            size={22}
            color={checkmarkColor}
            style={styles.checkmarkStyle}
          />
        )}
      </TouchableOpacity>
    );
  };

  const gradientColors = useMemo(
    () =>
      theme.gradientStart && theme.gradientEnd
        ? [theme.gradientStart, theme.gradientEnd]
        : ["#3b0940", "#d7d1d3"],
    [theme.gradientStart, theme.gradientEnd]
  );

  if (isLoading) {
    /* ... Your existing loading UI ... */
    return (
      <LinearGradient colors={gradientColors} style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator
            size="large"
            color={theme.accent || theme.primaryWhite || "#FFFFFF"}
          />
        </View>
      </LinearGradient>
    );
  }
  if (error && itemsToDisplay.length === 0) {
    /* ... Your existing error UI ... */
    return (
      <LinearGradient colors={gradientColors} style={styles.container}>
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
  if (itemsToDisplay.length === 0) {
    /* ... Your existing empty list UI ... */
    return (
      <LinearGradient colors={gradientColors} style={styles.container}>
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
    <LinearGradient colors={gradientColors} style={styles.container}>
      {error && itemsToDisplay.length > 0 && (
        <View
          style={{
            padding: 10,
            backgroundColor: theme.warningBackground || "rgba(255,200,0,0.2)",
          }}
        >
          <Text
            style={{
              color: theme.warningText || theme.textPrimary,
              textAlign: "center",
              fontSize: 12,
            }}
          >
            {error}
          </Text>
        </View>
      )}
      <FlatList
        data={itemsToDisplay}
        renderItem={renderCustomItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingVertical: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};

export default LinksScreen;

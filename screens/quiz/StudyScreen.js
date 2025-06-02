import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import CustomCarousel from "../../components/common/CustomCarousal"; // Ensure path is correct
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import {
  listenToCategoriesByGroup,
  listenToUserDocument, // UPDATED IMPORT
} from "../../services/firestoreContentApi"; // Adjust path as needed
import { authInstance } from "../../config/firebaseConfig"; // Adjust path as needed

// Helper function (from your provided code)
const formatCategoryDataForCarousel = (category) => ({
  id: category.id,
  title: category.title,
  image: category.image,
  subtitle: category.subtitle || "",
  duration: category.duration || "",
  author: category.author || "",
  type: category.type || "COURSE",
});

function StudyScreen({ navigation }) {
  const { theme } = useTheme();

  // State variables for categories
  const [olympiadCategories, setOlympiadCategories] = useState([]);
  const [classroomCategories, setClassroomCategories] = useState([]);
  const [popularReadCategories, setPopularReadCategories] = useState([]);
  const [popularQuizCategories, setPopularQuizCategories] = useState([]);

  // UPDATED STATE: Store the whole user document or specifically the completions map
  // Let's store userData and extract the map from it.
  const [userData, setUserData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isMountedRef = useRef(true);
  const userId = authInstance.currentUser?.uid;

  useEffect(() => {
    isMountedRef.current = true;
    console.log("StudyScreen mounted, setting up listeners...");
    setIsLoading(true);
    setError(null);
    setUserData(null); // Reset user data on userId change or mount

    let listenersInitializedCount = 0;
    const CATEGORY_LISTENERS_COUNT = 4;
    // Total listeners: categories + user document (if user is logged in)
    const TOTAL_EXPECTED_LISTENERS = userId
      ? CATEGORY_LISTENERS_COUNT + 1
      : CATEGORY_LISTENERS_COUNT;

    const onListenerInitialized = () => {
      if (isMountedRef.current) {
        listenersInitializedCount++;
        if (listenersInitializedCount >= TOTAL_EXPECTED_LISTENERS) {
          setIsLoading(false);
          console.log(
            "All expected initial listeners for StudyScreen have reported."
          );
        }
      }
    };

    const handleListenerError = (err, source) => {
      if (isMountedRef.current) {
        console.error(`StudyScreen Listener Error from ${source}:`, err);
        setError(`Failed to load ${source}. Please try again later.`);
        setIsLoading(false); // Stop loading on critical error
      }
    };

    // Setup listeners for categories (same as before)
    const unsubOlympiad = listenToCategoriesByGroup(
      "olympiad",
      (data) => {
        if (isMountedRef.current) {
          setOlympiadCategories(data.map(formatCategoryDataForCarousel));
          onListenerInitialized();
        }
      },
      (e) => handleListenerError(e, "Olympiad Categories")
    );
    const unsubClassroom = listenToCategoriesByGroup(
      "classroom",
      (data) => {
        if (isMountedRef.current) {
          setClassroomCategories(data.map(formatCategoryDataForCarousel));
          onListenerInitialized();
        }
      },
      (e) => handleListenerError(e, "Classroom Categories")
    );
    const unsubReads = listenToCategoriesByGroup(
      "popular_read",
      (data) => {
        if (isMountedRef.current) {
          setPopularReadCategories(data.map(formatCategoryDataForCarousel));
          onListenerInitialized();
        }
      },
      (e) => handleListenerError(e, "Popular Reads")
    );
    const unsubQuizzes = listenToCategoriesByGroup(
      "popular_quiz",
      (data) => {
        if (isMountedRef.current) {
          setPopularQuizCategories(data.map(formatCategoryDataForCarousel));
          onListenerInitialized();
        }
      },
      (e) => handleListenerError(e, "Popular Quizzes")
    );

    // Setup listener for user document if user is logged in
    let unsubUserDocument = () => {};
    if (userId) {
      unsubUserDocument = listenToUserDocument(
        // Use the new service function
        (data) => {
          if (isMountedRef.current) {
            setUserData(data); // Store the whole user document (or null if not found)
            console.log(
              "StudyScreen: User document received:",
              data
                ? `has perfectQuizCompletions: ${!!data.perfectQuizCompletions}`
                : "null"
            );
            onListenerInitialized();
          }
        },
        (err) => handleListenerError(err, "User Document")
      );
    }

    // Cleanup function
    return () => {
      console.log("StudyScreen unmounting, cleaning up listeners.");
      isMountedRef.current = false;
      unsubOlympiad();
      unsubClassroom();
      unsubReads();
      unsubQuizzes();
      unsubUserDocument(); // Cleanup the user document listener
    };
  }, [userId]); // Rerun effect if userId changes

  // Extract the perfectQuizCompletions map for passing to carousels
  const perfectQuizCompletions = userData?.perfectQuizCompletions || {};

  const styles = useMemo(
    () =>
      StyleSheet.create({
        gradientContainer: { flex: 1 },
        centered: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        },
        errorText: {
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          fontSize: 16,
          textAlign: "center",
          fontFamily: "nunito",
        },
        scrollViewContent: { paddingBottom: 20 },
      }),
    [theme]
  );

  if (isLoading) {
    return (
      <LinearGradient
        colors={[
          theme.gradientStart || "#3b0940",
          theme.gradientEnd || "#d7d1d3",
        ]}
        style={styles.centered}
      >
        <ActivityIndicator
          size="large"
          color={theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF"}
        />
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={[
          theme.gradientStart || "#3b0940",
          theme.gradientEnd || "#d7d1d3",
        ]}
        style={styles.centered}
      >
        <Text style={styles.errorText}>{error}</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[
        theme.gradientStart || "#3b0940",
        theme.gradientEnd || "#d7d1d3",
      ]}
      style={styles.gradientContainer}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {olympiadCategories.length > 0 && (
          <CustomCarousel
            title="Olympiad"
            data={olympiadCategories}
            navigation={navigation}
            perfectQuizCompletions={perfectQuizCompletions} // Pass the map
            customWidth={40}
            customHeight={120}
          />
        )}
        {classroomCategories.length > 0 && (
          <CustomCarousel
            title="My Classrooms"
            data={classroomCategories}
            navigation={navigation}
            perfectQuizCompletions={perfectQuizCompletions} // Pass the map
            customWidth={40}
            customHeight={120}
          />
        )}
        {popularReadCategories.length > 0 && (
          <CustomCarousel
            title="Popular Reads"
            data={popularReadCategories}
            navigation={navigation}
            perfectQuizCompletions={perfectQuizCompletions} // Pass the map
            customWidth={40}
            customHeight={120}
          />
        )}
        {popularQuizCategories.length > 0 && (
          <CustomCarousel
            title="Popular Quizzes"
            data={popularQuizCategories}
            navigation={navigation}
            perfectQuizCompletions={perfectQuizCompletions} // Pass the map
            customWidth={40}
            customHeight={120}
          />
        )}
        {!isLoading &&
          !error &&
          olympiadCategories.length === 0 &&
          classroomCategories.length === 0 &&
          popularReadCategories.length === 0 &&
          popularQuizCategories.length === 0 && (
            <View style={styles.centered}>
              <Text
                style={[
                  styles.errorText,
                  {
                    color:
                      theme.textSecondaryOnGradient ||
                      theme.textLightGray ||
                      "#B0B0B0",
                  },
                ]}
              >
                No study content available at the moment.
              </Text>
            </View>
          )}
      </ScrollView>
    </LinearGradient>
  );
}

export default StudyScreen;

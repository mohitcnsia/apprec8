// screens/quiz/StudyScreen.js (using @react-native-firebase listeners)

import React, { useState, useEffect } from "react"; // Use useEffect for listeners
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import CustomCarousel from "../../components/common/CustomCarousal"; // Adjust path if needed
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors"; // Adjust path if needed
import { listenToCategoriesByGroup } from "../../services/firestoreContentApi"; // Adjust path if needed

// Helper function to format data for the carousel
const formatCategoryDataForCarousel = (category) => ({
  id: category.id,
  title: category.title, // Use title field
  image: category.image,
  subtitle: category.subtitle || "", // Use subtitle field
  duration: category.duration || "",
  author: category.author || "",
  type: category.type || "COURSE", // Keep original type for navigation logic
  // No need to add carouselGroup here if only used for fetching
});

function StudyScreen({ navigation }) {
  // Separate state for each carousel's data
  const [olympiadCategories, setOlympiadCategories] = useState([]);
  const [classroomCategories, setClassroomCategories] = useState([]);
  const [popularReadCategories, setPopularReadCategories] = useState([]);
  const [popularQuizCategories, setPopularQuizCategories] = useState([]);

  // Combined loading/error state for initial fetch
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect to set up listeners on mount and clean up on unmount
  useEffect(() => {
    console.log("StudyScreen mounted, setting up listeners...");
    setIsLoading(true); // Assume loading until first data arrives
    setError(null);
    let active = true; // Flag to prevent state updates if component unmounts during async op

    // Track how many listeners have provided their first data snapshot
    let listenersInitialized = 0;
    const totalListeners = 4; // Update if you add/remove carousels

    const handleInitialLoad = () => {
      listenersInitialized++;
      if (active && listenersInitialized >= totalListeners) {
        setIsLoading(false); // Stop loading once all listeners give initial data
        console.log("All initial listeners fired for StudyScreen.");
      }
    };

    const handleError = (err) => {
      if (active) {
        setError("Could not load all study sections."); // Set a generic error
        setIsLoading(false); // Stop loading on error
      }
    };

    // --- Set up listeners ---
    const unsubOlympiad = listenToCategoriesByGroup(
      "olympiad",
      (data) => {
        if (active) {
          setOlympiadCategories(data.map(formatCategoryDataForCarousel));
          handleInitialLoad();
        }
      },
      handleError
    );
    const unsubClassroom = listenToCategoriesByGroup(
      "classroom",
      (data) => {
        if (active) {
          setClassroomCategories(data.map(formatCategoryDataForCarousel));
          handleInitialLoad();
        }
      },
      handleError
    );
    const unsubReads = listenToCategoriesByGroup(
      "popular_read",
      (data) => {
        if (active) {
          setPopularReadCategories(data.map(formatCategoryDataForCarousel));
          handleInitialLoad();
        }
      },
      handleError
    );
    const unsubQuizzes = listenToCategoriesByGroup(
      "popular_quiz",
      (data) => {
        if (active) {
          setPopularQuizCategories(data.map(formatCategoryDataForCarousel));
          handleInitialLoad();
        }
      },
      handleError
    );
    // --- End Listener Setup ---

    // --- Return cleanup function ---
    return () => {
      console.log("StudyScreen unmounting, cleaning up listeners.");
      active = false; // Prevent state updates after unmount
      unsubOlympiad();
      unsubClassroom();
      unsubReads();
      unsubQuizzes();
    };
  }, []); // Empty dependency array ensures this runs only once on mount/unmount

  // --- Render Logic ---
  if (isLoading) {
    return (
      <LinearGradient
        colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
        style={styles.centered}
      >
        <ActivityIndicator size="large" color={Colors.primaryWhite} />
      </LinearGradient>
    );
  }
  if (error) {
    return (
      <LinearGradient
        colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
        style={styles.centered}
      >
        <Text style={styles.errorText}>{error}</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Conditionally render carousels based on data length */}
        {olympiadCategories.length > 0 && (
          <CustomCarousel
            title="Olympiad"
            data={olympiadCategories}
            navigation={navigation}
            customWidth={40}
            customHeight={120}
          />
        )}
        {classroomCategories.length > 0 && (
          <CustomCarousel
            title="My Classrooms"
            data={classroomCategories}
            navigation={navigation}
            customWidth={40}
            customHeight={120}
          />
        )}
        {popularReadCategories.length > 0 && (
          <CustomCarousel
            title="Popular Reads"
            data={popularReadCategories}
            navigation={navigation}
            customWidth={40}
            customHeight={120}
          />
        )}
        {popularQuizCategories.length > 0 && (
          <CustomCarousel
            title="Popular Quizzes"
            data={popularQuizCategories}
            navigation={navigation}
            customWidth={40}
            customHeight={120}
          />
        )}
      </ScrollView>
    </LinearGradient>
  );
}

export default StudyScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: { color: Colors.primaryWhite, fontSize: 16, textAlign: "center" },
});

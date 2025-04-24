// screens/quiz/StudyScreen.js

import React, { useState, useEffect, useMemo } from "react"; // Import useMemo
import {
  ScrollView,
  StyleSheet,
  Text,
  View, // Keep View if needed for future layout, though not used currently
  ActivityIndicator,
} from "react-native";
import CustomCarousel from "../../components/common/CustomCarousal";
import { LinearGradient } from "expo-linear-gradient";
// import { Colors } from "../../config/colors"; // Remove legacy Colors import
import { useTheme } from "../../context/ThemeContext"; // Import useTheme hook
import { listenToCategoriesByGroup } from "../../services/firestoreContentApi";

// Helper function (remains the same)
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
  const { theme } = useTheme(); // Use the theme hook

  // State variables (remain the same)
  const [olympiadCategories, setOlympiadCategories] = useState([]);
  const [classroomCategories, setClassroomCategories] = useState([]);
  const [popularReadCategories, setPopularReadCategories] = useState([]);
  const [popularQuizCategories, setPopularQuizCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect for listeners (remains the same)
  useEffect(() => {
    console.log("StudyScreen mounted, setting up listeners...");
    setIsLoading(true);
    setError(null);
    let active = true;
    let listenersInitialized = 0;
    const totalListeners = 4;

    const handleInitialLoad = () => {
      listenersInitialized++;
      if (active && listenersInitialized >= totalListeners) {
        setIsLoading(false);
        console.log("All initial listeners fired for StudyScreen.");
      }
    };
    const handleError = (err) => {
      if (active) {
        setError("Could not load all study sections.");
        setIsLoading(false);
      }
    };

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

    return () => {
      console.log("StudyScreen unmounting, cleaning up listeners.");
      active = false;
      unsubOlympiad();
      unsubClassroom();
      unsubReads();
      unsubQuizzes();
    };
  }, []);

  // --- Define Styles Inside Component with useMemo ---
  const styles = useMemo(
    () =>
      StyleSheet.create({
        // Style for the LinearGradient wrapper
        gradientContainer: {
          flex: 1,
        },
        // Style for centered content (loading/error)
        centered: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          // Background handled by the gradient applied to this View
        },
        // Style for error text
        errorText: {
          // Use themed text color suitable for gradient background
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          fontSize: 16,
          textAlign: "center",
        },
        // Optional: Add padding to ScrollView content if needed
        scrollViewContent: {
          paddingBottom: 20, // Add padding at the bottom
        },
      }),
    [theme]
  ); // Depend on theme

  // --- Render Logic ---
  if (isLoading) {
    return (
      // Apply themed gradient to the loading container
      <LinearGradient
        colors={[
          theme.gradientStart || "#3b0940",
          theme.gradientEnd || "#d7d1d3",
        ]}
        style={styles.centered} // Use centered style which has flex: 1
      >
        {/* Use themed color for indicator */}
        <ActivityIndicator
          size="large"
          color={theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF"}
        />
      </LinearGradient>
    );
  }
  if (error) {
    return (
      // Apply themed gradient to the error container
      <LinearGradient
        colors={[
          theme.gradientStart || "#3b0940",
          theme.gradientEnd || "#d7d1d3",
        ]}
        style={styles.centered} // Use centered style which has flex: 1
      >
        <Text style={styles.errorText}>{error}</Text>
      </LinearGradient>
    );
  }

  // --- Main Screen Render ---
  return (
    // Apply themed gradient to the main container
    <LinearGradient
      colors={[
        theme.gradientStart || "#3b0940",
        theme.gradientEnd || "#d7d1d3",
      ]}
      style={styles.gradientContainer} // Use container style which has flex: 1
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent} // Optional padding
      >
        {/* Carousels are assumed to be themed internally */}
        {olympiadCategories.length > 0 && (
          <CustomCarousel
            title="Olympiad"
            data={olympiadCategories}
            navigation={navigation}
            customWidth={40} // Keep custom dimensions
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

// Removed the external StyleSheet as styles are now internal and memoized

// screens/quiz/StudyScreen.js

import React, { useState, useCallback } from "react"; // Remove useEffect, Add useCallback
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import CustomCarousel from "../../components/common/CustomCarousal";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors";
import { getCategoriesByGroup } from "../../services/firestoreContentApi";

const formatCategoryDataForCarousel = (category) => ({
  id: category.id,
  title: category.title,
  image: category.image,
  subtitle: category.subtitle || "",
  duration: category.duration || "",
  author: category.author || "",
  type: category.type || "COURSE",
  carouselGroup: category.carouselGroup, // Keep this if needed, or remove if only used for fetching
});

function StudyScreen({ navigation }) {
  const [olympiadCategories, setOlympiadCategories] = useState([]);
  const [classroomCategories, setClassroomCategories] = useState([]);
  const [popularReadCategories, setPopularReadCategories] = useState([]);
  const [popularQuizCategories, setPopularQuizCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Start loading false initially
  const [error, setError] = useState(null);

  // --- Use useFocusEffect to fetch data ---
  useFocusEffect(
    // Wrap the fetch logic in useCallback
    useCallback(() => {
      const loadAllCarouselData = async () => {
        // Only set loading true when we actually start fetching on focus
        setIsLoading(true);
        setError(null);
        console.log("StudyScreen focused, fetching data..."); // Log focus
        try {
          const results = await Promise.all([
            getCategoriesByGroup("olympiad"),
            getCategoriesByGroup("classroom"),
            getCategoriesByGroup("popular_read"),
            getCategoriesByGroup("popular_quiz"),
          ]);

          setOlympiadCategories(results[0].map(formatCategoryDataForCarousel));
          setClassroomCategories(results[1].map(formatCategoryDataForCarousel));
          setPopularReadCategories(
            results[2].map(formatCategoryDataForCarousel)
          );
          setPopularQuizCategories(
            results[3].map(formatCategoryDataForCarousel)
          );
        } catch (err) {
          console.error("Failed to load carousel data:", err);
          setError("Could not fetch study sections.");
        } finally {
          setIsLoading(false);
        }
      };

      loadAllCarouselData();

      // Optional: Return a cleanup function if needed when screen goes out of focus
      // return () => console.log("StudyScreen unfocused");
    }, []) // Empty dependency array ensures it runs on first focus, like useEffect mount
  );
  // --- End useFocusEffect ---

  // --- Render Logic (Remains mostly the same) ---
  // Show loader ONLY when isLoading is true (which now happens on focus)
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

  // Render carousels if data is available (and not loading/error)
  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Only render carousel if data exists */}
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

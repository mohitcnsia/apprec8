// screens/Home.js (using @react-native-firebase listeners)

import React, { useState, useEffect } from "react"; // Use useEffect
import { ScrollView, StyleSheet, Text, ActivityIndicator } from "react-native";
import CustomCarousel from "../../components/common/CustomCarousal"; // Adjust path
import { THOUGHTS } from "../../data/thoughts"; // Keep for now, maybe move to Firestore later?
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import KidsThoughtOfTheDay from "../../components/thought/KidsThoughtOfTheDay"; // Adjust path
import { listenToCategoriesByGroup } from "../../services/firestoreContentApi"; // Adjust path

// Re-use or move this helper
const formatCategoryDataForCarousel = (category) => ({
  id: category.id,
  title: category.title,
  image: category.image,
  subtitle: category.subtitle || "",
  duration: category.duration || "",
  author: category.author || "",
  type: category.type || "COURSE",
});

function Home({ navigation }) {
  const { theme } = useTheme();
  const [storyItems, setStoryItems] = useState([]);
  const [bookSummaryItems, setBookSummaryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch thought - keep existing logic for now
  const getThoughtOfTheDay = () => {
    return THOUGHTS[1]; // Maybe fetch this from Firestore later too?
  };

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1 },
        centered: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }, // Added centered
        errorText: {
          color: theme.errorText,
          fontSize: 16,
          textAlign: "center",
        }, // Added errorText
        thoughtContainer: { padding: 20 },
        thought: {
          color: theme.textPrimary,
          fontFamily: "pacifico",
          fontSize: 20,
        },
      }),
    [theme]
  );

  // useEffect to set up listeners for Home screen carousels
  useEffect(() => {
    console.log("HomeScreen mounted, setting up listeners...");
    setIsLoading(true);
    setError(null);
    let active = true;

    let listenersInitialized = 0;
    const totalListeners = 2; // Stories + Book Summaries

    const handleInitialLoad = () => {
      listenersInitialized++;
      if (active && listenersInitialized >= totalListeners) {
        setIsLoading(false);
        console.log("All initial listeners fired for HomeScreen.");
      }
    };

    const handleError = (err) => {
      if (active) {
        setError("Could not load some content.");
        setIsLoading(false);
      }
    };

    // Setup listener for Stories
    const unsubStories = listenToCategoriesByGroup(
      "story", // Assuming this is the carouselGroup value for stories
      (data) => {
        if (active) {
          setStoryItems(data.map(formatCategoryDataForCarousel));
          handleInitialLoad();
        }
      },
      handleError
    );

    // Setup listener for Book Summaries
    const unsubSummaries = listenToCategoriesByGroup(
      "book_summary", // Assuming this is the carouselGroup value
      (data) => {
        if (active) {
          setBookSummaryItems(data.map(formatCategoryDataForCarousel));
          handleInitialLoad();
        }
      },
      handleError
    );

    // Cleanup listeners on unmount
    return () => {
      console.log("HomeScreen unmounting, cleaning up listeners.");
      active = false;
      unsubStories();
      unsubSummaries();
    };
  }, []); // Run only on mount/unmount

  // --- Render Logic ---
  // Show global loader for simplicity, could show partial content too
  if (isLoading) {
    return (
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        style={styles.centered}
      >
        <ActivityIndicator size="large" color={theme.textPrimary} />
      </LinearGradient>
    );
  }
  // Simple error display
  if (error) {
    // Could still render thought even if carousels fail
    return (
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        style={styles.centered}
      >
        <Text style={styles.errorText}>{error}</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[theme.gradientStart, theme.gradientEnd]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <KidsThoughtOfTheDay thought={getThoughtOfTheDay()} />

        {storyItems.length > 0 && (
          <CustomCarousel
            title="Stories"
            data={storyItems} // Use fetched data
            navigation={navigation}
            customWidth={50}
            customHeight={180}
          />
        )}
        {bookSummaryItems.length > 0 && (
          <CustomCarousel
            title="Book Summaries"
            data={bookSummaryItems} // Use fetched data
            navigation={navigation}
            customWidth={50}
            customHeight={180}
          />
        )}
      </ScrollView>
    </LinearGradient>
  );
}

export default Home;

import { ScrollView, StyleSheet, Text, View } from "react-native";
import CustomCarousel from "../../components/common/CustomCarousal";
import { THOUGHTS } from "../../data/thoughts";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors";
import KidsThoughtOfTheDay from "../../components/thought/KidsThoughtOfTheDay";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
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

function Home({ navigation }) {
  const [storyCategories, setStoryCategories] = useState([]);
  const [bookSummaryCategories, setBookSummaryCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Start loading false initially
  const [error, setError] = useState(null);

  const getThoughtOfTheDay = () => {
    return THOUGHTS[1];
  };

  useFocusEffect(
    // Wrap the fetch logic in useCallback
    useCallback(() => {
      const loadAllCarouselData = async () => {
        // Only set loading true when we actually start fetching on focus
        setIsLoading(true);
        setError(null);
        console.log("HomeScreen focused, fetching data..."); // Log focus
        try {
          const results = await Promise.all([
            getCategoriesByGroup("story"),
            getCategoriesByGroup("book_summary"),
          ]);

          setStoryCategories(results[0].map(formatCategoryDataForCarousel));
          setBookSummaryCategories(
            results[1].map(formatCategoryDataForCarousel)
          );
        } catch (err) {
          console.error("Failed to load carousel data:", err);
          setError("Could not fetch home sections.");
        } finally {
          setIsLoading(false);
        }
      };

      loadAllCarouselData();

      // Optional: Return a cleanup function if needed when screen goes out of focus
      // return () => console.log("StudyScreen unfocused");
    }, []) // Empty dependency array ensures it runs on first focus, like useEffect mount
  );

  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <KidsThoughtOfTheDay thought={getThoughtOfTheDay()} />
        {/* Only render carousel if data exists */}
        {storyCategories.length > 0 && (
          <CustomCarousel
            title="Stories"
            data={storyCategories}
            navigation={navigation}
            customWidth={50}
            customHeight={180}
          />
        )}
        {bookSummaryCategories.length > 0 && (
          <CustomCarousel
            title="Book Summaries"
            data={bookSummaryCategories}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  thoughtContainer: {
    padding: 20,
  },
  thought: {
    color: Colors.primaryWhite,
    fontFamily: "pacifico",
    fontSize: 20,
  },
});

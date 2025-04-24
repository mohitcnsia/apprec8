// components/common/CustomCarousal.js

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react"; // Import useMemo
import {
  View,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  Pressable,
} from "react-native";
// import { Colors } from "../../config/colors"; // Remove legacy Colors import
import { useTheme } from "../../context/ThemeContext"; // Import useTheme hook
import DummyScreen from "../../screens/DummyScreen"; // Keep this if needed for navigation fallback
// Remove data imports if they are not used directly here
// import { psychologyTopics, systemDesignTopics } from "../../data/app-topic-data";

const { width: screenWidth } = Dimensions.get("window");
const SPACING = 20; // Keep spacing definition

// Helper functions remain the same
const getImageSource = (item) => {
  if (!item) return null;
  if (typeof item === "string") return { uri: item };
  if (typeof item === "number") return item;
  return item.image
    ? typeof item.image === "number"
      ? item.image
      : { uri: item.image }
    : null;
};

const containsMetadata = (item) =>
  Boolean(item?.title || item?.duration || item?.type || item?.author);

// --- CarouselItem Component ---
// Now accepts 'theme' as a prop
const CarouselItem = React.memo(
  ({ item, imageWidth, imageHeight, navigation, theme }) => {
    // Added theme prop
    // console.log("CarouselItem rendering item:", JSON.stringify(item, null, 2)); // Keep logs if needed during debugging
    const imageSource = getImageSource(item);
    // console.log("CarouselItem imageSource:", imageSource);
    // console.log("CarouselItem dimensions (w, h):", imageWidth, imageHeight);
    const hasMetadata = containsMetadata(item);

    // Navigation logic remains the same
    function pressHandler() {
      if (!item || !item.id) return;
      console.log(
        `CarouselItem pressed: ID=${item.id}, Type=${item.type}, Title=${item.title}`
      );
      switch (item.type?.toUpperCase()) {
        case "STUDY":
          navigation.push("Apprec8Reader", { contentId: item.id });
          break;
        case "QUIZ":
          navigation.push("Quiz", { quizContentId: item.id });
          break;
        case "COURSE":
        case "COMPLEX":
        case "ACTIVITY":
          navigation.push("LinkScreen", {
            categoryId: item.id,
            categoryTitle: item.title,
          });
          break;
        default:
          console.warn(`Unhandled item type: ${item.type} for ID: ${item.id}`);
          navigation.navigate("DummyScreen", {
            errorMessage: `Action for "${item.title}" not defined.`,
          });
          break;
      }
    }

    // Define minimal styles needed here, using the passed theme prop
    const itemStyles = useMemo(
      () =>
        StyleSheet.create({
          pressableWrapper: {
            marginHorizontal: SPACING / 2, // Apply spacing for FlatList separation
          },
          container: {
            width: imageWidth,
            borderRadius: 10,
            overflow: "hidden", // Clip image corners
          },
          imageStyle: {
            width: imageWidth,
            height: imageHeight,
            borderRadius: 10, // Ensure image has rounded corners (redundant due to container overflow:'hidden')
            resizeMode: "stretch",
          },
          imagePlaceholder: {
            width: imageWidth,
            height: imageHeight,
            borderRadius: 10,
            backgroundColor: theme.placeholder || "#cccccc", // Use theme placeholder color
          },
          metadataContainer: {
            padding: 8, // Slightly more padding
            // Optional: Add a subtle background overlay if needed for text readability on images
            // backgroundColor: 'rgba(0,0,0,0.3)',
          },
          itemTitle: {
            fontWeight: "bold",
            color: theme.textPrimary || "#000000", // Use theme text color
            fontSize: 13, // Slightly larger title
            marginBottom: 2,
          },
          metaText: {
            fontSize: 11,
            color: theme.textSecondary || "#6E6E73", // Use theme secondary text color
            marginTop: 1,
          },
        }),
      [theme, imageWidth, imageHeight]
    ); // Depend on theme and dimensions

    return (
      <Pressable
        onPress={pressHandler}
        style={({ pressed }) => [
          itemStyles.pressableWrapper, // Use styles defined above
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <View style={itemStyles.container}>
          {imageSource ? (
            <Image source={imageSource} style={itemStyles.imageStyle} />
          ) : (
            <View style={itemStyles.imagePlaceholder} />
          )}

          {/* Metadata Section Below Image */}
          {hasMetadata && (
            <View style={itemStyles.metadataContainer}>
              {item.title && (
                <Text style={itemStyles.itemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
              )}
              <Text style={itemStyles.metaText} numberOfLines={1}>
                {item.subtitle && `${item.subtitle} • `}
                {item.duration && `${item.duration}`}
              </Text>
              {item.author && (
                <Text style={itemStyles.metaText} numberOfLines={1}>
                  {item.author}
                </Text>
              )}
            </View>
          )}
        </View>
      </Pressable>
    );
  }
);

// --- CustomCarousel Component ---
const CustomCarousel = ({
  title,
  data = [], // Keep default prop
  navigation,
  autoPlay = false,
  interval = 3000,
  viewAllScreen, // Keep prop if used
  customWidth = 80,
  customHeight = 240,
  pagination = false,
}) => {
  // Get theme object
  const { theme } = useTheme();

  // console.log(`CustomCarousel "${title}" received data:`, JSON.stringify(data, null, 2)); // Keep if debugging needed

  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Dimensions calculations remain the same
  const imageWidth = (screenWidth * customWidth) / 100;
  const imageHeight = customHeight;

  // useEffect and useCallback logic remain the same
  useEffect(() => {
    if (autoPlay && data.length > 1) {
      const intervalId = setInterval(() => scrollToNext(), interval);
      return () => clearInterval(intervalId);
    }
  }, [autoPlay, data, interval, scrollToNext]); // Added data, scrollToNext dependencies

  const scrollToNext = useCallback(() => {
    if (!flatListRef.current || !Array.isArray(data) || data.length === 0)
      return;
    let nextIndex = (currentIndex + 1) % data.length;
    flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    // setCurrentIndex(nextIndex); // Let onScroll handle index update for consistency
  }, [currentIndex, data]);

  const handleScroll = useCallback(
    (event) => {
      if (!Array.isArray(data) || data.length === 0) return;
      // Calculate index based on scroll position and item width + spacing
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const itemTotalWidth = imageWidth + SPACING / 2; // Width + margin used in container
      const newIndex = Math.round(contentOffsetX / itemTotalWidth);

      if (
        newIndex !== currentIndex &&
        newIndex >= 0 &&
        newIndex < data.length
      ) {
        setCurrentIndex(newIndex);
      }
    },
    [currentIndex, data, imageWidth] // Added data dependency
  );

  // Define styles inside useMemo, depending on theme
  const styles = useMemo(
    () =>
      StyleSheet.create({
        carouselWrapper: {
          marginVertical: 10,
        },
        header: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: SPACING, // Use SPACING for consistency
          marginBottom: 10, // More space below header
        },
        title: {
          fontSize: 18,
          fontWeight: "bold",
          color: theme.textPrimary || "#000000", // Use theme text color
        },
        viewAll: {
          fontSize: 14, // Slightly larger
          color: theme.accent || "#007AFF", // Use theme accent color (or primary)
          fontWeight: "500",
        },
        paginationContainer: {
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 12, // More space above pagination
          marginBottom: 5,
        },
        dot: {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: theme.placeholder || "#cccccc", // Use theme placeholder color
          marginHorizontal: 4, // Adjust spacing
        },
        activeDot: {
          backgroundColor: theme.primary || "#800000", // Use theme primary (or accent) color
        },
        // FlatList content container style (no theme dependency needed here usually)
        flatlistContentContainer: {
          paddingHorizontal: SPACING / 2, // Start padding
        },
      }),
    [theme]
  ); // Depend on theme

  return (
    <View style={styles.carouselWrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {/* Ensure DummyScreen is imported if used here */}
        {viewAllScreen && (
          <TouchableOpacity onPress={() => navigation.navigate(DummyScreen)}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* FlatList */}
      <FlatList
        ref={flatListRef}
        data={data} // Use data prop
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item?.id || index.toString()} // Use item.id if available
        contentContainerStyle={styles.flatlistContentContainer} // Apply padding
        renderItem={({ item }) => (
          <CarouselItem
            item={item}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            navigation={navigation}
            theme={theme} // Pass theme object to CarouselItem
          />
        )}
        // Snapping logic requires careful calculation with item width + spacing
        snapToInterval={imageWidth + SPACING / 2} // Width + marginHorizontal from CarouselItem pressableWrapper
        decelerationRate="fast"
        snapToAlignment="start" // Align snapped item to the start
        onScroll={handleScroll}
        scrollEventThrottle={16} // Standard throttle
        getItemLayout={(data, index) => ({
          length: imageWidth + SPACING / 2, // Consistent length calculation
          offset: (imageWidth + SPACING / 2) * index,
          index,
        })}
      />

      {/* Pagination */}
      {pagination && Array.isArray(data) && data.length > 1 && (
        <View style={styles.paginationContainer}>
          {data.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default CustomCarousel;

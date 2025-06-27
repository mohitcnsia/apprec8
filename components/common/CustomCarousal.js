import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity, // For 'View All' button
  Text,
  Pressable,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import DummyScreen from "../../screens/DummyScreen"; // Ensure this path is correct if used
import { MaterialCommunityIcons } from "@expo/vector-icons"; // For the checkmark icon

const { width: screenWidth } = Dimensions.get("window");
const SPACING = 20; // Horizontal spacing between items (total)

// Helper function to get image source (from your provided code)
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

// Helper function to check for metadata (from your provided code)
const containsMetadata = (item) =>
  Boolean(
    item?.title ||
      item?.duration ||
      item?.type ||
      item?.author ||
      item?.subtitle
  );

// --- CarouselItem Component (defined within CustomCarousel) ---
const CarouselItem = React.memo(
  ({
    item,
    imageWidth,
    imageHeight,
    navigation,
    theme,
    perfectQuizCompletions,
  }) => {
    // UPDATED PROP: perfectQuizCompletions
    const imageSource = getImageSource(item);
    const hasMetadata = containsMetadata(item);

    const pressHandler = useCallback(() => {
      if (!item || !item.id) {
        console.warn(
          "CarouselItem: pressHandler called with no item or item.id"
        );
        return;
      }
      // Navigation logic based on item.type (remains same)
      switch (item.type?.toUpperCase()) {
        case "STUDY":
          navigation.push("Apprec8Reader", { contentId: item.id });
          break;
        case "QUIZ":
          navigation.push("Quiz", { quizContentId: item.id });
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
        case "COURSE":
        case "COMPLEX":
        case "ACTIVITY":
          navigation.push("LinkScreen", {
            categoryId: item.id,
            categoryTitle: item.title,
          });
          break;
        default:
          console.warn(
            `CarouselItem: Unhandled item type: ${item.type} for ID: ${item.id}`
          );
          navigation.navigate("DummyScreen", {
            errorMessage: `Action for "${item.title || "this item"}" of type "${
              item.type
            }" is not yet defined.`,
          });
          break;
      }
    }, [navigation, item]);

    // --- Checkmark Logic for Quizzes using perfectQuizCompletions map ---
    const isQuizType = item.type?.toUpperCase() === "QUIZ";
    let checkmarkColor = null;

    if (isQuizType && perfectQuizCompletions && item.id) {
      const lastPerfectScoreTimestamp = perfectQuizCompletions[item.id]; // item.id is quizId

      if (
        lastPerfectScoreTimestamp &&
        typeof lastPerfectScoreTimestamp.toDate === "function"
      ) {
        const lastPerfectScoreDate = lastPerfectScoreTimestamp.toDate();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        if (lastPerfectScoreDate > sevenDaysAgo) {
          checkmarkColor = theme.success || "green"; // Completed and "fresh"
        } else {
          checkmarkColor = theme.textDisabled || "gray"; // Completed but "forgotten"
        }
      }
    }
    // --- End Checkmark Logic ---

    const itemStyles = useMemo(
      () =>
        StyleSheet.create({
          pressableWrapper: {
            marginHorizontal: SPACING / 2,
          },
          container: {
            width: imageWidth,
            borderRadius: 10,
            overflow: "hidden",
            // backgroundColor: theme.cardBackground || theme.surface || "#FFFFFF",
            // elevation: 3,
            // shadowColor: theme.shadowColor || "#000",
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.2,
            // shadowRadius: 2,
          },
          imageStyle: {
            width: "100%",
            height: imageHeight,
            resizeMode: "stretch",
          },
          imagePlaceholder: {
            width: "100%",
            height: imageHeight,
            backgroundColor: theme.placeholder || "#E0E0E0",
            justifyContent: "center",
            alignItems: "center",
          },
          placeholderText: {
            color: theme.textSecondary || "#757575",
            fontSize: 12,
          },
          metadataContainer: {
            paddingVertical: 8,
            paddingHorizontal: 10,
          },
          itemTitle: {
            fontFamily: "nunitoBold",
            fontWeight: "bold",
            color: theme.textPrimary || "#000000",
            fontSize: 14,
            marginBottom: 3,
          },
          metaText: {
            fontFamily: "nunito",
            fontSize: 12,
            color: theme.textSecondary || "#6E6E73",
            marginTop: 2,
          },
          checkmarkContainer: {
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: theme.background || "rgba(255,255,255,0.8)",
            padding: 3,
            borderRadius: 15,
            zIndex: 1,
            elevation: 2,
          },
        }),
      [theme, imageWidth, imageHeight]
    );

    return (
      <Pressable
        onPress={pressHandler}
        style={({ pressed }) => [
          itemStyles.pressableWrapper,
          { opacity: pressed ? 0.65 : 1 },
        ]}
        accessibilityLabel={item.title || "Carousel item"}
        accessibilityRole="button"
      >
        <View style={itemStyles.container}>
          {checkmarkColor && isQuizType && (
            <View style={itemStyles.checkmarkContainer}>
              <MaterialCommunityIcons
                name="check-circle"
                size={22}
                color={checkmarkColor}
              />
            </View>
          )}

          {imageSource ? (
            <Image
              source={imageSource}
              style={itemStyles.imageStyle}
              accessibilityLabel={
                item.title ? `Image for ${item.title}` : "Item image"
              }
            />
          ) : (
            <View style={itemStyles.imagePlaceholder}>
              <Text style={itemStyles.placeholderText}>No Image</Text>
            </View>
          )}

          {hasMetadata && (
            <View style={itemStyles.metadataContainer}>
              {item.title && (
                <Text
                  style={itemStyles.itemTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.title}
                </Text>
              )}
              {(item.subtitle || item.duration) && (
                <Text
                  style={itemStyles.metaText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.subtitle
                    ? `${item.subtitle}${item.duration ? " • " : ""}`
                    : ""}
                  {item.duration ? `${item.duration}` : ""}
                </Text>
              )}
              {item.author && (
                <Text
                  style={itemStyles.metaText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  By: {item.author}
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
  data = [],
  navigation,
  autoPlay = false,
  interval = 3500,
  viewAllScreen,
  customWidth = 80,
  customHeight = 240,
  pagination = false,
  perfectQuizCompletions, // UPDATED PROP NAME
}) => {
  const { theme } = useTheme();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageWidth = (screenWidth * customWidth) / 100;
  const imageHeight = customHeight;

  useEffect(() => {
    let autoplayTimerId = null;
    if (autoPlay && Array.isArray(data) && data.length > 1) {
      autoplayTimerId = setInterval(() => {
        if (flatListRef.current) {
          setCurrentIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % data.length;
            flatListRef.current.scrollToIndex({
              index: nextIndex,
              animated: true,
            });
            return nextIndex;
          });
        }
      }, interval);
    }
    return () => {
      if (autoplayTimerId) clearInterval(autoplayTimerId);
    };
  }, [autoPlay, data, interval]);

  const handleScroll = useCallback(
    (event) => {
      if (!Array.isArray(data) || data.length === 0 || imageWidth <= 0) return;
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const itemEffectiveWidth = imageWidth + SPACING;
      const newIndex = Math.round(contentOffsetX / itemEffectiveWidth);
      if (
        newIndex !== currentIndex &&
        newIndex >= 0 &&
        newIndex < data.length
      ) {
        setCurrentIndex(newIndex);
      }
    },
    [currentIndex, data, imageWidth]
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        carouselWrapper: { marginVertical: 15 },
        header: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: SPACING,
          marginBottom: 12,
        },
        title: {
          fontSize: 20,
          fontFamily: "nunitoBold",
          color: theme.textPrimary || "#000000",
        },
        viewAll: {
          fontSize: 14,
          fontFamily: "nunito",
          color: theme.accent || theme.primary || "#007AFF",
        },
        paginationContainer: {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 15,
        },
        dot: {
          width: 9,
          height: 9,
          borderRadius: 5,
          backgroundColor: theme.placeholder || "#D1D1D6",
          marginHorizontal: 5,
        },
        activeDot: {
          backgroundColor: theme.primary || "#800000",
          width: 10,
          height: 10,
          borderRadius: 5,
        },
        flatlistContentContainer: { paddingHorizontal: SPACING / 2 },
      }),
    [theme]
  );

  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  return (
    <View style={styles.carouselWrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {viewAllScreen && viewAllScreen.screenName && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                viewAllScreen.screenName,
                viewAllScreen.params || {}
              )
            }
          >
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) =>
          item?.id?.toString() || `carousel-${title}-${index}`
        }
        contentContainerStyle={styles.flatlistContentContainer}
        renderItem={({ item }) => (
          <CarouselItem
            item={item}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            navigation={navigation}
            theme={theme}
            perfectQuizCompletions={perfectQuizCompletions} // Pass down the map
          />
        )}
        snapToInterval={imageWidth + SPACING}
        decelerationRate="fast"
        snapToAlignment="start"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(_data, index) => ({
          length: imageWidth + SPACING,
          offset: (imageWidth + SPACING) * index,
          index,
        })}
      />

      {pagination && (
        <View style={styles.paginationContainer}>
          {data.map((_, index) => (
            <View
              key={`dot-${title}-${index}`}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default CustomCarousel;

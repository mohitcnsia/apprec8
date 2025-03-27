import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState, useEffect, useCallback } from "react";
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
import { Colors } from "../../config/colors";
import DummyScreen from "../../screens/DummyScreen";
import {
  psychologyTopics,
  systemDesignTopics,
} from "../../data/app-topic-data";
import { getTopicData, showToast } from "../../data/app-topic-data";
import {
  getTileQuiz,
  getTileStudy,
  getTopicQuiz,
  tileStudyData,
} from "../../data/app-topic-detail-data";

const { width: screenWidth } = Dimensions.get("window");
const SPACING = 20;

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

// This looks bad. Why carousal should figure out data. It should get what is required and it should passon what it has
const getSystemDesignTopicData = (id) => {
  // This will be a DB/Cache/Elastic-Search call ideally
  return systemDesignTopics.find((topic) => topic.id === id) || null;
};

const getPsychologyTopicData = (parentId) => {
  // This will be a DB/Cache/Elastic-Search call ideally
  return psychologyTopics.filter(
    (topic) => topic.parentIds.indexOf(parentId) >= 0
  );
};

const CarouselItem = React.memo(
  ({ item, imageWidth, imageHeight, navigation }) => {
    const imageSource = getImageSource(item);
    const hasMetadata = containsMetadata(item);

    function pressHandler() {
      if (item.id) {
        console.log("carousal data - " + JSON.stringify(item));
        switch (item.type) {
          case "STUDY":
            const studyData =
              typeof item.parentId === "undefined"
                ? getTileStudy(item.id)
                : getTopicData(item.parentId);
            navigation.navigate("Apprec8Reader", { data: studyData });
            break;
          case "COURSE":
            const data = getTopicData(item.id);
            data.map((d) => console.log(d.title));
            navigation.navigate("LinkScreen", { data });
            break;
          case "QUIZ":
            console.log("QUIZ item parent: " + item.parentId);
            console.log("QUIZ id: " + item.id);
            const quizData =
              typeof item.parentId === "undefined"
                ? getTileQuiz(item.id)
                : getTopicQuiz(item.parentId);
            console.log(quizData.quizItems.map((quiz) => quiz.id));
            navigation.navigate("Quiz", { data: quizData.quizItems });
            // if (typeof item.parentId === "undefined") { dog-quiz-1
            //   console.log("parentId is undefined or not declared");
            //   const tileStudyData = getTileStudy(item.id);
            // } else {
            // }
            break;
          default:
            console.error("!!!!! Not a Valid Type !!!!!! " + item.type);
        }
      }
    }

    return (
      <Pressable
        onPress={pressHandler}
        style={({ pressed }) => [
          styles.viewAllButton,
          { opacity: pressed ? 0.7 : 1 }, // Manual opacity effect
        ]}
      >
        <View style={[styles.carousalItemContainer, { width: imageWidth }]}>
          {imageSource ? (
            <Image
              source={imageSource}
              style={{
                width: imageWidth,
                height: imageHeight,
                borderRadius: 10, // Ensure image has rounded corners
                resizeMode: "stretch",
              }}
            />
          ) : (
            <View
              style={[
                styles.imagePlaceholder,
                { width: imageWidth, height: imageHeight, borderRadius: 10 },
              ]}
            />
          )}

          {/* Metadata Section Below Image */}
          {hasMetadata && (
            <View style={styles.metadataContainer}>
              {item.title && <Text style={styles.itemTitle}>{item.title}</Text>}
              <Text style={styles.metaText}>
                {item.subtitle && `${item.subtitle} • `}
                {item.duration && `${item.duration}`}
              </Text>
              {item.author && (
                <Text style={styles.metaText}>{item.author}</Text>
              )}
            </View>
          )}
        </View>
      </Pressable>
    );
  }
);

const CustomCarousel = ({
  title,
  data = [],
  navigation,
  autoPlay = false,
  interval = 3000,
  viewAllScreen,
  customWidth = 80,
  customHeight = 240,
  pagination = false,
}) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageWidth = (screenWidth * customWidth) / 100;
  const imageHeight = customHeight;

  useEffect(() => {
    if (autoPlay && data.length > 1) {
      const intervalId = setInterval(() => scrollToNext(), interval);
      return () => clearInterval(intervalId);
    }
  }, [autoPlay, data.length, interval]);

  const scrollToNext = useCallback(() => {
    if (!flatListRef.current || data.length === 0) return;
    let nextIndex = (currentIndex + 1) % data.length;
    flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    setCurrentIndex(nextIndex);
  }, [currentIndex, data.length]);

  const handleScroll = useCallback(
    (event) => {
      const newIndex = Math.round(
        event.nativeEvent.contentOffset.x / (imageWidth + SPACING)
      );
      if (newIndex !== currentIndex && newIndex < data.length)
        setCurrentIndex(newIndex);
    },
    [currentIndex, data.length, imageWidth]
  );

  return (
    <View style={styles.carouselWrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {viewAllScreen && (
          <TouchableOpacity onPress={() => navigation.navigate(DummyScreen)}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingHorizontal: SPACING / 2 }}
        renderItem={({ item }) => (
          <CarouselItem
            item={item}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            navigation={navigation}
          />
        )}
        snapToInterval={imageWidth + SPACING / 2}
        decelerationRate="fast"
        snapToAlignment="start"
        onScroll={handleScroll}
        getItemLayout={(data, index) => ({
          length: imageWidth + SPACING / 2,
          offset: (imageWidth + SPACING / 2) * index,
          index,
        })}
        scrollEventThrottle={16}
      />
      {pagination && data.length > 1 && (
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

const styles = StyleSheet.create({
  carousalItemContainer: {
    marginRight: SPACING / 2,
    borderRadius: 10, // Ensure parent container has rounded edges
    overflow: "hidden", // This makes sure child elements don't break the border radius
  },
  imagePlaceholder: {
    backgroundColor: "grey",
  },
  itemTitle: {
    fontWeight: "bold",
    color: Colors.primaryWhite,
    fontSize: 12,
  },
  metaText: {
    fontSize: 11,
    color: Colors.primaryWhite,
    marginTop: 2,
  },
  carouselWrapper: {
    marginVertical: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  title: { fontSize: 18, fontWeight: "bold", color: Colors.primaryWhite },
  viewAll: { fontSize: 12, color: Colors.primaryWhite },
  imagePlaceholder: { backgroundColor: "grey" },
  metadataContainer: { padding: 5, backgroundColor: "transparent" },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: { backgroundColor: Colors.primaryWhite },
});

export default CustomCarousel;

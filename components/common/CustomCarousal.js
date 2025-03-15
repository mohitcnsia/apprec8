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
} from "react-native";
import { Colors } from "../../config/colors";

const { width: screenWidth } = Dimensions.get("window");
const SPACING = 20;

const getImageSource = (item) => {
  if (!item) return null;
  if (typeof item === "string") return { uri: item };
  if (typeof item === "number") return item;
  if (item.image)
    return typeof item.image === "number" ? item.image : { uri: item.image };
  return null;
};

const CarouselItem = React.memo(({ item, imageWidth, imageHeight }) => {
  const imageSource = getImageSource(item);
  return (
    <View
      style={[styles.itemContainer, { width: imageWidth, height: imageHeight }]}
    >
      {imageSource ? (
        <Image
          source={imageSource}
          style={[
            styles.imageStyle,
            {
              width: imageWidth,
              height: item.name ? imageHeight * 0.75 : imageHeight,
            },
          ]}
        />
      ) : (
        <View style={[styles.placeholder, { height: imageHeight }]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      {item.name && (
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.metaText}>
            {item.duration && `⏳ ${item.duration} `}
            {item.type && `📖 ${item.type} `}
            {item.author && `✍ ${item.author}`}
          </Text>
        </View>
      )}
    </View>
  );
});

const CustomCarousel = ({
  title,
  data = [],
  autoPlay = false,
  interval = 3000,
  viewAllScreen,
  customWidth = 80,
  customHeight = 240,
  pagination = false,
}) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();

  const handleNavigation = useCallback(() => {
    if (
      viewAllScreen &&
      navigation.getState().routes.every((r) => r.name !== viewAllScreen)
    ) {
      navigation.navigate(viewAllScreen);
    }
  }, [navigation, viewAllScreen]);

  const imageWidth = (screenWidth * customWidth) / 100;
  const imageHeight = customHeight;

  useEffect(() => {
    if (autoPlay && data.length > 1) {
      const intervalId = setInterval(() => {
        scrollToNext();
      }, interval);
      return () => clearInterval(intervalId);
    }
  }, [autoPlay, data.length, interval]);

  const scrollToNext = useCallback(() => {
    if (!flatListRef.current || data.length === 0) return;

    let nextIndex = (currentIndex + 1) % data.length;
    flatListRef.current.scrollToIndex({
      index: nextIndex,
      animated: true,
    });
    setCurrentIndex(nextIndex);
  }, [currentIndex, data.length]);

  const handleScroll = useCallback(
    (event) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const newIndex = Math.round(contentOffsetX / (imageWidth + SPACING));

      if (newIndex !== currentIndex && newIndex < data.length) {
        setCurrentIndex(newIndex);
      }
    },
    [currentIndex, data.length, imageWidth]
  );

  return (
    <View style={styles.carouselWrapper}>
      {/* Title & View All */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {viewAllScreen && (
          <TouchableOpacity onPress={handleNavigation}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* FlatList Carousel */}
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

      {/* Pagination Dots */}
      {pagination && data.length > 1 && (
        <View style={styles.paginationContainer}>
          {data.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : {},
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primaryWhite,
  },
  viewAll: {
    fontSize: 12,
    color: Colors.primaryWhite,
  },
  itemContainer: {
    marginRight: SPACING / 2,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
  imageStyle: {
    width: "100%",
  },
  textContainer: {
    padding: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    height: "25%",
  },
  itemTitle: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 16,
  },
  metaText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: Colors.primaryDarkMaroon,
  },
  placeholder: {
    backgroundColor: "#B0C4DE",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  placeholderText: {
    color: "#555",
  },
});

export default CustomCarousel;

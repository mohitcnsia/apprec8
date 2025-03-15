import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState, useEffect } from "react";
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

const CustomCarousel = ({
  title,
  data,
  autoPlay = false,
  interval = 3000,
  viewAllScreen,
  customWidth = 100, // Percentage-based width (defaults to full screen width)
  customHeight = 240, // Default height
}) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();

  // Calculate image width dynamically based on percentage
  const imageWidth = (screenWidth * customWidth) / 100 - SPACING * 2;

  // Auto-scroll effect
  useEffect(() => {
    if (autoPlay) {
      const intervalId = setInterval(() => {
        if (flatListRef.current) {
          const nextIndex = (currentIndex + 1) % data.length;
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
          setCurrentIndex(nextIndex);
        }
      }, interval);
      return () => clearInterval(intervalId);
    }
  }, [autoPlay, currentIndex, data.length, interval]);

  // Handles manual scrolling
  const handleScroll = (event) => {
    const newIndex = Math.round(
      event.nativeEvent.contentOffset.x / (imageWidth + SPACING)
    );
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.carouselWrapper}>
      {/* Title and View All */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate(viewAllScreen)}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingHorizontal: SPACING }}
          renderItem={({ item }) => (
            <View style={{ width: imageWidth, marginRight: SPACING }}>
              <Image
                source={typeof item === "string" ? { uri: item } : item}
                style={{
                  width: "100%",
                  height: customHeight,
                  borderRadius: 10,
                }}
              />
            </View>
          )}
          snapToInterval={imageWidth + SPACING} // Ensures smooth scroll
          decelerationRate="fast"
          snapToAlignment="start"
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />

        {/* Pagination Dots */}
        {/* <View style={styles.paginationContainer}>
          {data.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : {},
              ]}
            />
          ))}
        </View> */}
      </View>
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
  carouselContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
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
});

export default CustomCarousel;

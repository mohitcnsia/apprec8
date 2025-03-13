import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
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

const { width } = Dimensions.get("window");

const CustomCarousel = ({
  title,
  data,
  autoPlay = false,
  interval = 3000,
  viewAllAcreen,
}) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();

  // Auto-scroll effect
  React.useEffect(() => {
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
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
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
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.9} style={styles.slide}>
              <Image source={{ uri: item }} style={styles.image} />
            </TouchableOpacity>
          )}
        />
        {/* Pagination Dots */}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselWrapper: { marginVertical: 10 },
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
  slide: {
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width * 0.9,
    height: 200,
    borderRadius: 10,
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
    backgroundColor: "gray",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "blue",
  },
});

export default CustomCarousel;

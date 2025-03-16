import { ScrollView, StyleSheet, Text, View } from "react-native";
import CustomCarousel from "../../components/common/CustomCarousal";
import { THOUGHTS } from "../../data/thoughts";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors";
import KidsThoughtOfTheDay from "../../components/thought/KidsThoughtOfTheDay";
import { bookSummaryTiles, storyTiles } from "../../data/app-tiles-data";

function Home({ navigation }) {
  const getThoughtOfTheDay = () => {
    return THOUGHTS[1];
  };

  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <KidsThoughtOfTheDay thought={getThoughtOfTheDay()} />
        <CustomCarousel
          title="Stories"
          data={storyTiles}
          navigation={navigation}
          customWidth={50}
          customHeight={180}
        />
        <CustomCarousel
          title="Book Summaries"
          data={bookSummaryTiles}
          navigation={navigation}
          customWidth={50}
          customHeight={180}
        />
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

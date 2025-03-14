import { ScrollView, StyleSheet, Text, View } from "react-native";
import CustomCarousel from "../../components/common/CustomCarousal";
import { imageSet1, imageSet2 } from "../../data/dummy-carousal";
import { THOUGHTS } from "../../data/thoughts";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors";
import KidsThoughtOfTheDay from "../../components/thought/KidsThoughtOfTheDay";
import CalmThought from "../../components/thought/CalmThough";

function Home() {
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
        <CustomCarousel title="Leaders" data={imageSet2} itemWidth={300} />
        <CustomCarousel title="Featured" data={imageSet1} loop />
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

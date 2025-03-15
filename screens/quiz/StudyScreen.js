import { ScrollView, StyleSheet, Text, View } from "react-native";
import CustomCarousel from "../../components/common/CustomCarousal";
import { leaders, olympiad, random } from "../../data/dummy-carousal";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors";

function StudyScreen() {
  console.log("rending Study");
  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <CustomCarousel
          title="Olympiad"
          data={olympiad}
          customWidth={40}
          customHeight={100}
        />
        <CustomCarousel
          title="My Quizzes"
          data={random}
          customWidth={40}
          customHeight={100}
        />
        <CustomCarousel
          title="My Classrooms"
          data={leaders}
          customWidth={40}
          customHeight={100}
        />
        <CustomCarousel
          title="My Favourites"
          data={leaders}
          customWidth={40}
          customHeight={100}
        />
      </ScrollView>
    </LinearGradient>
  );
}

export default StudyScreen;

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

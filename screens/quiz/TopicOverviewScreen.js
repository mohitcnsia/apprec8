import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { TOPICS } from "../../data/topic-data";
import QuizButton from "../../components/quiz/QuizButton";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors";

const { height } = Dimensions.get("window"); // Get screen height

function TopicOverviewScreen({ route, navigation }) {
  const topicId = route.params.topicId;

  const displayTopic = TOPICS.filter((topic) => {
    return topic.id === topicId;
  });

  function renderTopicItem(itemData) {
    return (
      <View style={styles.topicContainer}>
        {/* Title - Fixed */}
        <Text style={styles.title}>{itemData.item.title}</Text>

        {/* Scrollable Description - Takes 70% height */}
        <View style={styles.descriptionWrapper}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.description}>{itemData.item.description}</Text>
          </ScrollView>
        </View>

        {/* Start Quiz Button - Fixed at the bottom */}
        <View style={styles.buttonContainer}>
          <QuizButton
            label="Start Quiz"
            handlePress={() =>
              navigation.navigate("Quiz", { itemId: itemData.item.id })
            }
          />
        </View>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <FlatList
        data={displayTopic}
        keyExtractor={(item) => item.id}
        renderItem={renderTopicItem}
      />
    </LinearGradient>
  );
}

export default TopicOverviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  topicContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primaryLightYellow,
    textAlign: "center",
    marginBottom: 20,
  },
  descriptionWrapper: {
    height: height * 0.6, // 70% of screen height for description
    marginBottom: 20, // Small space before button
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  description: {
    fontSize: 18,
    color: Colors.primaryBrightYellow,
    lineHeight: 28,
    textAlign: "justify",
    marginBottom: 20,
  },
  buttonContainer: {
    position: "absolute", // Fix the button at the bottom
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 20, // Make sure there's some padding at the bottom for the button
  },
});

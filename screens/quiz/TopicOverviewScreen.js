import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { TOPICS } from "../../data/topic-data";
import TopicItem from "../../components/TopicItem";
import QuizButton from "../../components/quiz/QuizButton";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors";

function TopicOverviewScreen({ route, navigation }) {
  const topicId = route.params.topicId;

  const displayTopic = TOPICS.filter((topic) => {
    return topic.id === topicId;
  });

  // function renderTopicItem(itemData) {
  //   return (
  //     <View>
  //       <TopicItem
  //         style={styles.title}
  //         title={itemData.item.title}
  //         description={itemData.item.description}
  //       />
  //       <QuizButton
  //         label="Start Quiz"
  //         handlePress={() => navigation.navigate("Quiz")}
  //       />
  //     </View>
  //   );
  // }

  function renderTopicItem(itemData) {
    return (
      <View style={styles.topicContainer}>
        <Text style={styles.title}>{itemData.item.title}</Text>

        {/* Scrollable Description */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.description}>{itemData.item.description}</Text>
        </ScrollView>

        {/* Button */}
        <QuizButton
          label="Start Quiz"
          handlePress={() => navigation.navigate("Quiz")}
        />
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
  scrollContainer: {
    paddingBottom: 20,
  },
  description: {
    fontSize: 18,
    color: Colors.primaryBrightYellow, // Dark gray color for text
    lineHeight: 28, // Line height for better readability
    textAlign: "justify", // Justified text for clean blocks
    marginBottom: 20, // Space between paragraphs
    paddingHorizontal: 10, // Padding on sides
  },
});

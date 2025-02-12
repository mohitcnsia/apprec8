import { FlatList, StyleSheet, Text, View } from "react-native";
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

  function handleStartQuiz() {
    console.log("Will navigate to Quiz Screen");
  }

  function renderTopicItem(itemData) {
    return (
      <View>
        <TopicItem
          title={itemData.item.title}
          description={itemData.item.description}
        />
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
});

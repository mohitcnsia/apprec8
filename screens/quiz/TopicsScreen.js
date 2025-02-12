import { FlatList, StyleSheet, View } from "react-native";
import TopicGridTile from "../../components/quiz/TopicGridTile";
import { CATEGORIES } from "../../data/topic-data";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors";

function TopicsScreen({ navigation }) {
  function renderCategoryItem(itemData) {
    function pressHandler() {
      navigation.navigate("Topic Overview", {
        topicId: itemData.item.id,
      });
    }

    return (
      <TopicGridTile
        title={itemData.item.title}
        color={itemData.item.color}
        onPress={pressHandler}
      />
    );
  }

  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoryItem}
        numColumns={2}
      />
    </LinearGradient>
  );
}

export default TopicsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

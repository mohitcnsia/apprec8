import { Text, View } from "react-native";

function TopicItem({ title, description }) {
  return (
    <View>
      <Text>{title}</Text>
      <Text>{description}</Text>
    </View>
  );
}

export default TopicItem;

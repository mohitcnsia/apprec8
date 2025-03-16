import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const DummyLinksScreen = ({ route, navigation }) => {
  const { item } = route.params;

  const handleLinkPress = (link) => {
    // Navigate to another screen based on the link's type (e.g., navigate to a custom reader)
    navigation.navigate("CustomReader", { item: { title: link } });
  };

  return (
    <View>
      <Text>Complex Item: {item.title}</Text>
      {/* Render multiple links here */}
      <TouchableOpacity onPress={() => handleLinkPress("Link 1")}>
        <Text>Link 1</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleLinkPress("Link 2")}>
        <Text>Link 2</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DummyLinksScreen;

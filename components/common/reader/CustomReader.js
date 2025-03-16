import React from "react";
import { View, Text } from "react-native";

const CustomReader = ({ route }) => {
  const { item } = route.params;

  return (
    <View>
      <Text>Reading Blog in CustomReader: {item.title}</Text>
      {/* Render blog content based on the item */}
    </View>
  );
};

export default CustomReader;

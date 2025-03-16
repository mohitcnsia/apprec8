import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const MyCarousal = ({ navigation }) => {
  const carousalItems = [
    { id: 1, type: "STUDY", title: "Study Item 1" },
    { id: 2, type: "COMPLEX", title: "Complex Item 1" },
    // More items
  ];

  const handleItemPress = (item) => {
    if (item.type === "STUDY") {
      // Navigate to the CustomReader if it's a STUDY item
      navigation.navigate("CustomReader", { item });
    } else if (item.type === "COMPLEX") {
      // Navigate to the LinksScreen if it's a COMPLEX item
      navigation.navigate("LinksScreen", { item });
    }
  };

  return (
    <View>
      {carousalItems.map((item) => (
        <TouchableOpacity key={item.id} onPress={() => handleItemPress(item)}>
          <Text>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default MyCarousal;

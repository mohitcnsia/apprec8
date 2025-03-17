import React from "react";
import AppFlatList from "../components/common/list/AppFlatList";

const LinksScreen = ({ route, navigation }) => {
  const data = route?.params?.data || [];

  const handleLinkPress = (link) => {
    console.log("You pressed: " + link.title);
    // navigation.navigate("LinkScreen", { item: { title: link } });
  };

  return (
    <AppFlatList data={data} isPressable={true} onItemPress={handleLinkPress} />
  );
};

export default LinksScreen;

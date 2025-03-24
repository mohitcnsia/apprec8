import React, { useEffect } from "react";
import AppFlatList from "../components/common/list/AppFlatList";

const LinksScreen = ({ route, navigation }) => {
  const data = route?.params?.data || [];
  const screenTitle = route?.params?.title || "Links";

  const handleLinkPress = (link) => {
    console.log("You pressed: " + link.title);
    navigation.navigate(link.id, { title: link.title });
  };

  return (
    <AppFlatList data={data} isPressable={true} onItemPress={handleLinkPress} />
  );
};

export default LinksScreen;

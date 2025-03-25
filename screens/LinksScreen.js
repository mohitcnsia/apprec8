import React, { useEffect } from "react";
import AppFlatList from "../components/common/list/AppFlatList";

const LinksScreen = ({ route, navigation }) => {
  const data = route?.params?.data || [];
  const screenTitle = route?.params?.title || "Links";

  const handleLinkPress1 = (link) => {
    console.log("You pressed: " + link.title);
    navigation.navigate(link.id, { title: link.title });
  };

  const handleLinkPress = (link) => {
    const availableScreens = navigation.getState()?.routeNames || [];
    if (availableScreens.includes(link.id)) {
      // Navigate to the valid screen
      navigation.navigate(link.id, { title: link.title });
    } else {
      // Navigate to a fallback or dummy screen
      navigation.navigate("DummyScreen", {
        errorMessage: `Screen "${link.title}" not found.`,
      });
    }
  };

  return (
    <AppFlatList data={data} isPressable={true} onItemPress={handleLinkPress} />
  );
};

export default LinksScreen;

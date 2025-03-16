import React from "react";
import { View, Text, Button } from "react-native";
import MyCarousal from "../carousal/MyCarousel";

const MainScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Welcome to the Main Screen</Text>
      {/* Other components */}

      {/* Your CustomCarousel is used as part of this screen */}
      <MyCarousal navigation={navigation} />
    </View>
  );
};

export default MainScreen;

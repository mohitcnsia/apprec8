import { View, Text, StyleSheet } from "react-native";
import React from "react";
import AppFlatList from "./AppFlatList";
import { Colors } from "../../../config/colors";

export default function AppFlatListTester() {
  const myData = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "First Item",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Second Item",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Third Item",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d4th",
      title: "4th Item",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d5th",
      title: "5th Item",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d76th",
      title: "6th Item",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d7th2",
      title: "7th Item",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d8th",
      title: "8th Item",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29thd72",
      title: "9th Item",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29t10th",
      title: "10th Item",
    },
  ];

  return (
    <>
      {/* <AppFlatList
        data={myData}
        backgroundColor="black"
        textColor="white"
        containerStyle={{ paddingHorizontal: 10 }}
      /> */}

      {/* <AppFlatList
        data={myData}
        backgroundColor="red"
        textColor="white"
        isPressable={true}
        onItemPress={(item) => console.log("Pressed:", item.title)}
        containerStyle={{ marginVertical: 10 }}
      /> */}

      {/* Provide your own render imlementation */}
      {/* <AppFlatList
        data={myData}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "lightblue",
              padding: 15,
              borderRadius: 12,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {item.title}
            </Text>
            <Text style={{ color: "gray", marginTop: 5 }}>
              {item.description}
            </Text>
          </View>
        )}
      /> */}

      {/* <AppFlatList
        data={myData}
        backgroundColor="white"
        textColor="black"
        containerStyle={{ paddingBottom: 50 }}
        isPressable={true}
        onItemPress={(item) => console.log("Tapped on", item.title)}
        itemStyle={{ borderBottomWidth: 1, borderColor: "#ccc" }}
      /> */}

      <AppFlatList
        data={myData}
        containerStyle={styles.listContainer}
        itemStyle={styles.listItem}
        textStyle={styles.listItemText}
        isPressable={true}
        onItemPress={(item) => console.log("Tapped on", item.title)}
        activeOpacity={0.6} // Works on iOS
      />
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 100,
  },
  listItem: {
    borderBottomWidth: 1,
    shadowColor: Colors.primaryOrange,
    shadowOpacity: 0.9,
    elevation: 20,
  },
  listItemText: {
    color: Colors.primaryDarkMaroon,
  },
});

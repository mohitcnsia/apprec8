import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, Text, View } from "react-native";
import CategoriesScreen from "./screens/CategoriesScreen";
import { CATEGORIES } from "./data/dummy-data";

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

function renderCategoryItem(item) {
  return <CategoryGridTile title={item.title} color={item.color} />;
}

export default function App() {
  return (
    <FlatList
      data={CATEGORIES}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Item title={item.title} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {},
});

import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, Text, View } from "react-native";
import CategoriesScreen from "./screens/CategoriesScreen";

export default function App() {
  return <CategoriesScreen />;
}

const styles = StyleSheet.create({
  container: {},
});

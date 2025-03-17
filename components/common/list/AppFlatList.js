import React, { useMemo } from "react";
import {
  FlatList,
  View,
  Text,
  Pressable,
  Platform,
  StyleSheet,
} from "react-native";

/**
 * A highly customizable FlatList wrapper for rendering lists with configurable styles and behavior.
 *
 * @see {@link AppFlatListTester.js} - The related TestClass used for testing.
 *
 * @param {Object[]} data - The list of items to display. Each item should have a unique `id`.
 * @param {boolean} [isPressable=false] - If `true`, items become pressable.
 * @param {function} [onItemPress=() => {}] - Function triggered when an item is pressed.
 * @param {function} [renderItem] - Custom render function for list items. If not provided, a default renderer is used.
 * @param {Object} [containerStyle={}] - Custom styles for the FlatList container.
 * @param {Object} [itemStyle={}] - Custom styles for each list item.
 * @param {Object} [textStyle={}] - Custom styles for each list item text.
 * @param {number} [activeOpacity=0.6] - Controls the opacity effect when an item is pressed (iOS only).
 *
 * @example
 * <AppFlatList
 *   data={[{ id: "1", title: "Item 1" }, { id: "2", title: "Item 2" }]}
 *   isPressable={true}
 *   onItemPress={(item) => console.log("Pressed:", item.title)}
 *   containerStyle={{ padding: 10 }}
 *   itemStyle={{ borderRadius: 10, padding: 15 }}
 *   activeOpacity={0.8}
 *   rippleColor="blue"
 * />
 */

const AppFlatList = ({
  data = [],
  isPressable = false,
  onItemPress = () => {},
  renderItem,
  containerStyle = {},
  itemStyle = {},
  textStyle = {},
  activeOpacity = 0.6,
}) => {
  // Default item rendering (if no custom render function is provided)
  const defaultRenderItem = ({ item }) => {
    return (
      <Pressable
        onPress={() => onItemPress(item)}
        style={({ pressed }) => [
          {
            opacity: isPressable && pressed ? activeOpacity : 1,
          },
        ]}
      >
        <View style={[styles.itemStyle, itemStyle]}>
          <Text style={[styles.textStyle, textStyle]}>{item.title}</Text>
        </View>
      </Pressable>
    );
  };

  // Memoize the item renderer for performance
  const memoizedRenderItem = useMemo(
    () => renderItem || defaultRenderItem,
    [renderItem, isPressable, onItemPress, itemStyle, activeOpacity]
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={memoizedRenderItem}
      contentContainerStyle={containerStyle} // Custom List container styles
    />
  );
};

export default AppFlatList;

const styles = StyleSheet.create({
  itemStyle: {
    backgroundColor: "white",
    padding: 10,
    margin: 5,
    borderRadius: 8,
  },
  textStyle: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

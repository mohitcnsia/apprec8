// components/common/list/AppFlatList.js

import React, { useMemo } from "react";
import {
  FlatList,
  View,
  Text,
  Pressable,
  // Platform, // Not used
  StyleSheet,
} from "react-native";
import { useTheme } from "../../../context/ThemeContext"; // Import useTheme hook

/**
 * A highly customizable FlatList wrapper with themed default styles.
 *
 * @param {Object[]} data - The list of items to display. Each item should have a unique `id` and a `title`.
 * @param {boolean} [isPressable=false] - If `true`, items become pressable.
 * @param {function} [onItemPress=() => {}] - Function triggered when an item is pressed.
 * @param {function} [renderItem] - Custom render function for list items. Overrides the default renderer.
 * @param {Object|Function} [containerStyle={}] - Custom styles for the FlatList container's content.
 * @param {Object|Function} [itemStyle={}] - Custom styles applied to the item's wrapper View, overriding themed defaults. Can be a function receiving the item.
 * @param {Object|Function} [textStyle={}] - Custom styles applied to the item's Text component, overriding themed defaults. Can be a function receiving the item.
 * @param {number} [activeOpacity=0.6] - Controls the opacity effect when an item is pressed.
 */
const AppFlatList = ({
  data = [],
  isPressable = false,
  onItemPress = () => {},
  renderItem, // Custom render function prop
  containerStyle = {},
  itemStyle = {}, // Prop for overriding item style
  textStyle = {}, // Prop for overriding text style
  activeOpacity = 0.6,
}) => {
  const { theme } = useTheme(); // Use theme hook

  // --- Define Themed Default Styles Inside Component ---
  const defaultStyles = useMemo(
    () =>
      StyleSheet.create({
        itemStyle: {
          // Use theme colors for defaults
          backgroundColor: theme.cardBackground || "white",
          padding: 15, // Adjusted padding
          marginVertical: 6, // Adjusted margin
          marginHorizontal: 10, // Adjusted margin
          borderRadius: 8,
          // Add shadow/elevation based on theme if desired
          // elevation: 1,
          // shadowColor: theme.shadowColor,
        },
        textStyle: {
          // Use theme colors for defaults
          color: theme.textPrimary || "black",
          fontSize: 16,
        },
      }),
    [theme]
  ); // Depend on theme

  // --- Default Item Renderer (Defined Inside to Access Styles/Props) ---
  // This is used only if the 'renderItem' prop is NOT provided.
  const defaultRenderItem = ({ item }) => {
    // Calculate final styles by merging themed defaults with props
    const finalItemStyle = [
      defaultStyles.itemStyle, // Start with themed default
      typeof itemStyle === "function" ? itemStyle(item) : itemStyle, // Apply prop override
    ];
    const finalTextStyle = [
      defaultStyles.textStyle, // Start with themed default
      typeof textStyle === "function" ? textStyle(item) : textStyle, // Apply prop override
    ];

    // If item is not pressable, just render the View and Text
    if (!isPressable) {
      return (
        <View style={finalItemStyle}>
          <Text style={finalTextStyle}>{item.title}</Text>
        </View>
      );
    }

    // If item IS pressable, wrap with Pressable
    return (
      <Pressable
        onPress={() => onItemPress(item)}
        style={({ pressed }) => [
          { opacity: pressed ? activeOpacity : 1 }, // Apply pressed opacity
          // Note: finalItemStyle is applied to the inner View, not the Pressable itself
          // If you want Pressable to have the background/border, move finalItemStyle here.
        ]}
      >
        <View style={finalItemStyle}>
          <Text style={finalTextStyle}>{item.title}</Text>
        </View>
      </Pressable>
    );
  };

  // --- Memoize the Renderer to Use ---
  // Choose between the custom 'renderItem' prop or our themed 'defaultRenderItem'
  const memoizedRenderItem = useMemo(
    () => renderItem || defaultRenderItem,
    // Re-calculate only if the renderItem prop itself changes,
    // or if defaultRenderItem is used and its dependencies change
    // (defaultRenderItem implicitly depends on theme via defaultStyles, and props like isPressable etc.)
    // NOTE: The dependencies here ensure that if defaultRenderItem is used,
    // it gets re-memoized when things it *needs* change.
    [
      renderItem,
      defaultStyles,
      isPressable,
      onItemPress,
      itemStyle,
      textStyle,
      activeOpacity,
    ]
  );

  return (
    <FlatList
      data={data}
      // Use item.id if available, otherwise fall back to index
      keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
      renderItem={memoizedRenderItem} // Use the chosen renderer
      contentContainerStyle={containerStyle} // Apply custom container styles
      // Add other FlatList props as needed (e.g., ListHeaderComponent)
    />
  );
};

export default AppFlatList;

// Removed the external StyleSheet as defaults are now internal and themed.

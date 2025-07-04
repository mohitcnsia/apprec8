import React, { useMemo } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../../context/ThemeContext";

const GameHeader = ({ rightControls = [] }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  if (rightControls.length === 0) {
    return null;
  }

  return (
    <View style={styles.headerContainer}>
      {rightControls.map((control, index) => (
        <TouchableOpacity
          key={index}
          onPress={control.onPress}
          style={styles.iconButton}
        >
          <MaterialCommunityIcons
            name={control.iconName}
            size={control.size || 24}
            color={theme.primary}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    headerContainer: {
      flexDirection: "row",
      // FIX 1: Changed from 'flex-end' to 'space-around' for even spacing
      justifyContent: "space-around",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
      backgroundColor: theme.background,
    },
    iconButton: {
      padding: 8,
      // REMOVED: No longer need marginLeft as space-around handles it
    },
  });

export default GameHeader;

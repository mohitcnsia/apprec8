// screens/task/TaskDetails.js (or similar path)

import React, { useContext, useLayoutEffect, useMemo } from "react"; // Import useMemo
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// import { Colors } from "../../config/colors"; // Remove legacy Colors import
import { useTheme } from "../../context/ThemeContext"; // Import useTheme hook
import PrimaryButton from "../../components/PrimaryButton"; // Keep custom components
import IconButton from "../../components/ui/IconButton";
import { formatDate } from "../../components/utils/date";
import { TasksContext } from "../../store/tasks-context";

const TaskDetails = ({ route, navigation }) => {
  const { theme } = useTheme(); // Use the theme hook
  const data = route?.params?.data || {};
  const { updateTask, deleteTask } = useContext(TasksContext);

  // Date formatting (remains the same)
  const formattedDueDate = formatDate(new Date(data.dueDate));
  const formattedCreatedAt = formatDate(new Date(data.createdAt));
  const formattedLastUpdatedAt = formatDate(new Date(data.lastUpdatedAt));

  // --- Update Header Buttons with Themed Color ---
  useLayoutEffect(() => {
    navigation.setOptions({
      // Header style itself is likely controlled by the Navigator's screenOptions
      headerRight: () => (
        <View style={styles.headerView}>
          <IconButton
            icon="pencil"
            size={20}
            color={theme.headerTint || "#ffffff"} // Use themed header tint color
            onPress={() =>
              navigation.navigate("TaskEditor", {
                data: { ...data, dueDate: data.dueDate },
              })
            }
          />
          <IconButton
            icon="trash"
            size={20}
            color={theme.headerTint || "#ffffff"} // Use themed header tint color
            onPress={() => {
              Alert.alert(
                "Confirm Deletion",
                "Are you sure you want to delete this task?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "OK",
                    onPress: () => {
                      deleteTask(data.id);
                      navigation.goBack(); // Use goBack instead of navigate("Tasks") maybe?
                    },
                  },
                ],
                { cancelable: true }
              );
            }}
          />
        </View>
      ),
    });
    // Depend on theme object in case headerTint changes
  }, [navigation, data, deleteTask, theme]); // Added theme and styles dependency

  // --- Mark Completed Handler (remains the same) ---
  const markCompletedHandler = () => {
    const updatedTask = { ...data, completed: true };
    updateTask(data.id, updatedTask);
    navigation.goBack(); // Go back after marking complete
  };

  // --- Define Styles Inside Component with useMemo ---
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          // Applied to LinearGradient
          flex: 1,
        },
        headerView: {
          // Style for grouping header buttons
          flexDirection: "row",
          marginRight: 10, // Add some margin if needed
        },
        scrollContainer: {
          margin: 20,
          paddingBottom: 40, // Ensure space for button if content is short
        },
        title: {
          // Use themed text color suitable for gradient
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          fontFamily: "deliusBold", // Keep font
          fontSize: 20, // Increased size
          textAlign: "center",
          fontWeight: "600",
          marginBottom: 15, // Added margin
        },
        detailsContainer: {
          padding: 10, // Added padding
          marginVertical: 10,
          alignItems: "center",
          backgroundColor: theme.cardBackgroundTransparent || "rgba(0,0,0,0.1)", // Subtle background
          borderRadius: 8, // Rounded corners
        },
        detailsText: {
          // Use themed text color suitable for gradient
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          fontFamily: "delius", // Keep font
          fontSize: 16,
          textAlign: "center",
          lineHeight: 24, // Improved line height
        },
        metaContainer: {
          paddingVertical: 6, // Adjusted padding
          alignItems: "center",
        },
        metaText: {
          // Use themed secondary text color suitable for gradient
          color:
            theme.textSecondaryOnGradient ||
            theme.primaryLightGray ||
            "#E0E0E0",
          fontFamily: "delius", // Use regular delius
          fontSize: 12, // Increased size slightly
        },
      }),
    [theme]
  ); // Depend on theme

  // --- RENDER ---
  return (
    // Apply themed gradient
    <LinearGradient
      colors={[
        theme.gradientStart || "#3b0940",
        theme.gradientEnd || "#d7d1d3",
      ]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View>
          <Text style={styles.title}>{data.title || "Task Details"}</Text>
        </View>

        {/* Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>
            {data.detail || "No details provided."}
          </Text>
        </View>

        {/* Meta Info */}
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>Due on: {formattedDueDate}</Text>
        </View>
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>Created: {formattedCreatedAt}</Text>
        </View>
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>
            Last Updated: {formattedLastUpdatedAt}
          </Text>
        </View>

        {/* Mark Completed Button (PrimaryButton assumed themed internally) */}
        {!data.completed && (
          <PrimaryButton
            onPress={markCompletedHandler}
            style={{ marginTop: 25 }}
          >
            Mark Completed
          </PrimaryButton>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default TaskDetails;

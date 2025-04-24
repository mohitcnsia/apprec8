// screens/task/Tasks.js (or similar path)

import { Alert, ScrollView, StyleSheet, Text, View } from "react-native"; // ScrollView not used directly here? Keep imports clean.
import React, { useContext, useLayoutEffect, useMemo } from "react"; // Import useMemo
import { LinearGradient } from "expo-linear-gradient";
// import { Colors } from "../../config/colors"; // Remove legacy Colors import
import { useTheme } from "../../context/ThemeContext"; // Import useTheme hook
import IconButton from "../../components/ui/IconButton";
import AppFlatList from "../../components/common/list/AppFlatList";
import { TasksContext } from "../../store/tasks-context";
import { formatDate } from "../../components/utils/date"; // Keep if needed, though not used directly here

// --- Main Content Component ---
const TasksScreenContent = ({ navigation }) => {
  const { theme } = useTheme(); // Use theme hook
  const taskContext = useContext(TasksContext);

  // --- Header Button ---
  useLayoutEffect(() => {
    navigation.setOptions({
      // Header styles likely set by Navigator's screenOptions
      headerRight: () => (
        <IconButton
          icon="add"
          size={24}
          color={theme.headerTint || "#ffffff"} // Use themed header tint color
          onPress={() => {
            navigation.navigate("TaskEditor"); // Navigate without params for new task
          }}
        />
      ),
    });
    // Depend on theme for headerTint
  }, [navigation, theme]);

  // --- Navigation Handler ---
  const handleLinkPress = (task) => {
    // Ensure date fields exist and are valid Date objects or null/undefined before conversion
    // TasksContext might store dates differently than route params did
    // Let's assume taskContext provides Date objects or ISO strings for dates
    const convertToISO = (date) => {
      if (date instanceof Date && !isNaN(date)) {
        return date.toISOString();
      }
      if (typeof date === "string") {
        // Attempt to parse if it's a string, otherwise return null
        const parsedDate = new Date(date);
        return !isNaN(parsedDate) ? parsedDate.toISOString() : null;
      }
      return null; // Handle other invalid types
    };

    const dueDateISO = convertToISO(task.dueDate); // Or task.dueAt if that's the field name
    const createdAtISO = convertToISO(task.createdAt);
    const lastUpdatedAtISO = convertToISO(task.lastUpdatedAt);

    navigation.navigate("TaskDetails", {
      data: {
        ...task,
        // Pass serialized dates (ISO strings) to the details screen
        dueDate: dueDateISO,
        createdAt: createdAtISO,
        lastUpdatedAt: lastUpdatedAtISO,
      },
    });
  };

  // --- Define Styles Inside Component with useMemo ---
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          // Applied to LinearGradient
          flex: 1,
          justifyContent: "center", // Center the 'noTask' text vertically
        },
        noTask: {
          // Use themed text color suitable for gradient
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          fontFamily: "delius", // Keep font
          fontSize: 18,
          textAlign: "center",
          paddingHorizontal: 20, // Add padding for centering text
        },
        // Style for regular task items (uses AppFlatList default text color)
        taskItem: {
          backgroundColor: theme.cardBackground || "white", // Themed card background
          padding: 15, // Adjusted padding
          marginVertical: 6,
          marginHorizontal: 10,
          borderRadius: 8,
          // Add shadow/elevation if needed
        },
        // Style for completed task items
        completedTask: {
          backgroundColor:
            theme.successBackground || theme.success + "30" || "lightgreen", // Themed success background (e.g., light green tint)
          padding: 15,
          marginVertical: 6,
          marginHorizontal: 10,
          borderRadius: 8,
          // Consider adding opacity or strikethrough via textStyle prop if desired
        },
        // Style for text inside completed tasks (if needed)
        completedTaskText: {
          color: theme.textOnSuccess || theme.textPrimary, // Ensure contrast
          // textDecorationLine: 'line-through', // Optional strikethrough
        },
        // Style for text inside regular tasks (uses AppFlatList default)
        taskItemText: {
          color: theme.textPrimary, // Default text color for regular items
        },
      }),
    [theme]
  ); // Depend on theme

  // --- Render Logic ---
  return (
    // Apply themed gradient
    <LinearGradient
      colors={[
        theme.gradientStart || "#3b0940",
        theme.gradientEnd || "#d7d1d3",
      ]}
      style={styles.container}
    >
      {taskContext?.tasks?.length > 0 ? (
        <AppFlatList
          data={taskContext.tasks}
          isPressable={true}
          onItemPress={handleLinkPress}
          // Pass a function to itemStyle to conditionally apply themed styles
          itemStyle={(task) =>
            task.completed ? styles.completedTask : styles.taskItem
          }
          // Conditionally set textStyle based on completion status for contrast
          textStyle={(task) =>
            task.completed ? styles.completedTaskText : styles.taskItemText
          }
          // Optional: Add padding to the list container itself
          // containerStyle={{ paddingTop: 10, paddingBottom: 10 }}
        />
      ) : (
        // Use themed style for "No Tasks" message
        <Text style={styles.noTask}>Yay !! You have no Tasks</Text>
      )}
    </LinearGradient>
  );
};

// Wrapper component remains the same
const Tasks = ({ navigation }) => {
  return <TasksScreenContent navigation={navigation} />;
};

export default Tasks;

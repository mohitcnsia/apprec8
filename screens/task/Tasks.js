// screens/task/Tasks.js

import React, {
  useContext,
  useLayoutEffect,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { Alert, StyleSheet, Text, View, ActivityIndicator } from "react-native"; // Removed ScrollView as it's not directly used
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import IconButton from "../../components/ui/IconButton";
import AppFlatList from "../../components/common/list/AppFlatList";
import { TasksContext } from "../../store/tasks-context";

const TasksScreenContent = ({ navigation }) => {
  const { theme } = useTheme();
  const taskContext = useContext(TasksContext);

  // Clear error from context when component mounts
  useEffect(() => {
    // Assuming clearError function exists in your context
    if (taskContext.clearError) {
      taskContext.clearError();
    }
  }, [taskContext.clearError]); // Added taskContext.clearError to dependency array

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="add"
          size={24}
          color={theme.headerTint || "#ffffff"}
          onPress={() => navigation.navigate("TaskEditor")} // Navigate without params for new task
        />
      ),
      // Ensure header is shown if it was globally hidden by navigator
      // This might be needed if ProfileNavigator still has headerShown: false globally
      // and you haven't overridden it for the "Tasks" screen in ProfileNavigator.js
      // headerShown: true,
      // title: "Tasks", // Or any title you prefer
    });
  }, [navigation, theme]);

  const convertToISO = useCallback((date) => {
    if (date instanceof Date && !isNaN(date)) {
      return date.toISOString();
    }
    if (typeof date === "string") {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate) ? parsedDate.toISOString() : null;
    }
    return null;
  }, []);

  const handleLinkPress = useCallback(
    (task) => {
      navigation.navigate("TaskDetails", {
        data: {
          ...task,
          dueDate: task.dueDate ? convertToISO(task.dueDate) : null,
          createdAt: task.createdAt ? convertToISO(task.createdAt) : null,
          lastUpdatedAt: task.lastUpdatedAt
            ? convertToISO(task.lastUpdatedAt)
            : null,
        },
      });
    },
    [navigation, convertToISO]
  );

  // Define styles, including new ones for overdue tasks
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, justifyContent: "center" },
        loadingOrErrorContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        },
        errorText: {
          color: theme.danger || "red",
          fontSize: 16,
          textAlign: "center",
          fontFamily: "delius",
        },
        noTask: {
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          fontFamily: "delius",
          fontSize: 18,
          textAlign: "center",
          paddingHorizontal: 20,
        },
        taskItem: {
          // Default style for active, non-overdue tasks
          backgroundColor: theme.cardBackground || "white",
          padding: 15,
          marginVertical: 6,
          marginHorizontal: 10,
          borderRadius: 8,
        },
        taskItemText: {
          // Default text for active, non-overdue
          color: theme.textPrimary || "black",
        },
        completedTask: {
          padding: 15,
          marginVertical: 6,
          marginHorizontal: 10,
          borderRadius: 8,
        },
        completedTaskText: {
          // Text for completed tasks
          color: theme.success || "#155724", // Darker green text
          textDecorationLine: "line-through", // Add strikethrough for completed tasks
        },
        overdueTask: {
          // Style for overdue tasks (red)
          backgroundColor: theme.dangerBackground || "#f8d7da", // Light red
          padding: 15,
          marginVertical: 6,
          marginHorizontal: 10,
          borderRadius: 8,
          // Optionally add a border
          // borderColor: theme.danger || 'red',
          // borderWidth: 1,
        },
        overdueTaskText: {
          // Text for overdue tasks
          color: theme.textOnDanger || theme.danger || "#721c24", // Darker red text
        },
      }),
    [theme]
  );

  // Helper function to check if a task is overdue
  const isTaskOverdue = (task) => {
    if (!task.dueDate || task.completed) {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to the beginning of the day for date-only comparison

    // Ensure task.dueDate is a Date object (it should be from context processing)
    const dueDate =
      task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
    if (isNaN(dueDate.getTime())) return false; // Invalid due date

    const normalizedDueDate = new Date(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate()
    );
    normalizedDueDate.setHours(0, 0, 0, 0); // Normalize due date to beginning of the day

    return today.getTime() > normalizedDueDate.getTime();
  };

  // Determine item style based on task status
  const getItemStyle = (task) => {
    if (task.completed) {
      return styles.completedTask;
    }
    if (isTaskOverdue(task)) {
      return styles.overdueTask;
    }
    return styles.taskItem;
  };

  // Determine text style based on task status
  const getTextStyle = (task) => {
    if (task.completed) {
      return styles.completedTaskText;
    }
    if (isTaskOverdue(task)) {
      return styles.overdueTaskText;
    }
    return styles.taskItemText;
  };

  if (taskContext.isLoading && taskContext.tasks.length === 0) {
    return (
      <LinearGradient
        colors={[
          theme.gradientStart || "#3b0940",
          theme.gradientEnd || "#d7d1d3",
        ]}
        style={styles.container}
      >
        <View style={styles.loadingOrErrorContainer}>
          <ActivityIndicator
            size="large"
            color={theme.primaryWhite || "#FFFFFF"}
          />
          <Text style={styles.noTask}>Loading Tasks...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (taskContext.error && taskContext.tasks.length === 0) {
    return (
      <LinearGradient
        colors={[
          theme.gradientStart || "#3b0940",
          theme.gradientEnd || "#d7d1d3",
        ]}
        style={styles.container}
      >
        <View style={styles.loadingOrErrorContainer}>
          <Text style={styles.errorText}>Error: {taskContext.error}</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[
        theme.gradientStart || "#3b0940",
        theme.gradientEnd || "#d7d1d3",
      ]}
      style={styles.container}
    >
      {taskContext.tasks?.length > 0 ? (
        <AppFlatList
          data={taskContext.tasks}
          isPressable={true}
          onItemPress={handleLinkPress}
          itemStyle={getItemStyle} // Pass the function to determine style
          textStyle={getTextStyle} // Pass the function to determine text style
        />
      ) : (
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

// screens/task/Tasks.js

import React, { useContext, useMemo, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity, // Using TouchableOpacity for FAB
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppFlatList from "../../components/common/list/AppFlatList";
import { TasksContext } from "../../store/tasks-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const TasksScreenContent = () => {
  const { theme } = useTheme();
  const { tasks, isLoading, error, clearError } = useContext(TasksContext);
  const navigation = useNavigation();

  useEffect(() => {
    console.log("TASKS_SCREEN_CONTENT_EFFECT: Theme for FAB:", {
      bg: theme.fabBackground,
      icon: theme.fabIconColor,
      // TouchableOpacity doesn't have a separate "pressed background" prop like Pressable's style function.
      // Its feedback is primarily through activeOpacity.
    });
  }, [theme]);

  useFocusEffect(
    /* ... same focus effect logging ... */ useCallback(() => {
      console.log("TASKS_SCREEN_CONTENT: Focused. Nav:", navigation);
      if (error && clearError) {
      }
      return () => {};
    }, [navigation, error, clearError])
  );
  const convertToISO = useCallback((date) => {
    /* ... same ... */ if (date instanceof Date && !isNaN(date))
      return date.toISOString();
    if (typeof date === "string") {
      const pd = new Date(date);
      return !isNaN(pd) ? pd.toISOString() : null;
    }
    return null;
  }, []);
  const handleLinkPress = useCallback(
    (task) => {
      /* ... same ... */ if (
        !navigation ||
        typeof navigation.navigate !== "function"
      ) {
        Alert.alert("Nav Error", "Cannot open details.");
        return;
      }
      try {
        navigation.navigate("TaskDetails", {
          data: {
            ...task,
            dueDate: convertToISO(task.dueDate),
            createdAt: convertToISO(task.createdAt),
            lastUpdatedAt: convertToISO(task.lastUpdatedAt),
          },
        });
      } catch (e) {
        Alert.alert("Nav Error", "Failed to open details: " + e.message);
      }
    },
    [navigation, convertToISO]
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: {
          flex: 1,
          backgroundColor: theme.gradientStart || "#3b0940",
        },
        container: { flex: 1 },
        contentContainer: {
          flex: 1,
          paddingTop: Platform.OS === "android" ? 10 : 0,
        },
        centeredMessageContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        },
        messageText: {
          fontFamily: "delius",
          fontSize: 18,
          textAlign: "center",
          color: theme.textPrimaryOnGradient || "#FFFFFF",
        },
        errorText: {
          color: theme.danger || "#c86c62",
          fontSize: 16,
          fontFamily: "delius",
          textAlign: "center",
          marginBottom: 10,
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
        },
        overdueTaskText: {
          color: theme.textOnDanger || theme.danger || "#c86c62",
          fontFamily: "delius",
        },
        fabStyle: {
          // Renamed to avoid confusion if styles.fab existed for Pressable
          position: "absolute",
          right: 20,
          bottom: Platform.OS === "ios" ? 40 : 30,
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          elevation: 8,
          shadowColor: theme.shadowColor || "#000000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          zIndex: 1,
          backgroundColor:
            theme.fabBackground ||
            (theme.mode === "dark" ? "#f0b0f0" : "#3b0940"),
        },
      }),
    [theme]
  );

  const isTaskOverdue = useCallback((task) => {
    /* ... same ... */ if (!task.dueDate || task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate =
      task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
    if (isNaN(dueDate.getTime())) return false;
    const norm = new Date(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate()
    );
    return today.getTime() > norm.getTime();
  }, []);
  const currentGetItemStyle = useCallback(
    (task) => {
      if (task.completed) return styles.completedTask;
      if (isTaskOverdue(task)) return styles.overdueTask;
      return styles.taskItem;
    },
    [styles, isTaskOverdue]
  );
  const currentGetTextStyle = useCallback(
    (task) => {
      if (task.completed) return styles.completedTaskText;
      if (isTaskOverdue(task)) return styles.overdueTaskText;
      return styles.taskItemText;
    },
    [styles, isTaskOverdue]
  );
  const renderMainContent = () => {
    /* ... same ... */ if (isLoading && tasks.length === 0) {
      return (
        <View style={styles.centeredMessageContainer}>
          <ActivityIndicator
            size="large"
            color={theme.primaryWhite || "#FFFFFF"}
          />
          <Text style={[styles.messageText, { marginTop: 10 }]}>
            Loading Tasks...
          </Text>
        </View>
      );
    }
    if (error && tasks.length === 0 && !isLoading) {
      return (
        <View style={styles.centeredMessageContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Text style={styles.messageText}>Could not load tasks.</Text>
        </View>
      );
    }
    if (tasks?.length > 0) {
      if (!AppFlatList) {
        console.error(
          "TASKS_SCREEN_CONTENT: AppFlatList component is undefined!"
        );
        return (
          <Text style={styles.errorText}>
            Error: List display component failed to load.
          </Text>
        );
      }
      return (
        <AppFlatList
          data={tasks}
          isPressable={true}
          onItemPress={handleLinkPress}
          itemStyle={currentGetItemStyle}
          textStyle={currentGetTextStyle}
          keyExtractor={(item) => item.id.toString()}
        />
      );
    }
    if (!isLoading && !error && tasks.length === 0) {
      return (
        <View style={styles.centeredMessageContainer}>
          <Text style={styles.messageText}>Yay !! You have no Tasks</Text>
        </View>
      );
    }
    return null;
  };
  const handleFabPress = useCallback(() => {
    /* ... same with logging ... */ console.log("TASKS_SCREEN_FAB: Pressed!");
    if (navigation && typeof navigation.navigate === "function") {
      try {
        navigation.navigate("TaskEditor");
      } catch (e) {
        Alert.alert("Nav Error", `Error: ${e.message}`);
      }
    } else {
      Alert.alert("Nav Issue", "Cannot navigate.");
    }
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[
          theme.gradientStart || "#3b0940",
          theme.gradientEnd || "#d7d1d3",
        ]}
        style={styles.container}
      >
        <View style={styles.contentContainer}>{renderMainContent()}</View>

        <TouchableOpacity
          style={styles.fabStyle} // Use the style object for TouchableOpacity
          onPress={handleFabPress}
          activeOpacity={0.7} // Standard opacity feedback for TouchableOpacity
        >
          <Ionicons
            name="add"
            size={30}
            color={
              theme.fabIconColor ||
              (theme.mode === "dark" ? "#3b0940" : "#ffffff")
            }
          />
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

const Tasks = () => {
  return <TasksScreenContent />;
};

export default Tasks;

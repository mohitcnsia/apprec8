// screens/task/TaskEditor.js

import React, {
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  Switch,
  ActivityIndicator,
  SafeAreaView, // For safe area handling
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext"; // <<< ENSURED useTheme IS IMPORTED
import Input from "../../components/input/Input";
import PrimaryButton from "../../components/PrimaryButton";
import Ionicons from "@expo/vector-icons/Ionicons"; // For custom back button
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate, getDatePlusDays } from "../../components/utils/date"; // Ensure getDatePlusDays is imported
import { TasksContext } from "../../store/tasks-context";
import { APPREC8_TEAM_REVIEWER_UID } from "../../config/appConfig";
import { authInstance } from "../../config/firebaseConfig";
import { useFocusEffect, useNavigation } from "@react-navigation/native"; // useNavigation can be fallback if prop not preferred

const TaskEditor = ({ route, navigation: propNavigation }) => {
  // Renamed prop to avoid conflict if useNavigation is primary
  const { theme, isDark } = useTheme();
  const { isLoading, error, addTask, updateTask, clearError } =
    useContext(TasksContext);
  const currentUser = authInstance.currentUser;

  // Prefer prop navigation, but use hook as fallback if prop isn't passed (though it should be by StackNavigator)
  const navigation = propNavigation || useNavigation();

  const existingTaskData = route?.params?.data;

  // Function to get default due date (7 days from now)
  const getDefaultDueDate = useCallback(() => {
    const today = new Date();
    return getDatePlusDays(today, 7);
  }, []); // No dependencies, or add getDatePlusDays if it were from context/props

  // Initialize formData state
  const [formData, setFormData] = useState(() => ({
    // Use function form for useState to compute initial state once
    id: existingTaskData?.id || "",
    title: existingTaskData?.title || "",
    detail: existingTaskData?.detail || "",
    dueDate: existingTaskData?.dueDate
      ? new Date(existingTaskData.dueDate)
      : getDefaultDueDate(),
    completed: existingTaskData?.completed || false,
    assignToTeam:
      existingTaskData?.assignedTeamReviewerUid === APPREC8_TEAM_REVIEWER_UID ||
      false,
  }));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const editorTitle = formData.id ? "Edit Task" : "Add New Task";

  // Clear error from context when component mounts or if existingTaskData changes
  useEffect(() => {
    if (clearError) {
      clearError();
    }
  }, [clearError, existingTaskData]);

  useFocusEffect(
    useCallback(() => {
      console.log("TASK_EDITOR: Focused. Navigation object:", navigation);
      if (error && clearError) {
        // Example: Alert.alert("Task Editor Note", `Previous error: ${error}`);
        // clearError();
      }
      return () => {
        // console.log('TASK_EDITOR: Unfocused.');
      };
    }, [navigation, error, clearError])
  );

  const inputChangeHandler = useCallback((key, value) => {
    setFormData((prevState) => ({ ...prevState, [key]: value }));
  }, []);

  const handleDateChange = useCallback(
    (event, selectedDate) => {
      const currentDate = selectedDate || formData.dueDate;
      if (Platform.OS === "android") {
        setShowDatePicker(false);
      }
      // For iOS, picker might stay open until "Done" is pressed.
      // We update the date immediately if a new one is selected.
      if (selectedDate) {
        // Only update if a new date was actually selected
        inputChangeHandler("dueDate", currentDate);
      }
    },
    [inputChangeHandler, formData.dueDate]
  );

  const handleDatePickerDone = useCallback(() => {
    // For iOS "Done" button
    setShowDatePicker(false);
  }, []);

  const validateFormData = useCallback(() => {
    if (formData.title.trim().length === 0) {
      Alert.alert("Validation Error", "Task Title is required!");
      return false;
    }
    if (formData.detail.trim().length === 0) {
      Alert.alert("Validation Error", "Task Detail is required!");
      return false;
    }
    return true;
  }, [formData.title, formData.detail]);

  const goBackHandler = useCallback(() => {
    if (navigation && navigation.canGoBack()) {
      navigation.goBack();
    } else if (navigation) {
      console.log(
        "TASK_EDITOR: Cannot go back, navigating to Tasks screen as fallback."
      );
      navigation.navigate("Tasks");
    } else {
      console.error(
        "TASK_EDITOR: goBackHandler - navigation object is missing!"
      );
    }
  }, [navigation]);

  const submitHandler = useCallback(async () => {
    if (!validateFormData()) {
      return;
    }
    const taskPayload = {
      title: formData.title.trim(),
      detail: formData.detail.trim(),
      dueDate: formData.dueDate,
      completed: formData.completed,
      assignToTeam: formData.assignToTeam,
    };

    try {
      if (formData.id) {
        const updateData = {
          title: taskPayload.title,
          detail: taskPayload.detail,
          dueDate: taskPayload.dueDate,
          completed: taskPayload.completed,
        };
        await updateTask(formData.id, updateData);
      } else {
        await addTask(taskPayload);
      }
      goBackHandler();
    } catch (err) {
      Alert.alert(
        "Operation Failed",
        err.message || "Could not save task. Please try again."
      );
    }
  }, [formData, validateFormData, updateTask, addTask, goBackHandler]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: {
          flex: 1,
          backgroundColor: theme.gradientStart || "#3b0940",
        },
        container: { flex: 1 },
        customHeader: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: Platform.OS === "ios" ? 15 : 10,
          paddingVertical: 10,
          height: 56,
        },
        backButtonContainer: {
          padding: 5,
          marginRight: 10,
        },
        editorTitle: {
          flex: 1,
          textAlign: "center",
          fontSize: 20,
          fontFamily: "deliusBold",
          color: theme.headerTint || theme.primaryWhite || "#FFFFFF",
        },
        headerPlaceholderRight: {
          // To balance the back button for centering title
          width: (Platform.OS === "ios" ? 28 : 28) + 5 * 2 + 10, // Icon size + padding + margin
        },
        scrollContainer: { paddingHorizontal: 16, paddingBottom: 40 },
        button: {
          minWidth: 50,
          marginHorizontal: 8,
          marginTop: 30,
          marginBottom: 20,
        },
        dateSection: {
          marginHorizontal: 8,
          marginVertical: 12,
          marginBottom: 15,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: theme.border || "#d7d1d3",
          paddingBottom: 10,
        },
        dateLabel: {
          color: theme.textPrimaryOnGradient || "#FFFFFF",
          fontSize: 16,
          fontFamily: "delius",
        },
        dateTextContainer: { alignItems: "flex-end" },
        dateText: {
          color: theme.textPrimaryOnGradient || "#FFFFFF",
          fontSize: 16,
          fontFamily: "delius",
          paddingBottom: 5,
        },
        assignSwitchContainer: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal: 8,
          marginVertical: 10,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: theme.border || "#d7d1d3",
          paddingBottom: 10,
        },
        assignLabel: {
          color: theme.textPrimaryOnGradient || "#FFFFFF",
          fontSize: 16,
          fontFamily: "delius",
          flexShrink: 1,
          marginRight: 10,
        },
        loadingOverlay: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
        },
        loadingText: {
          fontFamily: "delius",
          fontSize: 16,
          color: theme.textPrimaryOnGradient || "#FFFFFF",
          marginTop: 10,
        },
        iosPickerControls: {
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingVertical: 10,
          paddingHorizontal: 15,
          borderTopWidth: 1,
          borderTopColor: theme.border || "#d7d1d3",
          backgroundColor: theme.cardBackground || "#f9f9f9", // Use a themed background
        },
        doneButtonText: {
          color: theme.primary || "#007AFF",
          fontSize: 17,
          fontWeight: "600",
          fontFamily: "delius",
        },
      }),
    [theme] // Removed isDark as it's not directly used in these styles
  );

  if (isLoading && !showDatePicker) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={[
            theme.gradientStart || "#3b0940",
            theme.gradientEnd || "#d7d1d3",
          ]}
          style={styles.container}
        >
          <View style={styles.loadingOverlay}>
            <ActivityIndicator
              size="large"
              color={theme.primaryWhite || "#FFFFFF"}
            />
            <Text style={styles.loadingText}>Saving...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[
          theme.gradientStart || "#3b0940",
          theme.gradientEnd || "#d7d1d3",
        ]}
        style={styles.container}
      >
        <View style={styles.customHeader}>
          <Pressable onPress={goBackHandler} style={styles.backButtonContainer}>
            <Ionicons
              name={
                Platform.OS === "ios"
                  ? "chevron-back-outline"
                  : "arrow-back-outline"
              }
              size={Platform.OS === "ios" ? 30 : 28} // Slightly adjust size per platform if needed
              color={theme.headerTint || "#FFFFFF"}
            />
          </Pressable>
          <Text style={styles.editorTitle}>{editorTitle}</Text>
          <View style={styles.headerPlaceholderRight} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Input
            label="What is your Task?"
            value={formData.title}
            onChangeText={(value) => inputChangeHandler("title", value)}
          />
          <Input
            label="Please explain the task or just add details"
            value={formData.detail}
            onChangeText={(value) => inputChangeHandler("detail", value)}
            textInputConfig={{ autoCapitalize: "sentences", multiline: true }}
          />

          <View style={styles.dateSection}>
            <Text style={styles.dateLabel}>Due Date</Text>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={styles.dateTextContainer}
            >
              <Text style={styles.dateText}>
                {formatDate(formData.dueDate)}
              </Text>
            </Pressable>
          </View>

          {!formData.id && currentUser?.uid !== APPREC8_TEAM_REVIEWER_UID && (
            <View style={styles.assignSwitchContainer}>
              <Text style={styles.assignLabel}>
                Assign to Apprec8 Team for Review?
              </Text>
              <Switch
                trackColor={{
                  false: theme.switchTrackOff || "#767577",
                  true: theme.switchTrackOn || "#81b0ff",
                }}
                thumbColor={
                  formData.assignToTeam
                    ? theme.switchThumbOn || "#f5dd4b"
                    : theme.switchThumbOff || "#f4f3f4"
                }
                ios_backgroundColor={theme.switchTrackOff || "#3e3e3e"}
                onValueChange={(value) =>
                  inputChangeHandler("assignToTeam", value)
                }
                value={formData.assignToTeam}
                disabled={!!formData.id}
              />
            </View>
          )}

          {showDatePicker && (
            <>
              {Platform.OS === "ios" && (
                <View style={styles.iosPickerControls}>
                  <Pressable onPress={handleDatePickerDone}>
                    <Text style={styles.doneButtonText}>Done</Text>
                  </Pressable>
                </View>
              )}
              <DateTimePicker
                value={formData.dueDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                minimumDate={new Date()} // Optional: prevent selecting past dates
                // For iOS, you can try to pass theme colors if supported by your version
                // textColor={isDark ? theme.textPrimary : theme.inputText}
                // themeVariant={isDark ? 'dark' : 'light'}
              />
            </>
          )}

          <PrimaryButton
            style={styles.button}
            onPress={submitHandler}
            disabled={isLoading}
          >
            {isLoading && formData.id ? (
              <ActivityIndicator
                size="small"
                color={theme.textOnPrimary || "#FFFFFF"}
              />
            ) : formData.id ? (
              "Update Task"
            ) : (
              "Add Task"
            )}
          </PrimaryButton>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default TaskEditor;

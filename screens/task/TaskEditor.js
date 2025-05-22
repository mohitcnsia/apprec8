// screens/task/TaskEditor.js

import React, {
  useContext,
  useState,
  useLayoutEffect,
  useMemo,
  useEffect,
} from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  Switch, // Import Switch
  ActivityIndicator, // For loading state
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import Input from "../../components/input/Input";
import PrimaryButton from "../../components/PrimaryButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "../../components/utils/date";
import { TasksContext } from "../../store/tasks-context";
import { APPREC8_TEAM_REVIEWER_UID } from "../../config/appConfig"; // To know if current user is the reviewer
import { authInstance } from "../../config/firebaseConfig"; // To get current user

const TaskEditor = ({ route, navigation }) => {
  const { theme, isDark } = useTheme();
  const taskContext = useContext(TasksContext);
  const currentUser = authInstance.currentUser;

  const existingTaskData = route?.params?.data;

  // Initialize formData state
  const [formData, setFormData] = useState({
    id: existingTaskData?.id || "",
    title: existingTaskData?.title || "",
    detail: existingTaskData?.detail || "",
    dueDate: existingTaskData?.dueDate
      ? new Date(existingTaskData.dueDate)
      : new Date(),
    completed: existingTaskData?.completed || false,
    // Initialize assignToTeam based on existing data or default to false
    assignToTeam:
      existingTaskData?.assignedTeamReviewerUid === APPREC8_TEAM_REVIEWER_UID ||
      false,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Clear error from context when component mounts or when user starts editing
  useEffect(() => {
    taskContext.clearError();
  }, []);

  // Update header title
  useLayoutEffect(() => {
    navigation.setOptions({
      // title: formData.id ? "Edit Task" : "Add New Task",
    });
  }, [navigation, formData.id]);

  const inputChangeHandler = (key, value) => {
    setFormData((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios"); // Or manage "Done" button for iOS
    if (selectedDate) {
      inputChangeHandler("dueDate", selectedDate);
    }
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
  };

  function validateFormData() {
    if (formData.title.trim().length === 0) {
      Alert.alert("Validation Error", "Task Title is required!");
      return false;
    }
    if (formData.detail.trim().length === 0) {
      Alert.alert("Validation Error", "Task Detail is required!");
      return false;
    }
    return true;
  }

  async function submitHandler() {
    if (!validateFormData()) {
      return;
    }

    const taskPayload = {
      title: formData.title.trim(),
      detail: formData.detail.trim(),
      dueDate: formData.dueDate, // Pass as Date object, context will handle ISO conversion
      completed: formData.completed,
      // Only include assignToTeam if it's a new task or if editing is allowed for this field
      // For now, let's assume assignToTeam can be set during creation
      assignToTeam: formData.assignToTeam,
    };

    try {
      if (formData.id) {
        // When updating, we might not want to change assignToTeam via this editor screen,
        // or we might. For now, let's exclude it from update payload directly but
        // if `formData.assignToTeam` was part of `existingTaskData` mapping,
        // it would be part of `taskPayload`.
        // The key is that `assignedTeamReviewerUid` is set in `addTaskToFirestore`
        // based on `assignToTeam`. Updates don't typically re-assign this way.
        // We'll pass the relevant fields for update.
        const updatePayload = {
          title: taskPayload.title,
          detail: taskPayload.detail,
          dueDate: taskPayload.dueDate,
          completed: taskPayload.completed,
          // If you want to allow changing team assignment on edit:
          // ...(formData.assignToTeam ? { assignedTeamReviewerUid: APPREC8_TEAM_REVIEWER_UID } : { assignedTeamReviewerUid: firestore.FieldValue.delete() })
        };
        await taskContext.updateTask(formData.id, updatePayload);
      } else {
        await taskContext.addTask(taskPayload);
      }
      navigation.goBack();
    } catch (error) {
      // Error is already set in context, Alert can be shown here or based on context.error prop
      Alert.alert(
        "Operation Failed",
        error.message || "Could not save task. Please try again."
      );
    }
  }

  // Define Styles Inside Component with useMemo
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1 },
        scrollContainer: {
          paddingBottom: 40,
          paddingHorizontal: 16,
          paddingTop: 20,
        },
        button: {
          minWidth: 50,
          marginHorizontal: 8,
          marginTop: 20,
          marginBottom: 20,
        },
        dateSection: {
          marginHorizontal: 8,
          marginVertical: 12,
          marginBottom: 25,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: theme.border || theme.primaryLightGray,
          paddingBottom: 10,
        },
        dateLabel: {
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          fontSize: 16,
          fontFamily: "delius",
        },
        dateTextContainer: { alignItems: "flex-end" },
        dateText: {
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          fontSize: 16,
          fontFamily: "delius",
          paddingBottom: 5,
        },
        assignSwitchContainer: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal: 8,
          marginVertical: 15,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: theme.border || theme.primaryLightGray,
        },
        assignLabel: {
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          fontSize: 16,
          fontFamily: "delius",
        },
        loadingContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.3)",
        }, // For full screen loading
      }),
    [theme]
  );

  if (taskContext.isLoading && !showDatePicker) {
    // Avoid full screen loading when date picker is open
    return (
      <LinearGradient
        colors={[
          theme.gradientStart || "#3b0940",
          theme.gradientEnd || "#d7d1d3",
        ]}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={theme.primaryWhite || "#FFFFFF"}
          />
          <Text style={styles.dateLabel}>Saving...</Text>
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
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="What is your Task?"
          value={formData.title}
          onChangeText={(value) => inputChangeHandler("title", value)}
          // Theming for Input should ideally be internal to Input component
        />
        <Input
          label="Please explain the task or just add details"
          value={formData.detail}
          onChangeText={(value) => inputChangeHandler("detail", value)}
          textInputConfig={{ autoCapitalize: "sentences", multiline: true }}
        />

        {/* Due Date Section */}
        <View style={styles.dateSection}>
          <Text style={styles.dateLabel}>Due Date</Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={styles.dateTextContainer}
          >
            <Text style={styles.dateText}>{formatDate(formData.dueDate)}</Text>
          </Pressable>
        </View>

        {/* Assign to Apprec8 Team Switch - only show if user is NOT the team reviewer themselves OR if it's a new task */}
        {(!formData.id || currentUser?.uid !== APPREC8_TEAM_REVIEWER_UID) && (
          <View style={styles.assignSwitchContainer}>
            <Text style={styles.assignLabel}>
              Assign to Apprec8 Team for Review?
            </Text>
            <Switch
              trackColor={{
                false: theme.primaryLightGray,
                true: theme.primary,
              }}
              thumbColor={
                formData.assignToTeam ? theme.accent : theme.background
              }
              ios_backgroundColor={theme.primaryLightGray}
              onValueChange={(value) =>
                inputChangeHandler("assignToTeam", value)
              }
              value={formData.assignToTeam}
              disabled={!!formData.id} // Disable for existing tasks for now to simplify
            />
          </View>
        )}

        {showDatePicker && (
          <DateTimePicker
            value={formData.dueDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            // themeVariant={isDark ? "dark" : "light"} // Requires testing specific library version
          />
        )}

        <PrimaryButton
          style={styles.button}
          onPress={submitHandler}
          disabled={taskContext.isLoading}
        >
          {taskContext.isLoading ? (
            <ActivityIndicator color={theme.textOnPrimary || "#FFFFFF"} />
          ) : formData.id ? (
            "Update Task"
          ) : (
            "Add Task"
          )}
        </PrimaryButton>
      </ScrollView>
    </LinearGradient>
  );
};

export default TaskEditor;

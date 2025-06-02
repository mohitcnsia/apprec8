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
import { useTheme } from "../../context/ThemeContext";
import Input from "../../components/input/Input";
import PrimaryButton from "../../components/PrimaryButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate, getDatePlusDays } from "../../components/utils/date";
import { TasksContext } from "../../store/tasks-context";
import { APPREC8_TEAM_REVIEWER_UID } from "../../config/appConfig";
import { authInstance } from "../../config/firebaseConfig";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const TaskEditor = ({ route, navigation: propNavigation }) => {
  const { theme } = useTheme(); // isDark not used directly in this component's style block
  const { isLoading, error, addTask, updateTask, clearError } =
    useContext(TasksContext);
  const currentUser = authInstance.currentUser;
  const navigation = propNavigation || useNavigation();
  const existingTaskData = route?.params?.data;

  const getDefaultDueDate = useCallback(() => {
    const today = new Date();
    return getDatePlusDays(today, 7);
  }, []);

  const [formData, setFormData] = useState(() => ({
    id: existingTaskData?.id || "",
    title: existingTaskData?.title || "",
    detail: existingTaskData?.detail || "",
    dueDate: existingTaskData?.dueDate
      ? new Date(existingTaskData.dueDate)
      : getDefaultDueDate(),
    completed: existingTaskData?.completed || false,
    // This correctly initializes to true if editing a task assigned to the team, false otherwise for new/other tasks
    assignToTeam:
      existingTaskData?.assignedTeamReviewerUid === APPREC8_TEAM_REVIEWER_UID ||
      false,
  }));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const editorTitle = formData.id ? "Edit Task" : "Add New Task";

  useEffect(() => {
    if (clearError) {
      clearError();
    }
  }, [clearError, existingTaskData]); // Only run if clearError or existingTaskData changes

  useFocusEffect(
    useCallback(() => {
      // console.log("TASK_EDITOR: Focused. Navigation object:", navigation);
      // if (error && clearError) {
      // clearError(); // Example: clear context error on focus
      // }
      return () => {
        // console.log('TASK_EDITOR: Unfocused.');
      };
    }, [navigation, error, clearError]) // Keep error & clearError if you intend to act on them on focus
  );

  const inputChangeHandler = useCallback((key, value) => {
    setFormData((prevState) => ({ ...prevState, [key]: value }));
  }, []);

  const handleDateChange = useCallback(
    (event, selectedDate) => {
      setShowDatePicker(Platform.OS === "ios"); // Keep open on iOS, close on Android
      if (selectedDate) {
        // Only update if a date was selected (not cancelled)
        inputChangeHandler("dueDate", selectedDate);
      }
    },
    [inputChangeHandler] // formData.dueDate is not needed as a dep here
  );

  const handleDatePickerDone = useCallback(() => {
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
      // console.log("TASK_EDITOR: Cannot go back, navigating to Tasks screen as fallback.");
      navigation.navigate("Tasks"); // Ensure 'Tasks' is a valid route
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
    // The payload sent to context functions.
    // The context function is responsible for setting Firestore-specific fields like 'assignedTeamReviewerUid' or 'creatorUid'.
    const taskDataForContext = {
      title: formData.title.trim(),
      detail: formData.detail.trim(),
      dueDate: formData.dueDate.toISOString(), // Send as ISO string for Firestore
      completed: formData.completed,
      // This boolean tells the context whether the intention is to assign to the team.
      // It does NOT directly set assignedTeamReviewerUid here.
      assignToTeamBoolean: formData.assignToTeam,
    };

    try {
      if (formData.id) {
        // For updates, we send only the fields that can be changed by the editor, plus the ID.
        // The updateTask function in context should handle how `assignToTeamBoolean` affects `assignedTeamReviewerUid`.
        await updateTask(formData.id, taskDataForContext);
      } else {
        // For new tasks, addTask in context will use taskDataForContext to build the full Firestore document.
        await addTask(taskDataForContext);
      }
      goBackHandler();
    } catch (err) {
      // Error from context (already an HttpsError or similar) or local error
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
          height: 56, // Standard header height
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
          width: (Platform.OS === "ios" ? 30 : 28) + 5 * 2 + 10, // Approx (iconSize + padding*2 + margin)
        },
        scrollContainer: {
          paddingHorizontal: 16,
          paddingBottom: 40,
        },
        button: {
          minWidth: 50, // Or your desired minWidth
          marginHorizontal: 8,
          marginTop: 30,
          marginBottom: 20,
        },
        dateSection: {
          marginHorizontal: 8,
          marginVertical: 12,
          // marginBottom: 15, // Covered by marginVertical
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
        dateTextContainer: {
          alignItems: "flex-end",
        }, // No specific style needed if Pressable itself handles layout
        dateText: {
          color: theme.textPrimaryOnGradient || "#FFFFFF",
          fontSize: 16,
          fontFamily: "delius",
          paddingVertical: 5, // Make it easier to press
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
          // paddingBottom: 10, // Duplicated, use paddingVertical
        },
        assignLabel: {
          color: theme.textPrimaryOnGradient || "#FFFFFF",
          fontSize: 16,
          fontFamily: "delius",
          flexShrink: 1, // Allow label to shrink if switch takes space
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
          zIndex: 10, // Ensure it's on top
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
          backgroundColor: theme.cardBackground || "#f9f9f9",
        },
        doneButtonText: {
          color: theme.primary || "#007AFF", // Standard iOS blue or theme primary
          fontSize: 17,
          fontWeight: "600", // Common for "Done" buttons
          fontFamily: "delius", // Or system font if Delius doesn't fit
        },
      }),
    [theme] // isDark was removed as it wasn't directly used
  );

  // Loading state specifically for task submission context
  if (isLoading && !showDatePicker) {
    // Avoid showing global loading when only date picker is active
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={[
            theme.gradientStart || "#3b0940",
            theme.gradientEnd || "#d7d1d3",
          ]}
          style={styles.container} // This container should have flex: 1
        >
          {/* Custom loading overlay for task submission */}
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
              size={Platform.OS === "ios" ? 30 : 28}
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
              // style={styles.dateTextContainer} // Not strictly needed if Pressable wraps Text directly and has padding
            >
              <Text style={styles.dateText}>
                {" "}
                {/* Added paddingVertical to dateText for better tap area */}
                {formatDate(formData.dueDate)}
              </Text>
            </Pressable>
          </View>

          {/* Conditional rendering for the Switch:
              - Not for existing tasks (formData.id is truthy)
              - Not if the current user IS the Apprec8 team reviewer
           */}
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
                // Switch is implicitly not disabled here as it's only shown for new tasks
                // disabled={!!formData.id} // This condition is handled by the outer conditional rendering
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
                minimumDate={new Date()} // Prevent selecting past dates
                // textColor={isDark ? theme.textPrimaryOnGradient : theme.textPrimary} // Example theming for iOS
                // themeVariant={isDark ? 'dark' : 'light'} // For some custom pickers or future RN versions
              />
            </>
          )}

          <PrimaryButton
            style={styles.button}
            onPress={submitHandler}
            disabled={isLoading} // isLoading from context, true during submission
          >
            {/* Show ActivityIndicator inside button if isLoading (from context) is true */}
            {isLoading ? (
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

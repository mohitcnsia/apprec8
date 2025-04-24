// screens/task/TaskEditor.js (or similar path)

import React, { useContext, useState, useLayoutEffect, useMemo } from "react"; // Import useMemo
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// import { Colors } from "../../config/colors"; // Remove legacy Colors import
import { useTheme } from "../../context/ThemeContext"; // Import useTheme hook
import Input from "../../components/input/Input"; // Assume themed internally
import PrimaryButton from "../../components/PrimaryButton"; // Assume themed internally
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "../../components/utils/date";
import { TasksContext } from "../../store/tasks-context";

const TaskEditor = ({ route, navigation }) => {
  const { theme, isDark } = useTheme(); // Use the theme hook, get isDark for DateTimePicker potentially
  const taskContext = useContext(TasksContext);

  // Existing data handling and state (remain the same)
  const data = route?.params?.data; // Keep optional chaining for safety
  const [formData, setFormData] = useState({
    id: data?.id || "", // Use optional chaining
    title: data?.title || "",
    detail: data?.detail || "",
    // Ensure dueDate is initialized correctly, handling potential string from navigation
    dueDate: data?.dueDate ? new Date(data.dueDate) : new Date(),
    completed: data?.completed || false, // Keep completed state
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // --- Add Header Title based on edit/add mode ---
  // (This wasn't in the original but is good practice for editors)
  useLayoutEffect(() => {
    navigation.setOptions({
      title: formData.id ? "Edit Task" : "Add New Task",
      // Header styles are controlled by the Navigator's screenOptions
    });
  }, [navigation, formData.id]);

  // Handlers (remain the same logic)
  const inputChangeHandler = (key, value) => {
    setFormData((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    // Always hide picker on selection/dismissal
    setShowDatePicker(Platform.OS === "ios"); // On iOS, keep it open until done is pressed maybe? Test UX. Or always hide: setShowDatePicker(false)
    if (selectedDate) {
      inputChangeHandler("dueDate", selectedDate);
    }
    // On Android, hiding is implicit after selection/cancel
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
  };

  function validateFormData() {
    const isTaskTitleValid = formData.title.trim().length > 0;
    const isTaskDetailValid = formData.detail.trim().length > 0;
    if (isTaskTitleValid && isTaskDetailValid) return true;
    Alert.alert("Validation Error", "Title and Detail fields are required!");
    return false;
  }

  function saveToDb() {
    const taskDataToSave = {
      // Only include fields relevant to save/update
      title: formData.title,
      detail: formData.detail,
      dueDate: formData.dueDate.toISOString(), // Save as ISO string
      completed: formData.completed, // Persist completed status
    };
    if (formData.id) {
      // Editing existing task
      taskContext.updateTask(formData.id, taskDataToSave);
    } else {
      // Adding new task
      taskContext.addTask(taskDataToSave);
    }
  }

  function submitHandler() {
    if (validateFormData()) {
      saveToDb();
      navigation.goBack(); // Go back instead of navigating to Tasks maybe?
    }
  }

  // --- Define Styles Inside Component with useMemo ---
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          // Applied to LinearGradient
          flex: 1,
        },
        scrollContainer: {
          paddingBottom: 40, // Ensure space at bottom
          paddingHorizontal: 16, // Add horizontal padding
          paddingTop: 20, // Add top padding
        },
        button: {
          // Style for PrimaryButton wrapper/margin
          minWidth: 50, // Keep minWidth if needed by button
          marginHorizontal: 8, // Keep horizontal margin
          marginTop: 30, // Increased top margin
        },
        dateSection: {
          marginHorizontal: 8, // Keep horizontal margin
          marginVertical: 12,
          marginBottom: 25, // Adjusted bottom margin
          // Use flex layout for better alignment
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomWidth: 1, // Use solid border instead of dotted for theme consistency
          borderBottomColor: theme.border || theme.primaryLightGray, // Themed border color
          paddingBottom: 10, // Add padding below border
        },
        dateLabel: {
          // Use themed text color suitable for gradient
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          fontSize: 16,
          fontFamily: "delius", // Keep font
        },
        dateTextContainer: {
          // Wrapper for Pressable text to apply line easily
          alignItems: "flex-end", // Align text to the right if needed
        },
        dateText: {
          // Use themed text color suitable for gradient
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          fontSize: 16,
          fontFamily: "delius", // Keep font
          paddingBottom: 5, // Space for the line visual effect if using border below
        },
        // Dotted line removed in favor of borderBottom on dateSection
        // dottedLine: { ... },
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
        keyboardShouldPersistTaps="handled" // Good for forms
      >
        {/* Inputs are assumed themed internally */}
        <Input
          label="What is your Task?"
          value={formData.title}
          onChangeText={(value) => inputChangeHandler("title", value)}
          // Pass theme or specific styles if Input component supports it
          // labelStyle={{ color: theme.textSecondaryOnGradient }}
          // textInputStyle={{ color: theme.textPrimaryOnGradient }}
          // containerStyle={{ marginBottom: 15 }}
        />
        <Input
          label="Please explain the task or just add details"
          value={formData.detail}
          onChangeText={(value) => inputChangeHandler("detail", value)}
          textInputConfig={{
            autoCapitalize: "sentences",
            multiline: true,
            // Consider setting height or minHeight
            // minHeight: 80,
          }}
          // Pass theme or specific styles if Input component supports it
          // labelStyle={{ color: theme.textSecondaryOnGradient }}
          // textInputStyle={{ color: theme.textPrimaryOnGradient, minHeight: 80 }}
          // containerStyle={{ marginBottom: 15 }}
        />

        {/* Due Date Section */}
        <View style={styles.dateSection}>
          <Text style={styles.dateLabel}>Due Date</Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={styles.dateTextContainer}
          >
            <Text style={styles.dateText}>{formatDate(formData.dueDate)}</Text>
            {/* Dotted line replaced by borderBottom on parent View */}
          </Pressable>
        </View>

        {/* Show DateTimePicker */}
        {/* Consider wrapping Picker in a conditional View for Android if needed */}
        {showDatePicker && (
          <DateTimePicker
            value={formData.dueDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            // Potential Theme Props (check documentation, might vary by version/OS)
            // themeVariant={isDark ? "dark" : "light"} // Example prop
            // accentColor={theme.primary} // Example prop
            // textColor={theme.textPrimary} // Example prop (might not exist)
          />
        )}

        {/* Submit Button (assumed themed internally) */}
        <PrimaryButton
          // title="Submit" // Removed as child text is used
          style={styles.button} // Apply margin/layout styles
          onPress={submitHandler}
        >
          {formData.id ? "Update Task" : "Add Task"}
        </PrimaryButton>
      </ScrollView>
    </LinearGradient>
  );
};

export default TaskEditor;

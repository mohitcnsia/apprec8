import React, { useContext, useState } from "react";
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
import { Colors } from "../../config/colors";
import Input from "../../components/input/Input";
import PrimaryButton from "../../components/PrimaryButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "../../components/utils/date";
import { TasksContext } from "../../store/tasks-context";

const TaskEditor = ({ route, navigation }) => {
  const taskContext = useContext(TasksContext);

  const data = route?.params?.data || [];
  const [formData, setFormData] = useState({
    id: data ? data.id : "",
    title: data ? data.title : "",
    detail: data ? data.detail : "",
    dueDate: data?.dueAt ? new Date(data.dueAt) : new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Handle input changes
  const inputChangeHandler = (key, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  // Handle Date Change
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      inputChangeHandler("dueDate", selectedDate);
    }
  };

  // Submit Handler
  function submitHandler() {
    const isFormValid = validateFormData();
    if (isFormValid) {
      saveToDb();
      navigation.navigate("Tasks");
    }
  }

  // Form Validation
  function validateFormData() {
    const isTaskTitleValid = formData.title.trim().length > 0;
    const isTaskDetailValid = formData.detail.trim().length > 0;

    if (isTaskTitleValid && isTaskDetailValid) {
      return true;
    }
    Alert.alert("Validation Error", "All fields are required!");
    return false;
  }

  // Simulate Save to DB
  function saveToDb() {
    const newTaskData = {
      ...formData,
      dueAt: formData.dueDate.toISOString(), // Ensure date is saved correctly
      completed: formData.completed || false, // Default to false
    };

    if (formData.id) {
      taskContext.updateTask(formData.id, newTaskData);
    } else {
      taskContext.addTask(newTaskData);
    }
  }

  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {/* Task Title Input */}
          <Input
            label="What is your Task?"
            value={formData.title}
            onChangeText={(value) => inputChangeHandler("title", value)}
          />

          {/* Task Detail Input */}
          <Input
            label="Please explain the task or just add details"
            value={formData.detail}
            onChangeText={(value) => inputChangeHandler("detail", value)}
            textInputConfig={{
              autoCapitalize: "sentences",
              multiline: true,
            }}
          />

          {/* Due Date Section */}
          <View style={styles.dateSection}>
            <Text style={styles.dateLabel}>When is your Task due?</Text>
            <Pressable onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateText}>
                {formatDate(formData.dueDate)}
              </Text>
              <View style={styles.dottedLine} />
            </Pressable>
          </View>

          {/* Show DateTimePicker if showDatePicker is true */}
          {showDatePicker && (
            <DateTimePicker
              value={formData.dueDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
            />
          )}

          {/* Submit Button */}
          <PrimaryButton
            title="Submit"
            style={styles.button}
            onPress={submitHandler}
          >
            Submit
          </PrimaryButton>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default TaskEditor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  button: {
    minWidth: 50,
    marginHorizontal: 8,
    marginTop: 20,
  },
  dateSection: {
    marginHorizontal: 8,
    marginVertical: 12,
    marginBottom: 35,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateLabel: {
    color: Colors.primaryWhite,
    fontSize: 16,
    fontFamily: "delius",
  },
  dateText: {
    color: Colors.primaryWhite,
    fontSize: 16,
    fontFamily: "delius",
  },
  dottedLine: {
    borderBottomWidth: 1,
    borderStyle: "dotted",
    borderBottomColor: Colors.primaryWhite,
    marginTop: 4,
  },
});

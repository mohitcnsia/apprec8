import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useLayoutEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors";
import PrimaryButton from "../../components/PrimaryButton";
import IconButton from "../../components/ui/IconButton";
import { formatDate } from "../../components/utils/date";
import { TasksContext } from "../../store/tasks-context";

const TaskDetails = ({ route, navigation }) => {
  const data = route?.params?.data || {};
  const { updateTask, deleteTask } = useContext(TasksContext);

  // Convert the serialized date strings back into Date objects
  const formattedDueDate = formatDate(new Date(data.dueDate)); // Convert from ISO string to Date
  const formattedCreatedAt = formatDate(new Date(data.createdAt));
  const formattedLastUpdatedAt = formatDate(new Date(data.lastUpdatedAt));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerView}>
          <IconButton
            icon="pencil"
            size={20}
            color={Colors.primaryWhite}
            onPress={() =>
              navigation.navigate("TaskEditor", {
                data: {
                  ...data,
                  dueDate: data.dueDate, // Pass the serialized date as a string
                },
              })
            }
          />
          <IconButton
            icon="trash"
            size={20}
            color={Colors.primaryWhite}
            onPress={() => {
              Alert.alert(
                "Confirm Deletion",
                "Are you sure you want to delete this task?",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: () => {
                      deleteTask(data.id);
                      navigation.navigate("Tasks");
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
  }, [navigation, data, deleteTask]);

  const markCompletedHandler = () => {
    const updatedTask = { ...data, completed: true };
    updateTask(data.id, updatedTask);
    navigation.navigate("Tasks");
  };

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
          <Text style={styles.title}>{data.title}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>{data.detail}</Text>
        </View>
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>Due on: {formattedDueDate}</Text>
        </View>
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>Created At: {formattedCreatedAt}</Text>
        </View>
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>
            Last Updated At: {formattedLastUpdatedAt}
          </Text>
        </View>

        {!data.completed && (
          <PrimaryButton onPress={markCompletedHandler}>
            Mark Completed
          </PrimaryButton>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default TaskDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerView: {
    flexDirection: "row",
  },
  scrollContainer: {
    margin: 20,
  },
  title: {
    color: Colors.primaryWhite,
    fontFamily: "deliusBold",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  detailsContainer: {
    padding: 4,
    marginVertical: 10,
    alignItems: "center",
  },
  detailsText: {
    color: Colors.primaryWhite,
    fontFamily: "delius",
    fontSize: 16,
    textAlign: "center",
  },
  metaContainer: {
    padding: 4,
    alignItems: "center",
  },
  metaText: {
    color: Colors.primaryWhite,
    fontFamily: "deliusBold",
    fontSize: 10,
  },
});

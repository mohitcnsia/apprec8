import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useLayoutEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors";
import PrimaryButton from "../../components/PrimaryButton";
import IconButton from "../../components/ui/IconButton";
import { formatDate } from "../../components/utils/date";
import { TasksContext } from "../../store/tasks-context";

const TaskDetails = ({ route, navigation }) => {
  const data = route?.params?.data || [];
  const { updateTask } = useContext(TasksContext); // Get update function

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="pencil"
          size={20}
          color={Colors.primaryWhite}
          onPress={() => {
            navigation.navigate("TaskEditor", { data });
          }}
        />
      ),
    });
  }, [navigation]);

  const markCompletedHandler = () => {
    const updatedTask = { ...data, completed: true };
    updateTask(data.id, updatedTask);
    navigation.navigate("Tasks"); // Navigate back to task list
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
          <Text style={styles.metaText}>
            Due on: {formatDate(new Date(data.dueAt))}
          </Text>
        </View>
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>
            Created At: {formatDate(new Date(data.createdAt))}
          </Text>
        </View>
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>
            Last Updated At: {formatDate(new Date(data.lastUpdatedAt))}
          </Text>
        </View>
        <PrimaryButton onPress={markCompletedHandler}>
          Mark Completed
        </PrimaryButton>
      </ScrollView>
    </LinearGradient>
  );
};

export default TaskDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

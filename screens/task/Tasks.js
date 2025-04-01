import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useLayoutEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors";
import IconButton from "../../components/ui/IconButton";
import AppFlatList from "../../components/common/list/AppFlatList";
import { TasksContext } from "../../store/tasks-context";

const TasksScreenContent = ({ navigation }) => {
  const taskContext = useContext(TasksContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="add"
          size={24}
          color={Colors.primaryWhite}
          onPress={() => {
            navigation.navigate("TaskEditor");
          }}
        />
      ),
    });
  }, [navigation]);

  const handleLinkPress = (link) => {
    navigation.navigate("TaskDetails", { data: link });
  };

  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      {taskContext?.tasks?.length > 0 ? (
        <AppFlatList
          data={taskContext.tasks}
          isPressable={true}
          onItemPress={handleLinkPress}
          itemStyle={(task) =>
            task.completed ? styles.completedTask : styles.taskItem
          }
        />
      ) : (
        <Text style={styles.noTask}>Yay !! You have no Tasks</Text>
      )}
    </LinearGradient>
  );
};

const Tasks = ({ navigation }) => {
  return <TasksScreenContent navigation={navigation} />;
};

export default Tasks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noTask: {
    color: Colors.primaryWhite,
    fontFamily: "delius",
    fontSize: 18,
    textAlign: "center",
  },
  completedTask: {
    backgroundColor: "green", // Change background to green
  },
  taskItem: {
    backgroundColor: "white",
    padding: 10,
    margin: 5,
    borderRadius: 8,
  },
});

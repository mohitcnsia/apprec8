// screens/task/TaskDetails.js

import React, {
  useContext,
  useLayoutEffect,
  useMemo,
  useEffect,
  useState,
} from "react"; // Import useState
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import PrimaryButton from "../../components/PrimaryButton";
import IconButton from "../../components/ui/IconButton";
import { formatDate } from "../../components/utils/date";
import { TasksContext } from "../../store/tasks-context";
import { APPREC8_TEAM_REVIEWER_UID } from "../../config/appConfig";
import CompletionCommentModal from "../../components/common/CompletionCommentModal"; // Import the new modal

const TaskDetails = ({ route, navigation }) => {
  const { theme } = useTheme();
  const taskContext = useContext(TasksContext);
  const taskDataFromRoute = route?.params?.data || {};

  const currentTask =
    taskContext.tasks.find((t) => t.id === taskDataFromRoute.id) ||
    taskDataFromRoute;

  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false); // State for modal

  const ensureDateObject = (dateInput) => {
    if (!dateInput) return null;
    if (dateInput instanceof Date) return dateInput;
    const parsed = new Date(dateInput);
    return isNaN(parsed) ? null : parsed;
  };

  // data will now also hold completionComment from context/route or default to ""
  const data = useMemo(
    () => ({
      ...currentTask,
      dueDate: ensureDateObject(currentTask.dueDate),
      createdAt: ensureDateObject(currentTask.createdAt),
      lastUpdatedAt: ensureDateObject(currentTask.lastUpdatedAt),
      completionComment: currentTask.completionComment || "",
    }),
    [currentTask]
  );

  const formattedDueDate = data.dueDate ? formatDate(data.dueDate) : "Not set";
  const formattedCreatedAt = data.createdAt
    ? formatDate(data.createdAt)
    : "N/A";
  const formattedLastUpdatedAt = data.lastUpdatedAt
    ? formatDate(data.lastUpdatedAt)
    : "N/A";

  useEffect(() => {
    if (taskContext.clearError) {
      taskContext.clearError();
    }
  }, [taskContext.clearError]);

  useLayoutEffect(() => {
    navigation.setOptions({
      // headerShown: true,
      // title: data.title || "Task Details",
      headerRight: () => (
        <View style={styles.headerView}>
          <IconButton
            icon="pencil"
            size={20}
            color={theme.headerTint || "#ffffff"}
            onPress={() => {
              navigation.navigate("TaskEditor", {
                data: {
                  ...data,
                  dueDate: data.dueDate?.toISOString(),
                  createdAt: data.createdAt?.toISOString(),
                  lastUpdatedAt: data.lastUpdatedAt?.toISOString(),
                },
              });
            }}
          />
          <IconButton
            icon="trash"
            size={20}
            color={theme.headerTint || "#ffffff"}
            onPress={async () => {
              Alert.alert(
                "Confirm Deletion",
                "Are you sure you want to delete this task?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "OK",
                    onPress: async () => {
                      try {
                        await taskContext.deleteTask(data.id);
                        navigation.goBack();
                      } catch (error) {
                        Alert.alert(
                          "Delete Failed",
                          error.message || "Could not delete task."
                        );
                      }
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
  }, [navigation, data, theme, taskContext.deleteTask]);

  const handleOpenCommentModal = () => {
    setIsCommentModalVisible(true);
  };

  const handleSubmitComment = async (comment) => {
    setIsCommentModalVisible(false); // Close modal immediately
    const completionComment = comment || "";
    try {
      await taskContext.updateTask(data.id, {
        ...data,
        completed: true,
        completionComment: completionComment.trim(),
        // dueDate: data.dueDate // already in ...data
      });
      // Only navigate back if the update was successful,
      // context will set error state if it fails.
      // The component might re-render due to taskContext.isLoading changing.
      // If no error, and not loading, then we can assume success or navigation will happen
      // due to task list changing. For now, let's rely on goBack after successful update.
      navigation.goBack(); // Or listen to taskContext.error to prevent goBack on failure
    } catch (error) {
      // Error is already set in context by updateTask.
      // Alert can be shown based on context.error if needed, or here directly.
      Alert.alert(
        "Update Failed",
        error.message || "Could not mark task as completed."
      );
    }
  };

  const styles = useMemo(
    // Styles remain largely the same, ensure your theme keys are present
    () =>
      StyleSheet.create({
        container: { flex: 1 },
        headerView: { flexDirection: "row", marginRight: 10 },
        scrollContainer: { margin: 20, paddingBottom: 40 },
        title: {
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          fontFamily: "deliusBold",
          fontSize: 22,
          textAlign: "center",
          fontWeight: "600",
          marginBottom: 15,
        },
        detailsContainer: {
          padding: 15,
          marginVertical: 10,
          alignItems: "center",
          backgroundColor: theme.cardBackgroundTransparent || "rgba(0,0,0,0.1)",
          borderRadius: 8,
        },
        detailsText: {
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          fontFamily: "delius",
          fontSize: 17,
          textAlign: "center",
          lineHeight: 25,
        },
        metaContainer: { paddingVertical: 8, alignItems: "center" },
        metaText: {
          color:
            theme.textSecondaryOnGradient ||
            theme.primaryLightGray ||
            "#E0E0E0",
          fontFamily: "delius",
          fontSize: 13,
        },
        teamAssignText: {
          color: theme.accent || theme.primary,
          fontFamily: "deliusBold",
          fontSize: 14,
          marginTop: 10,
        },
        completionCommentSection: {
          marginTop: 15,
          padding: 10,
          backgroundColor:
            theme.cardBackgroundTransparent || "rgba(0,0,0,0.05)",
          borderRadius: 8,
        },
        completionCommentLabel: {
          color: theme.textSecondaryOnGradient || theme.primaryLightGray,
          fontFamily: "deliusBold",
          fontSize: 14,
          marginBottom: 5,
        },
        completionCommentText: {
          color: theme.textPrimaryOnGradient || theme.primaryWhite,
          fontFamily: "delius",
          fontSize: 15,
          lineHeight: 22,
        },
      }),
    [theme]
  );

  return (
    <LinearGradient
      colors={[
        theme.gradientStart || "#3b0940",
        theme.gradientEnd || "#d7d1d3",
      ]}
      style={styles.container}
    >
      <CompletionCommentModal
        visible={isCommentModalVisible}
        onClose={() => setIsCommentModalVisible(false)}
        onSubmit={handleSubmitComment}
        initialComment={data.completionComment}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.title}>{data.title || "Task Details"}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>
            {data.detail || "No details provided."}
          </Text>
        </View>

        {data.assignedTeamReviewerUid === APPREC8_TEAM_REVIEWER_UID && (
          <View style={styles.metaContainer}>
            <Text style={styles.teamAssignText}>
              Assigned to Apprec8 Team for Review
            </Text>
          </View>
        )}

        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>Due on: {formattedDueDate}</Text>
        </View>
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>Created: {formattedCreatedAt}</Text>
        </View>
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>
            Last Updated: {formattedLastUpdatedAt}
          </Text>
        </View>

        {data.completed &&
          data.completionComment &&
          data.completionComment.trim() !== "" && ( // Only show if comment is not empty
            <View style={styles.completionCommentSection}>
              <Text style={styles.completionCommentLabel}>
                Completion Comment:
              </Text>
              <Text style={styles.completionCommentText}>
                {data.completionComment}
              </Text>
            </View>
          )}

        {!data.completed && (
          <PrimaryButton
            onPress={handleOpenCommentModal}
            style={{ marginTop: 25 }}
            disabled={taskContext.isLoading}
          >
            {taskContext.isLoading ? (
              <ActivityIndicator color={theme.textOnPrimary || "#FFFFFF"} />
            ) : (
              "Mark Completed"
            )}
          </PrimaryButton>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default TaskDetails;

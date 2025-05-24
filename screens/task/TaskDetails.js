// screens/task/TaskDetails.js
import React, {
  useContext,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  // Alert, // We'll replace Alert.alert for deletion
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import PrimaryButton from "../../components/PrimaryButton";
import IconButton from "../../components/ui/IconButton";
import { formatDate } from "../../components/utils/date";
import { TasksContext } from "../../store/tasks-context";
import { APPREC8_TEAM_REVIEWER_UID } from "../../config/appConfig";
import CompletionCommentModal from "../../components/common/CompletionCommentModal";
import ConfirmationModal from "../../components/common/ConfirmationModel"; // <<< IMPORT NEW MODAL
import { useFocusEffect } from "@react-navigation/native";
import { Alert } from "react-native"; // Keep Alert for other general messages if needed

const TaskDetails = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { tasks, isLoading, error, updateTask, deleteTask, clearError } =
    useContext(TasksContext);
  const taskDataFromRoute = route?.params?.data || {};

  useFocusEffect(
    useCallback(() => {
      console.log("TaskDetails focused. Navigation:", navigation);
      if (error && clearError) {
        // clearError();
      }
      return () => {
        console.log("TaskDetails unfocused.");
      };
    }, [navigation, error, clearError])
  );

  const currentTaskFromContext = tasks.find(
    (t) => t.id === taskDataFromRoute.id
  );
  const initialTaskData = currentTaskFromContext || taskDataFromRoute;

  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false); // <<< State for delete modal

  const ensureDateObject = useCallback((dateInput) => {
    /* ... same ... */ if (!dateInput) return null;
    if (dateInput instanceof Date && !isNaN(dateInput)) return dateInput;
    const parsed = new Date(dateInput);
    return isNaN(parsed) ? null : parsed;
  }, []);
  const data = useMemo(
    () => ({
      /* ... same ... */ ...initialTaskData,
      dueDate: ensureDateObject(initialTaskData.dueDate),
      createdAt: ensureDateObject(initialTaskData.createdAt),
      lastUpdatedAt: ensureDateObject(initialTaskData.lastUpdatedAt),
      completionComment: initialTaskData.completionComment || "",
    }),
    [initialTaskData, ensureDateObject]
  );
  const formattedDueDate = data.dueDate ? formatDate(data.dueDate) : "Not set";
  const formattedCreatedAt = data.createdAt
    ? formatDate(data.createdAt)
    : "N/A";
  const formattedLastUpdatedAt = data.lastUpdatedAt
    ? formatDate(data.lastUpdatedAt)
    : "N/A";

  const confirmDeleteTask = async () => {
    setIsDeleteConfirmVisible(false); // Close modal first
    if (!data.id) {
      Alert.alert("Error", "Task ID is missing, cannot delete.");
      return;
    }
    try {
      await deleteTask(data.id);
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate("Tasks");
      }
    } catch (err) {
      Alert.alert("Delete Failed", err.message || "Could not delete task.");
    }
  };

  // Updated handleDelete to show the custom modal
  const handleDeletePress = useCallback(() => {
    if (!data.id) {
      Alert.alert("Error", "Task ID is missing.");
      return;
    }
    setIsDeleteConfirmVisible(true); // Show custom modal
  }, [data.id]);

  const handleEdit = useCallback(() => {
    /* ... same ... */ if (!data.id) {
      Alert.alert("Error", "Task data is incomplete.");
      return;
    }
    if (!navigation || typeof navigation.navigate !== "function") {
      Alert.alert("Nav Error", "Cannot open task editor.");
      return;
    }
    navigation.navigate("TaskEditor", {
      data: {
        ...data,
        dueDate: data.dueDate?.toISOString(),
        createdAt: data.createdAt?.toISOString(),
        lastUpdatedAt: data.lastUpdatedAt?.toISOString(),
      },
    });
  }, [navigation, data]);
  const handleOpenCommentModal = () => setIsCommentModalVisible(true);
  const handleSubmitComment = useCallback(
    async (commentText) => {
      /* ... same ... */ setIsCommentModalVisible(false);
      const fc = commentText || "";
      if (!data.id) {
        Alert.alert("Error", "ID missing");
        return;
      }
      try {
        await updateTask(data.id, {
          title: data.title,
          detail: data.detail,
          dueDate: data.dueDate,
          completed: true,
          completionComment: fc.trim(),
        });
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate("Tasks");
        }
      } catch (e) {
        Alert.alert("Update Failed", e.message || "Could not mark complete");
      }
    },
    [updateTask, data, navigation]
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        /* ... same styles ... */
        safeArea: {
          flex: 1,
          backgroundColor: theme.gradientStart || "#3b0940",
        },
        container: { flex: 1 },
        customHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingTop: Platform.OS === "android" ? 15 : 10,
          height: 56,
        },
        headerActionsContainer: { flexDirection: "row" },
        headerActionSpacer: { width: 16 },
        scrollContainer: {
          paddingHorizontal: 20,
          paddingBottom: 40,
          paddingTop: 5,
        },
        title: {
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          fontFamily: "deliusBold",
          fontSize: 24,
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: 20,
          marginTop: 10,
        },
        detailsContainer: {
          padding: 15,
          marginVertical: 10,
          backgroundColor: theme.cardBackgroundTransparent || "rgba(0,0,0,0.1)",
          borderRadius: 8,
        },
        detailsText: {
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          fontFamily: "delius",
          fontSize: 17,
          textAlign: "left",
          lineHeight: 25,
        },
        metaContainer: {
          paddingVertical: 6,
          alignItems: "flex-start",
          width: "100%",
        },
        metaText: {
          color:
            theme.textSecondaryOnGradient ||
            theme.primaryLightGray ||
            "#E0E0E0",
          fontFamily: "delius",
          fontSize: 14,
        },
        teamAssignText: {
          color: theme.accent || theme.primary,
          fontFamily: "deliusBold",
          fontSize: 14,
          marginTop: 5,
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
          fontStyle: "italic",
        },
        markCompleteButton: { marginTop: 30, marginBottom: 20 },
        centeredMessageContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
      }),
    [theme]
  );

  // ... (loading and no data return statements remain the same) ...
  if (!data || (!data.id && !isLoading)) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={[
            theme.gradientStart || "#3b0940",
            theme.gradientEnd || "#d7d1d3",
          ]}
          style={styles.container}
        >
          <View style={styles.centeredMessageContainer}>
            <Text style={styles.title}>
              Task not found or data is incomplete.
            </Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }
  if (isLoading && (!data || !data.id)) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={[
            theme.gradientStart || "#3b0940",
            theme.gradientEnd || "#d7d1d3",
          ]}
          style={styles.container}
        >
          <View style={styles.centeredMessageContainer}>
            <ActivityIndicator
              size="large"
              color={theme.primaryWhite || "#FFFFFF"}
            />
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
          <IconButton
            icon={Platform.OS === "ios" ? "chevron-back" : "arrow-back"}
            size={28}
            color={theme.headerTint || "#ffffff"}
            onPress={() =>
              navigation.canGoBack()
                ? navigation.goBack()
                : navigation.navigate("Tasks")
            }
          />
          <View style={styles.headerActionsContainer}>
            {!data.completed && (
              <IconButton
                icon="pencil"
                size={24}
                color={theme.headerTint || "#ffffff"}
                onPress={handleEdit}
              />
            )}
            <View style={styles.headerActionSpacer} />
            <IconButton
              icon="trash"
              size={24}
              color={theme.headerTint || "#ffffff"}
              onPress={handleDeletePress} // <<< Use new handler
            />
          </View>
        </View>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          visible={isDeleteConfirmVisible}
          title="Confirm Deletion"
          message="Are you sure you want to delete this task? This action cannot be undone."
          onCancel={() => setIsDeleteConfirmVisible(false)}
          onConfirm={confirmDeleteTask}
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonColor={theme.danger || "#dc3545"} // Use a danger color for confirm
        />

        {/* Completion Comment Modal (already present) */}
        <CompletionCommentModal
          visible={isCommentModalVisible}
          onClose={() => setIsCommentModalVisible(false)}
          onSubmit={handleSubmitComment}
          initialComment={data.completionComment || ""}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* ... (rest of the content: title, details, meta, completion comment, button) ... */}
          <Text style={styles.title}>{data.title}</Text>

          {data.assignedTeamReviewerUid === APPREC8_TEAM_REVIEWER_UID && (
            <View
              style={[
                styles.metaContainer,
                { alignItems: "center", marginBottom: 10 },
              ]}
            >
              <Text style={styles.teamAssignText}>
                Assigned to Apprec8 Team for Review
              </Text>
            </View>
          )}
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsText}>
              {data.detail || "No details provided."}
            </Text>
          </View>
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
            data.completionComment.trim() !== "" && (
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
              style={styles.markCompleteButton}
              disabled={isLoading}
            >
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color={theme.textOnPrimary || "#FFFFFF"}
                />
              )}
              {!isLoading && "Mark Completed"}
            </PrimaryButton>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default TaskDetails;

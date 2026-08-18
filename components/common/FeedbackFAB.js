// components/common/FeedbackFAB.js
import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable, // For the dropdown trigger
} from "react-native";
import {
  FAB,
  Portal,
  Modal, // This is Paper's Modal for the feedback input
  TextInput,
  Button as PaperButton,
  Text,
  IconButton,
  ActivityIndicator,
  Menu,
} from "react-native-paper";
import functions from "@react-native-firebase/functions";
import auth from "@react-native-firebase/auth";
import { useTheme } from "../../context/ThemeContext"; // Adjust path if your structure is different
import InfoModal from "./InfoModal"; // Adjust path

const MIN_CHARS_ISSUE_DESC = 10;
const MAX_CHARS_COMMENT = 100; // For Like, Dislike, and Issue description
const MIN_CHARS_DISLIKE_COMMENT = 10;

const issueCategories = [
  { label: "Select a category...", value: "" },
  { label: "Typo/Spelling Error", value: "typo_spelling" },
  { label: "Incorrect Information", value: "incorrect_info" },
  { label: "Broken Image/Link", value: "broken_media" },
  { label: "Feature Not Working", value: "feature_bug" },
  { label: "Other", value: "other" },
];

/**
 * @typedef {object} ContentContext
 * @property {'question' | 'quiz_overall' | 'study_material_page' | string} type
 * @property {string} id
 * @property {string} [parentId]
 * @property {string} [titlePreview]
 */
const FeedbackFAB = ({
  contentContext = null,
  style = {},
  visible = true,
  customFabStyle = {},
  customIcon = "message-outline",
  extraActions = [],
}) => {
  const { theme } = useTheme();
  const C = theme.appColors || theme; // Consolidate theme access
  const [fabOpen, setFabOpen] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState(null); // 'like', 'dislike', 'report_issue'
  const [feedbackText, setFeedbackText] = useState("");
  const [textInputError, setTextInputError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState("");
  const [infoModalMessage, setInfoModalMessage] = useState("");

  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [selectedIssueCategory, setSelectedIssueCategory] = useState("");

  const openCategoryMenu = () => setCategoryMenuVisible(true);
  const closeCategoryMenu = () => setCategoryMenuVisible(false);

  const handleCategorySelect = (categoryValue) => {
    setSelectedIssueCategory(categoryValue);
    setTextInputError(""); // Clear potential category error
    closeCategoryMenu();
  };

  useEffect(() => {
    // If the FAB is globally hidden (e.g., by parent gesture), ensure its internal menu is also closed.
    if (!visible && fabOpen) {
      setFabOpen(false);
    }
  }, [visible, fabOpen]);

  const onFabStateChange = ({ open }) => {
    // Only allow opening if the FAB itself is meant to be visible
    if (visible) {
      setFabOpen(open);
    } else {
      setFabOpen(false); // Ensure it's closed if parent hides it
    }
  };

  const handleFabActionPress = (mode) => {
    setModalMode(mode);
    setFabOpen(false); // Close the FAB group
    setSelectedIssueCategory(""); // Reset category
    setFeedbackText(""); // Reset text
    setTextInputError(""); // Reset error
    setFeedbackModalVisible(true); // Show the feedback input modal
  };

  // Effect to reset modal state when it's closed
  useEffect(() => {
    if (!feedbackModalVisible) {
      // Delay reset to allow modal to animate out
      const timer = setTimeout(() => {
        setModalMode(null);
        setFeedbackText("");
        setTextInputError("");
        setIsSubmitting(false);
        setSelectedIssueCategory("");
        setCategoryMenuVisible(false);
      }, 250); // Adjust timing if needed
      return () => clearTimeout(timer);
    }
  }, [feedbackModalVisible]);

  const validateInput = useCallback(() => {
    setTextInputError(""); // Clear previous errors
    if (modalMode === "report_issue") {
      if (!selectedIssueCategory) {
        setTextInputError("Please select an issue category.");
        return false;
      }
      if (feedbackText.trim().length < MIN_CHARS_ISSUE_DESC) {
        setTextInputError(
          `Please describe the issue (min ${MIN_CHARS_ISSUE_DESC} characters).`
        );
        return false;
      }
    } else if (modalMode === "dislike") {
      if (feedbackText.trim().length < MIN_CHARS_DISLIKE_COMMENT) {
        setTextInputError(
          `Please tell us what can be improved (min ${MIN_CHARS_DISLIKE_COMMENT} characters).`
        );
        return false;
      }
    }
    // For 'like', text is optional or has different validation if any
    return true;
  }, [feedbackText, modalMode, selectedIssueCategory]);

  const showInfoAlert = (title, message) => {
    setInfoModalTitle(title);
    setInfoModalMessage(message);
    setInfoModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;

    const currentUser = auth().currentUser;
    if (!currentUser) {
      showInfoAlert(
        "Authentication Error",
        "You must be logged in to submit feedback."
      );
      return;
    }

    setIsSubmitting(true);
    let reactionValue = null;
    if (modalMode === "like") reactionValue = "like";
    if (modalMode === "dislike") reactionValue = "dislike";

    const payload = {
      contentContext: contentContext || {
        id: "unknown_fab_content", // Fallback if context is missing
        type: "unknown_fab_content",
      },
      entryPoint: `${modalMode || "unknown"}_fab`,
      reaction: reactionValue,
      feedbackText: feedbackText.trim(),
      feedbackType: modalMode === "report_issue" ? "issue_report" : "general", // Corrected: "general" for like/dislike
      clientTimestamp: new Date().toISOString(),
    };

    if (modalMode === "report_issue") {
      payload.issueCategory = selectedIssueCategory;
    }

    try {
      // console.log("[FeedbackFAB] Submitting feedback payload:", payload);
      const submitFn = functions().httpsCallable("submitFeedback");
      const result = await submitFn(payload);

      if (result.data?.status === "success") {
        setFeedbackModalVisible(false); // Close modal on success
        showInfoAlert("Feedback Sent", "Thank you for your feedback!");
      } else {
        // Handle specific error messages from backend if available
        throw new Error(
          result.data?.message ||
            "Submission failed due to an unknown server response."
        );
      }
    } catch (e) {
      console.error("[FeedbackFAB] handleSubmit error:", e);
      showInfoAlert(
        "Submission Error",
        `Could not submit feedback: ${e.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubmitButtonText = () => {
    switch (modalMode) {
      case "like":
      case "dislike":
        return "Submit";
      case "report_issue":
        return "Submit Report";
      default:
        return "Submit";
    }
  };

  let placeholderText = "Optional comment...";
  if (modalMode === "report_issue") {
    placeholderText = `Describe the issue (min ${MIN_CHARS_ISSUE_DESC}, max ${MAX_CHARS_COMMENT} chars)...`;
  } else if (modalMode === "dislike") {
    placeholderText = `What can be improved? (min ${MIN_CHARS_DISLIKE_COMMENT}, max ${MAX_CHARS_COMMENT} chars)...`;
  } else if (modalMode === "like") {
    placeholderText = `Optional comment (max ${MAX_CHARS_COMMENT} chars)...`;
  }

  const fabActions = [
    {
      icon: "thumb-up-outline",
      label: "Like",
      onPress: () => handleFabActionPress("like"),
      color: C.fabIconColor || C.primaryWhite,
      style: { backgroundColor: C.fabActionBackground || C.primary },
      small: false,
    },
    {
      icon: "thumb-down-outline",
      label: "Dislike",
      onPress: () => handleFabActionPress("dislike"),
      color: C.fabIconColor || C.primaryWhite,
      style: { backgroundColor: C.fabActionBackground || C.primary },
      small: false,
    },
    {
      icon: "bug-outline",
      label: "Report Issue",
      onPress: () => handleFabActionPress("report_issue"),
      color: C.fabIconColor || C.primaryWhite,
      style: { backgroundColor: C.fabActionBackground || C.primary },
      small: false,
    },
  ].reverse(); // Reversed so "Report Issue" is often at the top of the expanded list

  const combinedActions = [
    ...extraActions,
    ...fabActions,
  ];

  // Define styles inside the component or ensure C (theme colors) is stable
  const styles = StyleSheet.create({
    modalContainer: {
      backgroundColor: C.cardBackground || C.background || "#FFFFFF",
      paddingHorizontal: 20,
      paddingTop: 15,
      paddingBottom: 20,
      marginHorizontal: 20,
      borderRadius: 12,
      maxHeight: "90%", // Ensure modal doesn't take full screen height
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
    },
    headerIcon: {
      // IconButton's own size will define its dimensions
    },
    textInputStyle: {
      backgroundColor: C.inputBackground || C.background || "transparent",
      marginBottom: 5, // Small space before error text
      textAlignVertical: "top", // For multiline
    },
    errorText: {
      color: C.appWarning || C.errorRed || "#B00020",
      fontSize: 13,
      marginBottom: 10, // Space after error text
      marginTop: 2, // Space before error text if it appears
    },
    modalActions: {
      flexDirection: "row",
      justifyContent: "center", // Center the button or ActivityIndicator
      marginTop: 20,
      alignItems: "center",
    },
    buttonStyle: {
      minWidth: "50%", // Ensure button is reasonably sized
      maxWidth: "80%",
    },
    // FAB main button style
    fabStyleForMainButton: {
      backgroundColor: C.fabBackground || C.primary,
      ...customFabStyle,
    },
    // Dropdown styles
    dropdownAnchor: {
      height: 50, // Standard input height
      borderWidth: 1,
      borderColor: C.border || C.placeholder || "#757575",
      borderRadius: 4, // Standard Paper TextInput border radius
      paddingHorizontal: 12,
      justifyContent: "center",
      marginBottom: 10, // Space below dropdown before text input
      backgroundColor: C.inputBackground || C.background || "transparent",
    },
    dropdownAnchorText: {
      color: C.textPrimary || "#000000",
      fontSize: 16,
    },
    dropdownErrorBorder: {
      borderColor: C.appWarning || C.errorRed || "#B00020", // Highlight if error related to category
    },
    menuItemText: {
      color: C.textPrimary || "#000000", // Ensure menu item text is themed
      fontSize: 16,
    },
  });

  if (!visible && !fabOpen) {
    // If FAB is not visible and its menu is not open, render nothing.
    // This prevents it from occupying space or handling gestures when hidden by parent.
    return null;
  }

  const selectedCategoryLabel =
    issueCategories.find((cat) => cat.value === selectedIssueCategory)?.label ||
    "Select a category...";

  const renderModalHeaderContent = () => {
    if (modalMode === "like") {
      return (
        <IconButton
          icon="thumb-up"
          size={32}
          iconColor={C.primary || theme.primary} // Use theme for consistency
          style={styles.headerIcon}
        />
      );
    }
    if (modalMode === "dislike") {
      return (
        <IconButton
          icon="thumb-down"
          size={32}
          iconColor={C.primary || theme.primary}
          style={styles.headerIcon}
        />
      );
    }
    if (modalMode === "report_issue") {
      return (
        <IconButton
          icon="bug"
          size={32}
          iconColor={C.warning || theme.warning} // Use warning color for issues
          style={styles.headerIcon}
        />
      );
    }
    return null; // Fallback for no mode or unknown mode
  };

  return (
    <>
      <Portal>
        <Modal
          visible={feedbackModalVisible}
          onDismiss={() => {
            if (!isSubmitting) setFeedbackModalVisible(false);
          }}
          contentContainerStyle={styles.modalContainer}
          dismissable={!isSubmitting} // Prevent dismissal while submitting
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0} // Adjust as needed
          >
            <View>
              {/* Modal Header with Icon */}
              <View style={styles.modalHeader}>
                {renderModalHeaderContent()}
              </View>

              {/* Issue Category Dropdown (only for 'report_issue' mode) */}
              {modalMode === "report_issue" && (
                <Menu
                  visible={categoryMenuVisible}
                  onDismiss={closeCategoryMenu}
                  anchor={
                    <Pressable
                      onPress={openCategoryMenu}
                      style={[
                        styles.dropdownAnchor,
                        textInputError.includes("category") && // Apply error style if category is the issue
                          styles.dropdownErrorBorder,
                      ]}
                    >
                      <Text style={styles.dropdownAnchorText}>
                        {selectedCategoryLabel}
                      </Text>
                    </Pressable>
                  }
                  style={{ width: "90%", alignSelf: "center" }} // Ensure menu width is reasonable
                >
                  {issueCategories.map(
                    (category) =>
                      // Don't show the "Select a category..." placeholder in the dropdown items
                      category.value !== "" && (
                        <Menu.Item
                          key={category.value}
                          onPress={() => handleCategorySelect(category.value)}
                          title={
                            <Text style={styles.menuItemText}>
                              {category.label}
                            </Text>
                          } // Ensure text theming
                        />
                      )
                  )}
                </Menu>
              )}

              {/* Feedback Text Input */}
              <TextInput
                label={placeholderText}
                value={feedbackText}
                onChangeText={setFeedbackText}
                multiline
                numberOfLines={4}
                style={styles.textInputStyle}
                error={
                  !!textInputError &&
                  (modalMode !== "like" || // Show error for dislike/issue if textInputError is set
                    (modalMode === "like" && // For 'like', error only if text is present but invalid (e.g., too short if it had min length)
                      feedbackText.trim().length > 0 &&
                      feedbackText.trim().length < 1)) // Example: if 'like' had a min length of 1 if text provided
                }
                maxLength={MAX_CHARS_COMMENT}
                disabled={isSubmitting}
                mode="outlined" // Consistent Paper UI
                outlineColor={C.border || C.placeholder}
                activeOutlineColor={C.appPrimary || C.primary}
                placeholderTextColor={C.placeholder || C.textSecondary}
                theme={{
                  colors: {
                    text: C.textPrimary || "#000000",
                    placeholder: C.placeholder || C.textSecondary || "#757575",
                    primary: C.primary || "#6200EE", 
                    background: C.inputBackground || C.background || "transparent",
                    onSurface: C.textPrimary || "#000000", 
                    outline: C.border || C.placeholder || "#757575", 
                  },
                }}
              />
              {textInputError ? (
                <Text style={styles.errorText}>{textInputError}</Text>
              ) : null}

              {/* Action Buttons (Submit/Cancel) */}
              <View style={styles.modalActions}>
                {isSubmitting ? (
                  <ActivityIndicator
                    animating={true}
                    color={C.appPrimary || C.primary}
                  />
                ) : (
                  <PaperButton
                    onPress={handleSubmit}
                    disabled={
                      isSubmitting || // General submission lock
                      // Disable if 'dislike' and comment is too short
                      (modalMode === "dislike" &&
                        feedbackText.trim().length <
                          MIN_CHARS_DISLIKE_COMMENT) ||
                      // Disable if 'report_issue' and category or description is missing/too short
                      (modalMode === "report_issue" &&
                        (!selectedIssueCategory ||
                          feedbackText.trim().length < MIN_CHARS_ISSUE_DESC))
                    }
                    style={styles.buttonStyle}
                    buttonColor={C.appPrimary || C.primary} // Themed button color
                    textColor={
                      C.buttonText || C.textOnAppPrimary || C.primaryWhite
                    } // Themed text color
                    mode="contained"
                  >
                    {getSubmitButtonText()}
                  </PaperButton>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </Portal>

      {/* Info Modal for alerts/confirmations */}
      <InfoModal
        visible={infoModalVisible}
        title={infoModalTitle}
        message={infoModalMessage}
        onDismiss={() => setInfoModalVisible(false)}
      />

      {/* The actual FAB Group */}
      <FAB.Group
        style={style}
        open={fabOpen}
        visible={visible} // Controlled by parent screen's gesture state
        icon={fabOpen ? "close-circle-outline" : customIcon}
        actions={combinedActions}
        onStateChange={onFabStateChange}
        onPress={() => {
          // Only toggle if the FAB is meant to be visible (prop `visible` is true)
          if (visible) {
            setFabOpen((prev) => !prev);
          }
        }}
        fabStyle={styles.fabStyleForMainButton} // Themed main FAB button
        color={C.fabIconColor || C.primaryWhite} // Themed icon color for main FAB
      />
    </>
  );
};

export default FeedbackFAB;

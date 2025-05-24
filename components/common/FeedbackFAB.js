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
import { useTheme } from "../../context/ThemeContext";
import InfoModal from "./InfoModal";

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
const FeedbackFAB = ({ contentContext, visible = true }) => {
  const { theme } = useTheme();
  const C = theme.appColors || theme;
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
    if (!visible && fabOpen) {
      setFabOpen(false);
    }
  }, [visible, fabOpen]);

  const onFabStateChange = ({ open }) => {
    setFabOpen(open);
  };

  const handleFabActionPress = (mode) => {
    setModalMode(mode);
    setFabOpen(false);
    setSelectedIssueCategory("");
    setFeedbackText("");
    setTextInputError("");
    setFeedbackModalVisible(true);
  };

  useEffect(() => {
    if (!feedbackModalVisible) {
      setTimeout(() => {
        setModalMode(null);
        setFeedbackText("");
        setTextInputError("");
        setIsSubmitting(false);
        setSelectedIssueCategory("");
        setCategoryMenuVisible(false);
      }, 250);
    }
  }, [feedbackModalVisible]);

  const validateInput = useCallback(() => {
    setTextInputError("");
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
      showInfoAlert("Authentication Error", "You must be logged in.");
      return;
    }

    setIsSubmitting(true);
    let reactionValue = null;
    if (modalMode === "like") reactionValue = "like";
    if (modalMode === "dislike") reactionValue = "dislike";

    const payload = {
      contentContext: contentContext || {
        id: "unknown_fab_content",
        type: "unknown_fab_content",
      },
      entryPoint: `${modalMode || "unknown"}_fab`,
      reaction: reactionValue,
      feedbackText: feedbackText.trim(),
      feedbackType: modalMode === "report_issue" ? "issue_report" : "general",
      clientTimestamp: new Date().toISOString(),
    };

    if (modalMode === "report_issue") {
      payload.issueCategory = selectedIssueCategory;
    }

    try {
      console.log("[FeedbackFAB] Submitting:", payload);
      const submitFn = functions().httpsCallable("submitFeedback");
      const result = await submitFn(payload);
      if (result.data?.status === "success") {
        setFeedbackModalVisible(false);
        showInfoAlert("Feedback Sent", "Thank you!");
      } else {
        throw new Error(result.data?.message || "Submission failed.");
      }
    } catch (e) {
      console.error("[FeedbackFAB] handleSubmit error:", e);
      showInfoAlert("Submission Error", `Could not submit: ${e.message}`);
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
      color: C.fabIconColor,
      style: { backgroundColor: C.fabBackground },
      small: false,
    },
    {
      icon: "thumb-down-outline",
      label: "Dislike",
      onPress: () => handleFabActionPress("dislike"),
      color: C.fabIconColor,
      style: { backgroundColor: C.fabBackground },
      small: false,
    },
    {
      icon: "bug-outline",
      label: "Report Issue",
      onPress: () => handleFabActionPress("report_issue"),
      color: C.fabIconColor,
      style: { backgroundColor: C.fabBackground },
      small: false,
    },
  ].reverse();

  const styles = StyleSheet.create({
    modalContainer: {
      backgroundColor: C.cardBackground || C.background || "#FFFFFF",
      paddingHorizontal: 20, // Horizontal padding
      paddingTop: 15, // Reduced top padding for the whole modal content area
      paddingBottom: 20, // Bottom padding
      marginHorizontal: 20,
      borderRadius: 12,
      maxHeight: "90%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15, // Reduced space below the icon, adjust as needed (was 20, then 15)
      // minHeight is removed, header will take the icon's height + any internal padding of IconButton
    },
    headerIcon: {
      // IconButton's own size (32) will define its dimensions
    },
    textInputStyle: {
      backgroundColor: C.inputBackground || C.background || "transparent",
      marginBottom: 5,
      textAlignVertical: "top",
    },
    errorText: {
      color: C.appWarning || C.errorRed || "#B00020",
      fontSize: 13,
      marginBottom: 10,
      marginTop: 2,
    },
    modalActions: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 20,
      alignItems: "center",
    },
    buttonStyle: {
      minWidth: "50%",
      maxWidth: "80%",
    },
    fabStyleForMainButton: {
      backgroundColor: C.fabBackground || C.primary,
    },
    dropdownAnchor: {
      height: 50,
      borderWidth: 1,
      borderColor: C.border || C.placeholder || "#757575",
      borderRadius: 4,
      paddingHorizontal: 12,
      justifyContent: "center",
      marginBottom: 10, // Space below dropdown before text input
      backgroundColor: C.inputBackground || C.background || "transparent",
    },
    dropdownAnchorText: {
      fontSize: 16,
      color: selectedIssueCategory
        ? C.inputText || C.textPrimary
        : C.placeholder || C.textSecondary,
    },
    dropdownErrorBorder: {
      borderColor: C.appWarning || C.errorRed || "#B00020",
    },
    menuItemText: {
      color: C.textPrimary || "#000000",
      fontSize: 16,
    },
  });

  if (!visible) {
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
          iconColor={C.primary || theme.primary}
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
          iconColor={C.warning || theme.warning}
          style={styles.headerIcon}
        />
      );
    }
    return null;
  };

  return (
    <>
      <Portal>
        <Modal
          visible={feedbackModalVisible}
          onDismiss={() => {
            if (!isSubmitting) setFeedbackModalVisible(false);
          }}
          contentContainerStyle={styles.modalContainer} // Applied here
          dismissable={!isSubmitting}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0} // May need adjustment
          >
            <View>
              {/* This View wraps content inside KeyboardAvoidingView */}
              <View style={styles.modalHeader}>
                {renderModalHeaderContent()}
              </View>
              {modalMode === "report_issue" && (
                <Menu
                  visible={categoryMenuVisible}
                  onDismiss={closeCategoryMenu}
                  anchor={
                    <Pressable
                      onPress={openCategoryMenu}
                      style={[
                        styles.dropdownAnchor,
                        textInputError.includes("category") &&
                          styles.dropdownErrorBorder,
                      ]}
                    >
                      <Text style={styles.dropdownAnchorText}>
                        {selectedCategoryLabel}
                      </Text>
                    </Pressable>
                  }
                  style={{ width: "90%", alignSelf: "center" }} // Paper Menu might need explicit width
                >
                  {issueCategories.map(
                    (category) =>
                      category.value !== "" && (
                        <Menu.Item
                          key={category.value}
                          onPress={() => handleCategorySelect(category.value)}
                          title={
                            <Text style={styles.menuItemText}>
                              {category.label}
                            </Text>
                          }
                        />
                      )
                  )}
                </Menu>
              )}
              <TextInput
                label={placeholderText}
                value={feedbackText}
                onChangeText={setFeedbackText}
                multiline
                numberOfLines={4}
                style={styles.textInputStyle}
                error={
                  !!textInputError &&
                  (modalMode !== "like" ||
                    (modalMode === "like" &&
                      feedbackText.trim().length > 0 &&
                      feedbackText.trim().length < 1))
                }
                maxLength={MAX_CHARS_COMMENT}
                disabled={isSubmitting}
                mode="outlined"
                outlineColor={C.border || C.placeholder}
                activeOutlineColor={C.appPrimary || C.primary}
                placeholderTextColor={C.placeholder || C.textSecondary}
                theme={{
                  colors: {
                    text: C.inputText || C.textPrimary || "#000000",
                    placeholder: C.placeholder || C.textSecondary || "#757575",
                    primary: C.appPrimary || C.primary || "#6200EE",
                    background:
                      C.inputBackground || C.background || "transparent",
                    onSurface: C.inputText || C.textPrimary || "#000000",
                    outline: C.border || C.placeholder || "#757575",
                  },
                }}
              />
              {textInputError ? (
                <Text style={styles.errorText}>{textInputError}</Text>
              ) : null}
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
                      isSubmitting ||
                      (modalMode === "dislike" &&
                        feedbackText.trim().length <
                          MIN_CHARS_DISLIKE_COMMENT) ||
                      (modalMode === "report_issue" &&
                        (!selectedIssueCategory ||
                          feedbackText.trim().length < MIN_CHARS_ISSUE_DESC))
                    }
                    style={styles.buttonStyle}
                    buttonColor={C.appPrimary || C.primary}
                    textColor={
                      C.buttonText || C.textOnAppPrimary || C.primaryWhite
                    }
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

      <InfoModal
        visible={infoModalVisible}
        title={infoModalTitle}
        message={infoModalMessage}
        onDismiss={() => setInfoModalVisible(false)}
      />

      <FAB.Group
        open={fabOpen}
        visible={visible}
        icon={fabOpen ? "close-circle-outline" : "message-plus-outline"}
        actions={fabActions}
        onStateChange={onFabStateChange}
        onPress={() => {
          setFabOpen((prev) => !prev);
        }}
        fabStyle={styles.fabStyleForMainButton}
        color={C.fabIconColor || C.primaryWhite}
      />
    </>
  );
};

export default FeedbackFAB;

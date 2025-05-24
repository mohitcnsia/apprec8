// components/common/FeedbackFAB.js
import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  // Alert, // Replaced by InfoModal
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
} from "react-native-paper";
import functions from "@react-native-firebase/functions";
import auth from "@react-native-firebase/auth";
import { useTheme } from "../../context/ThemeContext";
import InfoModal from "./InfoModal"; // <<< IMPORT YOUR NEW InfoModal

const MIN_CHARS = 10;
const MIN_WORDS = 3;

const countWords = (str) => {
  if (!str || typeof str !== "string" || str.trim() === "") return 0;
  return str.trim().split(/\s+/).length;
};

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
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false); // Renamed from modalVisible
  const [modalMode, setModalMode] = useState(null);
  const [selectedReactionInModal, setSelectedReactionInModal] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [textInputError, setTextInputError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- State for InfoModal ---
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState("");
  const [infoModalMessage, setInfoModalMessage] = useState("");

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
    if (mode === "like") setSelectedReactionInModal("like");
    else if (mode === "dislike") setSelectedReactionInModal("dislike");
    else if (mode === "feedback")
      setSelectedReactionInModal("like"); // Default reaction for feedback
    else if (mode === "report_issue") setSelectedReactionInModal(null);
    setFeedbackModalVisible(true); // Show feedback input modal
  };

  // Effect to reset feedback modal state when it's closed
  useEffect(() => {
    if (!feedbackModalVisible) {
      setTimeout(() => {
        setModalMode(null);
        setSelectedReactionInModal(null);
        setFeedbackText("");
        setTextInputError("");
        setIsSubmitting(false); // Also reset submit state if modal closes unexpectedly
      }, 250); // Delay to allow modal animations to finish
    }
  }, [feedbackModalVisible]);

  const validateInput = useCallback(() => {
    setTextInputError("");
    let isTextMandatory =
      modalMode === "feedback" || modalMode === "report_issue";
    let msg = `Text must be at least ${MIN_CHARS} characters and ${MIN_WORDS} words.`;
    if (modalMode === "report_issue")
      msg = `Please describe the issue (min ${MIN_CHARS} chars, ${MIN_WORDS} words).`;

    if (
      isTextMandatory &&
      (feedbackText.trim().length < MIN_CHARS ||
        countWords(feedbackText) < MIN_WORDS)
    ) {
      setTextInputError(msg);
      return false;
    }
    return true;
  }, [feedbackText, modalMode]);

  const toggleReactionInModal = (reaction) => {
    if (modalMode !== "feedback") return; // Only allow toggling reaction in detailed feedback mode
    setSelectedReactionInModal((prev) => (prev === reaction ? null : reaction));
  };

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
    const payload = {
      contentContext: contentContext || {
        id: "unknown_fab_content",
        type: "unknown_fab_content",
      },
      entryPoint: `${modalMode || "unknown"}_fab`, // e.g., "like_fab", "feedback_fab"
      reaction: selectedReactionInModal, // "like", "dislike", or null
      feedbackText: feedbackText.trim(),
      feedbackType: modalMode === "report_issue" ? "issue_report" : "general", // More specific type
      clientTimestamp: new Date().toISOString(),
    };

    try {
      console.log("[FeedbackFAB] Submitting feedback:", payload);
      const submitFn = functions().httpsCallable("submitFeedback");
      const result = await submitFn(payload);
      console.log("[FeedbackFAB] Submission result:", result);

      if (result.data?.status === "success") {
        setFeedbackModalVisible(false); // Close input modal first
        showInfoAlert("Feedback Sent", "Thank you for your feedback!");
      } else {
        throw new Error(
          result.data?.message || "Submission failed due to a server issue."
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

  let getModalTitle = () => {
    switch (modalMode) {
      case "like":
        return "Liked this? Add a comment?";
      case "dislike":
        return "Disliked this? Add a comment?";
      case "feedback":
        return "Share Your Detailed Feedback";
      case "report_issue":
        return "Report an Issue";
      default:
        return "Provide Feedback";
    }
  };

  let getSubmitButtonText = () => {
    switch (modalMode) {
      case "like":
      case "dislike":
        return feedbackText.trim() ? "Submit Comment" : "Submit";
      case "feedback":
        return "Submit Feedback";
      case "report_issue":
        return "Submit Report";
      default:
        return "Submit";
    }
  };

  const isFeedbackTextRequired =
    modalMode === "feedback" || modalMode === "report_issue";
  const placeholderText = isFeedbackTextRequired
    ? modalMode === "report_issue"
      ? "Describe issue..."
      : "Feedback (required)..."
    : "Optional comment...";

  let fabActions = [
    {
      icon: "thumb-up",
      label: "Like",
      onPress: () => handleFabActionPress("like"),
      color: C.fabIconColor,
      style: { backgroundColor: C.fabBackground },
      small: false,
    },
    {
      icon: "thumb-down",
      label: "Dislike",
      onPress: () => handleFabActionPress("dislike"),
      color: C.fabIconColor,
      style: { backgroundColor: C.fabBackground },
      small: false,
    },
    {
      icon: "pencil-outline",
      label: "Feedback",
      onPress: () => handleFabActionPress("feedback"),
      color: C.fabIconColor,
      style: { backgroundColor: C.fabBackground },
      small: false,
    },
    {
      icon: "alert-circle-outline",
      label: "Report Issue",
      onPress: () => handleFabActionPress("report_issue"),
      color: C.fabIconColor,
      style: { backgroundColor: C.fabBackground },
      small: false,
    },
  ].reverse(); // Reverse so "Report Issue" is at the top of the speed dial if that's desired.

  // Define styles here or import from a separate file
  const styles = StyleSheet.create({
    modalContainer: {
      backgroundColor: C.modalBackground || C.background || "#FFFFFF", // Theme-aware background
      padding: 20,
      marginHorizontal: 20, // Give some horizontal margin to the modal
      borderRadius: C.cardBorderRadius || 10,
      elevation: 5,
      shadowColor: C.shadowColor || "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    modalContent: {
      // This is the inner content wrapper if modalContainer is just for background/padding
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: C.textPrimary || "#000000",
      flex: 1, // Allow title to take space
    },
    reactionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 15,
    },
    reactionIconStyle: {
      // Add any specific styling for reaction icons if needed
      marginHorizontal: 10,
    },
    reactionDisplayContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
      padding: 10,
      backgroundColor: C.surface || C.lightGray, // A subtle background
      borderRadius: C.itemBorderRadius || 5,
    },
    reactionDisplayText: {
      marginLeft: 10,
      fontSize: 16,
      color: C.textSecondary || "#333333",
    },
    textInputStyle: {
      marginBottom: 10,
      maxHeight: 150, // Limit height
      backgroundColor: C.inputBackground || C.background, // Themeable input background
    },
    errorText: {
      color: C.error || C.appError || "red",
      fontSize: 12,
      marginBottom: 10,
      marginLeft: 5, // Align with TextInput typically
    },
    modalActions: {
      flexDirection: "row",
      justifyContent: "flex-end", // Align buttons to the right
      marginTop: 10,
    },
    buttonStyle: {
      marginLeft: 8, // Space between buttons
      minWidth: 80, // Ensure buttons have a decent tap area
    },
    fabStyleForMainButton: {
      backgroundColor: C.fabBackground || C.primary || "#6200ee", // Themeable FAB background
      // Add other FAB specific styles if needed, like bottom, right positions
      // bottom: Platform.OS === 'ios' ? 20 : 0, // Example positioning
      // right: 0,
    },
    // Add any other styles you had in your original working file
  });

  if (!visible) {
    return null;
  }

  return (
    <>
      <Portal>
        {/* Feedback Input Modal (Paper.Modal) */}
        <Modal
          visible={feedbackModalVisible}
          onDismiss={() => {
            if (!isSubmitting) setFeedbackModalVisible(false);
          }}
          contentContainerStyle={styles.modalContainer}
          dismissable={!isSubmitting}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined} // "height" might also work
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // Adjust as needed
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{getModalTitle()}</Text>
                {!isSubmitting && (
                  <IconButton
                    icon="close"
                    size={24}
                    onPress={() => setFeedbackModalVisible(false)}
                    iconColor={C.textPrimary}
                  />
                )}
              </View>

              {modalMode === "feedback" && (
                <View style={styles.reactionButtonsContainer}>
                  <IconButton
                    icon={
                      selectedReactionInModal === "like"
                        ? "thumb-up"
                        : "thumb-up-outline"
                    }
                    size={32}
                    onPress={() => toggleReactionInModal("like")}
                    iconColor={
                      selectedReactionInModal === "like"
                        ? C.appAccent || C.primary
                        : C.textSecondary || C.placeholder
                    }
                    style={styles.reactionIconStyle}
                  />
                  <IconButton
                    icon={
                      selectedReactionInModal === "dislike"
                        ? "thumb-down"
                        : "thumb-down-outline"
                    }
                    size={32}
                    onPress={() => toggleReactionInModal("dislike")}
                    iconColor={
                      selectedReactionInModal === "dislike"
                        ? C.appAccent || C.primary
                        : C.textSecondary || C.placeholder
                    }
                    style={styles.reactionIconStyle}
                  />
                </View>
              )}

              {(modalMode === "like" || modalMode === "dislike") &&
                selectedReactionInModal && (
                  <View style={styles.reactionDisplayContainer}>
                    <IconButton
                      icon={
                        selectedReactionInModal === "like"
                          ? "thumb-up"
                          : "thumb-down"
                      }
                      size={28}
                      iconColor={C.appAccent || C.primary}
                    />
                    <Text style={styles.reactionDisplayText}>
                      {selectedReactionInModal === "like"
                        ? "You're about to like this."
                        : "You're about to dislike this."}
                    </Text>
                  </View>
                )}

              <TextInput
                label={placeholderText}
                value={feedbackText}
                onChangeText={setFeedbackText}
                multiline
                numberOfLines={4}
                style={styles.textInputStyle}
                error={!!textInputError}
                maxLength={1000}
                disabled={isSubmitting}
                mode="outlined"
                outlineColor={C.border || C.placeholder}
                activeOutlineColor={C.appPrimary || C.primary}
                placeholderTextColor={C.placeholder || C.textSecondary}
                theme={{
                  colors: {
                    text: C.inputText || C.textPrimary || "#000000",
                    placeholder: C.placeholder || C.textSecondary || "#757575",
                    primary: C.appPrimary || C.primary || "#6200EE", // Outline color when focused
                    background:
                      C.inputBackground || C.background || "transparent", // TextInput background
                    onSurface: C.inputText || C.textPrimary || "#000000", // For text on surface colored components
                    outline: C.border || C.placeholder || "#757575", // Default outline color
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
                    style={{ marginRight: 15 }}
                  />
                ) : (
                  <PaperButton
                    onPress={() => setFeedbackModalVisible(false)}
                    style={styles.buttonStyle}
                    textColor={C.appPrimary || C.primary}
                    mode="outlined" // Or "text" for less emphasis
                  >
                    Cancel
                  </PaperButton>
                )}
                <PaperButton
                  onPress={handleSubmit}
                  disabled={
                    isSubmitting ||
                    (isFeedbackTextRequired &&
                      !feedbackText.trim() &&
                      modalMode !== "like" &&
                      modalMode !== "dislike")
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
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </Portal>

      {/* Your App-Specific Info Modal */}
      <InfoModal
        visible={infoModalVisible}
        title={infoModalTitle}
        message={infoModalMessage}
        onDismiss={() => setInfoModalVisible(false)}
      />

      <FAB.Group
        open={fabOpen}
        visible={true} // Control overall visibility via the prop `visible` passed to FeedbackFAB
        icon={fabOpen ? "close-circle-outline" : "message-plus-outline"}
        actions={fabActions}
        onStateChange={onFabStateChange}
        onPress={() => {
          // If already open, the onStateChange will handle closing.
          // If closed, this will trigger onStateChange to open.
          // No need to manually setFabOpen here if onStateChange does it.
          // This onPress is for the main FAB itself.
          // If you want the main FAB press to ALSO open the speed dial,
          // it should call setFabOpen(true) or toggle it.
          // The default behavior of FAB.Group's onPress might already toggle the group.
          // Test this behavior. If `onPress` on `FAB.Group` is not needed
          // when `onStateChange` is used, it can be removed.
          // However, it's common to have it toggle `fabOpen`.
          setFabOpen((prev) => !prev);
        }}
        fabStyle={styles.fabStyleForMainButton}
        color={C.fabIconColor || C.primaryWhite} // Color for the main FAB icon
      />
    </>
  );
};

export default FeedbackFAB;

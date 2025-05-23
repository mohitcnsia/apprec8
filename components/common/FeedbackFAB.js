// components/common/FeedbackFAB.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import {
  FAB,
  Portal,
  Modal,
  TextInput,
  Button as PaperButton,
  Text,
  IconButton,
  ActivityIndicator,
} from "react-native-paper"; // PaperProvider removed, assuming it's at app root
import functions from "@react-native-firebase/functions";
import auth from "@react-native-firebase/auth";
import { useTheme } from "../../context/ThemeContext"; // Assuming path to your ThemeContext

// Helper function to count words
const countWords = (str) => {
  if (!str || typeof str !== "string" || str.trim() === "") {
    return 0;
  }
  return str.trim().split(/\s+/).length;
};

/**
 * @typedef {object} ContentContext
 * @property {'question' | 'quiz_overall' | 'study_material_page' | string} type
 * @property {string} id
 * @property {string} [parentId]
 * @property {string} [titlePreview]
 */

/**
 * FeedbackFAB component designed to work with the user's existing custom theme structure.
 * @param {object} props
 * @param {ContentContext} props.contentContext - Contextual info about the content.
 */
const FeedbackFAB = ({ contentContext }) => {
  const { theme } = useTheme(); // Get theme from your ThemeContext

  // Use appColors if present, otherwise fallback to root theme keys
  // This assumes your theme structure (from config/colors.js after my last suggestion)
  // is either theme.appColors.yourKey or theme.yourKey if appColors doesn't exist/not used yet
  const C = theme.appColors || theme; // C for Colors from theme

  const [fabState, setFabState] = useState({ open: false });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [selectedReactionInModal, setSelectedReactionInModal] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [textInputError, setTextInputError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFabStateChange = ({ open }) => setFabState({ open });
  const { open: fabOpen } = fabState;

  useEffect(() => {
    if (!modalVisible) {
      setTimeout(() => {
        setModalMode(null);
        setSelectedReactionInModal(null);
        setFeedbackText("");
        setTextInputError("");
        setIsSubmitting(false);
      }, 250);
    }
  }, [modalVisible]);

  const MIN_CHARS = 10;
  const MIN_WORDS = 3;

  const validateInput = useCallback(() => {
    setTextInputError("");
    let isTextMandatory = false;
    let validationMessage = `Text must be at least ${MIN_CHARS} characters and ${MIN_WORDS} words.`;

    if (modalMode === "feedback") isTextMandatory = true;
    else if (modalMode === "report_issue") {
      isTextMandatory = true;
      validationMessage = `Please describe the issue (min ${MIN_CHARS} chars, ${MIN_WORDS} words).`;
    }

    if (isTextMandatory) {
      if (
        feedbackText.trim().length < MIN_CHARS ||
        countWords(feedbackText) < MIN_WORDS
      ) {
        setTextInputError(validationMessage);
        return false;
      }
    }
    return true;
  }, [feedbackText, modalMode]);

  const handleFabActionPress = (mode) => {
    setModalMode(mode);
    setFabState({ open: false });
    if (mode === "like") setSelectedReactionInModal("like");
    else if (mode === "dislike") setSelectedReactionInModal("dislike");
    else if (mode === "feedback")
      setSelectedReactionInModal("like"); // Default like
    else if (mode === "report_issue") setSelectedReactionInModal(null);
    setModalVisible(true);
  };

  const toggleReactionInModal = (reaction) => {
    if (modalMode !== "feedback") return;
    setSelectedReactionInModal((prev) => (prev === reaction ? null : reaction));
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;
    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert("Authentication Error", "You must be logged in.");
      return;
    }
    setIsSubmitting(true);
    const feedbackTypePayload =
      modalMode === "report_issue" ? "issue_report" : "general";
    const payload = {
      contentContext: contentContext || {
        id: "unknown_context",
        type: "unknown_context",
      },
      entryPoint: `${modalMode || "unknown"}_fab`,
      reaction: selectedReactionInModal,
      feedbackText: feedbackText.trim(),
      feedbackType: feedbackTypePayload,
      clientTimestamp: new Date().toISOString(),
    };

    try {
      const submitFeedbackFunction =
        functions().httpsCallable("submitFeedback");
      const result = await submitFeedbackFunction(payload);
      if (result.data && result.data.status === "success") {
        Alert.alert("Feedback Sent", "Thank you!");
        setModalVisible(false);
      } else {
        throw new Error(result.data.message || "Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Feedback submission error:", error);
      Alert.alert(
        "Submission Error",
        `Could not submit feedback: ${error.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getModalTitle = () => {
    // ... (same as before)
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
  const getSubmitButtonText = () => {
    // ... (same as before)
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
      ? "Please describe the issue in detail..."
      : "Your feedback (required)..."
    : "Optional comment...";

  const fabActions = [
    {
      icon: "thumb-up",
      label: "Like",
      onPress: () => handleFabActionPress("like"),
      color: C.fabIconColor,
      style: { backgroundColor: C.fabBackground },
    },
    {
      icon: "thumb-down",
      label: "Dislike",
      onPress: () => handleFabActionPress("dislike"),
      color: C.fabIconColor,
      style: { backgroundColor: C.fabBackground },
    },
    {
      icon: "pencil-outline",
      label: "Feedback",
      onPress: () => handleFabActionPress("feedback"),
      color: C.fabIconColor,
      style: { backgroundColor: C.fabBackground },
    },
    {
      icon: "alert-circle-outline",
      label: "Report Issue",
      onPress: () => handleFabActionPress("report_issue"),
      color: C.fabIconColor,
      style: { backgroundColor: C.fabBackground },
    },
  ].reverse();

  // Styles defined using your theme (C)
  const styles = StyleSheet.create({
    modalContainer: {
      backgroundColor: C.cardBackground || C.background || "#FFFFFF", // Fallback
      padding: 20,
      marginHorizontal: 20,
      borderRadius: 12,
      maxHeight: "90%",
    },
    modalContent: {},
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: C.textPrimary || "#000000",
      flex: 1,
    },
    closeButton: {},
    reactionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
      paddingVertical: 5,
    },
    reactionIcon: { marginHorizontal: 15 },
    reactionDisplayContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      marginBottom: 10,
      paddingVertical: 5,
    },
    reactionDisplayText: {
      marginLeft: 10,
      fontSize: 16,
      color: C.textPrimary || "#000000",
      flexShrink: 1,
    },
    textInputStyle: {
      // Note: This is for the style prop of TextInput, not a StyleSheet object
      backgroundColor: C.inputBackground || C.background || "transparent",
      // color: C.inputText || C.textPrimary, // Not a direct prop for Paper TextInput, handled by theme or activeUnderlineColor etc.
    },
    errorText: {
      color: C.appWarning || C.errorRed || "#B00020",
      fontSize: 13,
      marginBottom: 10,
      marginTop: 2,
    },
    modalActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 20,
      alignItems: "center",
    },
    buttonStyle: { marginLeft: 10, minWidth: 90 },
    fabStyle: { backgroundColor: C.fabBackground || C.primary || "#6200EE" },
  });

  return (
    <>
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => {
            if (!isSubmitting) setModalVisible(false);
          }}
          contentContainerStyle={styles.modalContainer}
          dismissable={!isSubmitting}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{getModalTitle()}</Text>
                {!isSubmitting && (
                  <IconButton
                    icon="close"
                    size={24}
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
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
                    style={styles.reactionIcon}
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
                    style={styles.reactionIcon}
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
                style={styles.textInputStyle} // Pass style object for TextInput
                error={!!textInputError}
                maxLength={1000}
                disabled={isSubmitting}
                mode="outlined" // Or "flat"
                outlineColor={C.border || C.placeholder}
                activeOutlineColor={C.appPrimary || C.primary}
                placeholderTextColor={C.placeholder || C.textSecondary}
                theme={{
                  // Pass a minimal theme to TextInput for text color if needed
                  colors: {
                    text: C.inputText || C.textPrimary, // For older Paper, newer uses onSurface or text color from global theme
                    placeholder: C.placeholder || C.textSecondary,
                    primary: C.appPrimary || C.primary, // For active states
                    background:
                      C.inputBackground || C.background || "transparent", // Ensure background is styled
                    onSurface: C.inputText || C.textPrimary, // For newer Paper text color
                    outline: C.border || C.placeholder,
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
                    onPress={() => setModalVisible(false)}
                    style={styles.buttonStyle}
                    textColor={C.appPrimary || C.primary} // For outlined button text
                    mode="outlined"
                    borderColor={C.appPrimary || C.primary} // Explicitly set border color
                  >
                    Cancel
                  </PaperButton>
                )}
                <PaperButton
                  onPress={handleSubmit}
                  disabled={
                    isSubmitting ||
                    (isFeedbackTextRequired && !feedbackText.trim())
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

      <FAB.Group
        open={fabOpen}
        visible={true}
        icon={fabOpen ? "close-circle-outline" : "message-plus-outline"}
        actions={fabActions} // fabActions already have color & style applied
        onStateChange={onFabStateChange}
        fabStyle={[
          styles.fabStyle,
          { backgroundColor: C.fabBackground || C.primary },
        ]} // Main FAB button itself
        color={C.fabIconColor || C.primaryWhite} // Color for the main FAB icon
      />
    </>
  );
};

export default FeedbackFAB;

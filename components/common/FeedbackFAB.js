// components/common/FeedbackFAB.js
// Based on Ultra-Simplified, now respects a 'visible' prop
import React, { useState, useCallback, useEffect } from "react";
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
} from "react-native-paper";
import functions from "@react-native-firebase/functions";
import auth from "@react-native-firebase/auth";
import { useTheme } from "../../context/ThemeContext";

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

const FeedbackFAB = ({
  contentContext,
  visible = true, // Prop to control visibility from parent
}) => {
  const { theme } = useTheme();
  const C = theme.appColors || theme;

  const [fabOpen, setFabOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [selectedReactionInModal, setSelectedReactionInModal] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [textInputError, setTextInputError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If the FAB is externally made invisible while its menu was open, close the menu.
  useEffect(() => {
    if (!visible && fabOpen) {
      setFabOpen(false);
    }
  }, [visible, fabOpen]);

  const onFabStateChange = ({ open }) => {
    console.log("[FeedbackFAB] onFabStateChange, open:", open);
    setFabOpen(open);
  };

  const handleFabActionPress = (mode) => {
    console.log("[FeedbackFAB] FAB action selected:", mode);
    setModalMode(mode);
    setFabOpen(false);
    if (mode === "like") setSelectedReactionInModal("like");
    else if (mode === "dislike") setSelectedReactionInModal("dislike");
    else if (mode === "feedback") setSelectedReactionInModal("like");
    else if (mode === "report_issue") setSelectedReactionInModal(null);
    setModalVisible(true);
  };

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

  const validateInput = useCallback(() => {
    /* ... (Same as your working "ultra-simplified" version) ... */
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
    /* ... (Same as your working "ultra-simplified" version) ... */
    if (modalMode !== "feedback") return;
    setSelectedReactionInModal((prev) => (prev === reaction ? null : reaction));
  };

  const handleSubmit = async () => {
    /* ... (Same as your working "ultra-simplified" version) ... */
    if (!validateInput()) return;
    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert("Auth Error", "Must be logged in.");
      return;
    }
    setIsSubmitting(true);
    const payload = {
      contentContext: contentContext || {
        id: "unknown_fab_hideshow",
        type: "unknown_fab_hideshow",
      },
      entryPoint: `${modalMode || "unknown"}_fab`,
      reaction: selectedReactionInModal,
      feedbackText: feedbackText.trim(),
      feedbackType: modalMode === "report_issue" ? "issue_report" : "general",
      clientTimestamp: new Date().toISOString(),
    };
    try {
      const submitFn = functions().httpsCallable("submitFeedback");
      const result = await submitFn(payload);
      if (result.data?.status === "success") {
        Alert.alert("Feedback Sent", "Thank you!");
        setModalVisible(false);
      } else {
        throw new Error(result.data.message || "Failed.");
      }
    } catch (e) {
      Alert.alert("Error", `Submit failed: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getModalTitle = () => {
    /* ... (Same as your working "ultra-simplified" version) ... */
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
    /* ... (Same as your working "ultra-simplified" version) ... */
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

  const fabActions = [
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
  ].reverse();

  const styles = StyleSheet.create({
    // No specific positioning container style needed here, FAB.Group positions itself by default
    modalContainer: {
      backgroundColor: C.cardBackground || C.background || "#FFFFFF",
      padding: 20,
      marginHorizontal: 20,
      borderRadius: 12,
      maxHeight: "90%",
    },
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
    reactionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
      paddingVertical: 5,
    },
    reactionIconStyle: { marginHorizontal: 15 },
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
      backgroundColor: C.inputBackground || C.background || "transparent",
      marginBottom: 5,
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
    fabStyleForMainButton: {
      backgroundColor: C.fabBackground || C.primary,
      // If Paper's default positioning isn't quite right, you can add explicit positioning here:
      // position: 'absolute', // This might be needed if it doesn't float correctly otherwise
      // right: 16,
      // bottom: 25, // Adjust this value
    },
  });

  if (!visible) {
    // console.log('[FeedbackFAB] Prop "visible" is false, rendering null.');
    return null; // Don't render if not visible
  }

  console.log("[FeedbackFAB] Rendering. fabOpen:", fabOpen);

  return (
    <>
      <Portal>
        {/* Modal Definition (Same as your "ultra-simplified" version) */}
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
                    style={{ marginRight: 15 }}
                  />
                ) : (
                  <PaperButton
                    onPress={() => setModalVisible(false)}
                    style={styles.buttonStyle}
                    textColor={C.appPrimary || C.primary}
                    mode="outlined"
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

      <FAB.Group
        open={fabOpen}
        visible={true} // FAB.Group itself is always "visible" when this component renders; parent controls overall mount/unmount
        icon={fabOpen ? "close-circle-outline" : "message-plus-outline"}
        actions={fabActions}
        onStateChange={onFabStateChange}
        onPress={() => {
          console.log(
            "[FeedbackFAB] Main FAB onPress, toggling fabOpen state."
          );
          setFabOpen((prev) => !prev);
        }}
        fabStyle={styles.fabStyleForMainButton}
        color={C.fabIconColor || C.primaryWhite}
      />
    </>
  );
};

export default FeedbackFAB;

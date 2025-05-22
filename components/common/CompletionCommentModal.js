// components/common/CompletionCommentModal.js
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import { useTheme } from "../../context/ThemeContext"; // Assuming you have useTheme

const CompletionCommentModal = ({
  visible,
  onClose,
  onSubmit,
  initialComment = "",
}) => {
  const { theme } = useTheme();
  const [comment, setComment] = useState(initialComment);

  useEffect(() => {
    if (visible) {
      setComment(initialComment); // Reset comment when modal becomes visible
    }
  }, [visible, initialComment]);

  const handleSubmit = () => {
    onSubmit(comment.trim());
    onClose();
  };

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
      margin: 20,
      backgroundColor: theme.cardBackground || "white",
      borderRadius: 20,
      padding: 25, // Increased padding
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: "85%", // Modal width
    },
    modalTitle: {
      marginBottom: 15,
      textAlign: "center",
      fontSize: 18,
      fontWeight: "bold",
      color: theme.textPrimary || "black",
      fontFamily: "deliusBold",
    },
    input: {
      height: 100, // For multiline
      borderColor: theme.border || "gray",
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      textAlignVertical: "top", // For Android multiline
      marginBottom: 20,
      width: "100%",
      color: theme.textPrimary || "black",
      backgroundColor: theme.inputBackground || theme.background || "#f0f0f0", // Themed input background
      fontFamily: "delius",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-around", // Space out buttons
      width: "100%",
    },
    button: {
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 20, // Added horizontal padding
      elevation: 2,
      minWidth: 100, // Ensure buttons have some width
      alignItems: "center", // Center text in button
    },
    buttonSubmit: {
      backgroundColor: theme.primary || "#2196F3",
    },
    buttonCancel: {
      backgroundColor: theme.grey || "#ccc", // A less prominent color for cancel
    },
    buttonText: {
      color: theme.textOnPrimary || "white",
      fontWeight: "bold",
      textAlign: "center",
      fontFamily: "delius",
    },
    cancelButtonText: {
      color: theme.textPrimary || "black", // Text color for cancel button
    },
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Completion Comment (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Add comments for completing this task..."
            placeholderTextColor={theme.textSecondary || "grey"}
            onChangeText={setComment}
            value={comment}
            multiline={true}
            numberOfLines={4}
          />
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.buttonCancel]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonSubmit]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>OK & Complete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CompletionCommentModal;

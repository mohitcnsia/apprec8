// components/common/ConfirmationModel.js (or similar path)

import React, { useMemo } from "react"; // Import useMemo
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
// import { Colors } from "../../config/colors"; // Remove legacy Colors import
import { useTheme } from "../../context/ThemeContext"; // Import useTheme hook

const ConfirmationModal = ({ visible, title, onCancel, onConfirm }) => {
  const { theme } = useTheme(); // Use the theme hook

  // Define styles inside useMemo, depending on theme
  const styles = useMemo(
    () =>
      StyleSheet.create({
        modalContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          // Backdrop color - often kept darkish regardless of theme, adjust as desired
          backgroundColor: theme.backdrop || "rgba(0, 0, 0, 0.6)",
        },
        modalContent: {
          backgroundColor: theme.cardBackground || "#FFFFFF", // Use theme card background
          padding: 24,
          borderRadius: 10,
          width: "90%",
          maxWidth: 400, // Add max width for larger screens/tablets
          alignItems: "center",
          shadowColor: theme.shadowColor || "#000", // Use theme shadow color
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 4,
        },
        modalTitle: {
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 15,
          textAlign: "center",
          color: theme.textPrimary || "#000000", // Use theme primary text color
        },
        buttonContainer: {
          flexDirection: "row",
          justifyContent: "space-between", // Or 'space-evenly'
          alignItems: "center",
          width: "100%",
          marginTop: 10,
        },
        modalButton: {
          flex: 1, // Allow buttons to grow equally
          minWidth: "40%", // Ensure minimum width
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: "center",
          marginHorizontal: 5, // Space between buttons
        },
        cancelButton: {
          // Use a less prominent theme color, e.g., placeholder or secondary background
          backgroundColor:
            theme.secondaryButtonBackground || theme.placeholder || "#cccccc",
        },
        confirmButton: {
          // Use primary branding color (or accent if preferred for confirm actions)
          backgroundColor: theme.primary || "#800000",
        },
        cancelText: {
          // Use text color that contrasts with cancelButton background
          color: theme.textOnSecondary || theme.textPrimary || "#000000",
          fontSize: 16,
        },
        confirmText: {
          // Use text color that contrasts with confirmButton background (often light)
          color: theme.textOnPrimary || theme.primaryWhite || "#FFFFFF",
          fontSize: 16,
          fontWeight: "bold",
        },
      }),
    [theme]
  ); // Depend on theme

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel} // Allows back button to dismiss on Android
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>

          <View style={styles.buttonContainer}>
            {/* Cancel Button */}
            <Pressable
              style={({ pressed }) => [
                styles.modalButton,
                styles.cancelButton,
                { opacity: pressed ? 0.7 : 1 }, // Add pressed feedback
              ]}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            {/* Confirm Button */}
            <Pressable
              style={({ pressed }) => [
                styles.modalButton,
                styles.confirmButton,
                { opacity: pressed ? 0.7 : 1 }, // Add pressed feedback
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;

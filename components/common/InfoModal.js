// components/common/InfoModal.js
import React, { useMemo } from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext"; // Adjust path if needed

const InfoModal = ({
  visible,
  title,
  message,
  onDismiss,
  dismissText = "OK",
}) => {
  const { theme } = useTheme();
  const C = theme.appColors || theme; // To access your custom theme keys

  const styles = useMemo(
    () =>
      StyleSheet.create({
        modalContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: C.backdrop || "rgba(0, 0, 0, 0.6)",
        },
        modalContent: {
          backgroundColor: C.cardBackground || "#FFFFFF",
          padding: 24,
          borderRadius: 10,
          width: "90%",
          maxWidth: 400,
          alignItems: "center",
          shadowColor: C.shadowColor || "#000",
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 4,
        },
        modalTitle: {
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: message ? 10 : 20, // Less margin if no message
          textAlign: "center",
          color: C.textPrimary || "#000000",
        },
        modalMessage: {
          fontSize: 16,
          marginBottom: 20,
          textAlign: "center",
          color: C.textSecondary || "#333333",
          lineHeight: 22,
        },
        buttonContainer: {
          flexDirection: "row",
          justifyContent: "center", // Center the single button
          width: "100%",
          marginTop: 10,
        },
        modalButton: {
          paddingVertical: 12,
          paddingHorizontal: 20, // Give some horizontal padding
          minWidth: "45%", // Ensure button is a decent size
          borderRadius: 8,
          alignItems: "center",
        },
        okButton: {
          backgroundColor: C.primary || C.appPrimary || "#800000", // Use primary color
        },
        okButtonText: {
          color: C.textOnPrimary || C.primaryWhite || "#FFFFFF",
          fontSize: 16,
          fontWeight: "bold",
        },
      }),
    [C, message] // Depend on C (theme) and message (for styling)
  );

  if (!visible) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onDismiss} // Allows back button to dismiss on Android
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          {message && <Text style={styles.modalMessage}>{message}</Text>}
          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.modalButton,
                styles.okButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={onDismiss}
              android_ripple={{
                color: C.rippleOnAppPrimary || C.primaryWhite + "77",
              }}
            >
              <Text style={styles.okButtonText}>{dismissText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default InfoModal;

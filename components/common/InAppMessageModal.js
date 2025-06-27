import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Button,
  Linking,
  Pressable,
  SafeAreaView,
  Image,
  Platform,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

/**
 * A dynamic, themed modal for showing in-app messages from Remote Config.
 * @param {object} props
 * @param {boolean} props.isVisible - Controls if the modal is shown.
 * @param {object} props.message - The message object from Remote Config.
 * @param {() => void} props.onClose - Function to call when the modal should be dismissed.
 */
const InAppMessageModal = ({ isVisible, message, onClose, updateUrl }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  // If there's no message data, render nothing.
  if (!message) {
    return null;
  }

  const { type, title, body, imageUrl, primaryButton, secondaryButton } =
    message;

  const isHardUpdate = type === "hard_update";

  const handleAction = (action) => {
    // --- SIMPLIFIED: No more platform logic here ---
    if (action === "STORE_LINK") {
      if (updateUrl) {
        Linking.openURL(updateUrl).catch((err) =>
          console.error("Couldn't open page", err)
        );
      }
    } else if (action === "DISMISS") {
      onClose();
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={isHardUpdate ? () => {} : onClose} // Only allow back button to close if not a hard update
    >
      <Pressable
        style={styles.overlay}
        onPress={isHardUpdate ? null : onClose} // Only allow tapping outside to close if not a hard update
      >
        <SafeAreaView style={styles.safeAreaContainer}>
          {/* Use a Pressable with no action to prevent taps inside the card from closing the modal */}
          <Pressable>
            <View style={styles.card}>
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : null}
              <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.body}>{body}</Text>
              </View>
              <View style={styles.buttonContainer}>
                {secondaryButton && !isHardUpdate && (
                  <View style={styles.buttonWrapper}>
                    <Button
                      title={secondaryButton.text}
                      onPress={() => handleAction(secondaryButton.action)}
                      color={theme.textSecondary} // A more subtle color for the secondary action
                    />
                  </View>
                )}
                {primaryButton && (
                  <View style={styles.buttonWrapper}>
                    <Button
                      title={primaryButton.text}
                      onPress={() => handleAction(primaryButton.action)}
                      color={theme.primary}
                    />
                  </View>
                )}
              </View>
            </View>
          </Pressable>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "flex-end", // Aligns children (the modal card) to the bottom
    },
    safeAreaContainer: {
      width: "100%",
    },
    card: {
      backgroundColor: theme.cardBackground,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 20,
      paddingBottom: 10,
      maxHeight: "80%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 10,
    },
    image: {
      width: "100%",
      height: 150,
      marginBottom: 15,
    },
    textContainer: {
      paddingHorizontal: 25,
      alignItems: "center",
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 10,
      color: theme.textPrimary,
      textAlign: "center",
    },
    body: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 25,
      lineHeight: 24,
      color: theme.textSecondary,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "center",
      paddingHorizontal: 15,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: 10,
    },
    buttonWrapper: {
      marginHorizontal: 10,
      minWidth: 120,
    },
  });

export default InAppMessageModal;

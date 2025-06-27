import React from "react";
import { View, Text, StyleSheet, Modal, Button, Linking } from "react-native";
import { useTheme } from "../../context/ThemeContext";

/**
 * A full-screen, non-dismissible modal that forces the user to update the app.
 * @param {object} props
 * @param {boolean} props.isVisible - Controls if the modal is shown.
 * @param {string} props.updateUrl - The App Store or Play Store URL to open.
 */
const ForceUpdateModal = ({ isVisible, updateUrl }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleUpdatePress = () => {
    // Checks if the URL is valid before trying to open it
    if (updateUrl) {
      Linking.canOpenURL(updateUrl).then((supported) => {
        if (supported) {
          Linking.openURL(updateUrl);
        } else {
          console.log(`Don't know how to open this URL: ${updateUrl}`);
        }
      });
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide" // This creates the slide-from-bottom effect
      onRequestClose={() => {
        // We do nothing on the back button press on Android to make it non-dismissible
      }}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Update Required</Text>
          <Text style={styles.message}>
            A new version is available with important updates and bug fixes. To
            continue using the app, please update to the latest version.
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              title="Update Now"
              onPress={handleUpdatePress}
              color={theme.primary}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 30,
      backgroundColor: theme.background,
    },
    content: {
      alignItems: "center",
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 15,
      color: theme.textPrimary,
    },
    message: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 30,
      lineHeight: 24,
      color: theme.textSecondary,
    },
    buttonContainer: {
      minWidth: "60%",
    },
  });

export default ForceUpdateModal;

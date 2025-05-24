// screens/profile/DeleteAccountConfirmationScreen.js
import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button as PaperButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import functions from "@react-native-firebase/functions";
import { useTheme } from "../../context/ThemeContext";
import { authInstance } from "../../config/firebaseConfig";
import { CommonActions } from "@react-navigation/native";

const CONFIRMATION_PHRASE = "DELETE MY ACCOUNT"; // User must type this exactly

const DeleteAccountConfirmationScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { userEmail } = route.params || {}; // Email for display purposes

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // For displaying errors in the UI

  const handleDeleteAccount = useCallback(async () => {
    if (inputText !== CONFIRMATION_PHRASE) {
      Alert.alert(
        "Confirmation Failed",
        `Please type the exact phrase "${CONFIRMATION_PHRASE}" to confirm deletion.`
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Calling requestAccountDeletion Cloud Function...");
      const requestAccountDeletionCallable = functions().httpsCallable(
        "requestAccountDeletion"
      );
      const result = await requestAccountDeletionCallable();

      console.log("Cloud Function result:", result);
      setIsLoading(false);

      Alert.alert(
        "Account Deletion Successful",
        "Your account has been deleted. You will now be signed out."
      );

      // Perform local sign out and navigate to the start of the authentication flow
      await authInstance.signOut(); // Ensure this doesn't throw unhandled errors

      // Reset navigation stack to the initial authentication route
      // This depends on your navigator setup.
      // Replace 'AuthLoading' with your initial route in the Auth stack or main navigator.
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "AuthLoading" }], // Or your primary App entry point that decides Auth vs Main
        })
      );
    } catch (err) {
      console.error("Error during account deletion process:", err);
      setIsLoading(false);
      // err.message from callable function is user-facing if set, otherwise default.
      const displayError =
        err.message ||
        "Could not delete your account. Please try again or contact support.";
      Alert.alert("Deletion Error", displayError);
      setError(displayError); // Optionally display this in your UI as well
    }
  }, [inputText, navigation]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        gradientContainer: { flex: 1 },
        keyboardAvoidingView: { flex: 1 },
        scrollViewContent: {
          flexGrow: 1,
          justifyContent: "center",
          padding: 20,
          paddingTop: Platform.OS === "ios" ? 40 : 20,
        },
        title: {
          fontSize: 24,
          fontWeight: "bold",
          color: theme.textPrimaryOnGradient || theme.textPrimary,
          textAlign: "center",
          marginBottom: 15,
          fontFamily: "deliusBold",
        },
        warningText: {
          fontSize: 16,
          color: theme.textSecondaryOnGradient || theme.textSecondary,
          textAlign: "center",
          marginBottom: 25,
          lineHeight: 24,
          fontFamily: "delius",
        },
        infoText: {
          fontSize: 15,
          color: theme.textPrimaryOnGradient || theme.textPrimary,
          marginBottom: 5,
          textAlign: "left",
          width: "100%",
          fontFamily: "delius",
        },
        confirmationPhrase: {
          fontWeight: "bold",
          color: theme.accent || theme.primary,
        },
        input: {
          marginBottom: 25,
          backgroundColor: theme.inputBackground || "transparent",
        },
        button: {
          marginTop: 10,
          paddingVertical: 6,
          borderRadius: theme.roundness || 8,
        },
        errorTextUI: {
          color: theme.error || theme.warning || "red",
          textAlign: "center",
          marginVertical: 10,
          fontFamily: "delius",
        },
      }),
    [theme]
  );

  return (
    <LinearGradient
      colors={
        theme.gradientStart && theme.gradientEnd
          ? [theme.gradientStart, theme.gradientEnd]
          : ["#8B0000", "#D3D3D3"]
      }
      style={styles.gradientContainer}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Delete Your Account</Text>
          <Text style={styles.warningText}>
            This action is permanent and cannot be undone. All your data
            associated with
            {userEmail ? (
              <Text style={{ fontWeight: "bold" }}> {userEmail} </Text>
            ) : (
              " your account "
            )}
            will be anonymized, and your access will be revoked.
          </Text>
          <Text style={styles.infoText}>
            To confirm, please type the exact phrase below:
          </Text>
          <Text
            style={[
              styles.infoText,
              styles.confirmationPhrase,
              { textAlign: "center", fontSize: 17, marginVertical: 10 },
            ]}
          >
            {CONFIRMATION_PHRASE}
          </Text>
          <TextInput
            mode="outlined"
            placeholder="Type the phrase here"
            value={inputText}
            onChangeText={setInputText}
            style={styles.input}
            disabled={isLoading}
            autoCapitalize="none"
            autoCorrect={false}
            textColor={theme.textPrimaryOnGradient || theme.textPrimary}
            theme={{
              colors: {
                primary: theme.accent || theme.primary,
                text: theme.textPrimaryOnGradient || theme.textPrimary,
                placeholder:
                  theme.textSecondaryOnGradient || theme.textSecondary,
                background: "transparent",
                onSurfaceVariant:
                  theme.textSecondaryOnGradient || theme.textSecondary,
              },
            }}
          />

          {error && <Text style={styles.errorTextUI}>{error}</Text>}

          <PaperButton
            mode="contained"
            onPress={handleDeleteAccount}
            disabled={isLoading || inputText.trim() !== CONFIRMATION_PHRASE}
            loading={isLoading}
            style={styles.button}
            buttonColor={theme.error || theme.warning || "#D32F2F"} // Destructive action color
            textColor={theme.textOnError || theme.textOnWarning || "#FFFFFF"}
            labelStyle={{
              fontSize: 17,
              fontWeight: "bold",
              fontFamily: "deliusBold",
            }}
          >
            {isLoading ? "Deleting Account..." : "Confirm & Delete Account"}
          </PaperButton>
          <PaperButton
            mode="text"
            onPress={() => navigation.goBack()}
            disabled={isLoading}
            style={styles.button}
            textColor={theme.textPrimaryOnGradient || theme.textPrimary}
            labelStyle={{ fontFamily: "delius" }}
          >
            Cancel
          </PaperButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default DeleteAccountConfirmationScreen;

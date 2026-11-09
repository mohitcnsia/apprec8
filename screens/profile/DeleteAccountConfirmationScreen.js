// screens/profile/DeleteAccountConfirmationScreen.js
import React, { useState, useCallback, useMemo } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button as PaperButton } from "react-native-paper";
import functions from "@react-native-firebase/functions";
import { useTheme } from "../../context/ThemeContext";
import { quizPalette } from "../../components/quiz/quizPalette";
import { authInstance } from "../../config/firebaseConfig";
import { CommonActions } from "@react-navigation/native";
import { showAlert } from "../../services/dialog";

const CONFIRMATION_PHRASE = "DELETE MY ACCOUNT"; // User must type this exactly

const DeleteAccountConfirmationScreen = ({ route, navigation }) => {
  const { isDark } = useTheme();
  const P = quizPalette(isDark);
  const { userEmail } = route.params || {}; // Email for display purposes

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // For displaying errors in the UI

  const handleDeleteAccount = useCallback(async () => {
    if (inputText !== CONFIRMATION_PHRASE) {
      showAlert(
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

      showAlert(
        "Account Deletion Successful",
        "Your account has been deleted. You will now be signed out."
      );

      // Perform local sign out and navigate to the start of the authentication flow
      await authInstance.signOut(); // Ensure this doesn't throw unhandled errors

      // Reset navigation stack to the initial authentication route
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "AuthLoading" }],
        })
      );
    } catch (err) {
      console.error("Error during account deletion process:", err);
      setIsLoading(false);
      // err.message from callable function is user-facing if set, otherwise default.
      const displayError =
        err.message ||
        "Could not delete your account. Please try again or contact support.";
      showAlert("Deletion Error", displayError);
      setError(displayError);
    }
  }, [inputText, navigation]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        screen: {
          flex: 1,
          backgroundColor: P.background,
        },
        keyboardAvoidingView: { flex: 1 },
        scrollViewContent: {
          flexGrow: 1,
          justifyContent: "center",
          padding: 20,
          paddingTop: Platform.OS === "ios" ? 40 : 20,
        },
        title: {
          fontSize: 24,
          fontFamily: "nunitoBold",
          color: P.text,
          textAlign: "center",
          marginBottom: 12,
        },
        warningText: {
          fontSize: 16,
          color: P.textSoft,
          textAlign: "center",
          marginBottom: 20,
          lineHeight: 24,
          fontFamily: "nunito",
        },
        boldEmail: {
          fontFamily: "nunitoBold",
          color: P.text,
        },
        infoCard: {
          backgroundColor: P.card,
          borderRadius: 18,
          borderWidth: 2,
          borderColor: P.cardBorder,
          padding: 16,
          marginBottom: 20,
          gap: 10,
        },
        infoText: {
          fontSize: 14,
          color: P.textSoft,
          textAlign: "left",
          lineHeight: 22,
          fontFamily: "nunito",
        },
        phrasePrompt: {
          fontSize: 15,
          fontFamily: "nunitoBold",
          color: P.text,
          textAlign: "center",
          marginTop: 4,
        },
        phraseBadge: {
          backgroundColor: isDark ? "#2A1818" : "#FEEBEB",
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: P.wrongBorder,
          paddingVertical: 10,
          paddingHorizontal: 16,
          alignItems: "center",
          alignSelf: "center",
          marginVertical: 4,
        },
        confirmationPhrase: {
          fontFamily: "nunitoBold",
          fontSize: 18,
          color: P.wrongBorder,
          letterSpacing: 1.5,
        },
        input: {
          marginBottom: 20,
          backgroundColor: P.card,
          fontFamily: "nunitoBold",
        },
        deleteButton: {
          marginTop: 10,
          borderRadius: 16,
          backgroundColor: P.wrongBorder,
        },
        cancelButton: {
          marginTop: 8,
          borderRadius: 16,
        },
        buttonLabel: {
          fontSize: 17,
          fontFamily: "nunitoBold",
          letterSpacing: 0.5,
          paddingVertical: 4,
        },
        cancelButtonLabel: {
          fontSize: 16,
          fontFamily: "nunitoBold",
          color: P.text,
          paddingVertical: 4,
        },
        errorTextUI: {
          color: P.wrongBorder,
          textAlign: "center",
          marginVertical: 10,
          fontFamily: "nunitoBold",
        },
      }),
    [P, isDark]
  );

  return (
    <View style={styles.screen}>
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
              <Text style={styles.boldEmail}> {userEmail} </Text>
            ) : (
              " your account "
            )}
            will be deleted, and your access will be revoked.
          </Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Deleted: your progress, answers, stars, class memberships and sign-in. Child profiles you made are deleted
              too; children with their own login keep their account. We keep only a record that consent was given
              (without names).
            </Text>
            <Text style={styles.phrasePrompt}>
              To confirm, please type the exact phrase below:
            </Text>
            <View style={styles.phraseBadge}>
              <Text style={styles.confirmationPhrase}>{CONFIRMATION_PHRASE}</Text>
            </View>
          </View>

          <TextInput
            mode="outlined"
            placeholder="Type the phrase here"
            value={inputText}
            onChangeText={setInputText}
            style={styles.input}
            disabled={isLoading}
            autoCapitalize="none"
            autoCorrect={false}
            textColor={P.text}
            outlineColor={P.cardBorder}
            activeOutlineColor={P.wrongBorder}
            theme={{
              colors: {
                primary: P.wrongBorder,
                text: P.text,
                placeholder: P.textSoft,
                background: P.card,
                onSurfaceVariant: P.textSoft,
              },
            }}
          />

          {error && <Text style={styles.errorTextUI}>{error}</Text>}

          <PaperButton
            mode="contained"
            onPress={handleDeleteAccount}
            disabled={isLoading || inputText.trim() !== CONFIRMATION_PHRASE}
            loading={isLoading}
            style={styles.deleteButton}
            buttonColor={P.wrongBorder}
            textColor="#FFFFFF"
            labelStyle={styles.buttonLabel}
          >
            {isLoading ? "Deleting Account..." : "Confirm & Delete Account"}
          </PaperButton>
          <PaperButton
            mode="text"
            onPress={() => navigation.goBack()}
            disabled={isLoading}
            style={styles.cancelButton}
            textColor={P.text}
            labelStyle={styles.cancelButtonLabel}
          >
            Cancel
          </PaperButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default DeleteAccountConfirmationScreen;

// screens/ContactUsForm.js

import {
  // Alert, // Can remove Alert if not used elsewhere
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Input from "../../components/input/Input"; // Import themed Input
import PrimaryButton from "../../components/PrimaryButton";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import { authInstance } from "../../config/firebaseConfig";
// Removed unused DateTimePicker/formatDate imports

const ContactUsForm = ({ navigation }) => {
  const { theme, isDark } = useTheme();

  // Form data state
  const [formData, setFormData] = useState({ subject: "", message: "" });
  // User email state
  const [userEmail, setUserEmail] = useState("");
  const [isLoadingEmail, setIsLoadingEmail] = useState(true);
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  // --- NEW: Validation error states ---
  const [subjectError, setSubjectError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  // ------------------------------------

  useEffect(() => {
    const currentUser = authInstance.currentUser;
    if (currentUser) setUserEmail(currentUser.email || "Email not available");
    else setUserEmail("Guest User (Not Logged In)");
    setIsLoadingEmail(false);
  }, []);

  // Update input handler to clear errors on change
  const inputChangeHandler = (key, value) => {
    setFormData((prevState) => ({ ...prevState, [key]: value }));
    // Clear specific error when user types
    if (key === "subject") setSubjectError(false);
    if (key === "message") setMessageError(false);
  };

  // Update validation to set error states instead of Alert
  function validateFormData() {
    console.log("Validating form...");
    const isSubjectValid = formData.subject.trim().length > 0;
    const isMessageValid = formData.message.trim().length > 0;

    // Set error states based on validity
    setSubjectError(!isSubjectValid);
    setMessageError(!isMessageValid);

    const isFormValid = isSubjectValid && isMessageValid;
    if (!isFormValid) {
      console.log("Validation failed.");
    } else {
      console.log("Validation passed.");
      // Optionally clear errors here too, though inputChangeHandler covers it
      // setSubjectError(false);
      // setMessageError(false);
    }
    return isFormValid;
  }

  // Update submit handler (no Alert needed here for validation)
  function submitHandler() {
    if (validateFormData() && !isSubmitting) {
      setIsSubmitting(true);
      console.log("Form Data:", formData, "User Email:", userEmail);
      // Replace with actual email sending logic
      setTimeout(() => {
        setIsSubmitting(false);
        // Use Alert only for SUCCESS notification now
        // Alert.alert("Success", "Email feature is Coming Soon");
        setFormData({ subject: "", message: "" }); // Clear form on success
        navigation.goBack();
      }, 1500);
    }
  }

  // --- Styles (remain the same as previous themed version) ---
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1 },
        scrollContent: { padding: 20, paddingBottom: 40 },
        heading: {
          fontSize: 24,
          fontFamily: "deliusBold",
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          textAlign: "center",
          marginBottom: 25,
        },
        infoLabel: {
          fontSize: 16,
          fontFamily: "delius",
          color:
            theme.textSecondaryOnGradient ||
            theme.primaryLightGray ||
            "#E0E0E0",
          marginBottom: 2,
        },
        infoValue: {
          fontSize: 17,
          fontFamily: "nunitoBold",
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          marginBottom: 15,
        },
        separator: {
          height: 1,
          backgroundColor: theme.border || theme.primaryMaroon100 || "#cccccc",
          marginVertical: 20,
        },
        messageInputContainer: { marginBottom: 10 },
        button: { minWidth: 150, alignSelf: "center", marginTop: 10 },
      }),
    [theme]
  );

  // --- RENDER ---
  return (
    <LinearGradient
      colors={[
        theme.gradientStart || "#3b0940",
        theme.gradientEnd || "#d7d1d3",
      ]}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Email Us</Text>

        {/* Info section remains the same */}
        <Text style={styles.infoLabel}>To:</Text>
        <Text style={styles.infoValue}>Apprec8 Customer Service</Text>
        <Text style={styles.infoLabel}>Email:</Text>
        {isLoadingEmail ? (
          <ActivityIndicator
            size="small"
            color={
              theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF"
            }
          />
        ) : (
          <Text style={styles.infoValue}>{userEmail}</Text>
        )}
        <View style={styles.separator} />

        {/* Pass error state to Input components */}
        <Input
          label="Subject:"
          value={formData.subject}
          onChangeText={(value) => inputChangeHandler("subject", value)}
          isInvalid={subjectError} // <<< Pass subject error state
        />

        <Input
          label="Please explain the problem or share feedback:"
          value={formData.message}
          onChangeText={(value) => inputChangeHandler("message", value)}
          textInputConfig={{
            autoCapitalize: "sentences",
            multiline: true,
          }}
          style={styles.messageInputContainer}
          isInvalid={messageError} // <<< Pass message error state
        />

        <View style={styles.separator} />

        {/* PrimaryButton remains the same */}
        <PrimaryButton
          style={styles.button}
          onPress={submitHandler}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send E-mail Coming Soon"}
        </PrimaryButton>
      </ScrollView>
    </LinearGradient>
  );
};

export default ContactUsForm;

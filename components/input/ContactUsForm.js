// screens/ContactUsForm.js (or similar path)

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator, // Keep standard indicator
  Pressable,
  Platform,
} from "react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react"; // Import useMemo
import Input from "../../components/input/Input"; // Import themed Input
import PrimaryButton from "../../components/PrimaryButton"; // Import themed Button
import { LinearGradient } from "expo-linear-gradient";
// import { Colors } from "../../config/colors"; // Remove legacy Colors import
import { useTheme } from "../../context/ThemeContext"; // Import useTheme hook
import { authInstance } from "../../config/firebaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker"; // Keep if used elsewhere, not here
import { formatDate } from "../../components/utils/date"; // Keep if used elsewhere, not here

const ContactUsForm = ({ navigation }) => {
  const { theme, isDark } = useTheme(); // Use theme hook

  // State remains the same
  const [formData, setFormData] = useState({ subject: "", message: "" });
  const [userEmail, setUserEmail] = useState("");
  const [isLoadingEmail, setIsLoadingEmail] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect and handlers remain the same logic
  useEffect(() => {
    const currentUser = authInstance.currentUser;
    if (currentUser) setUserEmail(currentUser.email || "Email not available");
    else setUserEmail("Guest User (Not Logged In)");
    setIsLoadingEmail(false);
  }, []);

  const inputChangeHandler = (key, value) => {
    setFormData((prevState) => ({ ...prevState, [key]: value }));
  };

  function validateFormData() {
    const isSubjectValid = formData.subject.trim().length > 0;
    const isMessageValid = formData.message.trim().length > 0;
    if (isSubjectValid && isMessageValid) return true;
    Alert.alert("Validation Error", "Subject and Message fields are required!");
    return false;
  }

  function submitHandler() {
    if (validateFormData() && !isSubmitting) {
      setIsSubmitting(true);
      console.log("Form Data:", formData, "User Email:", userEmail);
      // Replace with actual email sending logic
      setTimeout(() => {
        setIsSubmitting(false);
        Alert.alert("Success", "Your message would be sent!");
        setFormData({ subject: "", message: "" });
        navigation.goBack();
      }, 1500);
    }
  }

  // --- Define Styles Inside Component with useMemo ---
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          // Applied to LinearGradient
          flex: 1,
        },
        scrollContent: {
          padding: 20,
          paddingBottom: 40, // Ensure space at bottom
        },
        heading: {
          fontSize: 24,
          fontFamily: "deliusBold",
          // Use themed text color suitable for gradient
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          textAlign: "center",
          marginBottom: 25,
        },
        infoLabel: {
          fontSize: 16,
          fontFamily: "delius",
          // Use themed secondary text color suitable for gradient
          color:
            theme.textSecondaryOnGradient ||
            theme.primaryLightGray ||
            "#E0E0E0",
          marginBottom: 2,
        },
        infoValue: {
          fontSize: 17,
          fontFamily: "nunitoBold",
          // Use themed primary text color suitable for gradient
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          marginBottom: 15,
        },
        separator: {
          height: 1,
          // Use themed border or subtle primary color
          backgroundColor: theme.border || theme.primaryMaroon100 || "#cccccc",
          marginVertical: 20,
        },
        messageInputContainer: {
          // Style for the message Input component wrapper
          // Input internal style handles height, but we can add margin here
          marginBottom: 10,
        },
        button: {
          // Style for the PrimaryButton wrapper/margin
          minWidth: 150,
          alignSelf: "center",
          marginTop: 10,
        },
      }),
    [theme]
  ); // Depend on theme

  // --- RENDER ---
  return (
    // Apply themed gradient
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

        <Text style={styles.infoLabel}>To:</Text>
        <Text style={styles.infoValue}>Apprec8 Customer Service</Text>

        <Text style={styles.infoLabel}>Email:</Text>
        {isLoadingEmail ? (
          // Use themed color for indicator
          <ActivityIndicator
            size="small"
            color={
              theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF"
            }
          />
        ) : (
          <Text style={styles.infoValue}>{userEmail}</Text>
        )}

        {/* Use themed separator */}
        <View style={styles.separator} />

        {/* Input components are now themed internally */}
        <Input
          label="Subject:"
          value={formData.subject}
          onChangeText={(value) => inputChangeHandler("subject", value)}
          // Override label color if Input default (textSecondary) doesn't contrast well
          // labelStyle={{ color: theme.textSecondaryOnGradient || theme.primaryLightGray }}
        />

        <Input
          label="Please explain the problem or share feedback:"
          value={formData.message}
          onChangeText={(value) => inputChangeHandler("message", value)}
          textInputConfig={{
            autoCapitalize: "sentences",
            multiline: true,
          }}
          style={styles.messageInputContainer} // Apply margin if needed
          // Override label color if Input default doesn't contrast well
          // labelStyle={{ color: theme.textSecondaryOnGradient || theme.primaryLightGray }}
          // Input text color uses theme.inputText which should contrast with theme.inputBackground
        />

        <View style={styles.separator} />

        {/* PrimaryButton is now themed internally */}
        <PrimaryButton
          style={styles.button} // Apply layout styles
          onPress={submitHandler}
          disabled={isSubmitting}
          // PrimaryButton might accept isLoading prop for internal indicator
          // isLoading={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send E-mail"}
        </PrimaryButton>
      </ScrollView>
    </LinearGradient>
  );
};

export default ContactUsForm;

import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Input from "./Input";
import PrimaryButton from "../../components/PrimaryButton";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors";

const ContactUsForm = ({ navigation }) => {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  // Update state on input change
  const inputChangeHandler = (key, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  function submitHandler() {
    const isFormValid = validateFormData();
    if (isFormValid) {
      saveToDb();
      navigation.goBack();
      Alert.alert("Success", "Your message has been submitted!");
    }
  }

  function validateFormData() {
    console.log("Validating your form before submission");
    const isSubjectValid = formData.subject.trim().length > 0;
    const isMessageValid = formData.message.trim().length > 0;
    if (isSubjectValid && isMessageValid) {
      return true;
    }
    Alert.alert("Validation Error", "Both fields are required!"); // Do state management here and highlight the fields red
    return false;
  }

  function saveToDb() {
    console.log("Form submitted and saved to db");
    console.log("Form Data:", formData);
  }

  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Input
          label="Subject:"
          value={formData.subject}
          onChangeText={(value) => inputChangeHandler("subject", value)}
        />
        <Input
          label="Please explain the problem or share feedback:"
          value={formData.message}
          onChangeText={(value) => inputChangeHandler("message", value)}
          textInputConfig={{
            autoCapitalize: "sentences",
            multiline: true,
          }}
        />
        <PrimaryButton
          title="Submit"
          style={styles.button}
          onPress={submitHandler}
        >
          Submit
        </PrimaryButton>
      </ScrollView>
    </LinearGradient>
  );
};

export default ContactUsForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    minWidth: 50,
    marginHorizontal: 8,
  },
});

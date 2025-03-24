import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Input from "./Input";
import PrimaryButton from "../../components/PrimaryButton";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors";

const ContactUsForm = () => {
  const [inputs, setInputs] = useState({
    amount: {
      value: "",
      isValid: false,
    },
    date: {
      value: "",
      isValid: false,
    },
    description: {
      value: "",
      isValid: false,
    },
  });

  function submitHandler() {
    console.log("Form submitted");
  }

  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Input label="Subject:" />
        <Input
          label="Please explain the problem you are facing or share any feedback that you may have:"
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

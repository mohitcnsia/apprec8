import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { Colors } from "../../config/colors";

const Input = ({ label, invalid, style, textInputConfig }) => {
  const inputStyles = [styles.input];
  if (textInputConfig && textInputConfig.multiline) {
    inputStyles.push(styles.inputMultiline);
  }
  if (invalid) {
    inputStyles.push(styles.invalidInput);
  }

  return (
    <View style={[styles.inputContainer, style]}>
      <Text style={[styles.label, invalid && styles.invalidLabel]}>
        {label}
      </Text>
      <TextInput style={inputStyles} {...textInputConfig} />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 4,
  },
  label: {
    fontSize: 12,
    color: Colors.primary100,
    marginBottom: 4,
  },
  input: {
    backgroundColor: Colors.primary100,
    color: Colors.primary700,
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
    marginBottom: 10,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
    margin: 8,
  },
  invalidLabel: {
    color: Colors.error50,
  },
  invalidInput: {
    backgroundColor: Colors.error50,
  },
});

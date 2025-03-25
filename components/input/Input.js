import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "../../config/colors";
import { TextInput } from "react-native";

const Input = ({ label, value, onChangeText, style, textInputConfig }) => {
  const inputStyles = [styles.input];
  if (textInputConfig && textInputConfig.multiline) {
    inputStyles.push(styles.inputMultiline);
  }

  return (
    <View style={[styles.inputContainer, style]}>
      <Text style={[styles.label]}>{label}</Text>
      <TextInput
        style={inputStyles}
        value={value}
        onChangeText={onChangeText}
        {...textInputConfig}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  input: {
    backgroundColor: Colors.primaryWhite,
    // color: Colors.primaryWhite,
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
    marginBottom: 10,
  },
  label: {
    color: Colors.primaryWhite,
    fontFamily: "delius",
    fontSize: 16,
    marginBottom: 5,
  },
  inputMultiline: {
    minHeight: 200,
    textAlignVertical: "top",
  },
});

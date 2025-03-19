import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Input from "./Input";
import { Colors } from "../../config/colors";

const ExpenseForm = () => {
  function amountChangedHandler() {}

  return (
    <View>
      <Text style={styles.title}>Your Expense</Text>
      <View style={styles.inputRow}>
        <Input
          style={styles.rowInput}
          label="Anount"
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: amountChangedHandler,
          }}
        />
        <Input
          style={styles.rowInput}
          label="Date"
          textInputConfig={{
            placeholder: "YYYY-MM-DD",
            maxLength: 10,
            onChangeText: () => {},
          }}
        />
      </View>

      <Input
        label="Description"
        textInputConfig={{
          autoCapitalize: "sentences",
          multiline: true,
        }}
      />
    </View>
  );
};

export default ExpenseForm;

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowInput: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginVertical: 24,
    textAlign: "center",
  },
});

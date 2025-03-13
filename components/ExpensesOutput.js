import { StyleSheet, View } from "react-native";
import ExpensesSummary from "./ExpensesSummary";
import ExpensesList from "./ExpensesList";
import { Colors } from "../config/colors";

const DUMMY = [
  {
    id: "e1",
    description: "A pair for shoes",
    amount: 59.99,
    date: new Date("2021-12-19"),
  },
  {
    id: "e2",
    description: "A pair for Trousers",
    amount: 89.99,
    date: new Date("2022-1-10"),
  },
  {
    id: "e3",
    description: "A pair for Bananas",
    amount: 2.99,
    date: new Date("2021-12-10"),
  },
  {
    id: "e4",
    description: "A Book",
    amount: 3.99,
    date: new Date("2022-2-1"),
  },
  {
    id: "e5",
    description: "A Phone",
    amount: 203.99,
    date: new Date("2025-03-10"),
  },
  {
    id: "e6",
    description: "A pair for shoes",
    amount: 59.99,
    date: new Date("2021-12-19"),
  },
  {
    id: "e7",
    description: "A pair for Trousers",
    amount: 89.996565,
    date: new Date("2022-1-10"),
  },
  {
    id: "e8",
    description: "A pair for Bananas",
    amount: 2.99,
    date: new Date("2021-12-10"),
  },
  {
    id: "e9",
    description: "A Book",
    amount: 3.99,
    date: new Date("2022-2-1"),
  },
  {
    id: "e10",
    description: "A Phone",
    amount: 203.99,
    date: new Date("2025-03-10"),
  },
];

function ExpensesOutput({ expenses, expensesPeriod }) {
  return (
    <View style={styles.container}>
      <ExpensesSummary expenses={DUMMY} periodName={expensesPeriod} />
      <ExpensesList expenses={DUMMY} />
    </View>
  );
}

export default ExpensesOutput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.primary700,
  },
});

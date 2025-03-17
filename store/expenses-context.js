import React, { createContext, useReducer } from "react";

export const ExpensesContext = createContext({
  expenses: [],
  addExpense: ({ description, amount, date }) => {},
  deleteExpense: (id) => {},
  updateExpense: (id, { description, amount, date }) => {},
});

function expenseReducer(state, action) {
  switch (action.type) {
    case "ADD":
      const id = new Date().toString() + Math.random.toString();
      return [{ ...action.payload, id: id }, ...state];
    case "UPDATE":
      const updatableExpenseIndex = state.findIndex(
        (expense) => expense.id === action.payload.id
      );
      const updatableExpense = state[updatableExpenseIndex];
      const updatedItem = { ...updatableExpense, ...action.payload.data };
      const updatedExpenses = [...state];
      updatedExpenses[updatableExpenseIndex] = updatedItem;
      return updatedExpenses;
    case "DELETE":
      return state.filter((expense) => expense.id !== action.payload);
    default:
      return state;
  }
}

export default function ExpensesContextProvide({ children }) {
  const [expensesState, dispatch] = useReducer(expenseReducer, DUMMY_EXPENSES);

  function addExpense(expenseData) {
    dispatch({ type: "ADD", payload: expenseData });
  }

  function deleteExpense(id) {
    console.log("deleting expense: " + id);
    dispatch({ type: "DELETE", payload: id });
  }

  function updateExpense(id, expenseData) {
    dispatch({ type: "UPDATE", payload: { id: id, data: expenseData } });
  }

  const value = {
    expenses: expensesState,
    addExpense: addExpense,
    deleteExpense: deleteExpense,
    updateExpense: updateExpense,
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

export const DUMMY_EXPENSES = [
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

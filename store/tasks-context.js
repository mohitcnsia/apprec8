import { createContext, useReducer, useEffect } from "react";
import {
  fetchTasks,
  addTaskToFirestore,
  updateTaskInFirestore,
  deleteTaskFromFirestore,
} from "../store/firestore-api"; // Import Firestore API functions

export const TasksContext = createContext({
  tasks: [],
  addTask: async (taskData) => {},
  deleteTask: async (id) => {},
  updateTask: async (id, updatedData) => {},
});

function tasksReducer(state, action) {
  switch (action.type) {
    case "SET":
      return action.payload; // Set initial tasks from Firestore
    case "ADD":
      return [action.payload, ...state];
    case "UPDATE":
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, ...action.payload.data }
          : task
      );
    case "DELETE":
      return state.filter((task) => task.id !== action.payload);
    default:
      return state;
  }
}

function TasksContextProvider({ children }) {
  const [tasksState, dispatch] = useReducer(tasksReducer, []);

  // 📌 Load tasks from Firestore on app start
  useEffect(() => {
    async function loadTasks() {
      const tasks = await fetchTasks();
      dispatch({ type: "SET", payload: tasks });
    }

    loadTasks();
  }, []);

  // 📌 Add Task (calls Firestore API)
  async function addTask(taskData) {
    try {
      const newTask = await addTaskToFirestore(taskData);
      dispatch({ type: "ADD", payload: newTask });
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  }

  // 📌 Update Task (calls Firestore API)
  async function updateTask(id, taskData) {
    await updateTaskInFirestore(id, taskData);
    dispatch({ type: "UPDATE", payload: { id, data: taskData } });
  }

  // 📌 Delete Task (calls Firestore API)
  async function deleteTask(id) {
    await deleteTaskFromFirestore(id);
    dispatch({ type: "DELETE", payload: id });
  }

  const value = {
    tasks: tasksState,
    addTask,
    deleteTask,
    updateTask,
  };

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

export default TasksContextProvider;

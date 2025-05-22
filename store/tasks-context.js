// src/store/tasks-context.js

import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
} from "react"; // Import useCallback
import {
  fetchTasks,
  addTaskToFirestore,
  updateTaskInFirestore,
  deleteTaskFromFirestore,
} from "./firestore-api";

export const TasksContext = createContext({
  tasks: [],
  isLoading: false,
  error: null,
  addTask: async (taskData) => {},
  deleteTask: async (id) => {},
  updateTask: async (id, updatedData) => {},
  clearError: () => {},
});

function tasksReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload, error: null };
    case "SET_TASKS_SUCCESS":
      return { ...state, tasks: action.payload, isLoading: false, error: null };
    case "SET_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "ADD_TASK_SUCCESS":
      const newTasksAdd = [action.payload, ...state.tasks];
      // Ensure sorting by createdAt (assuming it's a Date object or can be converted)
      newTasksAdd.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      return {
        ...state,
        tasks: newTasksAdd,
        isLoading: false,
        error: null,
      };
    case "UPDATE_TASK_SUCCESS":
      const updatedTasks = state.tasks.map((task) =>
        task.id === action.payload.id
          ? { ...task, ...action.payload.data, lastUpdatedAt: new Date() }
          : task
      );
      updatedTasks.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      return {
        ...state,
        tasks: updatedTasks,
        isLoading: false,
        error: null,
      };
    case "DELETE_TASK_SUCCESS":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        isLoading: false,
        error: null,
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

function TasksContextProvider({ children }) {
  const [state, dispatch] = useReducer(tasksReducer, {
    tasks: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function loadTasks() {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const tasksFromApi = await fetchTasks();
        const processedTasks = tasksFromApi.map((task) => ({
          ...task,
          dueDate: task.dueDate
            ? task.dueDate.toDate
              ? task.dueDate.toDate()
              : new Date(task.dueDate)
            : null,
          createdAt: task.createdAt?.toDate
            ? task.createdAt.toDate()
            : task.createdAt
            ? new Date(task.createdAt)
            : null,
          lastUpdatedAt: task.lastUpdatedAt?.toDate
            ? task.lastUpdatedAt.toDate()
            : task.lastUpdatedAt
            ? new Date(task.lastUpdatedAt)
            : null,
        }));
        dispatch({ type: "SET_TASKS_SUCCESS", payload: processedTasks });
      } catch (err) {
        console.error("TasksContext: Failed to load tasks", err);
        dispatch({
          type: "SET_ERROR",
          payload: err.message || "Failed to fetch tasks.",
        });
      }
    }
    loadTasks();
  }, []); // Empty dependency array, loadTasks is defined inside or memoized if outside

  const addTask = useCallback(async (taskData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const dataForFirestore = {
        ...taskData,
        dueDate: taskData.dueDate.toISOString(),
      };
      const newTaskFromApi = await addTaskToFirestore(dataForFirestore);
      const newTaskForState = {
        ...newTaskFromApi,
        dueDate: newTaskFromApi.dueDate
          ? new Date(newTaskFromApi.dueDate)
          : new Date(),
        createdAt: newTaskFromApi.createdAt?.toDate
          ? newTaskFromApi.createdAt.toDate()
          : new Date(newTaskFromApi.createdAt), // Should be a Date object after API call
        lastUpdatedAt: newTaskFromApi.lastUpdatedAt?.toDate
          ? newTaskFromApi.lastUpdatedAt.toDate()
          : new Date(newTaskFromApi.lastUpdatedAt), // Should be a Date object
      };
      dispatch({ type: "ADD_TASK_SUCCESS", payload: newTaskForState });
      return newTaskForState;
    } catch (err) {
      console.error("TasksContext: Failed to add task", err);
      dispatch({
        type: "SET_ERROR",
        payload: err.message || "Failed to add task.",
      });
      throw err;
    }
  }, []); // No dependencies if dispatch is stable (which it is)

  const updateTask = useCallback(async (id, taskData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const dataForFirestore = {
        ...taskData,
        dueDate:
          taskData.dueDate instanceof Date
            ? taskData.dueDate.toISOString()
            : taskData.dueDate,
      };
      await updateTaskInFirestore(id, dataForFirestore);
      const updatedDataForState = {
        ...taskData,
        dueDate:
          taskData.dueDate instanceof Date
            ? taskData.dueDate
            : new Date(taskData.dueDate),
      };
      dispatch({
        type: "UPDATE_TASK_SUCCESS",
        payload: { id, data: updatedDataForState },
      });
    } catch (err) {
      console.error("TasksContext: Failed to update task", err);
      dispatch({
        type: "SET_ERROR",
        payload: err.message || "Failed to update task.",
      });
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await deleteTaskFromFirestore(id);
      dispatch({ type: "DELETE_TASK_SUCCESS", payload: id });
    } catch (err) {
      console.error("TasksContext: Failed to delete task", err);
      dispatch({
        type: "SET_ERROR",
        payload: err.message || "Failed to delete task.",
      });
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const value = {
    tasks: state.tasks,
    isLoading: state.isLoading,
    error: state.error,
    addTask,
    deleteTask,
    updateTask,
    clearError,
  };

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

export default TasksContextProvider;

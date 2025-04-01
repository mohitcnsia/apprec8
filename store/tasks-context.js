import { createContext, useReducer } from "react";
import uuid from "react-native-uuid";

export const TasksContext = createContext({
  tasks: [],
  addTask: ({ title, detail, dueDate, createdAt, lastUpdatedAt }) => {},
  deleteTask: (id) => {},
  updateTask: (
    id,
    { title, detail, dueDate, createdAt, completed, lastUpdatedAt }
  ) => {},
});

function tasksReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return addNewTask(state, action.payload);
    case "UPDATE":
      return updateExistingTask(state, action.payload);
    case "DELETE":
      return deleteTaskById(state, action.payload);
    default:
      return state;
  }
}

function addNewTask(state, taskData) {
  const now = new Date().toISOString();
  return [
    {
      ...taskData,
      id: uuid.v4(),
      createdAt: now,
      lastUpdatedAt: now,
      completed: false,
    },
    ...state,
  ];
}

function updateExistingTask(state, { id, data }) {
  return state.map((task) =>
    task.id === id
      ? { ...task, ...data, lastUpdatedAt: new Date().toISOString() }
      : task
  );
}

function deleteTaskById(state, id) {
  return state.filter((task) => task.id !== id);
}

function TasksContextProvider({ children }) {
  const [tasksState, dispatch] = useReducer(tasksReducer, []);

  function addTask(taskData) {
    dispatch({ type: "ADD", payload: taskData });
  }

  function deleteTask(id) {
    dispatch({ type: "DELETE", payload: id });
  }

  function updateTask(id, taskData) {
    dispatch({ type: "UPDATE", payload: { id: id, data: taskData } });
  }

  const value = {
    tasks: tasksState,
    addTask: addTask,
    deleteTask: deleteTask,
    updateTask: updateTask,
  };

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

export default TasksContextProvider;

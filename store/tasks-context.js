import { createContext, useReducer } from "react";
import uuid from "react-native-uuid";

export const DUMMY_TASKS = [
  // remove this dummy with actual call to backend
  {
    id: "1",
    title: "Dummy Task 1",
    detail:
      "This is a dummy task. Will add more details later. This is a dummy task. Will add more details later. This is a dummy task. Will add more details later. This is a dummy task. Will add more details later.",
    dueAt: "2025-03-31",
    createdAt: "2025-03-31",
    lastUpdatedAt: "2025-03-31",
    completed: false,
  },
  { id: "2", title: "Dummy Task 2" },
  { id: "3", title: "Dummy Task 3" },
  { id: "16", title: "Dummy Task 16" },
  { id: "17", title: "Dummy Task 17" },
];

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
  const [tasksState, dispatch] = useReducer(tasksReducer, DUMMY_TASKS);

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

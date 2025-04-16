import { db, authInstance } from "../config/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "@react-native-firebase/firestore";

const TASKS_COLLECTION = "tasks"; // Firestore collection name

export async function fetchTasks() {
  const currentUser = authInstance.currentUser; // Use the imported instance

  if (!currentUser) {
    console.log("No user logged in to fetch tasks.");
    return [];
  }

  const userId = currentUser.uid;

  try {
    console.log(`Workspaceing tasks for user: ${userId}`);
    const tasksQuery = db // Use the imported db instance
      .collection(TASKS_COLLECTION)
      .where("userId", "==", userId); // Filter by userId field in your task documents

    const querySnapshot = await tasksQuery.get();

    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`Workspaceed ${tasks.length} tasks for user ${userId}`);
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    if (error.code === "firestore/permission-denied") {
      console.error(
        "Firestore permission denied. Check rules and ensure task documents have a correct 'userId' field matching the logged-in user."
      );
    }
    return []; // Return empty array on error
  }
}

export async function addTaskToFirestore(taskData) {
  const currentUser = authInstance.currentUser;

  if (!currentUser) {
    console.error("Error adding task: No user logged in.");
    throw new Error("User must be logged in to add tasks."); // Throw error if no user
  }

  const userId = currentUser.uid;

  try {
    // Destructure potentially incoming client-side ID if needed, but don't save it
    const { id, ...taskDataFromInput } = taskData;

    // Create the object to save, merging input data with the userId
    const dataToSave = {
      ...taskDataFromInput, // Spread the original task data (title, details, etc.)
      userId: userId, // **Add the logged-in user's ID**
      createdAt: new Date(), // Optional: Add a server timestamp later if needed via rules/functions
      // Or just use client time for simplicity now
      isComplete: false, // Optional: Set default status if applicable
    };

    const docRef = await addDoc(collection(db, TASKS_COLLECTION), dataToSave);
    console.log(`Task added with ID: ${docRef.id} for user ${userId}`);
    // Return Firestore-generated ID with the *saved* data (including userId)
    return { id: docRef.id, ...dataToSave };
  } catch (error) {
    console.error(`Error adding task for user ${userId}:`, error);
    throw error; // Re-throw error for calling code to handle
  }
}

export async function deleteTaskFromFirestore(taskId) {
  try {
    await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

export async function updateTaskInFirestore(taskId, updatedData) {
  try {
    await updateDoc(doc(db, TASKS_COLLECTION, taskId), updatedData);
  } catch (error) {
    console.error("Error updating task:", error);
  }
}

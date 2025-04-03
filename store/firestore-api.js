import { db } from "../config/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const TASKS_COLLECTION = "tasks"; // Firestore collection name

export async function fetchTasks() {
  try {
    const querySnapshot = await getDocs(collection(db, TASKS_COLLECTION));
    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

export async function addTaskToFirestore(taskData) {
  try {
    const { id, ...taskDataWithoutId } = taskData;
    const docRef = await addDoc(collection(db, "tasks"), taskDataWithoutId);
    // Return Firestore-generated ID with task data
    return { id: docRef.id, ...taskDataWithoutId };
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
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

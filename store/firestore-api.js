// src/store/firestore-api.js

import {
  getFirestore, // To get the Firestore instance
  collection, // To get a collection reference
  doc, // To get a document reference
  query, // To build queries with where/orderBy
  where, // For where clauses
  orderBy, // For orderBy clauses
  getDocs, // To fetch query results
  addDoc, // To add a new document
  deleteDoc, // To delete a document
  updateDoc, // To update a document
  serverTimestamp, // For server timestamps
  Timestamp, // For client-side timestamps
} from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app"; // To get the default app instance
import { authInstance } from "../config/firebaseConfig"; // Assuming this is already modular
import { APPREC8_TEAM_REVIEWER_UID } from "../config/appConfig";

// Get the default Firebase app instance
const app = getApp();
// Get the Firestore instance from the app
const db = getFirestore(app);

const TASKS_COLLECTION = "tasks";

export async function fetchTasks() {
  const currentUser = authInstance.currentUser;
  if (!currentUser) {
    console.log("fetchTasks: No user logged in.");
    return [];
  }
  const userId = currentUser.uid;
  let allTasks = [];

  try {
    console.log(`fetchTasks: Fetching tasks created by user: ${userId}`);
    // Use modular `collection`, `query`, `where`, and `orderBy`
    const tasksCollectionRef = collection(db, TASKS_COLLECTION);
    const userTasksQuery = query(
      tasksCollectionRef,
      where("userId", "==", userId), // Query for tasks created by the user
      orderBy("createdAt", "desc")
    );

    // Use modular `getDocs`
    const userTasksSnapshot = await getDocs(userTasksQuery);
    const userTasksData = userTasksSnapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    allTasks = userTasksData;
    console.log(
      `fetchTasks: Fetched ${allTasks.length} tasks created by user ${userId}`
    );

    if (userId === APPREC8_TEAM_REVIEWER_UID) {
      console.log(
        `fetchTasks: User ${userId} is Apprec8 Team Reviewer. Fetching team-assigned tasks (using assignToTeamBoolean).`
      );
      // MODIFIED QUERY: Look for tasks where assignToTeamBoolean is true
      const teamAssignedTasksQuery = query(
        tasksCollectionRef, // Reuse the collection reference
        where("assignToTeamBoolean", "==", true), // Query by the boolean flag
        orderBy("createdAt", "desc") // Ensure consistent ordering
      );

      // Use modular `getDocs`
      const teamAssignedTasksSnapshot = await getDocs(teamAssignedTasksQuery);
      const teamTasksData = teamAssignedTasksSnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      console.log(
        `fetchTasks: Fetched ${teamTasksData.length} tasks with assignToTeamBoolean == true.`
      );

      // Merge and deduplicate tasks
      const taskMap = new Map();
      allTasks.forEach((task) => taskMap.set(task.id, task));
      teamTasksData.forEach((task) => taskMap.set(task.id, task)); // Will overwrite/add
      allTasks = Array.from(taskMap.values());

      // Re-sort the final merged list
      allTasks.sort((a, b) => {
        const dateA = a.createdAt?.toDate
          ? a.createdAt.toDate().getTime()
          : a.createdAt
          ? new Date(a.createdAt).getTime()
          : 0;
        const dateB = b.createdAt?.toDate
          ? b.createdAt.toDate().getTime()
          : b.createdAt
          ? new Date(b.createdAt).getTime()
          : 0;
        return dateB - dateA;
      });
    }
    console.log(
      `fetchTasks: Total unique tasks for user ${userId}: ${allTasks.length}`
    );
    return allTasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    if (error.code === "firestore/permission-denied") {
      console.error(
        "Firestore permission denied during fetchTasks. Check rules and ensure queries are valid (e.g., indexes for orderBy with where clauses)."
      );
    }
    throw error;
  }
}

export async function addTaskToFirestore(taskPayloadFromContext) {
  const currentUser = authInstance.currentUser;
  if (!currentUser) {
    console.error("addTaskToFirestore: No user logged in.");
    throw new Error("User must be logged in to add tasks.");
  }
  const userId = currentUser.uid; // This is the creator's UID

  try {
    // taskPayloadFromContext contains: { title, detail, dueDate (ISO string), completed, assignToTeamBoolean }
    const { assignToTeamBoolean, dueDate, ...otherDetails } =
      taskPayloadFromContext;

    const dataToSave = {
      ...otherDetails, // title, detail, completed
      creatorUid: userId, // Explicitly set who created the task
      createdAt: serverTimestamp(), // Use modular `serverTimestamp()`
      lastUpdatedAt: serverTimestamp(), // Use modular `serverTimestamp()`
      // Convert incoming ISO string dueDate to Firestore Timestamp
      dueDate: Timestamp.fromDate(new Date(dueDate)), // Use modular `Timestamp.fromDate()`
      // Store the boolean flag as it exists in your current Firestore documents
      assignToTeamBoolean: assignToTeamBoolean || false, // Ensure it's always a boolean
    };

    if (assignToTeamBoolean === true) {
      console.log(
        `addTaskToFirestore: Task flagged for team assignment (assignToTeamBoolean: true)`
      );
    } else {
      console.log(
        `addTaskToFirestore: Task NOT flagged for team assignment (assignToTeamBoolean: false)`
      );
    }

    // Use modular `collection` and `addDoc`
    const tasksCollectionRef = collection(db, TASKS_COLLECTION);
    const docRef = await addDoc(tasksCollectionRef, dataToSave);

    console.log(`Task added with ID: ${docRef.id} for user ${userId}`);
    return {
      id: docRef.id,
      ...dataToSave, // This will include FieldValues for timestamps
      // TasksContext will handle converting these to client-side Dates
    };
  } catch (error) {
    console.error(`Error adding task for user ${userId}:`, error);
    throw error;
  }
}

export async function deleteTaskFromFirestore(taskId) {
  try {
    // Use modular `doc` and `deleteDoc`
    const taskDocRef = doc(db, TASKS_COLLECTION, taskId);
    await deleteDoc(taskDocRef);
    console.log(`Task deleted with ID: ${taskId}`);
  } catch (error) {
    console.error(`Error deleting task ${taskId}:`, error);
    throw error;
  }
}

export async function updateTaskInFirestore(taskId, updatedDataFromContext) {
  try {
    const { assignToTeamBoolean, dueDate, ...otherDetailsToUpdate } =
      updatedDataFromContext;

    const dataToUpdate = {
      ...otherDetailsToUpdate,
      lastUpdatedAt: serverTimestamp(), // Use modular `serverTimestamp()`
    };

    if (dueDate) {
      dataToUpdate.dueDate = Timestamp.fromDate(new Date(dueDate)); // Use modular `Timestamp.fromDate()`
    }

    if (assignToTeamBoolean !== undefined) {
      dataToUpdate.assignToTeamBoolean = assignToTeamBoolean;
    }

    if ("id" in dataToUpdate) delete dataToUpdate.id;
    if ("creatorUid" in dataToUpdate) delete dataToUpdate.creatorUid;
    if ("createdAt" in dataToUpdate) delete dataToUpdate.createdAt;

    // Use modular `doc` and `updateDoc`
    const taskDocRef = doc(db, TASKS_COLLECTION, taskId);
    await updateDoc(taskDocRef, dataToUpdate);
    console.log(`Task updated with ID: ${taskId}`);
  } catch (error) {
    console.error(`Error updating task ${taskId}:`, error);
    throw error;
  }
}

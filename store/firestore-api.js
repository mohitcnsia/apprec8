// src/store/firestore-api.js

import firestore from "@react-native-firebase/firestore"; // Use the direct import
import { authInstance } from "../config/firebaseConfig"; // Assuming authInstance is correctly exported
import { APPREC8_TEAM_REVIEWER_UID } from "../config/appConfig";

// Assuming 'db' from firebaseConfig.js is firestore() or you can use firestore() directly
// If db is not firestore(), you might need to adjust.
// For this example, let's assume direct usage of the imported 'firestore' for clarity.
// If your 'db' export from firebaseConfig is indeed firestore(), you can use 'db' instead of 'firestore()' below.

const TASKS_COLLECTION = "tasks";

/**
 * Fetches tasks for the current user.
 * Includes tasks created by the user and, if the user is the designated
 * team reviewer, tasks assigned to the Apprec8 team for their review.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of task objects.
 */
export async function fetchTasks() {
  const currentUser = authInstance.currentUser;

  if (!currentUser) {
    console.log("No user logged in to fetch tasks.");
    return [];
  }

  const userId = currentUser.uid;
  let allTasks = [];

  try {
    console.log(`Workspaceing tasks created by user: ${userId}`);
    const userTasksQuery = firestore() // Using firestore() directly
      .collection(TASKS_COLLECTION)
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc");

    const userTasksSnapshot = await userTasksQuery.get();
    const userTasksData = userTasksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    allTasks = userTasksData; // Corrected variable name from previous thoughts
    console.log(
      `Workspaceed ${allTasks.length} tasks created by user ${userId}`
    );

    if (userId === APPREC8_TEAM_REVIEWER_UID) {
      console.log(
        `User ${userId} is Apprec8 Team Reviewer. Fetching team-assigned tasks.`
      );
      const teamAssignedTasksQuery = firestore() // Using firestore() directly
        .collection(TASKS_COLLECTION)
        .where("assignedTeamReviewerUid", "==", APPREC8_TEAM_REVIEWER_UID)
        .orderBy("createdAt", "desc");

      const teamAssignedTasksSnapshot = await teamAssignedTasksQuery.get();
      const teamTasksData = teamAssignedTasksSnapshot.docs.map((doc) => ({
        // Corrected variable name
        id: doc.id,
        ...doc.data(),
      }));
      console.log(
        `Workspaceed ${teamTasksData.length} tasks assigned to Apprec8 Team for review.`
      );

      const taskMap = new Map();
      allTasks.forEach((task) => taskMap.set(task.id, task));
      teamTasksData.forEach((task) => taskMap.set(task.id, task));
      allTasks = Array.from(taskMap.values());

      allTasks.sort((a, b) => {
        const dateA = a.createdAt?.toDate
          ? a.createdAt.toDate()
          : a.createdAt
          ? new Date(a.createdAt)
          : 0;
        const dateB = b.createdAt?.toDate
          ? b.createdAt.toDate()
          : b.createdAt
          ? new Date(b.createdAt)
          : 0;
        return dateB - dateA;
      });
    }
    console.log(
      `Total unique tasks fetched for user ${userId}: ${allTasks.length}`
    );
    return allTasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    if (error.code === "firestore/permission-denied") {
      console.error(
        "Firestore permission denied. Check rules and ensure task documents have a correct 'userId' field matching the logged-in user, or appropriate indexing for queries."
      );
    }
    throw error;
  }
}

/**
 * Adds a new task to Firestore.
 * @param {Object} taskData - The data for the new task.
 * Expected fields: title, detail, dueDate (ISO string), completed (boolean), assignToTeam (boolean, optional).
 * @returns {Promise<Object>} A promise that resolves to the newly created task object with its Firestore ID.
 */
export async function addTaskToFirestore(taskData) {
  const currentUser = authInstance.currentUser;

  if (!currentUser) {
    console.error("Error adding task: No user logged in.");
    throw new Error("User must be logged in to add tasks.");
  }

  const userId = currentUser.uid;

  try {
    const { assignToTeam, ...taskDetails } = taskData;

    const dataToSave = {
      ...taskDetails,
      userId: userId,
      createdAt: firestore.FieldValue.serverTimestamp(),
      lastUpdatedAt: firestore.FieldValue.serverTimestamp(),
      // 'completed' field comes from taskData
    };

    if (assignToTeam) {
      dataToSave.assignedTeamReviewerUid = APPREC8_TEAM_REVIEWER_UID;
      console.log(
        `Task assigned to Apprec8 Team Reviewer: ${APPREC8_TEAM_REVIEWER_UID}`
      );
    }

    const docRef = await firestore() // Using firestore() directly
      .collection(TASKS_COLLECTION)
      .add(dataToSave); // Changed from addDoc(collection(db,...))

    console.log(`Task added with ID: ${docRef.id} for user ${userId}`);
    return {
      id: docRef.id,
      ...dataToSave,
      // Approximate client time for immediate UI update, actual value is server-set
      createdAt: new Date(),
      lastUpdatedAt: new Date(),
    };
  } catch (error) {
    console.error(`Error adding task for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Deletes a task from Firestore.
 * @param {string} taskId - The ID of the task to delete.
 * @returns {Promise<void>}
 */
export async function deleteTaskFromFirestore(taskId) {
  try {
    await firestore() // Using firestore() directly
      .collection(TASKS_COLLECTION)
      .doc(taskId)
      .delete(); // Changed from deleteDoc(doc(db,...))
    console.log(`Task deleted with ID: ${taskId}`);
  } catch (error) {
    console.error(`Error deleting task ${taskId}:`, error);
    throw error;
  }
}

/**
 * Updates an existing task in Firestore.
 * @param {string} taskId - The ID of the task to update.
 * @param {Object} updatedData - An object containing the fields to update.
 * @returns {Promise<void>}
 */
export async function updateTaskInFirestore(taskId, updatedData) {
  try {
    const dataToUpdate = {
      ...updatedData, // This will include 'completionComment' if sent from context
      lastUpdatedAt: firestore.FieldValue.serverTimestamp(),
    };
    if ("id" in dataToUpdate) delete dataToUpdate.id;
    if ("userId" in dataToUpdate) delete dataToUpdate.userId;
    if ("createdAt" in dataToUpdate) delete dataToUpdate.createdAt;

    await firestore()
      .collection(TASKS_COLLECTION)
      .doc(taskId)
      .update(dataToUpdate);
    console.log(`Task updated with ID: ${taskId}`);
  } catch (error) {
    console.error(`Error updating task ${taskId}:`, error);
    throw error;
  }
}

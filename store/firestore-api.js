// src/store/firestore-api.js

import firestore from "@react-native-firebase/firestore";
import { authInstance } from "../config/firebaseConfig";
import { APPREC8_TEAM_REVIEWER_UID } from "../config/appConfig";

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
    // Assuming 'creatorUid' is the field storing the task creator's ID.
    // If you use 'userId' for this, change "creatorUid" to "userId" below.
    const userTasksQuery = firestore()
      .collection(TASKS_COLLECTION)
      .where("userId", "==", userId) // Query for tasks created by the user
      .orderBy("createdAt", "desc");

    const userTasksSnapshot = await userTasksQuery.get();
    const userTasksData = userTasksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
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
      const teamAssignedTasksQuery = firestore()
        .collection(TASKS_COLLECTION)
        .where("assignToTeamBoolean", "==", true) // Query by the boolean flag
        .orderBy("createdAt", "desc"); // Ensure consistent ordering

      const teamAssignedTasksSnapshot = await teamAssignedTasksQuery.get();
      const teamTasksData = teamAssignedTasksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
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
      createdAt: firestore.FieldValue.serverTimestamp(),
      lastUpdatedAt: firestore.FieldValue.serverTimestamp(),
      // Convert incoming ISO string dueDate to Firestore Timestamp
      dueDate: firestore.Timestamp.fromDate(new Date(dueDate)),
      // Store the boolean flag as it exists in your current Firestore documents
      assignToTeamBoolean: assignToTeamBoolean || false, // Ensure it's always a boolean
    };

    // No need to set assignedTeamReviewerUid if your schema uses assignToTeamBoolean
    // unless you want both for a future migration.
    // For now, we stick to assignToTeamBoolean.
    if (assignToTeamBoolean === true) {
      console.log(
        `addTaskToFirestore: Task flagged for team assignment (assignToTeamBoolean: true)`
      );
    } else {
      console.log(
        `addTaskToFirestore: Task NOT flagged for team assignment (assignToTeamBoolean: false)`
      );
    }

    const docRef = await firestore()
      .collection(TASKS_COLLECTION)
      .add(dataToSave);

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
    await firestore().collection(TASKS_COLLECTION).doc(taskId).delete();
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
      lastUpdatedAt: firestore.FieldValue.serverTimestamp(),
    };

    if (dueDate) {
      dataToUpdate.dueDate = firestore.Timestamp.fromDate(new Date(dueDate));
    }

    // Since TaskEditor hides the switch on edit, assignToTeamBoolean might not be in updatedDataFromContext.
    // If it is, it means you've enabled changing this on edit.
    if (assignToTeamBoolean !== undefined) {
      dataToUpdate.assignToTeamBoolean = assignToTeamBoolean;
    }

    if ("id" in dataToUpdate) delete dataToUpdate.id;
    if ("creatorUid" in dataToUpdate) delete dataToUpdate.creatorUid;
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

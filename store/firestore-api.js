import {
  getFirestore,
  collection,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  onSnapshot,
} from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";
import { authInstance } from "../config/firebaseConfig";
import { APPREC8_TEAM_REVIEWER_UID } from "../config/appConfig";

const app = getApp();
const db = getFirestore(app);

const TASKS_COLLECTION = "tasks";

/**
 * Fetches all spelling bee puzzles from the 'gameSpellingBee' collection.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of puzzle objects.
 */
export async function fetchSpellingBeePuzzles() {
  console.log("fetchSpellingBeePuzzles: Fetching all puzzles...");
  const puzzlesRef = collection(db, "gameSpellingBee");
  const puzzlesQuery = query(puzzlesRef); // No specific order needed for now

  try {
    const querySnapshot = await getDocs(puzzlesQuery);
    const puzzles = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(
      `fetchSpellingBeePuzzles: Successfully fetched ${puzzles.length} puzzles.`
    );
    return puzzles;
  } catch (error) {
    console.error("Error fetching Spelling Bee puzzles:", error);
    throw new Error(
      "Could not load Spelling Bee puzzles. Please try again later."
    );
  }
}

/**
 * Sets up a real-time listener for vocabulary game data.
 * @param {(data: object) => void} onDataChange - Callback invoked with the full game data object.
 * @param {(error: Error) => void} onError - Callback invoked on listener error.
 * @returns {() => void} An unsubscribe function to detach the listener.
 */
export function listenToVocabGameData(onDataChange, onError) {
  console.log("LISTENER: Setting up for Vocab Game data.");
  const categoriesRef = collection(db, "gameVocabCategories");
  const categoriesQuery = query(categoriesRef, orderBy("name"));

  // This will be an array of unsubscribe functions for all word sub-collections
  let wordListeners = [];

  const mainListener = onSnapshot(
    categoriesQuery,
    async (querySnapshot) => {
      // Unsubscribe from any previous word listeners to prevent memory leaks
      wordListeners.forEach((unsubscribe) => unsubscribe());
      wordListeners = []; // Reset the array

      const gameData = {};
      const categoryPromises = querySnapshot.docs.map((categoryDoc) => {
        const categoryId = categoryDoc.id;
        const categoryData = categoryDoc.data();

        return new Promise((resolve) => {
          const wordsRef = collection(
            db,
            "gameVocabCategories",
            categoryId,
            "words"
          );
          const wordsListener = onSnapshot(wordsRef, (wordsSnapshot) => {
            const words = wordsSnapshot.docs.map((wordDoc) => wordDoc.data());

            // Rebuild the entire gameData object on any change
            gameData[categoryId] = {
              name: categoryData.name,
              words: words,
            };

            // We call onDataChange inside the innermost listener
            // This might be called multiple times initially, but will stabilize
            onDataChange({ ...gameData });
            resolve(); // Resolve the promise for this category
          });
          wordListeners.push(wordsListener); // Add new listener to the array
        });
      });

      await Promise.all(categoryPromises);
      console.log("LISTENER: Initial data load for Vocab Game complete.");
    },
    (error) => {
      console.error("LISTENER ERROR: Vocab Game categories: ", error);
      onError(error);
    }
  );

  // Return a function that unsubscribes from all listeners
  return () => {
    mainListener();
    wordListeners.forEach((unsubscribe) => unsubscribe());
  };
}

// --- EXISTING FUNCTIONS (Unchanged) ---
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
    const tasksCollectionRef = collection(db, TASKS_COLLECTION);
    const userTasksQuery = query(
      tasksCollectionRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

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
      const teamAssignedTasksQuery = query(
        tasksCollectionRef,
        where("assignToTeamBoolean", "==", true),
        orderBy("createdAt", "desc")
      );

      const teamAssignedTasksSnapshot = await getDocs(teamAssignedTasksQuery);
      const teamTasksData = teamAssignedTasksSnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      console.log(
        `fetchTasks: Fetched ${teamTasksData.length} tasks with assignToTeamBoolean == true.`
      );

      const taskMap = new Map();
      allTasks.forEach((task) => taskMap.set(task.id, task));
      teamTasksData.forEach((task) => taskMap.set(task.id, task));
      allTasks = Array.from(taskMap.values());

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
  const userId = currentUser.uid;

  try {
    const { assignToTeamBoolean, dueDate, ...otherDetails } =
      taskPayloadFromContext;

    const dataToSave = {
      ...otherDetails,
      creatorUid: userId,
      createdAt: serverTimestamp(),
      lastUpdatedAt: serverTimestamp(),
      dueDate: Timestamp.fromDate(new Date(dueDate)),
      assignToTeamBoolean: assignToTeamBoolean || false,
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

    const tasksCollectionRef = collection(db, TASKS_COLLECTION);
    const docRef = await addDoc(tasksCollectionRef, dataToSave);

    console.log(`Task added with ID: ${docRef.id} for user ${userId}`);
    return {
      id: docRef.id,
      ...dataToSave,
    };
  } catch (error) {
    console.error(`Error adding task for user ${userId}:`, error);
    throw error;
  }
}

export async function deleteTaskFromFirestore(taskId) {
  try {
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
      lastUpdatedAt: serverTimestamp(),
    };

    if (dueDate) {
      dataToUpdate.dueDate = Timestamp.fromDate(new Date(dueDate));
    }

    if (assignToTeamBoolean !== undefined) {
      dataToUpdate.assignToTeamBoolean = assignToTeamBoolean;
    }

    if ("id" in dataToUpdate) delete dataToUpdate.id;
    if ("creatorUid" in dataToUpdate) delete dataToUpdate.creatorUid;
    if ("createdAt" in dataToUpdate) delete dataToUpdate.createdAt;

    const taskDocRef = doc(db, TASKS_COLLECTION, taskId);
    await updateDoc(taskDocRef, dataToUpdate);
    console.log(`Task updated with ID: ${taskId}`);
  } catch (error) {
    console.error(`Error updating task ${taskId}:`, error);
    throw error;
  }
}

/**
 * Sets up a real-time listener for a user's message inbox.
 * Messages are ordered with the newest first.
 * @param {string} userId The ID of the user whose messages to fetch.
 * @param {(messages: Array<object>) => void} onDataChange - Callback invoked with the messages array.
 * @param {(error: Error) => void} onError - Callback invoked on listener error.
 * @returns {() => void} An unsubscribe function to detach the listener.
 */
export function listenToUserMessages(userId, onDataChange, onError) {
  console.log(`LISTENER: Setting up for messages for user: ${userId}`);
  if (!userId) {
    onError(new Error("Invalid user ID provided to listenToUserMessages."));
    return () => {}; // Return no-op unsubscribe
  }

  const messagesRef = collection(db, "users", userId, "messages");
  const q = query(messagesRef, orderBy("receivedAt", "desc"));

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      console.log(
        `LISTENER: Snapshot for user messages: ${messages.length} items`
      );
      onDataChange(messages);
    },
    (error) => {
      console.error(`LISTENER ERROR: User messages for ${userId}:`, error);
      // Check for the common missing index error
      if (error.code?.includes("failed-precondition")) {
        console.error(
          `Firestore index likely missing for the messages query. The error log should contain a link to create it.`
        );
      }
      onError(error);
    }
  );

  return unsubscribe; // Return the cleanup function
}

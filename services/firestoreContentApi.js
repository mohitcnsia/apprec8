import firestore from "@react-native-firebase/firestore";
// Assuming authInstance is correctly configured and exported from your firebase setup.
// Please ensure this path is correct for your project structure.
import { authInstance } from "../config/firebaseConfig";

/**
 * Sets up a real-time listener for categories filtered by a specific group field.
 * Assumes categories have 'carouselGroup' and 'order' fields.
 *
 * @param {string} groupName - The value of the 'carouselGroup' field to filter by.
 * @param {(categories: Array<object>) => void} onDataChange - Callback invoked with the fetched categories array.
 * @param {(error: Error) => void} onError - Callback invoked on listener error.
 * @returns {() => void} An unsubscribe function to detach the listener.
 */
export function listenToCategoriesByGroup(groupName, onDataChange, onError) {
  console.log(`LISTENER: Setting up for categories in group: ${groupName}`);
  // Validate input
  if (!groupName || typeof groupName !== "string") {
    console.error("listenToCategoriesByGroup: Invalid groupName provided.");
    if (typeof onError === "function") {
      onError(new Error("Invalid group name for fetching categories."));
    }
    return () => {}; // Return no-op unsubscribe
  }

  const query = firestore()
    .collection("categories")
    .where("carouselGroup", "==", groupName)
    .orderBy("order");

  const unsubscribe = query.onSnapshot(
    (querySnapshot) => {
      const categories = [];
      querySnapshot.forEach((doc) => {
        // Include document ID along with data
        categories.push({ id: doc.id, ...doc.data() });
      });
      console.log(
        `LISTENER: Snapshot for group ${groupName}: ${categories.length} items`
      );
      if (typeof onDataChange === "function") {
        onDataChange(categories); // Pass fetched data
      }
    },
    (error) => {
      // Firestore listener error handling
      console.error(`LISTENER ERROR: categories group ${groupName}: `, error);
      // Check for common missing index error
      if (error.code?.includes("failed-precondition")) {
        console.error(
          `Firestore index likely missing for categories query (where carouselGroup == ${groupName}, orderBy order). Check Firestore console.`
        );
      }
      if (typeof onError === "function") {
        onError(error); // Pass the error object
      }
    }
  );
  return unsubscribe; // Return the cleanup function
}

/**
 * Listens for real-time updates on TOP-LEVEL topics within a specific category.
 * Fetches documents from the 'topics' collection where 'categoryId' matches
 * and 'parentTopicId' is explicitly null.
 * Requires a composite index on [categoryId (asc/desc), parentTopicId (asc/desc), order (asc/desc)] in Firestore.
 *
 * @param {string} categoryId - The ID of the category to fetch topics for.
 * @param {(topics: Array<object>) => void} onDataReceived - Callback invoked with the array of top-level topics.
 * @param {(error: Error) => void} onError - Callback invoked if an error occurs.
 * @returns {() => void} Function to unsubscribe from the listener.
 */
export const listenToCategoryTopics = (categoryId, onDataReceived, onError) => {
  console.log(
    `LISTENER: Attaching listener for top-level topics in category: ${categoryId}`
  );
  // Validate input
  if (!categoryId || typeof categoryId !== "string") {
    console.error("listenToCategoryTopics: Invalid categoryId provided.");
    if (typeof onError === "function") {
      onError(new Error("Invalid category ID for fetching topics."));
    }
    return () => {};
  }

  const query = firestore()
    .collection("topics")
    .where("categoryId", "==", categoryId)
    .where("parentTopicId", "==", null) // Filter for top-level items
    .orderBy("order", "asc"); // Order results

  const unsubscribe = query.onSnapshot(
    (querySnapshot) => {
      console.log(
        `LISTENER CALLBACK (Success): listenToCategoryTopics for ${categoryId} received snapshot. Size: ${querySnapshot.size}`
      );
      const topics = [];
      querySnapshot.forEach((doc) => {
        topics.push({ id: doc.id, ...doc.data() });
      });
      if (typeof onDataReceived === "function") {
        onDataReceived(topics); // Pass the array of topic objects
      }
    },
    (error) => {
      // Firestore listener error handling
      console.error(
        `LISTENER CALLBACK (Error): listenToCategoryTopics for ${categoryId} FAILED.`
      );
      console.error("Error details:", error);
      // Check for common missing index error
      if (error.code?.includes("failed-precondition")) {
        console.error(
          `Firestore index likely missing for topics query (where categoryId == ${categoryId}, where parentTopicId == null, orderBy order). Check Firestore console.`
        );
      }
      if (typeof onError === "function") {
        onError(error); // Pass the error object
      }
    }
  );
  return unsubscribe; // Return the cleanup function
};

/**
 * Listens for real-time updates on child items (subtopics or activities) of a specific parent topic/subtopic.
 * Fetches documents from the 'topics' collection where 'parentTopicId' matches the provided ID.
 * Requires an index on [parentTopicId (asc/desc), order (asc/desc)] in Firestore.
 *
 * @param {string} parentTopicId - The ID of the parent document in the 'topics' collection.
 * @param {(children: Array<object>) => void} onDataReceived - Callback invoked with the array of child items.
 * @param {(error: Error) => void} onError - Callback invoked if an error occurs.
 * @returns {() => void} Function to unsubscribe from the listener.
 */
export const listenToSubtopics = (parentTopicId, onDataReceived, onError) => {
  console.log(
    `LISTENER: Attaching listener for children of parent: ${parentTopicId}`
  );
  // Validate input
  if (!parentTopicId || typeof parentTopicId !== "string") {
    console.error("listenToSubtopics: Invalid parentTopicId provided.");
    if (typeof onError === "function") {
      onError(new Error("Invalid parent ID for fetching sub-items."));
    }
    return () => {};
  }

  const query = firestore()
    .collection("topics")
    .where("parentTopicId", "==", parentTopicId) // Filter by parent ID
    .orderBy("order", "asc"); // Order results

  const unsubscribe = query.onSnapshot(
    (querySnapshot) => {
      console.log(
        `LISTENER CALLBACK (Success): listenToSubtopics for parent ${parentTopicId} received snapshot. Size: ${querySnapshot.size}`
      );
      const children = [];
      querySnapshot.forEach((doc) => {
        children.push({ id: doc.id, ...doc.data() });
      });
      if (typeof onDataReceived === "function") {
        onDataReceived(children); // Pass the array of child items
      }
    },
    (error) => {
      // Firestore listener error handling
      console.error(
        `LISTENER CALLBACK (Error): listenToSubtopics for parent ${parentTopicId} FAILED.`
      );
      console.error("Error details:", error);
      // Check for common missing index error
      if (error.code?.includes("failed-precondition")) {
        console.error(
          `Firestore index likely missing for topics query (where parentTopicId == ${parentTopicId}, orderBy order). Check Firestore console.`
        );
      }
      if (typeof onError === "function") {
        onError(error); // Pass the error object
      }
    }
  );
  return unsubscribe; // Return the cleanup function
};

/**
 * Sets up a real-time listener for a single study content document.
 * Assumes the document ID in 'studyContent' collection matches the passed contentId.
 *
 * @param {string} contentId - The ID of the document in the 'studyContent' collection. Should match the ID of the corresponding 'STUDY' type document in 'topics'.
 * @param {(data: object | null) => void} onDataChange - Callback invoked with the study data object or null if not found.
 * @param {(error: Error) => void} onError - Callback invoked on listener error.
 * @returns {() => void} An unsubscribe function to detach the listener.
 */
export function listenToStudyContent(contentId, onDataChange, onError) {
  console.log(
    `LISTENER: Setting up for study content with contentId: ${contentId}`
  );
  // Validate input
  if (!contentId || typeof contentId !== "string") {
    console.error("listenToStudyContent: Invalid contentId provided.");
    if (typeof onError === "function") {
      onError(new Error("Invalid ID for fetching study content."));
    }
    return () => {};
  }

  const docRef = firestore().collection("studyContent").doc(contentId);

  const unsubscribe = docRef.onSnapshot(
    (docSnapshot) => {
      if (docSnapshot.exists) {
        const studyData = { id: docSnapshot.id, ...docSnapshot.data() };
        console.log(
          `LISTENER: Snapshot for study content ${contentId}: Data received.`
        );
        if (typeof onDataChange === "function") {
          onDataChange(studyData); // Pass data
        }
      } else {
        console.log(
          `LISTENER: Snapshot for study content ${contentId}: Document does not exist.`
        );
        if (typeof onDataChange === "function") {
          onDataChange(null); // Indicate not found
        }
      }
    },
    (error) => {
      // Firestore listener error handling
      console.error(`LISTENER ERROR: study content ${contentId}: `, error);
      if (typeof onError === "function") {
        onError(error); // Pass error
      }
    }
  );
  return unsubscribe; // Return cleanup function
}

/**
 * Sets up a real-time listener for quiz questions linked to a specific parent ID.
 * This parent ID should correspond to the ID of a 'QUIZ' type document in the 'topics' collection.
 * Assumes quiz question documents in 'quizQuestions' collection have a 'parentId' field matching this ID.
 * Requires an index on [parentId (asc/desc), order (asc/desc)] in Firestore 'quizQuestions' collection.
 *
 * @param {string} parentId - The ID of the parent document (likely a 'QUIZ' type topic doc).
 * @param {(questions: Array<object>) => void} onDataChange - Callback invoked with the array of questions.
 * @param {(error: Error) => void} onError - Callback invoked on listener error.
 * @returns {() => void} An unsubscribe function to detach the listener.
 */
export function listenToQuizQuestions(parentId, onDataChange, onError) {
  console.log(
    `LISTENER: Setting up for quiz questions for parentId: ${parentId}`
  );
  // Validate input
  if (!parentId || typeof parentId !== "string") {
    console.error("listenToQuizQuestions: Invalid parentId provided.");
    if (typeof onError === "function") {
      onError(new Error("Invalid ID for fetching quiz questions."));
    }
    return () => {};
  }

  const query = firestore()
    .collection("quizQuestions")
    .where("parentId", "==", parentId)
    .orderBy("order", "asc"); // Order questions

  const unsubscribe = query.onSnapshot(
    (querySnapshot) => {
      console.log(
        `LISTENER CALLBACK (Success): listenToQuizQuestions for parent ${parentId} received snapshot. Size: ${querySnapshot.size}`
      );
      const questions = [];
      querySnapshot.forEach((doc) => {
        questions.push({ id: doc.id, ...doc.data() });
      });
      if (typeof onDataChange === "function") {
        onDataChange(questions); // Pass fetched questions array
      }
    },
    (error) => {
      // Firestore listener error handling
      console.error(
        `LISTENER CALLBACK (Error): listenToQuizQuestions for parent ${parentId} FAILED.`
      );
      console.error("Error details:", error);
      // Check for common missing index error
      if (error.code?.includes("failed-precondition")) {
        console.error(
          `Firestore index likely missing for quizQuestions query (where parentId == ${parentId}, orderBy order). Check Firestore console.`
        );
      }
      if (typeof onError === "function") {
        onError(error); // Pass error
      }
    }
  );
  return unsubscribe; // Return cleanup function
}

// --- NEW FUNCTION for fetching the main user document ---
/**
 * Listens to the main document for the current authenticated user.
 * This document should contain the `perfectQuizCompletions` map and other user data.
 * @param {(userData: object | null) => void} onResult Callback function with the user data object or null if not found/error.
 * @param {(error: Error) => void} onError Callback function for errors.
 * @returns {() => void} Unsubscribe function.
 */
export const listenToUserDocument = (onResult, onError) => {
  const currentUser = authInstance.currentUser; // Get the currently signed-in user

  if (!currentUser) {
    console.warn(
      "listenToUserDocument: No user authenticated. Cannot attach listener."
    );
    if (typeof onError === "function") {
      // It might be better to call onResult with null if no user,
      // as it's not strictly a listener "error" but a state.
      // Or, the calling component should check for user before calling this.
      onResult(null);
    }
    return () => {}; // Return an empty unsubscribe function
  }
  const userId = currentUser.uid;
  console.log(`LISTENER: Setting up for user document: ${userId}`);

  const docRef = firestore().collection("users").doc(userId);

  const unsubscribe = docRef.onSnapshot(
    (docSnapshot) => {
      if (docSnapshot.exists) {
        const userData = {
          id: docSnapshot.id,
          ...docSnapshot.data(),
          // Ensure perfectQuizCompletions is at least an empty object if not present
          perfectQuizCompletions:
            docSnapshot.data()?.perfectQuizCompletions || {},
        };
        console.log(
          `LISTENER: Snapshot for user document ${userId}. Perfect completions map exists: ${!!userData.perfectQuizCompletions}`
        );
        if (typeof onResult === "function") {
          onResult(userData);
        }
      } else {
        console.warn(`LISTENER: User document ${userId} does not exist.`);
        if (typeof onResult === "function") {
          onResult(null); // User document not found
        }
      }
    },
    (error) => {
      console.error(`LISTENER ERROR: User document ${userId}: `, error);
      if (typeof onError === "function") {
        onError(error);
      }
    }
  );
  return unsubscribe;
};
// --- END OF NEW FUNCTION ---

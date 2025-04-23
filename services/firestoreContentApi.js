// services/firestoreContentApi.js (Rewritten & Documented)

import firestore from "@react-native-firebase/firestore";

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
    onError(new Error("Invalid group name for fetching categories."));
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
      onDataChange(categories); // Pass fetched data
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
      onError(error); // Pass the error object
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
    onError(new Error("Invalid category ID for fetching topics."));
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
      onDataReceived(topics); // Pass the array of topic objects
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
      onError(error); // Pass the error object
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
    onError(new Error("Invalid parent ID for fetching sub-items."));
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
      onDataReceived(children); // Pass the array of child items
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
      onError(error); // Pass the error object
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
  // <<< Renamed param to contentId
  console.log(
    `LISTENER: Setting up for study content with contentId: ${contentId}`
  ); // <<< Log using contentId
  // Validate input
  if (!contentId || typeof contentId !== "string") {
    console.error("listenToStudyContent: Invalid contentId provided.");
    onError(new Error("Invalid ID for fetching study content."));
    return () => {};
  }

  // Use the contentId directly as the document ID
  const docRef = firestore().collection("studyContent").doc(contentId); // <<< Use contentId here

  const unsubscribe = docRef.onSnapshot(
    (docSnapshot) => {
      if (docSnapshot.exists) {
        const studyData = { id: docSnapshot.id, ...docSnapshot.data() };
        console.log(
          `LISTENER: Snapshot for study content ${contentId}: Data received.`
        );
        onDataChange(studyData); // Pass data
      } else {
        console.log(
          `LISTENER: Snapshot for study content ${contentId}: Document does not exist.`
        );
        onDataChange(null); // Indicate not found
      }
    },
    (error) => {
      // Firestore listener error handling
      console.error(`LISTENER ERROR: study content ${contentId}: `, error);
      onError(error); // Pass error
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
  // Argument is parentId
  console.log(
    `LISTENER: Setting up for quiz questions for parentId: ${parentId}`
  );
  // Validate input
  if (!parentId || typeof parentId !== "string") {
    console.error("listenToQuizQuestions: Invalid parentId provided.");
    onError(new Error("Invalid ID for fetching quiz questions."));
    return () => {};
  }

  // Query 'quizQuestions' collection where the 'parentId' field matches
  const query = firestore()
    .collection("quizQuestions")
    .where("parentId", "==", parentId) // <<< Query using 'parentId' field
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
      onDataChange(questions); // Pass fetched questions array
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
      onError(error); // Pass error
    }
  );
  return unsubscribe; // Return cleanup function
}

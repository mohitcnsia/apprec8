// services/firestoreContentApi.js (using @react-native-firebase)

import firestore from "@react-native-firebase/firestore";

/**
 * Sets up a real-time listener for categories in a specific group.
 * @param {string} groupName - The value of the 'carouselGroup' field (e.g., "olympiad").
 * @param {function} onDataChange - Callback function: (data: Array<object>) => void
 * @param {function} onError - Callback function: (error: Error) => void
 * @returns {function} An unsubscribe function to detach the listener.
 */
export function listenToCategoriesByGroup(groupName, onDataChange, onError) {
  console.log(`LISTENER: Setting up for categories in group: ${groupName}`);
  const q = firestore()
    .collection("categories")
    .where("carouselGroup", "==", groupName)
    .orderBy("order");

  const unsubscribe = q.onSnapshot(
    (querySnapshot) => {
      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push({ id: doc.id, ...doc.data() });
      });
      console.log(
        `LISTENER: Snapshot for group ${groupName}: ${categories.length} items`
      );
      onDataChange(categories); // Pass data to callback
    },
    (error) => {
      console.error(`LISTENER ERROR: categories group ${groupName}: `, error);
      if (error.code.includes("failed-precondition")) {
        console.error(
          `Firestore index likely missing for categories query (where carouselGroup == ${groupName}, orderBy order).`
        );
      }
      onError(error); // Pass error to callback
    }
  );
  return unsubscribe; // Return the cleanup function
}

/**
 * Listens for real-time updates on TOP-LEVEL topics within a specific category.
 * Fetches topics where parentTopicId is explicitly null.
 * Requires a composite index on [categoryId, parentTopicId] in Firestore.
 *
 * @param {string} categoryId - The ID of the category to fetch topics for.
 * @param {function} onDataReceived - Callback function invoked with the array of topics.
 * @param {function} onError - Callback function invoked if an error occurs.
 * @returns {function} - Function to unsubscribe from the listener.
 */
export const listenToCategoryTopics = (categoryId, onDataReceived, onError) => {
  console.log(
    `Attaching listener for top-level topics in category: ${categoryId}`
  );

  const unsubscribe = firestore()
    .collection("topics")
    .where("categoryId", "==", categoryId)
    .where("parentTopicId", "==", null) // <<< Key change: Only fetch top-level items
    .orderBy("order", "asc") // Optional: Order by your desired field
    .onSnapshot(
      (querySnapshot) => {
        console.log(
          `LISTENER CALLBACK (Success): listenToCategoryTopics for category ${categoryId} received snapshot. Size: ${querySnapshot.size}`
        );
        const topics = [];
        querySnapshot.forEach((doc) => {
          // It's good practice to include the document ID with the data
          topics.push({
            id: doc.id, // Use Firestore document ID
            ...doc.data(),
          });
        });
        console.log(
          `Received ${topics.length} top-level topics for category ${categoryId}`
        );
        onDataReceived(topics); // Pass the array of topic objects
      },
      (error) => {
        console.error(
          `LISTENER CALLBACK (Error): listenToCategoryTopics for category ${categoryId} FAILED.`
        );
        console.error("Error details:", error); // Log the actual error object
        onError(error); // Pass the error object
      }
    );

  // Return the unsubscribe function to allow cleanup
  return unsubscribe;
};

/**
 * Sets up a real-time listener for a single study content document.
 * Uses topicId as the document ID in 'studyContent'.
 * @param {string} topicId - The ID of the topic/study document.
 * @param {function} onDataChange - Callback function: (data: object | null) => void
 * @param {function} onError - Callback function: (error: Error) => void
 * @returns {function} An unsubscribe function to detach the listener.
 */
export function listenToStudyContent(topicId, onDataChange, onError) {
  console.log(`LISTENER: Setting up for study content: ${topicId}`);
  const docRef = firestore().collection("studyContent").doc(topicId);

  const unsubscribe = docRef.onSnapshot(
    (docSnapshot) => {
      if (docSnapshot.exists) {
        const studyData = { id: docSnapshot.id, ...docSnapshot.data() };
        console.log(
          `LISTENER: Snapshot for study content ${topicId}: Data received.`
        );
        onDataChange(studyData);
      } else {
        console.log(
          `LISTENER: Snapshot for study content ${topicId}: Document does not exist.`
        );
        onDataChange(null); // Indicate not found
      }
    },
    (error) => {
      console.error(`LISTENER ERROR: study content ${topicId}: `, error);
      onError(error);
    }
  );
  return unsubscribe;
}

/**
 * Sets up a real-time listener for quiz questions for a specific topic.
 * @param {string} topicId - The ID of the topic.
 * @param {function} onDataChange - Callback function: (data: Array<object>) => void
 * @param {function} onError - Callback function: (error: Error) => void
 * @returns {function} An unsubscribe function to detach the listener.
 */
export function listenToQuizQuestions(topicId, onDataChange, onError) {
  console.log(`LISTENER: Setting up for quiz questions for topic: ${topicId}`);
  const q = firestore()
    .collection("quizQuestions")
    .where("topicId", "==", topicId)
    .orderBy("order");

  const unsubscribe = q.onSnapshot(
    (querySnapshot) => {
      const questions = [];
      querySnapshot.forEach((doc) => {
        questions.push({ id: doc.id, ...doc.data() });
      });
      console.log(
        `LISTENER: Snapshot for topic ${topicId} questions: ${questions.length} items`
      );
      onDataChange(questions);
    },
    (error) => {
      console.error(
        `LISTENER ERROR: quiz questions for topic ${topicId}: `,
        error
      );
      if (error.code.includes("failed-precondition")) {
        console.error(
          `Firestore index likely missing for quizQuestions query (where topicId == ${topicId}, orderBy order).`
        );
      }
      onError(error);
    }
  );
  return unsubscribe;
}

// In services/firestoreContentApi.js (add this new function)

/**
 * Listens for real-time updates on subtopics (children) of a specific parent topic.
 * Fetches items from the 'topics' collection where parentTopicId matches.
 *
 * @param {string} parentTopicId - The ID of the parent topic document.
 * @param {function} onDataReceived - Callback function invoked with the array of subtopics.
 * @param {function} onError - Callback function invoked if an error occurs.
 * @returns {function} - Function to unsubscribe from the listener.
 */
export const listenToSubtopics = (parentTopicId, onDataReceived, onError) => {
  console.log(`Attaching listener for subtopics of parent: ${parentTopicId}`);

  // Ensure parentTopicId is provided
  if (!parentTopicId) {
    console.error("listenToSubtopics called without a parentTopicId.");
    onError(new Error("Parent Topic ID is required to fetch subtopics."));
    // Return a no-op unsubscribe function
    return () => {};
  }

  const unsubscribe = firestore()
    .collection("topics")
    .where("parentTopicId", "==", parentTopicId) // <<< Key change: Fetch children
    .orderBy("order", "asc") // Optional: Order subtopics
    .onSnapshot(
      (querySnapshot) => {
        const subtopics = [];
        querySnapshot.forEach((doc) => {
          subtopics.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        console.log(
          `Received ${subtopics.length} subtopics for parent ${parentTopicId}`
        );
        onDataReceived(subtopics);
      },
      (error) => {
        console.error(
          `Error listening to subtopics for parent ${parentTopicId}: `,
          error
        );
        onError(error);
      }
    );

  // Return the unsubscribe function
  return unsubscribe;
};

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
 * Sets up a real-time listener for topics in a specific category.
 * @param {string} categoryId - The ID of the category (e.g., "imo").
 * @param {function} onDataChange - Callback function: (data: Array<object>) => void
 * @param {function} onError - Callback function: (error: Error) => void
 * @returns {function} An unsubscribe function to detach the listener.
 */
export function listenToCategoryTopics(categoryId, onDataChange, onError) {
  console.log(`LISTENER: Setting up for topics in category: ${categoryId}`);
  const q = firestore()
    .collection("topics")
    .where("categoryId", "==", categoryId)
    .orderBy("order");

  const unsubscribe = q.onSnapshot(
    (querySnapshot) => {
      const topics = [];
      querySnapshot.forEach((doc) => {
        topics.push({ id: doc.id, ...doc.data() });
      });
      console.log(
        `LISTENER: Snapshot for category ${categoryId} topics: ${topics.length} items`
      );
      onDataChange(topics);
    },
    (error) => {
      console.error(
        `LISTENER ERROR: topics for category ${categoryId}: `,
        error
      );
      if (error.code.includes("failed-precondition")) {
        console.error(
          `Firestore index likely missing for topics query (where categoryId == ${categoryId}, orderBy order).`
        );
      }
      onError(error);
    }
  );
  return unsubscribe;
}

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

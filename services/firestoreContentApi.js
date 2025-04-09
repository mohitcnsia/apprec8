// src/services/firestoreContentApi.js

// Adjust the path '../config/firebaseConfig' to correctly point to where your 'db' instance is exported
import { db } from "../config/firebaseConfig";

// Import necessary Firestore functions from the Firebase JS SDK
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  limit,
  orderBy, // Make sure orderBy is imported
} from "firebase/firestore";

/**
 * Fetches all categories, ordered by the 'order' field.
 * @returns {Promise<Array<object>>} An array of category objects.
 */
// export async function getCategories() {
//   console.log("Fetching categories from Firestore");
//   const categories = [];
//   const categoriesCollection = collection(db, "categories");
//   const q = query(categoriesCollection, orderBy("order")); // Assuming you added an 'order' field

//   try {
//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((doc) => {
//       categories.push({ id: doc.id, ...doc.data() });
//     });
//     console.log(`Found ${categories.length} categories`);
//     return categories;
//   } catch (error) {
//     console.error("Error fetching categories: ", error);
//     throw error;
//   }
// }
// In services/firestoreContentApi.js

/**
 * Fetches categories belonging to a specific group, ordered by 'order'.
 * @param {string} groupName - The value of the 'carouselGroup' field to filter by (e.g., "olympiad", "classroom").
 * @returns {Promise<Array<object>>} An array of category objects for that group.
 */
export async function getCategoriesByGroup(groupName) {
  console.log(`Workspaceing categories from Firestore for group: ${groupName}`);
  const categories = [];
  const categoriesCollection = collection(db, "categories");
  // Query where 'carouselGroup' matches the groupName, and order by 'order'
  const q = query(
    categoriesCollection,
    where("carouselGroup", "==", groupName),
    orderBy("order") // Assumes you have an 'order' field for sorting within the carousel
  );

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    console.log(`Found ${categories.length} categories for group ${groupName}`);
    return categories;
  } catch (error) {
    // Check for index error specifically
    if (error.code === "failed-precondition") {
      console.error(
        `Firestore index missing for categories query (where carouselGroup == ${groupName}, orderBy order): `,
        error
      );
      // You might need to create a composite index on 'carouselGroup' and 'order'
      // Error message will contain a link like before!
      throw new Error(
        `Firestore index required. Check console logs for the creation link.`
      );
    } else {
      console.error(
        `Error fetching categories for group ${groupName}: `,
        error
      );
      throw error; // Re-throw other errors
    }
  }
}

/**
 * Fetches topics for a specific categoryId, ordered by the 'order' field.
 * @param {string} categoryId - The ID of the category (e.g., "imo")
 * @returns {Promise<Array<object>>} An array of topic objects.
 */
export async function getCategoryTopics(categoryId) {
  console.log("Fetching Topics from Firestore for categoryId: ", categoryId);
  const topics = [];
  const topicsCollection = collection(db, "topics");
  const q = query(
    topicsCollection,
    where("categoryId", "==", categoryId),
    orderBy("order") // Assuming you added an 'order' field
  );

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      topics.push({ id: doc.id, ...doc.data() });
    });
    console.log(`Found ${topics.length} topics for ${categoryId}`);
    return topics;
  } catch (error) {
    console.error("Error fetching topics: ", error);
    throw error;
  }
}

/**
 * Fetches the study content document for a specific topicId.
 * Uses the topicId directly as the document ID in the 'studyContent' collection.
 * @param {string} topicId - The ID of the topic (e.g., "4-imo-div")
 * @returns {Promise<object|null>} The study data object or null if not found.
 */
export async function getStudyContent(topicId) {
  console.log("Fetching Study content from Firestore for topicId: ", topicId);
  const studyDocRef = doc(db, "studyContent", topicId);

  try {
    const docSnap = await getDoc(studyDocRef);
    if (docSnap.exists()) {
      console.log("Found study content for:", topicId);
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No study content found for topicId: ", topicId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching study content: ", error);
    throw error;
  }
}

/**
 * Fetches all quiz question documents for a given topic ID, ordered by the 'order' field.
 * Remember you changed field names to 'question' and 'answer' in your data.
 * @param {string} topicId - The ID of the topic (e.g., "4-imo-div")
 * @returns {Promise<Array<object>>} An array of quiz question objects.
 */
export async function getQuizQuestions(topicId) {
  console.log("Fetching Quiz data from Firestore for topicId: ", topicId);
  const questions = [];
  const quizQuestionsCollection = collection(db, "quizQuestions");
  const q = query(
    quizQuestionsCollection,
    where("topicId", "==", topicId),
    orderBy("order") // Assuming you add an 'order' field to questions
  );

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      questions.push({ id: doc.id, ...doc.data() });
    });
    console.log(`Found ${questions.length} quiz questions for ${topicId}`);
    return questions;
  } catch (error) {
    console.error("Error fetching quiz data: ", error);
    throw error;
  }
}

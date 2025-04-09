// functions/index.js
const functions = require("firebase-functions"); // General import
const { onRequest } = require("firebase-functions/v2/https"); // v2 HTTPS import
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Get a reference to Firestore
const db = admin.firestore();

// Define reusable runtime options for functions
const functionOptions = {
  memory: "128MiB", // Lowest memory setting
  timeoutSeconds: 30, // Slightly reduced timeout
};

const bulkFunctionOptions = {
  memory: "256MiB", // Lowest memory setting
  timeoutSeconds: 60, // Default timeout
};

// --- Single Item Add Functions ---

/**
 * Adds or updates a single category document using its 'id'.
 * Handles 'title', 'subtitle', and 'carouselGroup' fields.
 * Expects a POST request with JSON body containing category data.
 * Example Body:
 * {
 * "id": "psy",                     // Document ID for the category
 * "title": "Psychology",           // Main display name
 * "image": "URL_FROM_STORAGE",     // Full HTTPS URL
 * "subtitle": "Class XI",          // Subtitle/Description
 * "order": 2,                      // Display order
 * "carouselGroup": "classroom",    // Group for UI filtering
 * "type": "COURSE",                // Type for navigation logic
 * "duration": "20 hr",             // Optional duration
 * "author": "Seema Joshi"          // Optional author
 * }
 */
exports.addCategory = onRequest(functionOptions, async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }
  try {
    const categoryData = req.body;
    const requiredFields = ["id", "title", "image", "order", "carouselGroup"];
    for (const field of requiredFields) {
      if (
        categoryData[field] === undefined ||
        categoryData[field] === null ||
        categoryData[field] === ""
      ) {
        return res
          .status(400)
          .send(`Missing or empty required field: ${field}`);
      }
    }
    const categoryId = categoryData.id;
    const categoryRef = db.collection("categories").doc(categoryId);

    await categoryRef.set({
      title: categoryData.title,
      image: categoryData.image,
      subtitle: categoryData.subtitle || "",
      order: categoryData.order,
      carouselGroup: categoryData.carouselGroup, // Included
      type: categoryData.type || "COURSE",
      duration: categoryData.duration || "",
      author: categoryData.author || "",
    });

    console.log(`Successfully added/updated category: ${categoryId}`);
    return res.status(201).send({ success: true, id: categoryId });
  } catch (error) {
    console.error("Error adding category:", error);
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error" });
  }
});

/**
 * Adds or updates a single topic document using its 'id'.
 * Links to a category via 'categoryId'. Includes boolean flags for content.
 * Expects a POST request with JSON body containing topic data.
 * Example Body:
 * {
 * "id": "4-imo-add",         // Document ID for the topic
 * "categoryId": "imo",       // ID of the parent category
 * "title": "Addition",
 * "order": 2,
 * "hasStudy": true,          // Boolean flag
 * "hasQuiz": false,          // Boolean flag
 * "type": "ACTIVITY",        // Optional original type
 * "otherActivities": []      // Optional array of other activity types
 * }
 */
exports.addTopic = onRequest(functionOptions, async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }
  try {
    const topicData = req.body;
    const requiredFields = ["id", "categoryId", "title", "order"];
    for (const field of requiredFields) {
      if (topicData[field] === undefined || topicData[field] === null) {
        return res.status(400).send(`Missing required field: ${field}`);
      }
    }
    const hasStudy = topicData.hasStudy === true;
    const hasQuiz = topicData.hasQuiz === true;
    const topicId = topicData.id;
    const topicRef = db.collection("topics").doc(topicId);

    const dataToSave = {
      categoryId: topicData.categoryId,
      title: topicData.title,
      order: topicData.order,
      hasStudy: hasStudy,
      hasQuiz: hasQuiz,
      otherActivities: Array.isArray(topicData.otherActivities)
        ? topicData.otherActivities
        : [],
      type: topicData.type || "ACTIVITY",
    };

    await topicRef.set(dataToSave);
    console.log(
      `Successfully added/updated topic: ${topicId} under category ${topicData.categoryId}`
    );
    return res
      .status(201)
      .send({ success: true, id: topicId, data: dataToSave });
  } catch (error) {
    console.error("Error adding topic:", error);
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error" });
  }
});

/**
 * Adds or updates study content for a specific topic.
 * Uses the 'topicId' as the document ID in the 'studyContent' collection.
 * Expects a POST request with JSON body containing study content data.
 * Example Body:
 * {
 * "topicId": "4-imo-add",       // ID of the topic this content belongs to
 * "name": "Addition Study",   // Display name for the reader screen
 * "author": "Mohit Chilkoti",
 * "content": "## Addition Basics\n...",
 * "coverImage": "OPTIONAL_URL_FROM_STORAGE",
 * "additionalImages": ["OPTIONAL_URL_1"]
 * }
 */
exports.addStudyContent = onRequest(functionOptions, async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }
  try {
    const contentData = req.body;
    const requiredFields = ["topicId", "name", "author", "content"];
    for (const field of requiredFields) {
      if (!contentData[field]) {
        return res.status(400).send(`Missing required field: ${field}`);
      }
    }
    const topicId = contentData.topicId;
    const studyContentRef = db.collection("studyContent").doc(topicId);

    const dataToSave = {
      name: contentData.name,
      author: contentData.author,
      content: contentData.content,
      coverImage: contentData.coverImage || null,
      additionalImages: Array.isArray(contentData.additionalImages)
        ? contentData.additionalImages
        : [],
    };

    await studyContentRef.set(dataToSave);
    console.log(
      `Successfully added/updated study content for topic: ${topicId}`
    );
    return res.status(201).send({ success: true, id: topicId });
  } catch (error) {
    console.error("Error adding study content:", error);
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error" });
  }
});

/**
 * Adds a single new quiz question to the 'quizQuestions' collection.
 * Links to a topic via 'topicId'. Uses auto-generated document ID.
 * Expects a POST request with JSON body containing question data.
 * Example Body:
 * {
 * "topicId": "4-imo-mul",
 * "question": "19 x __ = 152", // Use 'question' field
 * "options": ["6", "7", "8", "9"],
 * "answer": "8",               // Use 'answer' field
 * "explanation": "Because 19 * 8 = 152.",
 * "order": 1                 // Order within the quiz
 * }
 */
exports.addQuizQuestion = onRequest(functionOptions, async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }
  try {
    const questionData = req.body;
    const requiredFields = [
      "topicId",
      "question",
      "options",
      "answer",
      "order",
    ];
    for (const field of requiredFields) {
      if (questionData[field] === undefined || questionData[field] === null) {
        if (field === "options" && !Array.isArray(questionData.options)) {
          return res.status(400).send(`Field 'options' must be an array.`);
        } else if (field !== "options") {
          return res.status(400).send(`Missing required field: ${field}`);
        }
      }
    }
    if (!Array.isArray(questionData.options)) {
      return res.status(400).send("Field 'options' must be an array.");
    }

    const dataToSave = {
      topicId: questionData.topicId,
      question: questionData.question, // Use 'question' field
      options: questionData.options,
      answer: questionData.answer, // Use 'answer' field
      explanation: questionData.explanation || "",
      order: questionData.order,
    };

    const docRef = await db.collection("quizQuestions").add(dataToSave);
    console.log(
      `Successfully added quiz question with ID: ${docRef.id} for topic ${questionData.topicId}`
    );
    return res.status(201).send({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Error adding quiz question:", error);
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error" });
  }
});

// --- Bulk Add Functions ---

/**
 * Adds multiple category documents using a batch write.
 * Handles 'title', 'subtitle', and 'carouselGroup'.
 * Expects POST with JSON body: { "categories": [{cat1}, {cat2}, ...] }
 */
exports.bulkAddCategories = onRequest(bulkFunctionOptions, async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }
  try {
    const categoriesArray = req.body.categories;
    if (!Array.isArray(categoriesArray) || categoriesArray.length === 0) {
      return res
        .status(400)
        .send("Request body must contain a non-empty 'categories' array.");
    }
    if (categoriesArray.length > 500) {
      return res
        .status(400)
        .send("Cannot add more than 500 categories in one batch.");
    }

    const batch = db.batch();
    const categoriesCol = db.collection("categories");
    let processedCount = 0;

    categoriesArray.forEach((catData) => {
      if (
        catData.id &&
        catData.title &&
        catData.image &&
        catData.order !== undefined &&
        catData.carouselGroup
      ) {
        const categoryId = catData.id;
        const categoryRef = categoriesCol.doc(categoryId);
        const dataToSave = {
          title: catData.title,
          image: catData.image,
          subtitle: catData.subtitle || "",
          order: catData.order,
          carouselGroup: catData.carouselGroup, // Included
          type: catData.type || "COURSE",
          duration: catData.duration || "",
          author: catData.author || "",
        };
        batch.set(categoryRef, dataToSave);
        processedCount++;
      } else {
        console.warn(
          "Skipping invalid category data (missing id, title, image, order, or carouselGroup) in bulk add:",
          catData
        );
      }
    });

    if (processedCount === 0) {
      return res
        .status(400)
        .send("No valid category data found in the request.");
    }

    await batch.commit();
    console.log(
      `Successfully added ${processedCount} categories via bulk operation.`
    );
    return res.status(201).send({ success: true, count: processedCount });
  } catch (error) {
    console.error("Error adding categories in bulk:", error);
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error" });
  }
});

/**
 * Adds multiple topic documents using a batch write.
 * Expects POST with JSON body: { "topics": [{topic1}, {topic2}, ...] }
 */
exports.bulkAddTopics = onRequest(bulkFunctionOptions, async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }
  try {
    const topicsArray = req.body.topics;
    if (!Array.isArray(topicsArray) || topicsArray.length === 0) {
      return res
        .status(400)
        .send("Request body must contain a non-empty 'topics' array.");
    }
    if (topicsArray.length > 500) {
      return res
        .status(400)
        .send("Cannot add more than 500 topics in one batch.");
    }

    const batch = db.batch();
    const topicsCol = db.collection("topics");
    let processedCount = 0;

    topicsArray.forEach((topicData) => {
      if (
        topicData.id &&
        topicData.categoryId &&
        topicData.title &&
        topicData.order !== undefined
      ) {
        const topicId = topicData.id;
        const topicRef = topicsCol.doc(topicId);
        const dataToSave = {
          categoryId: topicData.categoryId,
          title: topicData.title,
          order: topicData.order,
          hasStudy: topicData.hasStudy === true,
          hasQuiz: topicData.hasQuiz === true,
          otherActivities: Array.isArray(topicData.otherActivities)
            ? topicData.otherActivities
            : [],
          type: topicData.type || "ACTIVITY",
        };
        batch.set(topicRef, dataToSave);
        processedCount++;
      } else {
        console.warn("Skipping invalid topic data in bulk add:", topicData);
      }
    });

    if (processedCount === 0) {
      return res.status(400).send("No valid topic data found in the request.");
    }

    await batch.commit();
    console.log(
      `Successfully added ${processedCount} topics via bulk operation.`
    );
    return res.status(201).send({ success: true, count: processedCount });
  } catch (error) {
    console.error("Error adding topics in bulk:", error);
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error" });
  }
});

/**
 * Adds/Updates multiple study content docs using a batch write.
 * Expects POST with JSON body: { "studyItems": [{item1}, {item2}, ...] }
 */
exports.bulkAddStudyContent = onRequest(
  bulkFunctionOptions,
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }
    try {
      const studyItemsArray = req.body.studyItems;
      if (!Array.isArray(studyItemsArray) || studyItemsArray.length === 0) {
        return res
          .status(400)
          .send("Request body must contain a non-empty 'studyItems' array.");
      }
      if (studyItemsArray.length > 500) {
        return res
          .status(400)
          .send("Cannot process more than 500 study items in one batch.");
      }

      const batch = db.batch();
      const studyCol = db.collection("studyContent");
      let processedCount = 0;

      studyItemsArray.forEach((itemData) => {
        if (
          itemData.topicId &&
          itemData.name &&
          itemData.author &&
          itemData.content
        ) {
          const topicId = itemData.topicId;
          const studyRef = studyCol.doc(topicId);
          const dataToSave = {
            name: itemData.name,
            author: itemData.author,
            content: itemData.content,
            coverImage: itemData.coverImage || null,
            additionalImages: Array.isArray(itemData.additionalImages)
              ? itemData.additionalImages
              : [],
          };
          batch.set(studyRef, dataToSave);
          processedCount++;
        } else {
          console.warn(
            "Skipping invalid study item data in bulk add:",
            itemData
          );
        }
      });

      if (processedCount === 0) {
        return res
          .status(400)
          .send("No valid study item data found in the request.");
      }

      await batch.commit();
      console.log(
        `Successfully added/updated ${processedCount} study items via bulk operation.`
      );
      return res.status(201).send({ success: true, count: processedCount });
    } catch (error) {
      console.error("Error adding study items in bulk:", error);
      return res
        .status(500)
        .send({ success: false, error: "Internal Server Error" });
    }
  }
);

/**
 * Adds multiple new quiz questions using a batch write.
 * Expects POST with JSON body: { "questions": [{q1}, {q2}, ...] }
 */
exports.bulkAddQuizQuestions = onRequest(
  bulkFunctionOptions,
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }
    try {
      const questionsArray = req.body.questions;
      if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
        return res
          .status(400)
          .send("Request body must contain a non-empty 'questions' array.");
      }
      if (questionsArray.length > 500) {
        return res
          .status(400)
          .send("Cannot add more than 500 questions in one batch.");
      }

      const batch = db.batch();
      const quizCol = db.collection("quizQuestions");
      let processedCount = 0;

      questionsArray.forEach((qData) => {
        if (
          qData.topicId &&
          qData.question &&
          Array.isArray(qData.options) &&
          qData.answer !== undefined &&
          qData.order !== undefined
        ) {
          const dataToSave = {
            topicId: qData.topicId,
            question: qData.question, // Use 'question'
            options: qData.options,
            answer: qData.answer, // Use 'answer'
            explanation: qData.explanation || "",
            order: qData.order,
          };
          const newQuestionRef = quizCol.doc();
          batch.set(newQuestionRef, dataToSave);
          processedCount++;
        } else {
          console.warn(
            "Skipping invalid quiz question data in bulk add:",
            qData
          );
        }
      });

      if (processedCount === 0) {
        return res
          .status(400)
          .send("No valid quiz question data found in the request.");
      }

      await batch.commit();
      console.log(
        `Successfully added ${processedCount} quiz questions via bulk operation.`
      );
      return res.status(201).send({ success: true, count: processedCount });
    } catch (error) {
      console.error("Error adding quiz questions in bulk:", error);
      return res
        .status(500)
        .send({ success: false, error: "Internal Server Error" });
    }
  }
);

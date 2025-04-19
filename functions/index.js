// functions/index.js - Using ONLY v1 SDK Syntax - CORRECTED

// --- Top-Level Imports and Initialization ---
const functions = require("firebase-functions"); // v1 SDK
const admin = require("firebase-admin");
const { getFirestore, FieldValue } = require("firebase-admin/firestore"); // Specific imports

// Initialize Firebase Admin SDK *ONCE*
try {
  if (admin.apps.length === 0) {
    admin.initializeApp();
    console.log("Firebase Admin SDK initialized.");
  }
} catch (e) {
  console.error("Firebase admin initialization error", e);
}

const db = getFirestore(); // Get Firestore instance

// --- Define Region and Runtime Options for v1 ---
const region = "us-central1"; // Your chosen region
const runtimeOptions = {
  memory: "256MB",
  timeoutSeconds: 60,
};
const longRuntimeOptions = {
  // For potentially long operations like bulk delete/update
  memory: "512MB",
  timeoutSeconds: 300, // 5 minutes
};

// =========================================================
// --- Auth Trigger (v1 Syntax) --- CORRECTED
// =========================================================
/**
 * V1 Auth Trigger: Runs when a new Firebase Auth user is created.
 * Initializes corresponding documents in 'users' and 'userStats' collections.
 * NOTE: This function runs automatically. No external security check needed.
 */
exports.initializeNewUser = functions
  .region(region)
  .runWith(runtimeOptions)
  .auth.user()
  .onCreate(async (user) => {
    // Function receives the 'user' object
    const userId = user.uid;
    const email = user.email || ""; // Email might be optional
    const displayName = user.displayName;
    const photoURL = user.photoURL;

    console.log(
      `V1 auth.user().onCreate: Initializing user: ${userId}, email: ${email}`
    );

    // --- Security check REMOVED - Not applicable or needed for Auth triggers ---

    const now = FieldValue.serverTimestamp();
    const userRef = db.collection("users").doc(userId);
    const userStatsRef = db.collection("userStats").doc(userId);

    // Use provided info, fallback for username
    const defaultUsername =
      displayName ||
      (email ? email.split("@")[0] : `User_${userId.substring(0, 6)}`);

    const userData = {
      userId: userId,
      email: email,
      username: defaultUsername,
      displayName: displayName || "",
      photoURL: photoURL || "",
      phone: user.phoneNumber || "",
      createdAt: now,
      lastUpdatedAt: now,
      lastActivityAt: null,
    };

    const userStatsData = {
      userId: userId,
      totalStars: 0,
      currentStreak: 0,
      lastQuizCompletionDate: null,
      totalQuizzesCompleted: 0,
    };

    const batch = db.batch();
    batch.set(userRef, userData);
    batch.set(userStatsRef, userStatsData);

    try {
      await batch.commit();
      console.log(
        `V1 auth.user().onCreate: Successfully initialized documents for user ${userId}`
      );
    } catch (error) {
      console.error(
        `V1 auth.user().onCreate: Error initializing documents for user ${userId}:`,
        error
      );
    }
    // No return value or res.send() needed for this trigger type
  });

// ==========================================================
// --- EXISTING HTTPS FUNCTIONS (v1 Syntax) ---
// --- SECURITY NOTE: Secure these via IAM Permissions ---
// ==========================================================

/**
 * V1 HTTPS: Adds or updates a single category document.
 * SECURITY: Ensure this function's IAM permissions restrict invocation
 * (e.g., remove 'allUsers', add specific admin user/service account
 * with 'Cloud Functions Invoker' role). No internal auth check needed here.
 */
exports.addCategory = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
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
          String(categoryData[field]).trim() === ""
        ) {
          console.warn(`V1 addCategory: Missing/empty field: ${field}`);
          return res
            .status(400)
            .send({ success: false, error: `Missing/empty field: ${field}` });
        }
      }
      const categoryId = String(categoryData.id);
      const categoryRef = db.collection("categories").doc(categoryId);
      await categoryRef.set(
        {
          title: categoryData.title,
          image: categoryData.image,
          subtitle: categoryData.subtitle || "",
          order: categoryData.order,
          carouselGroup: categoryData.carouselGroup,
          type: categoryData.type || "COURSE",
          duration: categoryData.duration || "",
          author: categoryData.author || "",
        },
        { merge: true }
      );
      console.log(`V1 addCategory: Success for id: ${categoryId}`);
      return res.status(201).send({ success: true, id: categoryId }); // Use return
    } catch (error) {
      console.error("V1 addCategory: Error:", error);
      return res
        .status(500)
        .send({ success: false, error: "Internal Server Error" }); // Use return
    }
  });

// ==========================================================
// --- TOPIC MANAGEMENT FUNCTIONS ---
// ==========================================================

/**
 * V1 HTTPS (POST): Creates a new topic document *only* if an ID doesn't exist.
 * Expects the desired document ID to be included in the request body.
 * SECURITY: Ensure this function's IAM permissions restrict invocation
 * (e.g., remove 'allUsers', add specific admin user/service account).
 *
 * @param {object} req.body - JSON payload containing topic data including 'id'.
 * @param {string} req.body.id - The desired Document ID for the new topic.
 * @param {string} req.body.categoryId - ID of the parent category.
 * @param {string} req.body.title - Title of the topic.
 * @param {number} req.body.order - Order for sorting.
 * @param {boolean} [req.body.hasStudy=false] - Does it have study content?
 * @param {boolean} [req.body.hasQuiz=false] - Does it have quiz content?
 * @param {string|null} [req.body.parentTopicId=null] - ID of parent topic if subtopic.
 * @param {boolean} [req.body.hasSubtopics=false] - Does it have subtopics?
 * @param {string} [req.body.type="ACTIVITY"] - Type indicator (e.g., TOPIC, SUBTOPIC).
 * @param {Array<string>} [req.body.otherActivities=[]] - Other activity types.
 */
exports.addTopic = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    // Ensure POST method
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed. Use POST.");
    }
    if (!req.is("application/json")) {
      return res
        .status(400)
        .send("Bad Request: Content-Type must be application/json.");
    }

    try {
      const topicData = req.body;
      // --- Basic Input Validation ---
      const requiredFields = ["id", "categoryId", "title", "order"];
      for (const field of requiredFields) {
        if (
          topicData[field] === undefined ||
          topicData[field] === null ||
          String(topicData[field]).trim() === ""
        ) {
          // Allow order 0, but check others for empty string
          if (field !== "order" && String(topicData[field]).trim() === "") {
            console.warn(
              `V1 addTopic: Missing or empty required field: ${field}`
            );
            return res
              .status(400)
              .send({
                success: false,
                error: `Missing or empty required field: ${field}`,
              });
          } else if (
            field === "order" &&
            typeof topicData[field] !== "number"
          ) {
            console.warn(`V1 addTopic: Field 'order' must be a number.`);
            return res
              .status(400)
              .send({
                success: false,
                error: `Field 'order' must be a number.`,
              });
          }
        }
      }

      const topicId = String(topicData.id).trim();
      if (!topicId) {
        return res
          .status(400)
          .send({ success: false, error: `Field 'id' cannot be empty.` });
      }

      const topicRef = db.collection("topics").doc(topicId);

      // Prepare data with defaults (important for create)
      const dataToSave = {
        categoryId: String(topicData.categoryId),
        title: String(topicData.title),
        order: Number(topicData.order),
        hasStudy: topicData.hasStudy === true, // Ensure boolean
        hasQuiz: topicData.hasQuiz === true, // Ensure boolean
        parentTopicId:
          topicData.parentTopicId !== undefined
            ? String(topicData.parentTopicId)
            : null, // Ensure string or null
        hasSubtopics: topicData.hasSubtopics === true, // Ensure boolean
        otherActivities: Array.isArray(topicData.otherActivities)
          ? topicData.otherActivities
          : [],
        type: String(topicData.type || "ACTIVITY"), // Default type
        // Consider adding createdAt timestamp here
        createdAt: FieldValue.serverTimestamp(),
        lastUpdatedAt: FieldValue.serverTimestamp(),
      };

      // --- Use Transaction to ensure create-only ---
      await db.runTransaction(async (transaction) => {
        const docSnap = await transaction.get(topicRef);
        if (docSnap.exists) {
          // Document already exists, throw error to trigger 409 Conflict
          throw new Error(
            `Document with ID ${topicId} already exists in collection 'topics'. Use PUT to update.`
          );
        }
        // Document doesn't exist, create it
        console.log(
          `V1 addTopic: Creating document ID ${topicId} with data:`,
          JSON.stringify(dataToSave, null, 2)
        );
        transaction.set(topicRef, dataToSave);
      });

      console.log(`V1 addTopic: Successfully created document ID: ${topicId}`);
      // Return 201 Created status code
      return res
        .status(201)
        .send({ success: true, id: topicId, data: dataToSave });
    } catch (error) {
      if (error.message.includes("already exists")) {
        console.warn(
          `V1 addTopic: Attempted to create existing document: ${error.message}`
        );
        return res.status(409).send({ success: false, error: error.message }); // 409 Conflict
      }
      console.error("V1 addTopic: Error:", error);
      return res
        .status(500)
        .send({ success: false, error: "Internal Server Error" });
    }
  });

/**
 * V1 HTTPS (PUT): Updates an existing topic document *only*. Fails if not found.
 * Expects the document ID and fields to update in the request body.
 * SECURITY: Ensure this function's IAM permissions restrict invocation.
 *
 * @param {object} req.body - JSON payload containing update data.
 * @param {string} req.body.id - The Document ID of the topic to update.
 * @param {object} req.body.fields - An object containing only the fields to update.
 */
exports.updateTopic = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    // Ensure PUT method
    if (req.method !== "PUT") {
      return res.status(405).send("Method Not Allowed. Use PUT.");
    }
    if (!req.is("application/json")) {
      return res
        .status(400)
        .send("Bad Request: Content-Type must be application/json.");
    }

    try {
      const { id: topicId, fields: fieldsToUpdate } = req.body;

      // --- Basic Input Validation ---
      if (!topicId || typeof topicId !== "string" || topicId.trim() === "") {
        return res
          .status(400)
          .send({
            success: false,
            error: "Missing or invalid 'id' (string) in request body.",
          });
      }
      if (
        !fieldsToUpdate ||
        typeof fieldsToUpdate !== "object" ||
        Object.keys(fieldsToUpdate).length === 0
      ) {
        return res
          .status(400)
          .send({
            success: false,
            error: "Missing or empty 'fields' object in request body.",
          });
      }
      // Optional: Add validation to prevent updating certain fields like 'id' or 'createdAt'
      if (
        fieldsToUpdate.hasOwnProperty("id") ||
        fieldsToUpdate.hasOwnProperty("createdAt")
      ) {
        console.warn(
          `V1 updateTopic: Attempt to update immutable field (id or createdAt) for ${topicId}`
        );
        // delete fieldsToUpdate.id; // Silently remove them
        // delete fieldsToUpdate.createdAt;
        return res
          .status(400)
          .send({
            success: false,
            error: "Cannot update immutable fields like 'id' or 'createdAt'.",
          });
      }

      const topicRef = db.collection("topics").doc(topicId);

      // --- Use Transaction to ensure update-only ---
      await db.runTransaction(async (transaction) => {
        const docSnap = await transaction.get(topicRef);
        if (!docSnap.exists) {
          // Document doesn't exist, throw error to trigger 404 Not Found
          throw new Error(
            `Document with ID ${topicId} not found in collection 'topics'. Use POST to create.`
          );
        }
        // Document exists, update it
        const updateData = {
          ...fieldsToUpdate,
          lastUpdatedAt: FieldValue.serverTimestamp(), // Always update timestamp
        };
        console.log(
          `V1 updateTopic: Updating document ID ${topicId} with data:`,
          JSON.stringify(updateData, null, 2)
        );
        transaction.update(topicRef, updateData); // Use transaction.update
      });

      console.log(
        `V1 updateTopic: Successfully updated document ID: ${topicId}`
      );
      // Return 200 OK status code for successful update
      return res.status(200).send({ success: true, id: topicId });
    } catch (error) {
      if (error.message.includes("not found")) {
        console.warn(
          `V1 updateTopic: Document not found for update: ${error.message}`
        );
        return res.status(404).send({ success: false, error: error.message }); // 404 Not Found
      }
      console.error("V1 updateTopic: Error:", error);
      return res
        .status(500)
        .send({ success: false, error: "Internal Server Error" });
    }
  });

/**
 * V1 HTTPS: Adds or updates study content for a specific topic/subtopic.
 * SECURITY: Ensure this function's IAM permissions restrict invocation.
 */
exports.addStudyContent = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }
    try {
      const contentData = req.body;
      const requiredFields = ["contentId", "name", "author", "content"]; // Use contentId
      for (const field of requiredFields) {
        if (!contentData[field] || String(contentData[field]).trim() === "") {
          console.warn(`V1 addStudyContent: Missing/empty field: ${field}`);
          return res
            .status(400)
            .send({ success: false, error: `Missing/empty field: ${field}` });
        }
      }
      const contentId = String(contentData.contentId);
      const studyContentRef = db.collection("studyContent").doc(contentId);
      const dataToSave = {
        name: contentData.name,
        author: contentData.author,
        content: contentData.content,
        coverImage: contentData.coverImage || null,
        additionalImages: Array.isArray(contentData.additionalImages)
          ? contentData.additionalImages
          : [],
        // parentId: contentData.parentId || null // Add parentId if needed
      };
      await studyContentRef.set(dataToSave, { merge: true });
      console.log(`V1 addStudyContent: Success for contentId: ${contentId}`);
      return res.status(201).send({ success: true, id: contentId }); // Use return
    } catch (error) {
      console.error("V1 addStudyContent: Error:", error);
      return res
        .status(500)
        .send({ success: false, error: "Internal Server Error" }); // Use return
    }
  });

/**
 * V1 HTTPS: Adds a single new quiz question.
 * SECURITY: Ensure this function's IAM permissions restrict invocation.
 */
exports.addQuizQuestion = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }
    try {
      const questionData = req.body;
      const requiredFields = [
        "parentId",
        "question",
        "options",
        "answer",
        "order",
      ]; // Use parentId
      for (const field of requiredFields) {
        if (questionData[field] === undefined || questionData[field] === null) {
          console.warn(`V1 addQuizQuestion: Missing field: ${field}`);
          return res
            .status(400)
            .send({ success: false, error: `Missing field: ${field}` });
        }
        // Allow explanation to be empty, check others
        if (
          field !== "explanation" &&
          field !== "options" &&
          String(questionData[field]).trim() === ""
        ) {
          console.warn(`V1 addQuizQuestion: Empty required field: ${field}`);
          return res
            .status(400)
            .send({ success: false, error: `Empty required field: ${field}` });
        }
      }
      if (
        !Array.isArray(questionData.options) ||
        questionData.options.length === 0
      ) {
        console.warn(`V1 addQuizQuestion: Options invalid.`);
        return res.status(400).send({
          success: false,
          error: "Field 'options' must be a non-empty array.",
        });
      }

      const dataToSave = {
        parentId: questionData.parentId, // Link to topic/subtopic
        question: questionData.question,
        options: questionData.options,
        answer: questionData.answer,
        explanation: questionData.explanation || "",
        order: questionData.order,
      };
      const docRef = await db.collection("quizQuestions").add(dataToSave);
      console.log(`V1 addQuizQuestion: Success, new id: ${docRef.id}`);
      return res.status(201).send({ success: true, id: docRef.id }); // Use return
    } catch (error) {
      console.error("V1 addQuizQuestion: Error:", error);
      return res
        .status(500)
        .send({ success: false, error: "Internal Server Error" }); // Use return
    }
  });

// --- Bulk Add Functions (v1 Syntax) ---
// SECURITY NOTE: Secure these via IAM Permissions

/** V1 HTTPS: Adds multiple category documents using a batch write. */
exports.bulkAddCategories = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }
    try {
      const { categories: categoriesArray } = req.body;
      if (!Array.isArray(categoriesArray) || categoriesArray.length === 0) {
        return res.status(400).send({
          success: false,
          error: "Request body must contain a non-empty 'categories' array.",
        });
      }
      if (categoriesArray.length > 500) {
        // Firestore batch limit
        return res.status(400).send({
          success: false,
          error: "Cannot process more than 500 categories in one batch.",
        });
      }

      const batch = db.batch();
      const categoriesCol = db.collection("categories");
      let processedCount = 0;
      let skippedCount = 0;

      categoriesArray.forEach((catData) => {
        // Re-check validation logic - ensure fields exist and aren't just empty strings
        if (
          catData &&
          typeof catData === "object" && // Basic object check
          catData.id &&
          catData.title &&
          String(catData.title).trim() !== "" &&
          catData.image &&
          String(catData.image).trim() !== "" &&
          catData.order !== undefined &&
          catData.order !== null &&
          typeof catData.order === "number" && // Check type
          catData.carouselGroup &&
          String(catData.carouselGroup).trim() !== ""
        ) {
          const categoryId = String(catData.id);
          const categoryRef = categoriesCol.doc(categoryId);
          const dataToSave = {
            title: catData.title,
            image: catData.image,
            subtitle: catData.subtitle || "",
            order: catData.order,
            carouselGroup: catData.carouselGroup,
            type: catData.type || "COURSE",
            duration: catData.duration || "",
            author: catData.author || "",
          };
          batch.set(categoryRef, dataToSave, { merge: true });
          processedCount++;
        } else {
          skippedCount++;
          console.warn(
            "V1 bulkAddCategories: Skipping invalid data:",
            JSON.stringify(catData)
          ); // Stringify for better logging
        }
      });

      if (processedCount === 0) {
        return res.status(400).send({
          success: false,
          error: "No valid category data found to process.",
          skipped: skippedCount,
        });
      }

      await batch.commit();
      console.log(
        `V1: Bulk add categories complete. Processed: ${processedCount}, Skipped: ${skippedCount}.`
      );
      return res.status(201).send({
        success: true,
        processed: processedCount,
        skipped: skippedCount,
      });
    } catch (error) {
      console.error("V1: Error bulk adding categories:", error);
      return res
        .status(500)
        .send({ success: false, error: "Bulk operation failed." });
    }
  });

/** V1 HTTPS: Adds multiple topic/subtopic documents using a batch write. */
exports.bulkAddTopics = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }
    try {
      const { topics: topicsArray } = req.body;
      if (!Array.isArray(topicsArray) || topicsArray.length === 0) {
        return res.status(400).send({
          success: false,
          error: "Request body must contain a non-empty 'topics' array.",
        });
      }
      if (topicsArray.length > 500) {
        return res.status(400).send({
          success: false,
          error: "Cannot process more than 500 topics in one batch.",
        });
      }

      const batch = db.batch();
      const topicsCol = db.collection("topics");
      let processedCount = 0;
      let skippedCount = 0;

      topicsArray.forEach((topicData) => {
        // Add better validation
        if (
          topicData &&
          typeof topicData === "object" &&
          topicData.id &&
          topicData.categoryId &&
          String(topicData.categoryId).trim() !== "" &&
          topicData.title &&
          String(topicData.title).trim() !== "" &&
          topicData.order !== undefined &&
          topicData.order !== null &&
          typeof topicData.order === "number"
        ) {
          const topicId = String(topicData.id);
          const topicRef = topicsCol.doc(topicId);
          const dataToSave = {
            categoryId: topicData.categoryId,
            title: topicData.title,
            order: topicData.order,
            hasStudy: topicData.hasStudy === true,
            hasQuiz: topicData.hasQuiz === true,
            parentTopicId:
              topicData.parentTopicId !== undefined
                ? topicData.parentTopicId
                : null,
            hasSubtopics: topicData.hasSubtopics === true,
            otherActivities: Array.isArray(topicData.otherActivities)
              ? topicData.otherActivities
              : [],
            type: topicData.type || "ACTIVITY",
          };
          console.log(
            `bulkAddTopics - Data for ID ${topicId}:`,
            JSON.stringify(dataToSave, null, 2)
          );
          batch.set(topicRef, dataToSave, { merge: true });
          processedCount++;
        } else {
          skippedCount++;
          console.warn(
            "V1 bulkAddTopics: Skipping invalid data:",
            JSON.stringify(topicData)
          );
        }
      });

      if (processedCount === 0) {
        return res.status(400).send({
          success: false,
          error: "No valid topic data found to process.",
          skipped: skippedCount,
        });
      }

      await batch.commit();
      console.log(
        `V1: Bulk add topics complete. Processed: ${processedCount}, Skipped: ${skippedCount}.`
      );
      return res.status(201).send({
        success: true,
        processed: processedCount,
        skipped: skippedCount,
      });
    } catch (error) {
      console.error("V1: Error bulk adding topics:", error);
      return res
        .status(500)
        .send({ success: false, error: "Bulk operation failed." });
    }
  });

/** V1 HTTPS: Adds/Updates multiple study content docs using a batch write. */
exports.bulkAddStudyContent = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }
    try {
      const { studyItems: studyItemsArray } = req.body;
      if (!Array.isArray(studyItemsArray) || studyItemsArray.length === 0) {
        return res.status(400).send({
          success: false,
          error: "Request body must contain a non-empty 'studyItems' array.",
        });
      }
      if (studyItemsArray.length > 500) {
        return res.status(400).send({
          success: false,
          error: "Cannot process more than 500 study items in one batch.",
        });
      }

      const batch = db.batch();
      const studyCol = db.collection("studyContent");
      let processedCount = 0;
      let skippedCount = 0;

      studyItemsArray.forEach((itemData) => {
        // Add better validation
        if (
          itemData &&
          typeof itemData === "object" &&
          itemData.contentId && // Changed from topicId
          itemData.name &&
          String(itemData.name).trim() !== "" &&
          itemData.author &&
          String(itemData.author).trim() !== "" &&
          itemData.content &&
          String(itemData.content).trim() !== ""
        ) {
          const contentId = String(itemData.contentId); // Use contentId
          const studyRef = studyCol.doc(contentId);
          const dataToSave = {
            name: itemData.name,
            author: itemData.author,
            content: itemData.content,
            coverImage: itemData.coverImage || null,
            additionalImages: Array.isArray(itemData.additionalImages)
              ? itemData.additionalImages
              : [],
            // parentId: itemData.parentId || null // Add if needed
          };
          batch.set(studyRef, dataToSave, { merge: true });
          processedCount++;
        } else {
          skippedCount++;
          console.warn(
            "V1 bulkAddStudyContent: Skipping invalid data:",
            JSON.stringify(itemData)
          );
        }
      });

      if (processedCount === 0) {
        return res.status(400).send({
          success: false,
          error: "No valid study item data found to process.",
          skipped: skippedCount,
        });
      }

      await batch.commit();
      console.log(
        `V1: Bulk add study content complete. Processed: ${processedCount}, Skipped: ${skippedCount}.`
      );
      return res.status(201).send({
        success: true,
        processed: processedCount,
        skipped: skippedCount,
      });
    } catch (error) {
      console.error("V1: Error bulk adding study content:", error);
      return res
        .status(500)
        .send({ success: false, error: "Bulk operation failed." });
    }
  });

/** V1 HTTPS: Adds multiple new quiz questions using a batch write. */
exports.bulkAddQuizQuestions = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }
    try {
      const { questions: questionsArray } = req.body;
      if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
        return res.status(400).send({
          success: false,
          error: "Request body must contain a non-empty 'questions' array.",
        });
      }
      if (questionsArray.length > 500) {
        return res.status(400).send({
          success: false,
          error: "Cannot process more than 500 questions in one batch.",
        });
      }

      const batch = db.batch();
      const quizCol = db.collection("quizQuestions");
      let processedCount = 0;
      let skippedCount = 0;

      questionsArray.forEach((qData) => {
        // Add better validation
        if (
          qData &&
          typeof qData === "object" &&
          qData.parentId &&
          String(qData.parentId).trim() !== "" && // Changed from topicId
          qData.question &&
          String(qData.question).trim() !== "" &&
          Array.isArray(qData.options) &&
          qData.options.length > 0 &&
          qData.answer !== undefined &&
          qData.answer !== null &&
          String(qData.answer).trim() !== "" &&
          qData.order !== undefined &&
          qData.order !== null &&
          typeof qData.order === "number"
        ) {
          const dataToSave = {
            parentId: qData.parentId,
            question: qData.question,
            options: qData.options,
            answer: qData.answer,
            explanation: qData.explanation || "",
            order: qData.order,
          };
          const newQuestionRef = quizCol.doc(); // Auto-generate ID
          batch.set(newQuestionRef, dataToSave);
          processedCount++;
        } else {
          skippedCount++;
          console.warn(
            "V1 bulkAddQuizQuestions: Skipping invalid data:",
            JSON.stringify(qData)
          );
        }
      });

      if (processedCount === 0) {
        return res.status(400).send({
          success: false,
          error: "No valid quiz question data found to process.",
          skipped: skippedCount,
        });
      }

      await batch.commit();
      console.log(
        `V1: Bulk add quiz questions complete. Processed: ${processedCount}, Skipped: ${skippedCount}.`
      );
      return res.status(201).send({
        success: true,
        processed: processedCount,
        skipped: skippedCount,
      });
    } catch (error) {
      console.error("V1: Error bulk adding quiz questions:", error);
      return res
        .status(500)
        .send({ success: false, error: "Bulk operation failed." });
    }
  });

// ==========================================================
// --- BULK DELETE & UPDATE FUNCTIONS (v1 Syntax) ---
// --- SECURITY NOTE: Secure these via IAM Permissions ---
// ==========================================================

/**
 * V1 HTTPS: Deletes documents based on field matching.
 * SECURITY: Ensure this function's IAM permissions restrict invocation.
 */
exports.deleteAllDocuments = functions
  .region(region)
  .runWith(longRuntimeOptions) // Use longer timeout/more memory
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }
    try {
      const { collectionName, fieldToMatch, valueToMatch, valuesToMatch } =
        req.body;
      // ... (keep validation logic from previous version) ...
      if (!collectionName || !fieldToMatch) {
        return res.status(400).send({
          success: false,
          error:
            "Missing required fields: 'collectionName' and 'fieldToMatch'.",
        });
      }
      // ... more validation ...

      console.log(
        `V1 deleteAllDocuments: Request for collection '${collectionName}', field '${fieldToMatch}'.`
      );

      // --- Build Query ---
      let query = db.collection(collectionName);
      if (valueToMatch !== undefined) {
        console.log(`Matching single value: ${valueToMatch}`);
        query = query.where(fieldToMatch, "==", valueToMatch);
      } else if (
        Array.isArray(valuesToMatch) &&
        valuesToMatch.length > 0 &&
        valuesToMatch.length <= 30
      ) {
        console.log(
          `Matching multiple values (count: ${valuesToMatch.length})`
        );
        query = query.where(fieldToMatch, "in", valuesToMatch);
      } else {
        // Validation should have caught this, but double-check
        return res.status(400).send({
          success: false,
          error:
            "Invalid or missing match criteria ('valueToMatch' or 'valuesToMatch').",
        });
      }

      // --- Fetch and Delete in Batches ---
      const BATCH_SIZE = 499; // Firestore batch limit is 500 ops
      let totalDeleted = 0;
      let snapshot;
      let iterations = 0; // Safety break
      const MAX_ITERATIONS = 100; // Prevent infinite loop if something goes wrong

      do {
        iterations++;
        if (iterations > MAX_ITERATIONS) {
          console.error(
            "V1 deleteAllDocuments: Exceeded max delete iterations, stopping."
          );
          throw new Error("Delete operation took too long, potentially stuck.");
        }

        snapshot = await query.limit(BATCH_SIZE).get();

        if (snapshot.empty) {
          break; // No more documents match
        }

        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        await batch.commit();
        totalDeleted += snapshot.size;
        console.log(
          `V1 deleteAllDocuments: Deleted batch of ${snapshot.size} documents. Total deleted so far: ${totalDeleted}`
        );

        // Short pause to prevent hammering Firestore too hard, optional
        // await new Promise(resolve => setTimeout(resolve, 50));
      } while (snapshot.size === BATCH_SIZE); // If we deleted a full batch, there might be more

      console.log(
        `V1 deleteAllDocuments: Completed. Total documents deleted: ${totalDeleted}`
      );
      return res
        .status(200)
        .send({ success: true, deletedCount: totalDeleted }); // Use return
    } catch (error) {
      console.error("V1 deleteAllDocuments: Error:", error);
      return res.status(500).send({
        success: false,
        error: "Internal Server Error during delete operation.",
        details: error.message,
      }); // Use return
    }
  });

/**
 * V1 HTTPS: Updates documents based on field matching or all documents.
 * SECURITY: Ensure this function's IAM permissions restrict invocation.
 */
exports.updateFirestoreDocuments = functions
  .region(region)
  .runWith(longRuntimeOptions) // Use longer timeout/more memory
  .https.onRequest(async (req, res) => {
    // --- NO internal auth check needed if secured via IAM ---

    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed. Use POST.");
    }
    if (!req.is("application/json")) {
      return res
        .status(400)
        .send("Bad Request: Content-Type must be application/json.");
    }

    const {
      collectionName,
      fieldToMatch,
      valueToMatch,
      fields,
      confirmUpdateAll,
    } = req.body;

    // --- Input Validation ---
    if (
      !collectionName ||
      typeof collectionName !== "string" ||
      collectionName.trim() === ""
    ) {
      return res
        .status(400)
        .send('Bad Request: "collectionName" (string) is required.');
    }
    if (
      !fields ||
      typeof fields !== "object" ||
      Object.keys(fields).length === 0
    ) {
      return res
        .status(400)
        .send(
          'Bad Request: "fields" (object) is required and must not be empty.'
        );
    }
    const hasMatchCriteria =
      fieldToMatch &&
      typeof fieldToMatch === "string" &&
      fieldToMatch.trim() !== "" &&
      valueToMatch !== undefined;

    try {
      let query;
      let queryDescription;

      // --- Build Query ---
      if (hasMatchCriteria) {
        queryDescription = `where "${fieldToMatch}" == ${JSON.stringify(
          valueToMatch
        )}`;
        query = db
          .collection(collectionName)
          .where(fieldToMatch, "==", valueToMatch);
        functions.logger.info(
          `Querying collection "${collectionName}" ${queryDescription}.`
        );
      } else {
        queryDescription = "ALL documents";
        if (confirmUpdateAll !== true) {
          functions.logger.warn(
            `Attempt to update all documents in "${collectionName}" without explicit confirmation.`
          );
          return res
            .status(400)
            .send(
              'Bad Request: Updating all documents requires "confirmUpdateAll": true in the request body for safety.'
            );
        }
        functions.logger.warn(
          `!!! Querying ALL documents in collection "${collectionName}" for update. Ensure this is intended!`
        );
        query = db.collection(collectionName);
      }

      const snapshot = await query.get();

      if (snapshot.empty) {
        functions.logger.info(
          `No documents found in "${collectionName}" matching criteria: ${queryDescription}.`
        );
        return res
          .status(200)
          .send(
            "Query successful, but no documents matched the criteria. No updates performed."
          );
      }

      functions.logger.info(
        `Found ${snapshot.size} documents to update in "${collectionName}" based on: ${queryDescription}.`
      );

      // --- Perform Updates using Batched Writes ---
      const MAX_BATCH_SIZE = 500;
      let batch = db.batch();
      let documentsInBatch = 0;
      let totalUpdatesCommitted = 0;
      const commitPromises = [];

      for (const doc of snapshot.docs) {
        batch.update(doc.ref, fields); // Use update() to merge fields
        documentsInBatch++;

        if (documentsInBatch === MAX_BATCH_SIZE) {
          functions.logger.info(
            `Committing batch of ${documentsInBatch} updates...`
          );
          commitPromises.push(batch.commit());
          totalUpdatesCommitted += documentsInBatch;
          batch = db.batch(); // Start a new batch
          documentsInBatch = 0;
        }
      }

      // Commit the final batch if it has any operations
      if (documentsInBatch > 0) {
        functions.logger.info(
          `Committing final batch of ${documentsInBatch} updates...`
        );
        commitPromises.push(batch.commit());
        totalUpdatesCommitted += documentsInBatch;
      }

      // Wait for all batch commits to complete
      await Promise.all(commitPromises);

      functions.logger.info(
        `Successfully updated ${totalUpdatesCommitted} documents in collection "${collectionName}".`
      );
      return res
        .status(200)
        .send(`Successfully updated ${totalUpdatesCommitted} documents.`); // Use return
    } catch (error) {
      functions.logger.error(
        `Error updating documents in collection "${collectionName}" with criteria "${queryDescription}":`,
        error
      );
      let errorMessage = "Internal Server Error: Failed to update documents.";
      if (error.code === "permission-denied") {
        errorMessage =
          "Permission Denied: Check Firestore security rules and function service account permissions.";
      } else if (error.message.includes("index")) {
        errorMessage = `Internal Server Error: Firestore query might require an index. Check logs for details. Error: ${error.message}`;
      }
      return res.status(500).send(errorMessage); // Use return
    }
  });

// ===============================================================
// --- HTTPS CALLABLE FUNCTIONS (v1 Syntax) - CORRECT SECURITY ---
// ===============================================================
/**
 * V1 Callable Function: Records quiz result, calculates stats/stars/streak.
 * Security: Checks context.auth automatically handled by Callable Functions.
 */
exports.recordQuizResult = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    // Correctly checks context.auth
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated to record results."
      );
    }
    const userId = context.auth.uid;
    const { quizId, scoreAchieved, passingScore, maxScore } = data;
    console.log(`V1 recordQuizResult: User ${userId}, Quiz ${quizId}`);

    // Basic validation
    if (
      quizId == null ||
      typeof scoreAchieved !== "number" ||
      typeof passingScore !== "number" ||
      typeof maxScore !== "number"
    ) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing or invalid quiz result data."
      );
    }

    // Your existing logic for handling passed/not passed, transactions, stars, streak...
    // Make sure all database references use the top-level `db` instance.
    // Ensure FieldValue is used for increments/timestamps if needed within transaction.
    // ... (Your transaction logic here) ...

    // Example structure (replace with your actual transaction logic)
    try {
      let starsAwarded = 0;
      let finalStreak = 0;
      // --- Start Transaction ---
      await db.runTransaction(async (transaction) => {
        const userRef = db.collection("users").doc(userId);
        const userStatsRef = db.collection("userStats").doc(userId);
        // ... fetch docs using transaction.get() ...
        // ... calculate stars, streak, updates ...
        // ... perform transaction.update() / transaction.set() ...
        finalStreak = 1; // Placeholder
        starsAwarded = 1; // Placeholder
      });
      // --- End Transaction ---
      console.log(
        `V1 recordQuizResult: Transaction successful. Stars: ${starsAwarded}, Streak: ${finalStreak}`
      );
      return {
        status: "success",
        starsAwarded: starsAwarded,
        currentStreak: finalStreak,
      }; // Return result
    } catch (error) {
      console.error(
        `V1 recordQuizResult: Transaction error for user ${userId}, quiz ${quizId}:`,
        error
      );
      throw new functions.https.HttpsError(
        "internal",
        error.message || "Failed to record quiz result."
      );
    }
  });

/**
 * V1 Callable Function: Penalizes user 1 star for leaving a quiz early.
 * Security: Checks context.auth automatically handled by Callable Functions.
 */
exports.penalizeQuizLeave = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    // Correctly checks context.auth
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated to apply penalty."
      );
    }
    const userId = context.auth.uid;
    const quizId = data?.quizId; // Optional quizId
    console.log(
      `V1 penalizeQuizLeave: User ${userId} left quiz ${
        quizId || "(unknown)"
      }. Penalizing 1 star.`
    );

    const userStatsRef = db.collection("userStats").doc(userId);
    try {
      let finalStarTotal = null;
      await db.runTransaction(async (transaction) => {
        const userStatsDoc = await transaction.get(userStatsRef);
        if (!userStatsDoc.exists) {
          console.warn(
            `V1 penalizeQuizLeave: User stats not found for ${userId}. Cannot apply penalty.`
          );
          // Consider if you should throw an error or just return
          finalStarTotal = null; // Indicate stats weren't found/updated
          return; // Exit transaction
        }
        const currentStars = userStatsDoc.data().totalStars || 0;
        const newStarTotal = Math.max(0, currentStars - 1); // Ensure stars don't go below 0
        console.log(
          `V1 penalizeQuizLeave: Current stars: ${currentStars}, New stars: ${newStarTotal}`
        );
        transaction.update(userStatsRef, { totalStars: newStarTotal });
        finalStarTotal = newStarTotal; // Store the value to return
      });

      if (finalStarTotal === null) {
        return { status: "no_stats_found", newStarTotal: null };
      } else {
        return { status: "success", newStarTotal: finalStarTotal }; // Return result
      }
    } catch (error) {
      console.error(
        `V1 penalizeQuizLeave: Error applying penalty for user ${userId}:`,
        error
      );
      throw new functions.https.HttpsError(
        "internal",
        "Failed to apply penalty."
      );
    }
  });

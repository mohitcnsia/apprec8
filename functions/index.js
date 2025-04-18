// functions/index.js - Using ONLY v1 SDK Syntax

const functions = require("firebase-functions"); // Use v1 main import
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
try {
  if (admin.apps.length === 0) {
    admin.initializeApp();
    console.log("Firebase Admin SDK initialized.");
  }
} catch (e) {
  console.error("Firebase admin initialization error", e);
}

const db = admin.firestore();

// --- Define Region and Runtime Options for v1 ---
const region = "us-central1"; // Your chosen region
const runtimeOptions = {
  memory: "256MB",
  timeoutSeconds: 60,
};

// =========================================================
// --- Auth Trigger (v1 Syntax) ---
// =========================================================
/**
 * V1 Auth Trigger: Runs when a new Firebase Auth user is created.
 */
exports.initializeNewUser = functions
  .region(region)
  .runWith(runtimeOptions)
  .auth.user()
  .onCreate(async (user) => {
    const userId = user.uid;
    const email = user.email || "";
    console.log(
      `V1 auth.user().onCreate: Initializing user: ${userId}, email: ${email}`
    );
    const now = admin.firestore.FieldValue.serverTimestamp();
    const userRef = db.collection("users").doc(userId);
    const userStatsRef = db.collection("userStats").doc(userId);
    const defaultUsername = email
      ? email.split("@")[0]
      : `User_${userId.substring(0, 6)}`;
    const userData = {
      userId: userId,
      email: email,
      username: defaultUsername,
      phone: "",
      createdAt: now,
      lastUpdatedAt: now,
      lastActivityAt: null,
    };
    const userStatsData = {
      userId: userId,
      totalStars: 0,
      currentStreak: 0,
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
  });

// ==========================================================
// --- EXISTING HTTPS FUNCTIONS (Converted to v1 Syntax) ---
// ==========================================================

/** V1: Adds or updates a single category document. */
exports.addCategory = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
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
          res
            .status(400)
            .send({ success: false, error: `Missing/empty field: ${field}` });
          return;
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
      res.status(201).send({ success: true, id: categoryId });
    } catch (error) {
      console.error("V1 addCategory: Error:", error);
      res.status(500).send({ success: false, error: "Internal Server Error" });
    }
  });

/** V1: Adds or updates a single topic document. */
exports.addTopic = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }
    try {
      const topicData = req.body;
      const requiredFields = ["id", "categoryId", "title", "order"];
      for (const field of requiredFields) {
        if (topicData[field] === undefined || topicData[field] === null) {
          console.warn(`V1 addTopic: Missing field: ${field}`);
          res
            .status(400)
            .send({ success: false, error: `Missing field: ${field}` });
          return;
        }
      }
      const topicId = String(topicData.id);
      const topicRef = db.collection("topics").doc(topicId);
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
      await topicRef.set(dataToSave, { merge: true });
      console.log(`V1 addTopic: Success for id: ${topicId}`);
      res.status(201).send({ success: true, id: topicId, data: dataToSave });
    } catch (error) {
      console.error("V1 addTopic: Error:", error);
      res.status(500).send({ success: false, error: "Internal Server Error" });
    }
  });

/** V1: Adds or updates study content for a specific topic. */
exports.addStudyContent = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }
    try {
      const contentData = req.body;
      const requiredFields = ["topicId", "name", "author", "content"];
      for (const field of requiredFields) {
        if (!contentData[field] || String(contentData[field]).trim() === "") {
          console.warn(`V1 addStudyContent: Missing/empty field: ${field}`);
          res
            .status(400)
            .send({ success: false, error: `Missing/empty field: ${field}` });
          return;
        }
      }
      const topicId = String(contentData.topicId);
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
      await studyContentRef.set(dataToSave, { merge: true });
      console.log(`V1 addStudyContent: Success for topicId: ${topicId}`);
      res.status(201).send({ success: true, id: topicId });
    } catch (error) {
      console.error("V1 addStudyContent: Error:", error);
      res.status(500).send({ success: false, error: "Internal Server Error" });
    }
  });

/** V1: Adds a single new quiz question. */
exports.addQuizQuestion = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
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
          console.warn(`V1 addQuizQuestion: Missing field: ${field}`);
          res
            .status(400)
            .send({ success: false, error: `Missing field: ${field}` });
          return;
        }
        if (
          field !== "explanation" &&
          String(questionData[field]).trim() === ""
        ) {
          console.warn(`V1 addQuizQuestion: Empty field: ${field}`);
          res
            .status(400)
            .send({ success: false, error: `Empty field: ${field}` });
          return;
        }
      }
      if (
        !Array.isArray(questionData.options) ||
        questionData.options.length === 0
      ) {
        console.warn(`V1 addQuizQuestion: Options invalid.`);
        res.status(400).send({
          success: false,
          error: "Field 'options' must be a non-empty array.",
        });
        return;
      }
      const dataToSave = {
        topicId: questionData.topicId,
        question: questionData.question,
        options: questionData.options,
        answer: questionData.answer,
        explanation: questionData.explanation || "",
        order: questionData.order,
      };
      const docRef = await db.collection("quizQuestions").add(dataToSave);
      console.log(`V1 addQuizQuestion: Success, new id: ${docRef.id}`);
      res.status(201).send({ success: true, id: docRef.id });
    } catch (error) {
      console.error("V1 addQuizQuestion: Error:", error);
      res.status(500).send({ success: false, error: "Internal Server Error" });
    }
  });

// --- Bulk Add Functions (v1 Syntax) ---

/** V1: Adds multiple category documents using a batch write. */
exports.bulkAddCategories = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }
    try {
      const { categories: categoriesArray } = req.body;
      if (!Array.isArray(categoriesArray) || categoriesArray.length === 0) {
        res.status(400).send({
          success: false,
          error: "Request body must contain a non-empty 'categories' array.",
        });
        return;
      }
      if (categoriesArray.length > 500) {
        res.status(400).send({
          success: false,
          error: "Cannot process more than 500 categories in one batch.",
        });
        return;
      }
      const batch = db.batch();
      const categoriesCol = db.collection("categories");
      let processedCount = 0;
      let skippedCount = 0;
      categoriesArray.forEach((catData) => {
        if (
          catData.id &&
          catData.title &&
          String(catData.title).trim() !== "" &&
          catData.image &&
          String(catData.image).trim() !== "" &&
          catData.order !== undefined &&
          catData.order !== null &&
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
          console.warn("V1 bulkAddCategories: Skipping invalid data:", catData);
        }
      });
      if (processedCount === 0) {
        res.status(400).send({
          success: false,
          error: "No valid category data found.",
          skipped: skippedCount,
        });
        return;
      }
      await batch.commit();
      console.log(
        `V1: Bulk add categories complete. Processed: ${processedCount}, Skipped: ${skippedCount}.`
      );
      res.status(201).send({
        success: true,
        processed: processedCount,
        skipped: skippedCount,
      });
    } catch (error) {
      console.error("V1: Error bulk adding categories:", error);
      res.status(500).send({ success: false, error: "Bulk operation failed." });
    }
  });

/** V1: Adds multiple topic documents using a batch write. */
exports.bulkAddTopics = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }
    try {
      const { topics: topicsArray } = req.body;
      if (!Array.isArray(topicsArray) || topicsArray.length === 0) {
        res.status(400).send({
          success: false,
          error: "Request body must contain a non-empty 'topics' array.",
        });
        return;
      }
      if (topicsArray.length > 500) {
        res.status(400).send({
          success: false,
          error: "Cannot process more than 500 topics in one batch.",
        });
        return;
      }
      const batch = db.batch();
      const topicsCol = db.collection("topics");
      let processedCount = 0;
      let skippedCount = 0;
      topicsArray.forEach((topicData) => {
        if (
          topicData.id &&
          topicData.categoryId &&
          String(topicData.categoryId).trim() !== "" &&
          topicData.title &&
          String(topicData.title).trim() !== "" &&
          topicData.order !== undefined &&
          topicData.order !== null
        ) {
          const topicId = String(topicData.id);
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
          batch.set(topicRef, dataToSave, { merge: true });
          processedCount++;
        } else {
          skippedCount++;
          console.warn("V1 bulkAddTopics: Skipping invalid data:", topicData);
        }
      });
      if (processedCount === 0) {
        res.status(400).send({
          success: false,
          error: "No valid topic data found.",
          skipped: skippedCount,
        });
        return;
      }
      await batch.commit();
      console.log(
        `V1: Bulk add topics complete. Processed: ${processedCount}, Skipped: ${skippedCount}.`
      );
      res.status(201).send({
        success: true,
        processed: processedCount,
        skipped: skippedCount,
      });
    } catch (error) {
      console.error("V1: Error bulk adding topics:", error);
      res.status(500).send({ success: false, error: "Bulk operation failed." });
    }
  });

/** V1: Adds/Updates multiple study content docs using a batch write. */
exports.bulkAddStudyContent = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }
    try {
      const { studyItems: studyItemsArray } = req.body;
      if (!Array.isArray(studyItemsArray) || studyItemsArray.length === 0) {
        res.status(400).send({
          success: false,
          error: "Request body must contain a non-empty 'studyItems' array.",
        });
        return;
      }
      if (studyItemsArray.length > 500) {
        res.status(400).send({
          success: false,
          error: "Cannot process more than 500 study items in one batch.",
        });
        return;
      }
      const batch = db.batch();
      const studyCol = db.collection("studyContent");
      let processedCount = 0;
      let skippedCount = 0;
      studyItemsArray.forEach((itemData) => {
        if (
          itemData.topicId &&
          itemData.name &&
          String(itemData.name).trim() !== "" &&
          itemData.author &&
          String(itemData.author).trim() !== "" &&
          itemData.content &&
          String(itemData.content).trim() !== ""
        ) {
          const topicId = String(itemData.topicId);
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
          batch.set(studyRef, dataToSave, { merge: true });
          processedCount++;
        } else {
          skippedCount++;
          console.warn(
            "V1 bulkAddStudyContent: Skipping invalid data:",
            itemData
          );
        }
      });
      if (processedCount === 0) {
        res.status(400).send({
          success: false,
          error: "No valid study item data found.",
          skipped: skippedCount,
        });
        return;
      }
      await batch.commit();
      console.log(
        `V1: Bulk add study content complete. Processed: ${processedCount}, Skipped: ${skippedCount}.`
      );
      res.status(201).send({
        success: true,
        processed: processedCount,
        skipped: skippedCount,
      });
    } catch (error) {
      console.error("V1: Error bulk adding study content:", error);
      res.status(500).send({ success: false, error: "Bulk operation failed." });
    }
  });

/** V1: Adds multiple new quiz questions using a batch write. */
exports.bulkAddQuizQuestions = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }
    try {
      const { questions: questionsArray } = req.body;
      if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
        res.status(400).send({
          success: false,
          error: "Request body must contain a non-empty 'questions' array.",
        });
        return;
      }
      if (questionsArray.length > 500) {
        res.status(400).send({
          success: false,
          error: "Cannot process more than 500 questions in one batch.",
        });
        return;
      }
      const batch = db.batch();
      const quizCol = db.collection("quizQuestions");
      let processedCount = 0;
      let skippedCount = 0;
      questionsArray.forEach((qData) => {
        if (
          qData.topicId &&
          String(qData.topicId).trim() !== "" &&
          qData.question &&
          String(qData.question).trim() !== "" &&
          Array.isArray(qData.options) &&
          qData.options.length > 0 &&
          qData.answer !== undefined &&
          qData.answer !== null &&
          String(qData.answer).trim() !== "" &&
          qData.order !== undefined &&
          qData.order !== null
        ) {
          const dataToSave = {
            topicId: qData.topicId,
            question: qData.question,
            options: qData.options,
            answer: qData.answer,
            explanation: qData.explanation || "",
            order: qData.order,
          };
          const newQuestionRef = quizCol.doc();
          batch.set(newQuestionRef, dataToSave);
          processedCount++;
        } else {
          skippedCount++;
          console.warn(
            "V1 bulkAddQuizQuestions: Skipping invalid data:",
            qData
          );
        }
      });
      if (processedCount === 0) {
        res.status(400).send({
          success: false,
          error: "No valid quiz question data found.",
          skipped: skippedCount,
        });
        return;
      }
      await batch.commit();
      console.log(
        `V1: Bulk add quiz questions complete. Processed: ${processedCount}, Skipped: ${skippedCount}.`
      );
      res.status(201).send({
        success: true,
        processed: processedCount,
        skipped: skippedCount,
      });
    } catch (error) {
      console.error("V1: Error bulk adding quiz questions:", error);
      res.status(500).send({ success: false, error: "Bulk operation failed." });
    }
  });

// ==========================================================
// --- NEW BULK DELETE FUNCTION (v1 Syntax) ---
// ==========================================================
/**
 * V1: Deletes documents from a specified collection based on matching field values.
 * Handles single or multiple values to match (up to 30 for 'valuesToMatch' array).
 * Uses batched writes for efficiency.
 *
 * @param {object} req.body - JSON payload
 * @param {string} req.body.collectionName - Name of the collection.
 * @param {string} req.body.fieldToMatch - Field to query against (e.g., 'topicId').
 * @param {string|number} [req.body.valueToMatch] - Single value to match (use if not using valuesToMatch).
 * @param {Array<string|number>} [req.body.valuesToMatch] - Array of values to match (use if not using valueToMatch, max 30 items).
 */
exports.deleteAllDocuments = functions
  .region(region)
  .runWith(runtimeOptions) // Use runtime options with potentially longer timeout
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
      const { collectionName, fieldToMatch, valueToMatch, valuesToMatch } =
        req.body;

      // --- Input Validation ---
      if (!collectionName || !fieldToMatch) {
        return res.status(400).send({
          success: false,
          error:
            "Missing required fields: 'collectionName' and 'fieldToMatch'.",
        });
      }
      if (valueToMatch === undefined && !Array.isArray(valuesToMatch)) {
        return res.status(400).send({
          success: false,
          error:
            "Must provide either 'valueToMatch' (string/number) or 'valuesToMatch' (array).",
        });
      }
      if (valueToMatch !== undefined && Array.isArray(valuesToMatch)) {
        return res.status(400).send({
          success: false,
          error: "Provide either 'valueToMatch' OR 'valuesToMatch', not both.",
        });
      }
      if (Array.isArray(valuesToMatch) && valuesToMatch.length === 0) {
        return res.status(400).send({
          success: false,
          error: "'valuesToMatch' array cannot be empty.",
        });
      }
      if (Array.isArray(valuesToMatch) && valuesToMatch.length > 30) {
        // Firestore 'in' query limit
        return res.status(400).send({
          success: false,
          error: "'valuesToMatch' array cannot contain more than 30 items.",
        });
      }

      console.log(
        `V1 deleteAllDocuments: Received request for collection '${collectionName}', field '${fieldToMatch}'.`
      );

      // --- Build Query ---
      let query = db.collection(collectionName);
      if (valueToMatch !== undefined) {
        console.log(`Matching single value: ${valueToMatch}`);
        query = query.where(fieldToMatch, "==", valueToMatch);
      } else {
        // valuesToMatch must be a non-empty array here
        console.log(
          `Matching multiple values (count: ${valuesToMatch.length})`
        );
        query = query.where(fieldToMatch, "in", valuesToMatch);
      }

      // --- Fetch and Delete in Batches ---
      const BATCH_SIZE = 499; // Firestore batch limit is 500 operations
      let totalDeleted = 0;
      let snapshot;

      do {
        snapshot = await query.limit(BATCH_SIZE).get(); // Get next batch of docs

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
          `V1 deleteAllDocuments: Deleted batch of ${snapshot.size} documents.`
        );

        // If we deleted exactly the BATCH_SIZE, there might be more, so loop again.
        // The query implicitly continues from where it left off due to document ordering.
        // For guaranteed ordering/continuation with very large datasets, cursor-based pagination is safer,
        // but this limit-based approach works for moderately large deletes within timeout.
      } while (snapshot.size === BATCH_SIZE);

      console.log(
        `V1 deleteAllDocuments: Completed. Total documents deleted: ${totalDeleted}`
      );
      res.status(200).send({ success: true, deletedCount: totalDeleted });
    } catch (error) {
      console.error("V1 deleteAllDocuments: Error:", error);
      res.status(500).send({
        success: false,
        error: "Internal Server Error during delete operation.",
        details: error.message,
      });
    }
  });

// ===============================================================
// --- HTTPS CALLABLE FUNCTION (v1 Syntax) - UPDATED STREAK LOGIC ---
// ===============================================================
/**
 * V1 Callable Function: Records quiz result, calculates stats/stars/streak.
 * Star Logic: +5/+10 first ever; +2 first completion today; +1 later completions today.
 * Streak Logic: Updates only on the first completion of *any* quiz per day.
 */
exports.recordQuizResult = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "...");
    }
    const userId = context.auth.uid;
    const { quizId, scoreAchieved, passingScore, maxScore } = data;
    console.log(`V1 recordQuizResult: User ${userId}, Quiz ${quizId}`);
    if (
      !quizId ||
      typeof scoreAchieved !== "number" ||
      typeof passingScore !== "number" ||
      typeof maxScore !== "number"
    ) {
      throw new functions.https.HttpsError("invalid-argument", "...");
    }
    if (scoreAchieved < passingScore) {
      console.log(`V1: Not passed.`);
      return { status: "not_passed", starsAwarded: 0, currentStreak: null };
    }
    console.log(`V1: Passed.`);

    const now = admin.firestore.Timestamp.now();
    const todayStart = new Date(now.toDate());
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayStartTimestamp = admin.firestore.Timestamp.fromDate(todayStart);

    const userRef = db.collection("users").doc(userId);
    const userStatsRef = db.collection("userStats").doc(userId);
    const quizAttemptRef = db
      .collection("users")
      .doc(userId)
      .collection("quizAttempts")
      .doc(quizId);

    try {
      let starsAwarded = 0;
      let incrementUniqueCompletions = 0;
      let finalStreak = 0; // Store the final streak value to return
      let newStreakCalculated = false; // Flag to know if we calculated a new streak today
      let newLastActivityAt = null; // Store the potential new timestamp

      await db.runTransaction(async (transaction) => {
        console.log(`V1: Starting transaction`);
        const userDoc = await transaction.get(userRef);
        const userStatsDoc = await transaction.get(userStatsRef);
        const quizAttemptDoc = await transaction.get(quizAttemptRef);
        if (!userDoc.exists || !userStatsDoc.exists) {
          throw new Error("User profile/stats missing.");
        }

        const userData = userDoc.data();
        const userStatsData = userStatsDoc.data();
        const lastActivityAt = userData.lastActivityAt; // Firestore Timestamp or null
        const currentStreak = userStatsData.currentStreak || 0;
        finalStreak = currentStreak; // Start with current streak

        // --- Determine if this is the first activity TODAY ---
        const isFirstActivityToday =
          !lastActivityAt || lastActivityAt.toDate() < todayStart;
        console.log(`V1: Is first activity today? ${isFirstActivityToday}`);

        // --- Calculate Streak ONLY if it's the first activity today ---
        if (isFirstActivityToday) {
          newStreakCalculated = true;
          newLastActivityAt = now; // Will update timestamp
          if (!lastActivityAt) {
            // First ever activity
            finalStreak = 1;
            console.log(`V1: First ever activity, streak=1.`);
          } else {
            // Check if consecutive day
            const lastActivityDate = new Date(lastActivityAt.toDate());
            lastActivityDate.setUTCHours(0, 0, 0, 0);
            const yesterdayStart = new Date(todayStart);
            yesterdayStart.setUTCDate(yesterdayStart.getUTCDate() - 1);
            if (lastActivityDate.getTime() === yesterdayStart.getTime()) {
              finalStreak = currentStreak + 1; // Consecutive day
              console.log(
                `V1: Consecutive day activity, streak=${finalStreak}`
              );
            } else {
              finalStreak = 1; // Gap detected, reset streak
              console.log(`V1: Gap detected, resetting streak=1`);
            }
          }
        } else {
          console.log(
            `V1: Not first activity today, streak remains ${finalStreak}`
          );
          // Keep finalStreak = currentStreak
          newLastActivityAt = lastActivityAt; // Keep existing timestamp
        }

        // --- Quiz Completion & Stars Logic (Same as previous) ---
        let newCompletionCount = 0;
        let bestScore = scoreAchieved;
        if (!quizAttemptDoc.exists) {
          console.log(`V1: First completion ever.`);
          starsAwarded = 5;
          if (scoreAchieved >= maxScore) {
            starsAwarded = 10;
          }
          incrementUniqueCompletions = 1;
          newCompletionCount = 1;
          transaction.set(quizAttemptRef, {
            quizId: quizId,
            userId: userId,
            completed: true,
            firstCompletionAt: now,
            firstCompletionScore: scoreAchieved,
            bestScore: bestScore,
            lastAttemptAt: now,
            lastCompletionOfDay: now,
            completionCount: newCompletionCount,
          });
        } else {
          console.log(`V1: Subsequent completion.`);
          const attemptData = quizAttemptDoc.data();
          const currentCompletionCount = attemptData.completionCount || 0;
          bestScore = Math.max(attemptData.bestScore || 0, scoreAchieved);
          const lastCompletionOfDay = attemptData.lastCompletionOfDay;
          if (
            !lastCompletionOfDay ||
            lastCompletionOfDay.toDate() < todayStart
          ) {
            console.log(`V1: First completion today. +2 stars.`);
            starsAwarded = 2;
          } else {
            console.log(`V1: Repeat completion today. +1 star.`);
            starsAwarded = 1;
          }
          newCompletionCount = currentCompletionCount + 1;
          incrementUniqueCompletions = 0;
          transaction.update(quizAttemptRef, {
            bestScore: bestScore,
            lastAttemptAt: now,
            lastCompletionOfDay: now,
            completionCount: newCompletionCount,
          });
        }

        // --- Prepare Updates ---
        console.log(
          `V1: Preparing updates. Stars: ${starsAwarded}, UniqueInc: ${incrementUniqueCompletions}, FinalStreak: ${finalStreak}`
        );
        const currentStars = userStatsData.totalStars || 0;
        // Update Stats (only update streak if calculated)
        transaction.update(userStatsRef, {
          totalStars: Math.max(0, currentStars + starsAwarded),
          totalQuizzesCompleted: admin.firestore.FieldValue.increment(
            incrementUniqueCompletions
          ),
          currentStreak: finalStreak, // Use the final calculated or existing streak
        });
        // Update User (only update lastActivityAt if it's the first today)
        transaction.update(userRef, {
          lastActivityAt: newLastActivityAt, // Use the new timestamp OR the existing one
          lastUpdatedAt: now, // Always update lastUpdatedAt
        });
      }); // End transaction

      console.log(
        `V1 recordQuizResult: Transaction successful. Stars: ${starsAwarded}, Streak: ${finalStreak}`
      );
      return {
        status: "success",
        starsAwarded: starsAwarded,
        currentStreak: finalStreak,
      };
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

// ===============================================================
// --- Cloud Function for Leaving Quiz Penalty (v1 Syntax) ---
// ===============================================================
/** V1 Callable Function: Penalizes user 1 star for leaving a quiz early. */
exports.penalizeQuizLeave = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "...");
    }
    const userId = context.auth.uid;
    const quizId = data?.quizId;
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
          console.error(
            `V1 penalizeQuizLeave: User stats not found for ${userId}.`
          );
          return;
        }
        const currentStars = userStatsDoc.data().totalStars || 0;
        const newStarTotal = Math.max(0, currentStars - 1);
        console.log(
          `V1 penalizeQuizLeave: Current stars: ${currentStars}, New stars: ${newStarTotal}`
        );
        transaction.update(userStatsRef, { totalStars: newStarTotal });
        finalStarTotal = newStarTotal;
      });
      return { status: "success", newStarTotal: finalStarTotal };
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

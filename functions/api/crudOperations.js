// functions/api/crudOperations.js
const functions = require("firebase-functions");
const admin = require("../common/admin");
const { db, FieldValue } = admin;
const { region, runtimeOptions } = require("../common/config");

/** V1 HTTPS: Adds or updates a single category document. */
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
      return res.status(201).send({ success: true, id: categoryId });
    } catch (error) {
      console.error("V1 addCategory: Error:", error);
      return res
        .status(500)
        .send({ success: false, error: "Internal Server Error" });
    }
  });

/** V1 HTTPS (POST): Creates a new topic document *only* if an ID doesn't exist. */
exports.addTopic = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
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
      const requiredFields = ["id", "categoryId", "title", "order"];
      for (const field of requiredFields) {
        if (
          topicData[field] === undefined ||
          topicData[field] === null ||
          (field !== "order" && String(topicData[field]).trim() === "") ||
          (field === "order" && typeof topicData[field] !== "number")
        ) {
          const errorMsg =
            field === "order"
              ? "Field 'order' must be a number."
              : `Missing or empty required field: ${field}`;
          console.warn(`V1 addTopic: ${errorMsg}`);
          return res.status(400).send({ success: false, error: errorMsg });
        }
      }
      const topicId = String(topicData.id).trim();
      if (!topicId) {
        return res
          .status(400)
          .send({ success: false, error: "Field 'id' cannot be empty." });
      }
      const topicRef = db.collection("topics").doc(topicId);
      const dataToSave = {
        categoryId: String(topicData.categoryId),
        title: String(topicData.title),
        order: Number(topicData.order),
        parentTopicId:
          topicData.parentTopicId !== undefined
            ? String(topicData.parentTopicId)
            : null,
        hasSubtopics: topicData.hasSubtopics === true,
        otherActivities: Array.isArray(topicData.otherActivities)
          ? topicData.otherActivities
          : [],
        type: String(topicData.type || "ACTIVITY"),
        createdAt: FieldValue.serverTimestamp(),
        lastUpdatedAt: FieldValue.serverTimestamp(),
      };
      await db.runTransaction(async (transaction) => {
        const docSnap = await transaction.get(topicRef);
        if (docSnap.exists) {
          throw new Error(
            `Document with ID ${topicId} already exists in collection 'topics'. Use PUT to update.`
          );
        }
        transaction.set(topicRef, dataToSave);
      });
      return res
        .status(201)
        .send({ success: true, id: topicId, data: dataToSave });
    } catch (error) {
      if (error.message.includes("already exists")) {
        return res.status(409).send({ success: false, error: error.message });
      }
      console.error("V1 addTopic: Error:", error);
      return res
        .status(500)
        .send({ success: false, error: "Internal Server Error" });
    }
  });

/** V1 HTTPS (PUT): Updates an existing topic document *only*. */
exports.updateTopic = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
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
      if (!topicId || typeof topicId !== "string" || topicId.trim() === "") {
        return res.status(400).send({
          success: false,
          error: "Missing or invalid 'id' (string) in request body.",
        });
      }
      if (
        !fieldsToUpdate ||
        typeof fieldsToUpdate !== "object" ||
        Object.keys(fieldsToUpdate).length === 0
      ) {
        return res.status(400).send({
          success: false,
          error: "Missing or empty 'fields' object in request body.",
        });
      }
      if (
        fieldsToUpdate.hasOwnProperty("id") ||
        fieldsToUpdate.hasOwnProperty("createdAt")
      ) {
        return res.status(400).send({
          success: false,
          error: "Cannot update immutable fields like 'id' or 'createdAt'.",
        });
      }
      const topicRef = db.collection("topics").doc(topicId);
      await db.runTransaction(async (transaction) => {
        const docSnap = await transaction.get(topicRef);
        if (!docSnap.exists) {
          throw new Error(
            `Document with ID ${topicId} not found in collection 'topics'. Use POST to create.`
          );
        }
        const updateData = {
          ...fieldsToUpdate,
          lastUpdatedAt: FieldValue.serverTimestamp(),
        };
        transaction.update(topicRef, updateData);
      });
      return res.status(200).send({ success: true, id: topicId });
    } catch (error) {
      if (error.message.includes("not found")) {
        return res.status(404).send({ success: false, error: error.message });
      }
      console.error("V1 updateTopic: Error:", error);
      return res
        .status(500)
        .send({ success: false, error: "Internal Server Error" });
    }
  });

/** V1 HTTPS: Adds or updates study content. */
exports.addStudyContent = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }
    try {
      const contentData = req.body;
      const requiredFields = ["contentId", "name", "author", "content"];
      for (const field of requiredFields) {
        if (!contentData[field] || String(contentData[field]).trim() === "") {
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
      };
      await studyContentRef.set(dataToSave, { merge: true });
      return res.status(201).send({ success: true, id: contentId });
    } catch (error) {
      console.error("V1 addStudyContent: Error:", error);
      return res
        .status(500)
        .send({ success: false, error: "Internal Server Error" });
    }
  });

/** V1 HTTPS: Adds a single new quiz question. */
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
      ];
      for (const field of requiredFields) {
        if (questionData[field] === undefined || questionData[field] === null) {
          return res
            .status(400)
            .send({ success: false, error: `Missing field: ${field}` });
        }
        if (
          field !== "explanation" &&
          field !== "options" &&
          String(questionData[field]).trim() === ""
        ) {
          return res
            .status(400)
            .send({ success: false, error: `Empty required field: ${field}` });
        }
      }
      if (
        !Array.isArray(questionData.options) ||
        questionData.options.length === 0
      ) {
        return res.status(400).send({
          success: false,
          error: "Field 'options' must be a non-empty array.",
        });
      }
      const dataToSave = {
        parentId: questionData.parentId,
        question: questionData.question,
        options: questionData.options,
        answer: questionData.answer,
        explanation: questionData.explanation || "",
        order: questionData.order,
      };
      const docRef = await db.collection("quizQuestions").add(dataToSave);
      return res.status(201).send({ success: true, id: docRef.id });
    } catch (error) {
      console.error("V1 addQuizQuestion: Error:", error);
      return res
        .status(500)
        .send({ success: false, error: "Internal Server Error" });
    }
  });

/**
 * @file crudOperations.js
 * @description This is the corrected createQuiz function.
 * It is now an 'onRequest' function to match the rest of your API.
 * It correctly uses the 'admin' object and handles requests/responses
 * in the same style as your other functions.
 */
exports.createQuiz = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    // --- CHANGE 2: Converted to onRequest to match your project style ---

    // 1. Handle CORS and Method validation (standard for onRequest)
    res.set("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.status(204).send("");
      return;
    }
    if (req.method !== "POST") {
      return res
        .status(405)
        .send({ success: false, error: "Method Not Allowed. Use POST." });
    }
    if (!req.is("application/json")) {
      return res.status(400).send({
        success: false,
        error: "Content-Type must be application/json.",
      });
    }

    try {
      // 2. Input Validation
      const { quizData, questionsData } = req.body;

      if (!quizData || !quizData.title) {
        return res.status(400).send({
          success: false,
          error: "Request must include 'quizData' with a 'title'.",
        });
      }
      if (!Array.isArray(questionsData) || questionsData.length === 0) {
        return res.status(400).send({
          success: false,
          error: "Request must include a non-empty 'questionsData' array.",
        });
      }
      const questionIds = questionsData.map((q) => q.id);
      if (new Set(questionIds).size !== questionIds.length) {
        return res.status(400).send({
          success: false,
          error: "Each question in 'questionsData' must have a unique 'id'.",
        });
      }

      // 3. Firestore Batch Write
      const batch = db.batch();
      const quizRef = db.collection("quizzes").doc();
      batch.set(quizRef, {
        ...quizData,
        // Use the imported FieldValue correctly
        createdAt: FieldValue.serverTimestamp(),
      });

      const newQuizId = quizRef.id;

      questionsData.forEach((question) => {
        const questionRef = db.collection("questions").doc(question.id);
        batch.set(questionRef, {
          ...question,
          quizId: newQuizId,
        });
      });

      await batch.commit();

      // 4. Return Success Response
      console.log(`Successfully created quiz with ID: ${newQuizId}`);
      return res.status(201).send({
        success: true,
        message: "Quiz created successfully!",
        quizId: newQuizId,
      });
    } catch (error) {
      console.error("Error creating quiz:", error);
      return res
        .status(500)
        .send({ success: false, error: "Internal Server Error" });
    }
  });

/**
 * HTTPS Cloud Function to update the top-level details of a quiz document.
 * Expects a POST request with 'quizId' and 'updateData'.
 */
exports.updateQuizDetails = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    // 1. Handle CORS and Method validation
    res.set("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.status(204).send("");
      return;
    }
    if (req.method !== "POST") {
      return res
        .status(405)
        .send({ success: false, error: "Method Not Allowed. Use POST." });
    }
    if (!req.is("application/json")) {
      return res.status(400).send({
        success: false,
        error: "Content-Type must be application/json.",
      });
    }

    try {
      // 2. Input Validation
      const { quizId, updateData } = req.body;

      if (!quizId) {
        return res
          .status(400)
          .send({ success: false, error: "Request must include 'quizId'." });
      }
      if (
        !updateData ||
        typeof updateData !== "object" ||
        Object.keys(updateData).length === 0
      ) {
        return res.status(400).send({
          success: false,
          error: "Request must include a non-empty 'updateData' object.",
        });
      }
      // Prevent protected fields from being updated
      if (updateData.id || updateData.createdAt) {
        return res.status(400).send({
          success: false,
          error: "Cannot update protected fields like 'id' or 'createdAt'.",
        });
      }

      // 3. Firestore Update
      const quizRef = db.collection("quizzes").doc(quizId);

      // Check if the document exists before updating
      const doc = await quizRef.get();
      if (!doc.exists) {
        return res
          .status(404)
          .send({ success: false, error: `Quiz with ID ${quizId} not found.` });
      }

      await quizRef.update({
        ...updateData,
        lastUpdatedAt: FieldValue.serverTimestamp(), // Keep track of updates
      });

      // 4. Return Success Response
      return res.status(200).send({
        success: true,
        message: "Quiz details updated successfully!",
        quizId: quizId,
      });
    } catch (error) {
      console.error("Error updating quiz details:", error);
      return res
        .status(500)
        .send({ success: false, error: "Internal Server Error" });
    }
  });

/**
 * HTTPS Cloud Function to add one or more new questions to an existing quiz.
 * Expects a POST request with 'quizId' and a 'questionsData' array.
 */
exports.addQuestions = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    // 1. Handle CORS and Method validation
    res.set("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.status(204).send("");
      return;
    }
    if (req.method !== "POST") {
      return res
        .status(405)
        .send({ success: false, error: "Method Not Allowed. Use POST." });
    }
    if (!req.is("application/json")) {
      return res.status(400).send({
        success: false,
        error: "Content-Type must be application/json.",
      });
    }

    try {
      // 2. Input Validation
      const { quizId, questionsData } = req.body;

      if (!quizId) {
        return res
          .status(400)
          .send({ success: false, error: "Request must include 'quizId'." });
      }
      if (!Array.isArray(questionsData) || questionsData.length === 0) {
        return res.status(400).send({
          success: false,
          error: "Request must include a non-empty 'questionsData' array.",
        });
      }
      // Ensure every question has a unique ID
      const questionIds = questionsData.map((q) => q.id);
      if (
        new Set(questionIds).size !== questionIds.length ||
        questionIds.includes(undefined)
      ) {
        return res.status(400).send({
          success: false,
          error: "Each question in 'questionsData' must have a unique 'id'.",
        });
      }

      // 3. Verify the parent quiz exists
      const quizRef = db.collection("quizzes").doc(quizId);
      const quizDoc = await quizRef.get();
      if (!quizDoc.exists) {
        return res.status(404).send({
          success: false,
          error: `Parent quiz with ID ${quizId} not found.`,
        });
      }

      // 4. Firestore Batch Write
      const batch = db.batch();
      const addedIds = [];

      questionsData.forEach((question) => {
        const questionRef = db.collection("questions").doc(question.id);
        batch.set(questionRef, {
          ...question,
          quizId: quizId, // Link the question to the parent quiz
        });
        addedIds.push(question.id);
      });

      await batch.commit();

      // 5. Return Success Response
      return res.status(201).send({
        success: true,
        message: `Successfully added ${addedIds.length} question(s) to quiz ${quizId}.`,
        addedQuestionIds: addedIds,
      });
    } catch (error) {
      console.error("Error adding questions:", error);
      return res
        .status(500)
        .send({ success: false, error: "Internal Server Error" });
    }
  });

/**
 * HTTPS Cloud Function to update one or more existing questions in bulk.
 * Expects a POST request with a 'questionsData' array. Each object in the
 * array must have an 'id' and the fields to update.
 */
exports.updateQuestions = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    // 1. Handle CORS and Method validation
    res.set("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.status(204).send("");
      return;
    }
    if (req.method !== "POST") {
      return res
        .status(405)
        .send({ success: false, error: "Method Not Allowed. Use POST." });
    }
    if (!req.is("application/json")) {
      return res.status(400).send({
        success: false,
        error: "Content-Type must be application/json.",
      });
    }

    try {
      // 2. Input Validation
      const { questionsData } = req.body;

      if (!Array.isArray(questionsData) || questionsData.length === 0) {
        return res.status(400).send({
          success: false,
          error: "Request must include a non-empty 'questionsData' array.",
        });
      }

      // 3. Firestore Batch Write for Updates
      const batch = db.batch();
      const updatedIds = [];

      for (const question of questionsData) {
        if (!question.id) {
          // If any question is missing an ID, fail the entire operation
          return res.status(400).send({
            success: false,
            error: "Each question in 'questionsData' must have an 'id'.",
          });
        }

        const questionRef = db.collection("questions").doc(question.id);
        const { id, ...updatePayload } = question; // Exclude the id from the update payload

        // Use update instead of set to only change specified fields
        batch.update(questionRef, updatePayload);
        updatedIds.push(question.id);
      }

      await batch.commit();

      // 4. Return Success Response
      return res.status(200).send({
        success: true,
        message: `Successfully updated ${updatedIds.length} question(s).`,
        updatedQuestionIds: updatedIds,
      });
    } catch (error) {
      console.error("Error updating questions:", error);
      return res
        .status(500)
        .send({ success: false, error: "Internal Server Error" });
    }
  });

/**
 * HTTPS Cloud Function to delete one or more questions in bulk.
 * Expects a POST request with a 'questionIds' array.
 */
exports.deleteQuestions = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    // 1. Handle CORS and Method validation
    res.set("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.status(204).send("");
      return;
    }
    if (req.method !== "POST") {
      return res
        .status(405)
        .send({ success: false, error: "Method Not Allowed. Use POST." });
    }
    if (!req.is("application/json")) {
      return res.status(400).send({
        success: false,
        error: "Content-Type must be application/json.",
      });
    }

    try {
      // 2. Input Validation
      const { questionIds } = req.body;

      if (!Array.isArray(questionIds) || questionIds.length === 0) {
        return res.status(400).send({
          success: false,
          error: "Request must include a non-empty 'questionIds' array.",
        });
      }
      if (
        questionIds.some((id) => typeof id !== "string" || id.trim() === "")
      ) {
        return res.status(400).send({
          success: false,
          error: "All items in 'questionIds' must be non-empty strings.",
        });
      }

      // 3. Firestore Batch Write for Deletes
      const batch = db.batch();

      questionIds.forEach((id) => {
        const questionRef = db.collection("questions").doc(id);
        batch.delete(questionRef);
      });

      await batch.commit();

      // 4. Return Success Response
      return res.status(200).send({
        success: true,
        message: `Successfully deleted ${questionIds.length} question(s).`,
        deletedQuestionIds: questionIds,
      });
    } catch (error) {
      console.error("Error deleting questions:", error);
      return res
        .status(500)
        .send({ success: false, error: "Internal Server Error" });
    }
  });

/**
 * HTTPS Cloud Function to delete a quiz and all of its associated questions.
 * Expects a POST request with a 'quizId'.
 */
exports.deleteQuiz = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    // 1. Handle CORS and Method validation
    res.set("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "POST");
      res.set("Access-control-allow-headers", "Content-Type");
      res.status(204).send("");
      return;
    }
    if (req.method !== "POST") {
      return res
        .status(405)
        .send({ success: false, error: "Method Not Allowed. Use POST." });
    }
    if (!req.is("application/json")) {
      return res
        .status(400)
        .send({
          success: false,
          error: "Content-Type must be application/json.",
        });
    }

    try {
      // 2. Input Validation
      const { quizId } = req.body;

      if (!quizId || typeof quizId !== "string") {
        return res
          .status(400)
          .send({
            success: false,
            error: "Request must include a valid 'quizId'.",
          });
      }

      // 3. Find all associated questions
      const questionsQuery = db
        .collection("questions")
        .where("quizId", "==", quizId);
      const questionSnapshots = await questionsQuery.get();

      // 4. Firestore Batch Write for Deletes
      const batch = db.batch();

      // Add each question to the delete batch
      questionSnapshots.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Add the main quiz document to the delete batch
      const quizRef = db.collection("quizzes").doc(quizId);
      batch.delete(quizRef);

      await batch.commit();

      // 5. Return Success Response
      return res.status(200).send({
        success: true,
        message: `Successfully deleted quiz ${quizId} and its ${questionSnapshots.size} associated questions.`,
      });
    } catch (error) {
      console.error("Error deleting quiz:", error);
      return res
        .status(500)
        .send({ success: false, error: "Internal Server Error" });
    }
  });

// functions/api/crudOperations.js
const functions = require("firebase-functions");
const { db, FieldValue } = require("../common/admin");
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

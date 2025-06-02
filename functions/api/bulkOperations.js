// functions/api/bulkOperations.js
const functions = require("firebase-functions");
const { db, FieldValue } = require("../common/admin");
const {
  region,
  runtimeOptions,
  longRuntimeOptions,
} = require("../common/config");

/** V1 HTTPS: Adds multiple category documents using a batch write. */
exports.bulkAddCategories = functions
  .region(region)
  .runWith(runtimeOptions) // Can use standard runtimeOptions if batches are small
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
        if (
          catData &&
          typeof catData === "object" &&
          catData.id &&
          catData.title &&
          String(catData.title).trim() !== "" &&
          catData.image &&
          String(catData.image).trim() !== "" &&
          catData.order !== undefined &&
          catData.order !== null &&
          typeof catData.order === "number" &&
          catData.carouselGroup &&
          String(catData.carouselGroup).trim() !== ""
        ) {
          const categoryRef = categoriesCol.doc(String(catData.id));
          batch.set(
            categoryRef,
            {
              title: catData.title,
              image: catData.image,
              subtitle: catData.subtitle || "",
              order: catData.order,
              carouselGroup: catData.carouselGroup,
              type: catData.type || "COURSE",
              duration: catData.duration || "",
              author: catData.author || "",
            },
            { merge: true }
          );
          processedCount++;
        } else {
          skippedCount++;
          console.warn(
            "V1 bulkAddCategories: Skipping invalid data:",
            JSON.stringify(catData)
          );
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
      return res
        .status(201)
        .send({
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
        return res
          .status(400)
          .send({
            success: false,
            error: "Request body must contain a non-empty 'topics' array.",
          });
      }
      if (topicsArray.length > 500) {
        return res
          .status(400)
          .send({
            success: false,
            error: "Cannot process more than 500 topics in one batch.",
          });
      }
      const batch = db.batch();
      const topicsCol = db.collection("topics");
      let processedCount = 0;
      let skippedCount = 0;
      topicsArray.forEach((topicData) => {
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
          const topicRef = topicsCol.doc(String(topicData.id));
          batch.set(
            topicRef,
            {
              categoryId: topicData.categoryId,
              title: topicData.title,
              order: topicData.order,
              parentTopicId:
                topicData.parentTopicId !== undefined
                  ? topicData.parentTopicId
                  : null,
              hasSubtopics: topicData.hasSubtopics === true,
              otherActivities: Array.isArray(topicData.otherActivities)
                ? topicData.otherActivities
                : [],
              type: topicData.type || "ACTIVITY",
            },
            { merge: true }
          );
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
        return res
          .status(400)
          .send({
            success: false,
            error: "No valid topic data found to process.",
            skipped: skippedCount,
          });
      }
      await batch.commit();
      return res
        .status(201)
        .send({
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
        return res
          .status(400)
          .send({
            success: false,
            error: "Request body must contain a non-empty 'studyItems' array.",
          });
      }
      if (studyItemsArray.length > 500) {
        return res
          .status(400)
          .send({
            success: false,
            error: "Cannot process more than 500 study items in one batch.",
          });
      }
      const batch = db.batch();
      const studyCol = db.collection("studyContent");
      let processedCount = 0;
      let skippedCount = 0;
      studyItemsArray.forEach((itemData) => {
        if (
          itemData &&
          typeof itemData === "object" &&
          itemData.contentId &&
          itemData.name &&
          String(itemData.name).trim() !== "" &&
          itemData.author &&
          String(itemData.author).trim() !== "" &&
          itemData.content &&
          String(itemData.content).trim() !== ""
        ) {
          const studyRef = studyCol.doc(String(itemData.contentId));
          batch.set(
            studyRef,
            {
              name: itemData.name,
              author: itemData.author,
              content: itemData.content,
              coverImage: itemData.coverImage || null,
              additionalImages: Array.isArray(itemData.additionalImages)
                ? itemData.additionalImages
                : [],
            },
            { merge: true }
          );
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
        return res
          .status(400)
          .send({
            success: false,
            error: "No valid study item data found to process.",
            skipped: skippedCount,
          });
      }
      await batch.commit();
      return res
        .status(201)
        .send({
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
        return res
          .status(400)
          .send({
            success: false,
            error: "Request body must contain a non-empty 'questions' array.",
          });
      }
      if (questionsArray.length > 500) {
        return res
          .status(400)
          .send({
            success: false,
            error: "Cannot process more than 500 questions in one batch.",
          });
      }
      const batch = db.batch();
      const quizCol = db.collection("quizQuestions");
      let processedCount = 0;
      let skippedCount = 0;
      questionsArray.forEach((qData) => {
        if (
          qData &&
          typeof qData === "object" &&
          qData.parentId &&
          String(qData.parentId).trim() !== "" &&
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
          const newQuestionRef = quizCol.doc(); // Auto-generate ID
          batch.set(newQuestionRef, {
            parentId: qData.parentId,
            question: qData.question,
            options: qData.options,
            answer: qData.answer,
            explanation: qData.explanation || "",
            order: qData.order,
          });
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
        return res
          .status(400)
          .send({
            success: false,
            error: "No valid quiz question data found to process.",
            skipped: skippedCount,
          });
      }
      await batch.commit();
      return res
        .status(201)
        .send({
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

/** V1 HTTPS: Deletes documents based on field matching. */
exports.deleteAllDocuments = functions
  .region(region)
  .runWith(longRuntimeOptions)
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }
    try {
      const { collectionName, fieldToMatch, valueToMatch, valuesToMatch } =
        req.body;
      if (!collectionName || !fieldToMatch) {
        return res.status(400).send({
          success: false,
          error:
            "Missing required fields: 'collectionName' and 'fieldToMatch'.",
        });
      }
      if (
        valueToMatch === undefined &&
        (!Array.isArray(valuesToMatch) ||
          valuesToMatch.length === 0 ||
          valuesToMatch.length > 30)
      ) {
        return res.status(400).send({
          success: false,
          error:
            "Either 'valueToMatch' (single value) or 'valuesToMatch' (array of 1-30 values) must be provided.",
        });
      }
      if (
        valueToMatch !== undefined &&
        Array.isArray(valuesToMatch) &&
        valuesToMatch.length > 0
      ) {
        return res.status(400).send({
          success: false,
          error: "Provide either 'valueToMatch' or 'valuesToMatch', not both.",
        });
      }
      let query = db.collection(collectionName);
      if (valueToMatch !== undefined) {
        query = query.where(fieldToMatch, "==", valueToMatch);
      } else {
        // valuesToMatch must be valid here due to above checks
        query = query.where(fieldToMatch, "in", valuesToMatch);
      }
      const BATCH_SIZE = 499;
      let totalDeleted = 0;
      let snapshot;
      let iterations = 0;
      const MAX_ITERATIONS = 100;
      do {
        iterations++;
        if (iterations > MAX_ITERATIONS) {
          throw new Error("Delete operation took too long, potentially stuck.");
        }
        snapshot = await query.limit(BATCH_SIZE).get();
        if (snapshot.empty) break;
        const batch = db.batch();
        snapshot.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
        totalDeleted += snapshot.size;
      } while (snapshot.size === BATCH_SIZE);
      return res
        .status(200)
        .send({ success: true, deletedCount: totalDeleted });
    } catch (error) {
      console.error("V1 deleteAllDocuments: Error:", error);
      return res.status(500).send({
        success: false,
        error: "Internal Server Error during delete operation.",
        details: error.message,
      });
    }
  });

/** V1 HTTPS: Updates and/or deletes fields in documents. */
exports.updateFirestoreDocuments = functions
  .region(region)
  .runWith(longRuntimeOptions)
  .https.onRequest(async (req, res) => {
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
      deleteFields,
      confirmUpdateAll,
    } = req.body;
    if (
      !collectionName ||
      typeof collectionName !== "string" ||
      collectionName.trim() === ""
    ) {
      return res
        .status(400)
        .send({
          success: false,
          error: 'Bad Request: "collectionName" (string) is required.',
        });
    }
    const hasFieldsToUpdate =
      fields && typeof fields === "object" && Object.keys(fields).length > 0;
    let hasFieldsToDelete = false;
    if (deleteFields !== undefined) {
      if (
        !Array.isArray(deleteFields) ||
        !deleteFields.every((f) => typeof f === "string" && f.trim() !== "")
      ) {
        return res
          .status(400)
          .send({
            success: false,
            error:
              'Bad Request: "deleteFields" must be an array of non-empty strings.',
          });
      }
      if (deleteFields.length > 0) hasFieldsToDelete = true;
    }
    if (!hasFieldsToUpdate && !hasFieldsToDelete) {
      return res
        .status(400)
        .send({
          success: false,
          error:
            'Bad Request: Either "fields" or "deleteFields" must be provided.',
        });
    }
    const hasMatchCriteria =
      fieldToMatch &&
      typeof fieldToMatch === "string" &&
      fieldToMatch.trim() !== "" &&
      valueToMatch !== undefined;
    try {
      let query;
      let queryDescription;
      if (hasMatchCriteria) {
        queryDescription = `where "${fieldToMatch}" == ${JSON.stringify(
          valueToMatch
        )}`;
        query = db
          .collection(collectionName)
          .where(fieldToMatch, "==", valueToMatch);
      } else {
        queryDescription = "ALL documents";
        if (confirmUpdateAll !== true) {
          return res
            .status(400)
            .send({
              success: false,
              error:
                'Bad Request: Modifying all documents requires "confirmUpdateAll": true.',
            });
        }
        query = db.collection(collectionName);
      }
      const snapshot = await query.get();
      if (snapshot.empty) {
        return res
          .status(200)
          .send({
            success: true,
            message:
              "Query successful, but no documents matched. No modifications performed.",
          });
      }
      const MAX_BATCH_SIZE = 500;
      let batch = db.batch();
      let documentsInBatch = 0;
      let totalModificationsCommitted = 0;
      const commitPromises = [];
      for (const doc of snapshot.docs) {
        const updateData = {};
        if (hasFieldsToUpdate) Object.assign(updateData, fields);
        if (hasFieldsToDelete)
          deleteFields.forEach((fieldName) => {
            updateData[fieldName] = FieldValue.delete();
          });
        batch.update(doc.ref, updateData);
        documentsInBatch++;
        if (documentsInBatch === MAX_BATCH_SIZE) {
          commitPromises.push(batch.commit());
          totalModificationsCommitted += documentsInBatch;
          batch = db.batch();
          documentsInBatch = 0;
        }
      }
      if (documentsInBatch > 0) {
        commitPromises.push(batch.commit());
        totalModificationsCommitted += documentsInBatch;
      }
      await Promise.all(commitPromises);
      return res
        .status(200)
        .send({
          success: true,
          message: `Successfully modified ${totalModificationsCommitted} documents.`,
        });
    } catch (error) {
      functions.logger.error(
        `Error modifying documents in "${collectionName}" with criteria "${
          queryDescription || "N/A"
        }":`,
        error
      );
      // ... (error handling)
      return res
        .status(500)
        .send({
          success: false,
          error: "Internal Server Error: Failed to modify documents.",
        });
    }
  });

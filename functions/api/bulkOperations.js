// functions/api/bulkOperations.js
const functions = require("firebase-functions");
const { admin } = require("../common/admin"); // Assume this initializes admin correctly
const {
  region,
  runtimeOptions,
  longRuntimeOptions,
} = require("../common/config");

// Get the Firestore instance and FieldValue from the initialized admin app.
// This is the correct way to access these in the Admin SDK.
const firestore = admin.firestore();
const { FieldValue } = admin.firestore;

// =================================================================================================
// REUSABLE HELPER FOR BULK 'SET' OPERATIONS
// This helper function abstracts the common logic from the original four bulkAdd functions.
// =================================================================================================

/**
 * Handles the core logic for bulk 'set' operations.
 * @param {object} req - The HTTPS request object.
 * @param {object} res - The HTTPS response object.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {string} arrayKey - The key in the request body that holds the items array (e.g., "categories").
 * @param {function} itemProcessor - A function that validates and transforms a single item into a document data object.
 * @param {boolean} autoGenerateId - If true, generates a new document ID. If false, uses `item.id`.
 */
const handleBulkSetOperation = async (
  req,
  res,
  { collectionName, arrayKey, itemProcessor, autoGenerateId = false }
) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .send({ success: false, error: "Method Not Allowed" });
  }

  try {
    const itemsArray = req.body[arrayKey];
    if (!Array.isArray(itemsArray) || itemsArray.length === 0) {
      return res.status(400).send({
        success: false,
        error: `Request body must contain a non-empty '${arrayKey}' array.`,
      });
    }
    if (itemsArray.length > 500) {
      return res.status(400).send({
        success: false,
        error: `Cannot process more than 500 items in one batch.`,
      });
    }

    const batch = firestore.batch();
    const collectionRef = firestore.collection(collectionName);
    let processedCount = 0;
    let skippedCount = 0;

    itemsArray.forEach((item) => {
      const processedData = itemProcessor(item);
      if (processedData) {
        const docId = autoGenerateId ? null : String(item.id);
        const docRef = docId ? collectionRef.doc(docId) : collectionRef.doc(); // Auto-generate ID if docId is null
        batch.set(docRef, processedData, { merge: true });
        processedCount++;
      } else {
        skippedCount++;
        functions.logger.warn(
          `Skipping invalid data in ${collectionName}:`,
          JSON.stringify(item)
        );
      }
    });

    if (processedCount === 0) {
      return res.status(400).send({
        success: false,
        error: `No valid data found in '${arrayKey}' to process.`,
        skipped: skippedCount,
      });
    }

    await batch.commit();
    return res.status(201).send({
      success: true,
      processed: processedCount,
      skipped: skippedCount,
    });
  } catch (error) {
    functions.logger.error(`Error bulk adding to ${collectionName}:`, error);
    return res
      .status(500)
      .send({ success: false, error: "Bulk operation failed." });
  }
};

// =================================================================================================
// EXPORTED CLOUD FUNCTIONS
// =================================================================================================

/**
 * @summary Bulk adds or updates documents in the 'categories' collection.
 * @description Expects a POST request with `{"categories": [...]}`.
 * Each object in the array needs `id`, `title`, `image`, `order`, and `carouselGroup`.
 */
exports.bulkAddCategories = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest((req, res) =>
    handleBulkSetOperation(req, res, {
      collectionName: "categories",
      arrayKey: "categories",
      itemProcessor: (item) => {
        if (
          item &&
          item.id &&
          item.title &&
          item.image &&
          item.order !== undefined &&
          item.carouselGroup
        ) {
          return {
            title: item.title,
            image: item.image,
            subtitle: item.subtitle || "",
            order: Number(item.order),
            carouselGroup: item.carouselGroup,
            type: item.type || "COURSE",
            duration: item.duration || "",
            author: item.author || "",
          };
        }
        return null;
      },
    })
  );

/**
 * @summary Bulk adds or updates documents in the 'topics' collection.
 * @description Expects a POST request with `{"topics": [...]}`.
 * Each object in the array needs `id`, `categoryId`, `title`, and `order`.
 */
exports.bulkAddTopics = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest((req, res) =>
    handleBulkSetOperation(req, res, {
      collectionName: "topics",
      arrayKey: "topics",
      itemProcessor: (item) => {
        if (
          item &&
          item.id &&
          item.categoryId &&
          item.title &&
          item.order !== undefined
        ) {
          return {
            categoryId: item.categoryId,
            title: item.title,
            order: Number(item.order),
            parentTopicId:
              item.parentTopicId !== undefined ? item.parentTopicId : null,
            hasSubtopics: item.hasSubtopics === true,
            otherActivities: Array.isArray(item.otherActivities)
              ? item.otherActivities
              : [],
            type: item.type || "ACTIVITY",
          };
        }
        return null;
      },
    })
  );

/**
 * @summary Bulk adds or updates documents in the 'studyContent' collection.
 * @description Expects a POST request with `{"studyItems": [...]}`.
 * Each object in the array needs `contentId`, `name`, `author`, and `content`.
 */
exports.bulkAddStudyContent = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest((req, res) =>
    handleBulkSetOperation(req, res, {
      collectionName: "studyContent",
      arrayKey: "studyItems",
      itemProcessor: (item) => {
        if (
          item &&
          item.contentId &&
          item.name &&
          item.author &&
          item.content
        ) {
          return {
            name: item.name,
            author: item.author,
            content: item.content,
            coverImage: item.coverImage || null,
            additionalImages: Array.isArray(item.additionalImages)
              ? item.additionalImages
              : [],
          };
        }
        return null;
      },
      // Override the auto-generate ID behavior
      autoGenerateId: false,
      // Provide the item ID key
      itemIdKey: "contentId",
    })
  );

/**
 * @summary Bulk adds new documents to the 'quizQuestions' collection with auto-generated IDs.
 * @description Expects a POST request with `{"questions": [...]}`.
 * Each object in the array needs `parentId`, `question`, `options`, `answer`, and `order`.
 */
exports.bulkAddQuizQuestions = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest((req, res) =>
    handleBulkSetOperation(req, res, {
      collectionName: "quizQuestions",
      arrayKey: "questions",
      itemProcessor: (item) => {
        if (
          item &&
          item.parentId &&
          item.question &&
          Array.isArray(item.options) &&
          item.options.length > 0 &&
          item.answer !== undefined &&
          item.order !== undefined
        ) {
          return {
            parentId: item.parentId,
            question: item.question,
            options: item.options,
            answer: item.answer,
            explanation: item.explanation || "",
            order: Number(item.order),
          };
        }
        return null;
      },
      autoGenerateId: true, // This endpoint auto-generates IDs
    })
  );

/**
 * @summary Deletes multiple documents from a collection based on a field value.
 * @description Supports matching a single value (`'=='`) or multiple values (`'in'`).
 * @example body `{"collectionName": "users", "fieldToMatch": "status", "valueToMatch": "inactive"}`
 * @example body `{"collectionName": "users", "fieldToMatch": "uid", "valuesToMatch": ["uid1", "uid2"]}`
 */
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
      // ... (Validation logic remains the same, it's already good)
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

      const targetCollectionRef = firestore.collection(collectionName);
      let query;
      if (valueToMatch !== undefined) {
        query = targetCollectionRef.where(fieldToMatch, "==", valueToMatch);
      } else {
        query = targetCollectionRef.where(fieldToMatch, "in", valuesToMatch);
      }

      const BATCH_SIZE = 499;
      let totalDeleted = 0;
      let snapshot;

      // Loop to delete in batches until no more matching documents are found.
      while (true) {
        snapshot = await query.limit(BATCH_SIZE).get();
        if (snapshot.empty) {
          break; // Exit loop if no documents are left
        }

        const batch = firestore.batch();
        snapshot.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
        totalDeleted += snapshot.size;

        // If we deleted fewer docs than the batch size, we are done.
        if (snapshot.size < BATCH_SIZE) {
          break;
        }
      }

      return res
        .status(200)
        .send({ success: true, deletedCount: totalDeleted });
    } catch (error) {
      functions.logger.error("deleteAllDocuments Error:", error);
      return res.status(500).send({
        success: false,
        error: "Internal Server Error during delete operation.",
      });
    }
  });

/**
 * @summary Updates or deletes fields in multiple documents.
 * @description Can target a single document by its ID, documents matching a field, or all documents in a collection.
 * @example body `{"collectionName": "topics", "fieldToMatch": "documentId", "valueToMatch": "doc-id-1", "fields": {"status": "published"}}`
 * @example body `{"collectionName": "users", "fieldToMatch": "country", "valueToMatch": "USA", "deleteFields": ["old_data"]}`
 * @example body `{"collectionName": "posts", "confirmUpdateAll": true, "fields": {"isPublic": false}}`
 */
exports.updateFirestoreDocuments = functions
  .region(region)
  .runWith(longRuntimeOptions)
  .https.onRequest(async (req, res) => {
    // ... (Validation logic for request body remains the same)
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

    let queryDescription = "N/A";

    try {
      const targetCollectionRef = firestore.collection(collectionName);
      let snapshot;

      if (hasMatchCriteria) {
        if (fieldToMatch === "documentId") {
          queryDescription = `document with ID "${valueToMatch}"`;
          const docRef = targetCollectionRef.doc(String(valueToMatch));
          const docSnapshot = await docRef.get();
          snapshot = {
            empty: !docSnapshot.exists,
            docs: docSnapshot.exists ? [docSnapshot] : [],
          };
        } else {
          queryDescription = `where "${fieldToMatch}" == ${JSON.stringify(
            valueToMatch
          )}`;
          const query = targetCollectionRef.where(
            fieldToMatch,
            "==",
            valueToMatch
          );
          snapshot = await query.get();
        }
      } else {
        queryDescription = "ALL documents";
        if (confirmUpdateAll !== true) {
          return res.status(400).send({
            success: false,
            error:
              'Bad Request: Modifying all documents requires "confirmUpdateAll": true.',
          });
        }
        snapshot = await targetCollectionRef.get();
      }

      if (snapshot.empty) {
        return res.status(200).send({
          success: true,
          message:
            "Query successful, but no documents matched. No modifications performed.",
        });
      }

      // Batch processing logic remains the same, it's already good.
      const MAX_BATCH_SIZE = 500;
      let batch = firestore.batch();
      let documentsInBatch = 0;
      let totalModificationsCommitted = 0;
      const commitPromises = [];

      for (const doc of snapshot.docs) {
        const updateData = {};
        if (hasFieldsToUpdate) Object.assign(updateData, fields);
        if (hasFieldsToDelete) {
          deleteFields.forEach((fieldName) => {
            updateData[fieldName] = FieldValue.delete();
          });
        }
        batch.update(doc.ref, updateData);
        documentsInBatch++;

        if (documentsInBatch >= MAX_BATCH_SIZE) {
          commitPromises.push(batch.commit());
          totalModificationsCommitted += documentsInBatch;
          batch = firestore.batch();
          documentsInBatch = 0;
        }
      }
      if (documentsInBatch > 0) {
        commitPromises.push(batch.commit());
        totalModificationsCommitted += documentsInBatch;
      }
      await Promise.all(commitPromises);

      return res.status(200).send({
        success: true,
        message: `Successfully modified ${totalModificationsCommitted} document(s).`,
      });
    } catch (error) {
      functions.logger.error(
        `Error modifying documents in "${collectionName}" with criteria "${queryDescription}":`,
        error
      );
      return res.status(500).send({
        success: false,
        error: "Internal Server Error: Failed to modify documents.",
      });
    }
  });

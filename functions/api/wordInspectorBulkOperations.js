const functions = require("firebase-functions");
const { db, FieldValue } = require("../common/admin");
const {
  region,
  runtimeOptions,
  longRuntimeOptions,
} = require("../common/config");

// Define the expected schema for a single Word Inspector Quiz for validation
const wordInspectorQuizSchema = {
  id: "string", // Document ID, must be provided
  title: "string",
  instruction: "string",
  passage: "string",
  targetWordType: "string",
  caseSensitive: "boolean",
  matchBehavior: {
    mode: ["type", "instance"], // Enum: "type" or "instance"
    targetWords: {
      type: "object", // Placeholder, validated more deeply below
    },
  },
  // Optional fields
  difficultyLevel: "string",
  topicId: "string",
};

/**
 * Validates the structure and content of a single Word Inspector Quiz object.
 * This is a more detailed validator than a generic schema validator
 * because of the dynamic nature of 'matchBehavior.targetWords'.
 * @param {object} quizData - The quiz data object to validate.
 * @returns {string|null} - An error message if invalid, null otherwise.
 */
function validateWordInspectorQuiz(quizData) {
  if (!quizData || typeof quizData !== "object") {
    return "Quiz data must be an object.";
  }
  if (typeof quizData.id !== "string" || quizData.id.trim() === "") {
    return "Quiz 'id' (string) is required and cannot be empty.";
  }
  if (typeof quizData.title !== "string" || quizData.title.trim() === "") {
    return "Quiz 'title' (string) is required and cannot be empty.";
  }
  if (
    typeof quizData.instruction !== "string" ||
    quizData.instruction.trim() === ""
  ) {
    return "Quiz 'instruction' (string) is required and cannot be empty.";
  }
  if (typeof quizData.passage !== "string" || quizData.passage.trim() === "") {
    return "Quiz 'passage' (string) is required and cannot be empty.";
  }
  if (
    typeof quizData.targetWordType !== "string" ||
    quizData.targetWordType.trim() === ""
  ) {
    return "Quiz 'targetWordType' (string) is required and cannot be empty.";
  }
  if (typeof quizData.caseSensitive !== "boolean") {
    return "Quiz 'caseSensitive' (boolean) is required.";
  }

  const { matchBehavior } = quizData;
  if (
    !matchBehavior ||
    typeof matchBehavior !== "object" ||
    !matchBehavior.mode
  ) {
    return "Quiz 'matchBehavior' with 'mode' is required.";
  }

  if (!["type", "instance"].includes(matchBehavior.mode)) {
    return "matchBehavior.mode must be 'type' or 'instance'.";
  }

  // Validate matchBehavior.targetWords based on mode
  if (matchBehavior.mode === "type") {
    if (
      !Array.isArray(matchBehavior.targetWords) ||
      matchBehavior.targetWords.length === 0 ||
      !matchBehavior.targetWords.every(
        (w) => typeof w === "string" && w.trim() !== ""
      )
    ) {
      return "For 'type' mode, 'matchBehavior.targetWords' must be a non-empty array of strings.";
    }
  } else if (matchBehavior.mode === "instance") {
    // FIX: Corrected validation logic for instance mode
    if (
      !matchBehavior.targetWords ||
      typeof matchBehavior.targetWords !== "object"
    ) {
      return "For 'instance' mode, 'matchBehavior.targetWords' must be an object containing 'instanceTargets'.";
    }
    const instanceTargets = matchBehavior.targetWords.instanceTargets;
    if (
      !instanceTargets ||
      typeof instanceTargets !== "object" ||
      Object.keys(instanceTargets).length === 0
    ) {
      return "For 'instance' mode, 'matchBehavior.targetWords.instanceTargets' must be a non-empty object.";
    }
    // Validate frequencies in instanceTargets
    for (const word in instanceTargets) {
      const freq = instanceTargets[word];
      if (typeof freq !== "number" || freq <= 0 || !Number.isInteger(freq)) {
        return `For 'instance' mode, '${word}' frequency in 'instanceTargets' must be a positive integer.`;
      }
    }
  }
  return null; // All checks passed
}

/**
 * HTTPS Callable Function: Adds one or more Word Inspector Quiz documents.
 * Documents are created with the provided ID. If an ID already exists,
 * that specific document creation will fail.
 *
 * @param {object} req - The request object from the HTTPS call.
 * @param {Array<object>} req.body.quizzes - An array of quiz data objects.
 * @returns {object} - A response indicating success/failure and counts.
 */
exports.bulkAddWordInspectorQuizzes = functions
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
      const { quizzes: quizzesArray } = req.body;

      if (!Array.isArray(quizzesArray) || quizzesArray.length === 0) {
        return res.status(400).send({
          success: false,
          error: "Request body must contain a non-empty 'quizzes' array.",
        });
      }
      if (quizzesArray.length > 500) {
        return res.status(400).send({
          success: false,
          error: "Cannot process more than 500 quizzes in one batch.",
        });
      }

      const batch = db.batch();
      const quizzesCol = db.collection("wordInspectorQuizzes");
      let processedCount = 0;
      let skippedCount = 0;
      const failedCreations = []; // To track specific failures

      for (const quizData of quizzesArray) {
        const validationError = validateWordInspectorQuiz(quizData);
        if (validationError) {
          skippedCount++;
          console.warn(
            `bulkAddWordInspectorQuizzes: Skipping invalid quiz data (ID: ${
              quizData.id || "N/A"
            }): ${validationError}`
          );
          failedCreations.push({
            id: quizData.id || "N/A",
            reason: validationError,
          });
          continue; // Skip to next quiz if invalid
        }

        const quizRef = quizzesCol.doc(String(quizData.id));

        try {
          // Use .create() which fails if the document already exists during commit
          batch.create(quizRef, {
            title: quizData.title,
            instruction: quizData.instruction,
            passage: quizData.passage,
            targetWordType: quizData.targetWordType,
            caseSensitive: quizData.caseSensitive,
            matchBehavior: quizData.matchBehavior,
            difficultyLevel: quizData.difficultyLevel || null,
            topicId: quizData.topicId || null,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          });
          processedCount++;
        } catch (batchPreparationError) {
          // This specific catch block might not be hit for existence checks at batch.create level
          // as it's typically caught during batch.commit()
          // but good for other immediate validation issues.
          skippedCount++;
          console.warn(
            `bulkAddWordInspectorQuizzes: Unexpected error preparing batch for quiz ID ${quizData.id}:`,
            batchPreparationError.message
          );
          failedCreations.push({
            id: quizData.id,
            reason: batchPreparationError.message,
          });
        }
      }

      if (processedCount === 0) {
        return res.status(400).send({
          success: false,
          error: "No valid quiz data found to process.",
          skipped: skippedCount,
          failedCreations: failedCreations,
        });
      }

      try {
        await batch.commit();
      } catch (commitError) {
        // This catch will hit if a document already exists when using batch.create()
        console.error(
          "bulkAddWordInspectorQuizzes: Batch commit failed, potentially due to existing documents:",
          commitError
        );
        // Determine which documents failed if possible (requires more complex error parsing)
        // For simplicity, we report a general commit failure.
        return res.status(409).send({
          // 409 Conflict if resource already exists
          success: false,
          error: `Batch commit failed. One or more quizzes might already exist or another Firestore error occurred: ${commitError.message}`,
          processed: processedCount,
          skipped: skippedCount,
          failedCreations: failedCreations, // Still include schema validation failures
          // Add a flag indicating a commit-level failure
          commitFailed: true,
        });
      }

      return res.status(201).send({
        success: true,
        processed: processedCount,
        skipped: skippedCount, // Skipped due to invalid schema
        message: `Successfully processed ${processedCount} quizzes.`,
        failedCreations: failedCreations, // Will typically be empty unless validation failed before batch.create
      });
    } catch (error) {
      console.error("bulkAddWordInspectorQuizzes: Top-level Error:", error);
      return res.status(500).send({
        success: false,
        error: "Internal Server Error: Failed to add quizzes.",
        details: error.message,
      });
    }
  });

/**
 * HTTPS Callable Function: Retrieves one or more Word Inspector Quiz documents by their IDs.
 *
 * @param {object} req - The request object from the HTTPS call.
 * @param {Array<string>} req.body.quizIds - An array of quiz IDs to retrieve.
 * @returns {object} - A response containing the retrieved quizzes or an error.
 */
exports.bulkGetWordInspectorQuizzes = functions
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
      const { quizIds } = req.body;

      if (!Array.isArray(quizIds) || quizIds.length === 0) {
        return res.status(400).send({
          success: false,
          error: "Request body must contain a non-empty 'quizIds' array.",
        });
      }
      // Maximum 500 IDs for Promise.all to avoid excessive concurrent reads
      if (quizIds.length > 500) {
        return res.status(400).send({
          success: false,
          error: "Cannot retrieve more than 500 quiz IDs at once.",
        });
      }

      const quizzesCol = db.collection("wordInspectorQuizzes");
      const fetchPromises = quizIds.map((id) =>
        quizzesCol.doc(String(id)).get()
      );

      const snapshots = await Promise.all(fetchPromises);

      const fetchedQuizzes = [];
      snapshots.forEach((docSnap) => {
        if (docSnap.exists) {
          // Exclude internal Firestore fields like 'createdAt', 'updatedAt' if desired for public API response
          const { createdAt, updatedAt, ...dataWithoutTimestamps } =
            docSnap.data();
          fetchedQuizzes.push({ id: docSnap.id, ...dataWithoutTimestamps });
        }
      });

      return res.status(200).send({
        success: true,
        quizzes: fetchedQuizzes,
        foundCount: fetchedQuizzes.length,
        requestedCount: quizIds.length,
      });
    } catch (error) {
      console.error("bulkGetWordInspectorQuizzes: Error:", error);
      return res.status(500).send({
        success: false,
        error: "Internal Server Error: Failed to retrieve quizzes.",
        details: error.message,
      });
    }
  });

const functions = require("firebase-functions");
const { admin } = require("../common/admin");
// We only need FieldValue from here now
const { FieldValue } = require("firebase-admin/firestore");
const { region, runtimeOptions } = require("../common/config");

// Get the firestore instance from the initialized admin app
const firestore = admin.firestore();

// --- BULK READ ---
exports.getGameContent = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }
    try {
      const { collectionName, categoryId, subcollectionName } = req.body;
      if (!collectionName) {
        return res
          .status(400)
          .send({ success: false, error: "'collectionName' is required." });
      }
      let query =
        categoryId && subcollectionName
          ? firestore
              .collection(collectionName)
              .doc(categoryId)
              .collection(subcollectionName)
          : firestore.collection(collectionName);
      const snapshot = await query.get();
      const documents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return res
        .status(200)
        .send({ success: true, count: documents.length, data: documents });
    } catch (error) {
      console.error("Error in getGameContent:", error);
      return res
        .status(500)
        .send({ success: false, error: "Failed to fetch content." });
    }
  });

// --- BULK DELETE ---
exports.bulkDeleteGameDocs = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }
    try {
      const { collectionName, docIds } = req.body;
      if (!collectionName || !Array.isArray(docIds) || docIds.length === 0) {
        return res
          .status(400)
          .send({
            success: false,
            error:
              "Request must contain 'collectionName' and a non-empty 'docIds' array.",
          });
      }
      const batch = firestore.batch(); // Use the standard instance method
      docIds.forEach((id) => {
        const docRef = firestore.collection(collectionName).doc(id);
        batch.delete(docRef);
      });
      await batch.commit();
      return res
        .status(200)
        .send({
          success: true,
          message: `Successfully deleted ${docIds.length} documents.`,
        });
    } catch (error) {
      console.error("Error in bulkDeleteGameDocs:", error);
      return res
        .status(500)
        .send({ success: false, error: "Bulk delete operation failed." });
    }
  });

exports.deleteVocabCategory = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }
    try {
      const { categoryId } = req.body;
      if (!categoryId) {
        return res
          .status(400)
          .send({ success: false, error: "'categoryId' is required." });
      }
      const path = `gameVocabCategories/${categoryId}`;
      await admin.firestore().recursiveDelete(firestore.doc(path));
      return res
        .status(200)
        .send({
          success: true,
          message: `Successfully deleted category ${categoryId} and all its words.`,
        });
    } catch (error) {
      console.error("Error in deleteVocabCategory:", error);
      return res
        .status(500)
        .send({ success: false, error: "Recursive delete operation failed." });
    }
  });

// --- BULK ADD ---
exports.bulkAddVocabCategories = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }
    try {
      const { categories } = req.body;
      if (!Array.isArray(categories) || categories.length === 0) {
        return res
          .status(400)
          .send({
            success: false,
            error: "Request body must contain a non-empty 'categories' array.",
          });
      }

      const batch = firestore.batch(); // Use the standard instance method
      const categoriesColRef = firestore.collection("gameVocabCategories");
      let processedCount = 0;

      categories.forEach((cat) => {
        if (
          cat &&
          cat.name &&
          typeof cat.name === "string" &&
          cat.name.trim() !== ""
        ) {
          const newCategoryRef = categoriesColRef.doc();
          batch.set(newCategoryRef, {
            name: cat.name.trim(),
            createdAt: FieldValue.serverTimestamp(),
          });
          processedCount++;
        }
      });
      if (processedCount === 0) {
        return res
          .status(400)
          .send({
            success: false,
            error: "No valid category data found to process.",
          });
      }
      await batch.commit();
      return res
        .status(201)
        .send({
          success: true,
          message: `Successfully added ${processedCount} categories.`,
        });
    } catch (error) {
      console.error("Error in bulkAddVocabCategories:", error);
      return res
        .status(500)
        .send({ success: false, error: "Bulk operation failed." });
    }
  });

exports.bulkAddWordsToCategory = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }
    try {
      const { categoryId, words } = req.body;
      if (!categoryId || typeof categoryId !== "string") {
        return res
          .status(400)
          .send({
            success: false,
            error: "A valid 'categoryId' string is required.",
          });
      }
      if (!Array.isArray(words) || words.length === 0) {
        return res
          .status(400)
          .send({
            success: false,
            error: "Request body must contain a non-empty 'words' array.",
          });
      }

      const batch = firestore.batch(); // Use the standard instance method
      const wordsColRef = firestore
        .collection("gameVocabCategories")
        .doc(categoryId)
        .collection("words");
      let processedCount = 0;

      words.forEach((wordData) => {
        if (wordData && wordData.word && wordData.hint) {
          const newWordRef = wordsColRef.doc();
          batch.set(newWordRef, {
            word: String(wordData.word).toUpperCase().trim(),
            hint: String(wordData.hint).trim(),
          });
          processedCount++;
        }
      });
      if (processedCount === 0) {
        return res
          .status(400)
          .send({
            success: false,
            error: "No valid word data found to process.",
          });
      }
      await batch.commit();
      return res
        .status(201)
        .send({
          success: true,
          message: `Successfully added ${processedCount} words to category ${categoryId}.`,
        });
    } catch (error) {
      console.error("Error in bulkAddWordsToCategory:", error);
      return res
        .status(500)
        .send({ success: false, error: "Bulk operation failed." });
    }
  });

exports.bulkAddSpellingBeePuzzles = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }
    try {
      const { puzzles } = req.body;
      if (!Array.isArray(puzzles) || puzzles.length === 0) {
        return res
          .status(400)
          .send({
            success: false,
            error: "Request body must contain a non-empty 'puzzles' array.",
          });
      }

      const batch = firestore.batch(); // Use the standard instance method
      const puzzlesColRef = firestore.collection("gameSpellingBee");
      let processedCount = 0;

      puzzles.forEach((puzzle) => {
        const { center, letters } = puzzle;
        if (
          center &&
          typeof center === "string" &&
          center.length === 1 &&
          Array.isArray(letters) &&
          letters.length === 7 &&
          letters.includes(center)
        ) {
          const newPuzzleRef = puzzlesColRef.doc();
          batch.set(newPuzzleRef, {
            center: center.toUpperCase(),
            letters: letters.map((l) => l.toUpperCase()),
            createdAt: FieldValue.serverTimestamp(),
          });
          processedCount++;
        }
      });
      if (processedCount === 0) {
        return res
          .status(400)
          .send({
            success: false,
            error: "No valid puzzle data found to process.",
          });
      }
      await batch.commit();
      return res
        .status(201)
        .send({
          success: true,
          message: `Successfully added ${processedCount} puzzles.`,
        });
    } catch (error) {
      console.error("Error in bulkAddSpellingBeePuzzles:", error);
      return res
        .status(500)
        .send({ success: false, error: "Bulk operation failed." });
    }
  });

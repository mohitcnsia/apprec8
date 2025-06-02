// functions/api/utility.js
const functions = require("firebase-functions");
const { db } = require("../common/admin");
const { region, runtimeOptions } = require("../common/config");
const { inferSchemaFromData } = require("../utils/helpers"); // Import helper

/**
 * V1 HTTPS (POST): Fetches multiple documents by ID from a specified collection,
 * or optionally returns the inferred schema of those documents.
 */
exports.getDocumentsById = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*"); // Basic CORS for testing
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
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
        error: "Bad Request: Content-Type must be application/json.",
      });
    }

    try {
      const { collectionName, docIds, getSchema = false } = req.body;

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
      if (!Array.isArray(docIds) || docIds.length === 0) {
        return res
          .status(400)
          .send({
            success: false,
            error: 'Bad Request: "docIds" must be a non-empty array.',
          });
      }
      if (docIds.length > 25) {
        return res
          .status(400)
          .send({
            success: false,
            error: "Bad Request: Maximum number of docIds allowed is 25.",
          });
      }
      if (!docIds.every((id) => typeof id === "string" && id.trim() !== "")) {
        return res
          .status(400)
          .send({
            success: false,
            error:
              'Bad Request: All items in "docIds" must be non-empty strings.',
          });
      }
      if (typeof getSchema !== "boolean") {
        return res
          .status(400)
          .send({
            success: false,
            error:
              'Bad Request: "getSchema" must be a boolean (true or false).',
          });
      }

      const docRefs = docIds.map((id) =>
        db.collection(collectionName).doc(id.trim())
      );
      const documentSnapshots = await db.getAll(...docRefs);
      const results = {};

      documentSnapshots.forEach((snapshot) => {
        const docId = snapshot.id;
        if (!snapshot.exists) {
          results[docId] = null;
        } else {
          const docData = snapshot.data();
          if (getSchema) {
            results[docId] = inferSchemaFromData(docData);
          } else {
            results[docId] = { id: docId, ...docData };
          }
        }
      });

      const responsePayload = { success: true };
      if (getSchema) {
        responsePayload.schema = results;
      } else {
        responsePayload.documents = results;
      }
      return res.status(200).send(responsePayload);
    } catch (error) {
      console.error("getDocumentsById: Error processing request:", error);
      // ... (error handling)
      return res
        .status(500)
        .send({
          success: false,
          error: "Internal Server Error: Failed to process request.",
        });
    }
  });

const { admin } = require("../common/admin"); // admin is needed for Firestore specific types

/** Helper function to shuffle an array */
const shuffleArray = (array) => {
  if (!Array.isArray(array)) return [];
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

/** Checks if two Firestore Timestamps are on the same calendar date in UTC */
function isSameUTCDate(timestamp1, timestamp2) {
  if (!timestamp1 || !timestamp2) return false;
  try {
    const date1 = timestamp1.toDate();
    const date2 = timestamp2.toDate();
    return (
      date1.getUTCFullYear() === date2.getUTCFullYear() &&
      date1.getUTCMonth() === date2.getUTCMonth() &&
      date1.getUTCDate() === date2.getUTCDate()
    );
  } catch (e) {
    console.error("isSameUTCDate Error:", e);
    return false;
  }
}

/** Checks if timestamp1 is exactly the day before timestamp2 in UTC */
function isYesterdayUTC(timestamp1, timestamp2) {
  if (!timestamp1 || !timestamp2) return false;
  try {
    const date1 = timestamp1.toDate();
    const date2 = timestamp2.toDate();
    const startOfDate2 = Date.UTC(
      date2.getUTCFullYear(),
      date2.getUTCMonth(),
      date2.getUTCDate(),
      0,
      0,
      0,
      0
    );
    const startOfYesterday = startOfDate2 - 24 * 60 * 60 * 1000;
    const date1Millis = date1.getTime();
    return date1Millis >= startOfYesterday && date1Millis < startOfDate2;
  } catch (e) {
    console.error("isYesterdayUTC Error:", e);
    return false;
  }
}

/**
 * DOCUMENTATION:
 * Recursively infers the schema of a given data object.
 * - For primitive types (string, number, boolean), it returns their type name.
 * - For an array, it infers the schema of the first element and assumes all
 * elements in the array follow that same structure.
 * - For an object, it iterates over its keys and recursively calls itself
 * on each value to build a nested schema object.
 *
 * @param {any} data - The data (object, array, or primitive) to infer a schema from.
 * @returns {object|string} - The inferred schema.
 */
const inferSchemaFromData = (data) => {
  // --- CHANGE 1: Handle null and primitive types ---
  if (data === null || typeof data !== "object") {
    return typeof data;
  }

  // --- CHANGE 2: Handle arrays ---
  if (Array.isArray(data)) {
    // If the array is empty, we can't know the structure of its elements.
    if (data.length === 0) {
      return "array (empty)";
    }
    // Otherwise, assume all elements have the same schema as the first one.
    // Recursively call this function on the first element.
    return [inferSchemaFromData(data[0])];
  }

  // --- CHANGE 3: Handle objects ---
  const schema = {};
  // Loop through each key in the object
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      // Recursively call this function for each value to handle nesting.
      schema[key] = inferSchemaFromData(value);
    }
  }
  return schema;
};

/** Helper function to count words for feedback text validation. */
const countFeedbackWords = (str) => {
  if (!str || typeof str !== "string" || str.trim() === "") {
    return 0;
  }
  return str.trim().split(/\s+/).length;
};

module.exports = {
  shuffleArray,
  isSameUTCDate,
  isYesterdayUTC,
  inferSchemaFromData,
  countFeedbackWords,
};

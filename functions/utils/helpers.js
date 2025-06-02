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

/** Helper function to infer basic schema from a Firestore document data object. */
function inferSchemaFromData(data) {
  if (!data || typeof data !== "object") return null;
  const schema = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];
      const type = typeof value;

      if (value === null) {
        schema[key] = "null";
      } else if (type === "object") {
        if (value instanceof admin.firestore.Timestamp) {
          schema[key] = "Timestamp";
        } else if (value instanceof admin.firestore.GeoPoint) {
          schema[key] = "GeoPoint";
        } else if (value instanceof admin.firestore.DocumentReference) {
          schema[key] = "Reference";
        } else if (Array.isArray(value)) {
          schema[key] = "array";
        } else {
          schema[key] = "object";
        }
      } else {
        schema[key] = type;
      }
    }
  }
  return schema;
}

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

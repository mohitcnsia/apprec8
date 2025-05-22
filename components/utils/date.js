// src/components/utils/date.js

/**
 * Formats a date object to YYYY-MM-DD string using UTC.
 * @param {Date} date - The date object to format.
 * @returns {string} The formatted date string (e.g., "2023-10-26").
 * @caution This uses UTC date. For local date YYYY-MM-DD, other methods are preferred.
 */
export function getFormattedDate(date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Returns a new Date object that is a specified number of days before the given date.
 * @param {Date} date - The original date.
 * @param {number} days - The number of days to subtract.
 * @returns {Date} A new Date object representing the date 'days' ago.
 */
export function getDateMinusDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
}

/**
 * Formats a Date object into a long-form string (e.g., "October 26, 2023").
 * @param {Date} date - The date object to format.
 * @returns {string} The formatted date string.
 */
export const formatDate = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    return "Invalid Date"; // Or handle as appropriate
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Compares two version strings (e.g., "1.2.3" vs "1.2.4").
 * @param {string} currentVersion The version of the running app.
 * @param {string} minimumVersion The minimum required version from Remote Config.
 * @returns {boolean} True if an update is required (current < minimum), false otherwise.
 */
export const isUpdateRequired = (currentVersion, minimumVersion) => {
  // Ensure we have valid strings to compare
  if (!currentVersion || !minimumVersion) {
    return false;
  }

  // Split versions into parts and convert to numbers
  const currentParts = currentVersion.split(".").map(Number);
  const minimumParts = minimumVersion.split(".").map(Number);

  const maxLength = Math.max(currentParts.length, minimumParts.length);

  for (let i = 0; i < maxLength; i++) {
    const current = currentParts[i] || 0;
    const minimum = minimumParts[i] || 0;

    // If a part of the current version is lower, an update is required
    if (current < minimum) {
      return true;
    }
    // If a part of the current version is higher, no update is needed
    if (current > minimum) {
      return false;
    }
    // If the parts are equal, continue to the next part
  }

  // If all parts are identical, no update is needed
  return false;
};

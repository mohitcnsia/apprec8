// utils/courseVisibility.js
// Course / tile visibility and ordering rules (G81).
// Pure, testable helpers.

export const ADMIN_UID = "ThOziLzf1INR9K9hxZQxOMgjcJD3";

/**
 * Checks if a tile, quest, or bundled quest module is visible to a user.
 * - Items without `forClassIds` (or empty) are public and visible to everyone.
 * - Items with `forClassIds` are restricted: visible only to:
 *   1. Admins / owners (isAdmin flag, userDoc.isAdmin, or matching admin UID).
 *   2. Students enrolled in any of those classes (userDoc.classIds).
 *   3. Teachers who teach any of those classes (userDoc.teachesClassIds).
 * Everyone else never sees it (Home, Progress, parent week).
 */
export function isTileVisible(tileOrQuest, userDoc, { isAdmin = false, adminUid = ADMIN_UID } = {}) {
  if (!tileOrQuest) return false;
  const forClassIds =
    tileOrQuest.forClassIds ||
    tileOrQuest.quest?.forClassIds ||
    tileOrQuest.tile?.forClassIds;

  if (!Array.isArray(forClassIds) || forClassIds.length === 0) return true;

  // Admin / Owner override
  if (isAdmin) return true;
  if (userDoc?.isAdmin) return true;
  const uid = userDoc?.uid || userDoc?.userId || null;
  if (adminUid && uid && uid === adminUid) return true;

  // Check student classes
  const studentClasses = Array.isArray(userDoc?.classIds) ? userDoc.classIds : [];
  if (forClassIds.some((cid) => studentClasses.includes(cid))) return true;

  // Check teacher classes
  const teacherClasses = Array.isArray(userDoc?.teachesClassIds) ? userDoc.teachesClassIds : [];
  if (forClassIds.some((cid) => teacherClasses.includes(cid))) return true;

  return false;
}

/**
 * Filters an array of tiles or quests to only those visible to the user.
 */
export function filterVisibleTiles(tilesOrQuests = [], userDoc, options = {}) {
  return (tilesOrQuests || []).filter((item) => isTileVisible(item, userDoc, options));
}

/**
 * Checks if a tile/quest is a course tile specifically for the student's class.
 */
export function isEnrolledCourse(tileOrQuest, userDoc) {
  if (!tileOrQuest) return false;
  const forClassIds =
    tileOrQuest.forClassIds ||
    tileOrQuest.quest?.forClassIds ||
    tileOrQuest.tile?.forClassIds;

  if (!Array.isArray(forClassIds) || forClassIds.length === 0) return false;

  const studentClasses = Array.isArray(userDoc?.classIds) ? userDoc.classIds : [];
  return forClassIds.some((cid) => studentClasses.includes(cid));
}

/**
 * Orders tiles/quests for the Home screen:
 * - If the student is enrolled in a class course, that course tile comes FIRST.
 * - All other tiles follow in their original relative order.
 */
export function orderQuestsForHome(tilesOrQuests = [], userDoc) {
  if (!tilesOrQuests || tilesOrQuests.length <= 1) return tilesOrQuests || [];
  const enrolled = [];
  const others = [];
  for (const item of tilesOrQuests) {
    if (isEnrolledCourse(item, userDoc)) {
      enrolled.push(item);
    } else {
      others.push(item);
    }
  }
  return [...enrolled, ...others];
}

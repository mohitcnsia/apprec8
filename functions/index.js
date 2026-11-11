// Import functions from their new locations
const authTriggers = require("./triggers/auth");
const reportTriggers = require("./triggers/reports");
const { onQuestProgressForClass } = require("./triggers/classSummary");
const quizActionsCallable = require("./callable/quizActions");
const userActionsCallable = require("./callable/userActions");
const schoolActionsCallable = require("./callable/schoolActions");
const familyActionsCallable = require("./callable/familyActions");
const demoActionsCallable = require("./callable/demoActions");
const pushActionsCallable = require("./callable/pushActions");
const joinActionsCallable = require("./callable/joinActions");
const moodActionsCallable = require("./callable/moodActions");
const { sendSticker } = require("./callable/stickerActions");
const { ownerWeekly } = require("./callable/ownerActions");

// Export all functions for Firebase to discover
// 2026-11-09 (DR-23): the old HTTP content endpoints in functions/api/ are no longer exported: they had no auth
// check (deleteAllDocuments could wipe any collection). The files stay for reference until the G60 cleanup.
module.exports = {
  ...authTriggers,
  ...reportTriggers,
  onQuestProgressForClass,
  ...quizActionsCallable,
  ...userActionsCallable,
  ...schoolActionsCallable,
  ...familyActionsCallable,
  ...demoActionsCallable,
  ...pushActionsCallable,
  ...joinActionsCallable,
  ...moodActionsCallable,
  sendSticker,
  ownerWeekly,
};

// Import functions from their new locations
const authTriggers = require("./triggers/auth");
const reportTriggers = require("./triggers/reports");
const crudOperationsApi = require("./api/crudOperations");
const bulkOperationsApi = require("./api/bulkOperations");
const utilityApi = require("./api/utility");
const quizActionsCallable = require("./callable/quizActions");
const userActionsCallable = require("./callable/userActions");
const schoolActionsCallable = require("./callable/schoolActions");
const familyActionsCallable = require("./callable/familyActions");
const demoActionsCallable = require("./callable/demoActions");
const wordInspectorBulkOperations = require("./api/wordInspectorBulkOperations");
const gameManagementApi = require("./api/gameManagement");

// Export all functions for Firebase to discover
module.exports = {
  ...authTriggers,
  ...reportTriggers,
  ...crudOperationsApi,
  ...bulkOperationsApi,
  ...utilityApi,
  ...quizActionsCallable,
  ...userActionsCallable,
  ...schoolActionsCallable,
  ...familyActionsCallable,
  ...demoActionsCallable,
  ...wordInspectorBulkOperations,
  ...gameManagementApi,
};

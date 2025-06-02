// Import functions from their new locations
const authTriggers = require("./triggers/auth");
const crudOperationsApi = require("./api/crudOperations");
const bulkOperationsApi = require("./api/bulkOperations");
const utilityApi = require("./api/utility");
const quizActionsCallable = require("./callable/quizActions");
const userActionsCallable = require("./callable/userActions");

// Export all functions for Firebase to discover
module.exports = {
  ...authTriggers,
  ...crudOperationsApi,
  ...bulkOperationsApi,
  ...utilityApi,
  ...quizActionsCallable,
  ...userActionsCallable,
};

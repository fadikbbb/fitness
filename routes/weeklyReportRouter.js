const express = require("express");
const weeklyReportController = require("../controllers/weeklyReportController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const { query } = require("../middlewares/query");
const weeklyReportValidationMiddleware = require("../middlewares/validation/weeklyReportValidation");
const router = express.Router();

router.get("/",
  query(),
  authenticate,
  authorize("admin"),
  weeklyReportController.getAllReports);

router.get(
  "/:userId",
  authenticate,
  authorize("admin"),
  weeklyReportController.getUserReports
);

router.post(
  "/:userId",
  weeklyReportValidationMiddleware,
  authenticate,
  weeklyReportController.createReport
);

module.exports = router;

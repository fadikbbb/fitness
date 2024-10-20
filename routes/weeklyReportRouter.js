const express = require("express");
const weeklyReportController = require("../controllers/weeklyReportController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const { query } = require("../middlewares/query");

const router = express.Router();

router.get("/", authenticate, query(), weeklyReportController.getWeeklyReports);

router.get(
  "/:userId",
  authenticate,
  authorize("admin", "premium"),
  weeklyReportController.getWeeklyReportsByUser
);

router.post(
  "/:userId",
  authenticate,
  authorize("premium"),
  weeklyReportController.createWeeklyReport
);

module.exports = router;

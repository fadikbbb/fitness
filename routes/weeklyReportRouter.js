const express = require("express");
const weeklyReportController = require("../controllers/weeklyReportController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const { query } = require("../middlewares/query");
const userValidation = require("../middlewares/validation/userValidation")
router.get('/', query(), weeklyReportController.getWeeklyReports);
router.get('/:userId', weeklyReportController.getWeeklyReportsByUser);
router.post('/:userId', authorize("admin"), userValidation.userValidationMiddleware, weeklyReportController.createWeeklyReport);
module.exports = router;
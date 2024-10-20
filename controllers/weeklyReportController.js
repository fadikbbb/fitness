const moment = require("moment");
const weeklyReportService = require("../services/weeklyReportService");

exports.getWeeklyReports = async (req, res) => {
  try {
    const reports = await weeklyReportService.getAllReports(req.query);
    res.status(200).json(reports);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching weekly reports", error: error.message });
  }
};

// Get weekly reports for a specific user
exports.getWeeklyReportsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const reports = await weeklyReportService.getReportsByUser(userId);
    if (!reports) {
      return res
        .status(404)
        .json({ message: "No reports found for this user" });
    }
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching reports for user",
      error: error.message,
    });
  }
};

exports.createWeeklyReport = async (req, res) => {
  const today = moment().day();

  if (today !== 0) {
    // 0 corresponds to Sunday
    return res.status(400).json({
      message: "Weekly reports can only be submitted on Sundays.",
    });
  }

  // Continue with report creation logic if it's Sunday
  const { userId, week, workoutSummary, caloriesBurned, progressNotes } =
    req.body;

  try {
    const report = await weeklyReportService.createReport(
      userId,
      week,
      workoutSummary,
      caloriesBurned,
      progressNotes
    );

    res.status(201).json({
      message: "Weekly report submitted successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error submitting the weekly report",
      error: error.message,
    });
  }
};

const WeeklyReport = require("../models/WeeklyReportModel");

exports.createReport = async (
  userId,
  week,
  workoutSummary,
  caloriesBurned,
  progressNotes
) => {
  const report = new WeeklyReport({
    userId,
    week,
    workoutSummary,
    caloriesBurned,
    progressNotes,
  });
  return await report.save();
};

exports.getUserReports = async (userId) => {
  return await WeeklyReport.find({ userId }).sort({ createdAt: -1 });
};

exports.getReportByWeek = async (userId, week) => {
  return await WeeklyReport.findOne({ userId, week });
};

const weeklyReportService = require("../services/weeklyReportService");

exports.getAllReports = async (req, res, next) => {
  try {
    const reports = await weeklyReportService.getAllReports(
      req.query.timeFrame
    );
    return res.status(200).json(reports);
  } catch (error) {
    next(error);
  }
};

exports.getUserReports = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const reports = await weeklyReportService.getUserReports(userId);
    return res
      .status(200)
      .json({ message: "Reports fetched successfully", reports });
  } catch (error) {
    next(error);
  }
};

exports.createReport = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const body = req.body;
    const report = await weeklyReportService.createReport(userId, body);
    return res.status(201).json({
      message: "Weekly report submitted successfully",
      report,
    });
  } catch (error) {
    next(error);
  }
};

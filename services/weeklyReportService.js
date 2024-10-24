const WeeklyReport = require("../models/WeeklyReportModel");
const moment = require("moment");
const apiError = require("../utils/apiError");
const User = require("../models/UserModel");

exports.getAllReports = async (timeFrame) => {
  try {
    let startDate, endDate, reports;
    if (timeFrame) {
      switch (timeFrame) {
        case 'lastWeek':
          startDate = moment().subtract(1, 'weeks').startOf('week').toDate();
          endDate = moment().toDate();
          break;
        case 'currentWeek':
          startDate = moment().startOf('week').toDate();
          endDate = moment().toDate();
          break;
        case 'lastMonth':
          startDate = moment().subtract(1, 'months').startOf('month').toDate();
          endDate = moment().toDate();
          break;
        default:
          throw new Error("Invalid timeFrame specified");
      }
      console.log(startDate, endDate)
      reports = await WeeklyReport.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
        .sort({ createdAt: 1 })
        .populate("userId");
    } else {
      reports = await WeeklyReport.find()
        .sort({ createdAt: 1 })
        .populate("userId");
    }
    console.log(reports)
    return reports;
  } catch (error) {
    throw error;
  }
};

exports.getUserReports = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new apiError("User not found", 404);
  }
  const reportsUser = await WeeklyReport.find({ userId }).sort({ createdAt: 1 })
    .populate("userId");
  if (!reportsUser) {
    throw new apiError("Reports not found", 404);
  }
  return reportsUser;
};
exports.createReport = async (userId, data) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new apiError("User not found", 404);
    }

    if (user.subscriptionStatus !== "premium") {
      if (user.role !== "admin") {
        throw new apiError("You are not authorized to create reports", 401);
      }
      throw new apiError("You are not authorized to create reports", 401);
    }
    // const today = moment().day();
    // console.log(today);
    // if (today !== 0) { // 0 corresponds to Sunday
    //   throw new apiError("Reports can only be submitted on Sundays", 400);
    // }

    const startOfWeek = moment().startOf('week').toDate();
    const endOfWeek = moment().endOf('week').toDate();

    const existingReport = await WeeklyReport.findOne({
      userId,
      createdAt: {
        $gte: startOfWeek,
        $lte: endOfWeek,
      },
    });

    if (existingReport) {
      throw new apiError("You have already submitted a report this week", 400);
    }

    if (!data.eatingLevel || !data.exerciseLevel || !data.sleepLevel || !data.weight) {
      throw new apiError("All fields are required", 400);
    }

    const report = new WeeklyReport({
      userId,
      eatingLevel: data.eatingLevel,
      exerciseLevel: data.exerciseLevel,
      sleepLevel: data.sleepLevel,
      weight: data.weight,
      isProblems: data.isProblems,
      problems: data.problems,
    });

    await User.findByIdAndUpdate(userId, {
      weight: data.weight,
    })

    return await report.save();
  } catch (error) {
    throw error;
  }
};


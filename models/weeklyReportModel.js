const mongoose = require("mongoose");

const weeklyReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eatingLevel: {
    type: String,
    required: true,
  },
  exerciseLevel: {
    type: String,
    required: true,
  },
  sleepLevel: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  isProblems: {
    type: Boolean,
    required: true,
  },
  problems: {
    type: String,
    required: false,
  },
 
}
,{timestamps: true});

module.exports = mongoose.model("WeeklyReport", weeklyReportSchema);

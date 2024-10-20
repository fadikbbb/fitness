const mongoose = require("mongoose");

const weeklyReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    report: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const WeeklyReport = mongoose.model("WeeklyReport", weeklyReportSchema);
module.exports = WeeklyReport
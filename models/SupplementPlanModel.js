const mongoose = require("mongoose");

const supplementPlanSchema = new mongoose.Schema(
  {
    supplementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplement",
      required: true,
    },
    type: {
      type: String,
      enum: ["weight", "quantity"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const SupplementPlan = mongoose.model("SupplementPlan", supplementPlanSchema);

module.exports = SupplementPlan;

const mongoose = require("mongoose");

const nutritionPlanSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  meals: [{
    mealName: {
      type: String,
      required: true,
    },
    foods: [{
      foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        required: true,
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"],
      },
    }],
    mealCalories: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  }
  ],
  totalCalories: {
    type: Number,
    min: 0,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model("NutritionPlan", nutritionPlanSchema);

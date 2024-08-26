const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Workout name is required"],
  },
  description: {
    type: String,
    required: [true, "Workout description is required"],
  },
  duration: {
    type: Number,
    required: [true, "Duration is required"],
  },
  intensity: {
    type: String,
    enum: ["low", "medium", "high"],
    required: [true, "Intensity is required"],
  },
  type: {
    type: String,
    enum: ["cardio", "strength", "flexibility", "balance"],
    required: [true, "Type is required"],
  },
  exercises: [
    {
      name: String,
      reps: Number,
      sets: Number,
      duration: Number, // Duration in seconds for each exercise
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;

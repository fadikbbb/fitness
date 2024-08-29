const express = require("express");
const workoutPlanController = require("../controllers/workoutPlanController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const { validateWorkoutPlan } = require("../middleware/validation");
const WorkoutPlan = require("../models/WorkoutPlanModel");
const { query } = require("../middleware/query");
const router = express.Router();

// Apply authentication middleware
router.use(authenticate);

// Admin and premium users can create and manage workout plans
router.post(
  "/",
  authorize("admin"),
  validateWorkoutPlan,
  workoutPlanController.createWorkoutPlan
);
router.put(
  "/:id",
  authorize("admin"),
  validateWorkoutPlan,
  workoutPlanController.updateWorkoutPlan
);
router.delete(
  "/:id",
  authorize("admin"),
  workoutPlanController.deleteWorkoutPlan
);

// All authenticated users can get their workout plans
router.get("/", query(WorkoutPlan), workoutPlanController.getWorkoutPlans);

module.exports = router;

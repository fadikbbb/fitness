const express = require("express");
const workoutPlanController = require("../controllers/workoutPlanController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const { query } = require("../middlewares/query");
const router = express.Router();

router.use(authenticate);

router.get("/", query(), workoutPlanController.getWorkoutPlans);
router.get("/:userId", workoutPlanController.getWorkoutPlanByUser);
router.post("/:userId", authorize("admin"), workoutPlanController.createWorkoutPlan);
router.patch("/:userId/workoutPlan/:id/exercise/:exerciseId", authorize("admin"), workoutPlanController.updateExercise);
router.delete("/:userId/workoutPlan/:id", authorize("admin"), workoutPlanController.deleteWorkoutPlan);
router.delete("/:userId/workoutPlan/:id/day", authorize("admin"), workoutPlanController.deleteDayOfExercise);
router.delete("/:userId/workoutPlan/:id/exercise/:exerciseId", authorize("admin"), workoutPlanController.removeExercise);

module.exports = router;

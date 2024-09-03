const express = require("express");
const router = express.Router();
const nutritionPlanController = require("../controllers/nutritionPlanController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const { query } = require("../middleware/query");
const NutritionPlan = require("../models/NutritionPlanModel");

router.use(authenticate);

// Routes for nutrition plans
router.post(
  "/",
  authorize("admin"),
  nutritionPlanController.createNutritionPlan
);
router.get(
  "/",
  query(NutritionPlan),
  nutritionPlanController.getNutritionPlans
);
router.get("/:id", nutritionPlanController.getNutritionPlanById);
router.put(
  "/:id",
  authorize("admin"),
  nutritionPlanController.updateNutritionPlan
);
router.delete(
  "/:id",
  authorize("admin"),
  nutritionPlanController.deleteNutritionPlan
);

module.exports = router;

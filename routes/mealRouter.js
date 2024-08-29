const express = require("express");
const router = express.Router();
const mealController = require("../controllers/mealController");
const { query } = require("../middleware/query");
const Meal = require("../models/MealModel");
const authenticate = require("../middleware/authenticate");
const { validateMeal } = require("../middleware/validation");

// Apply authentication middleware
router.use(authenticate);

// Routes for meals
router.post("/", validateMeal, mealController.createMeal);
router.get("/", query(Meal), mealController.getMeals);
router.get("/:id", mealController.getMealById);
router.put("/:id", validateMeal, mealController.updateMeal);
router.delete("/:id", mealController.deleteMeal);

module.exports = router;

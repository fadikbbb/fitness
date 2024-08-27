const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');
const { validateMeal } = require('../middleware/validation');

// Routes for meals
router.post('/', validateMeal, mealController.createMeal);
router.get('/', mealController.getMeals);
router.get('/:id', mealController.getMealById);
router.put('/:id', validateMeal, mealController.updateMeal);
router.delete('/:id', mealController.deleteMeal);

module.exports = router;

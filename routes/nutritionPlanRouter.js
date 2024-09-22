const express = require('express');
const router = express.Router();
const nutritionPlanController = require('../controllers/nutritionPlanController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { query } = require('../middlewares/query');

router.use(authenticate);

// Route for creating a new nutrition plan (admin only)
router.post(
  '/:userId',
  authorize('admin'),
  nutritionPlanController.createNutritionPlan
);

// Route for retrieving all nutrition plans with filters, sort, pagination, etc.
router.get(
  '/',
  query(),
  nutritionPlanController.getNutritionPlans
);

// Route for retrieving nutrition plan by user ID
router.get('/:userId', nutritionPlanController.getNutritionPlanByUser);

// Route for retrieving a specific nutrition plan by plan ID
router.get('/:id', nutritionPlanController.getNutritionPlanById);

// Route for updating a nutrition plan (admin only)
router.patch(
  '/:id',
  authorize('admin'),
  nutritionPlanController.updateNutritionPlan
);

// Route for deleting a nutrition plan (admin only)
router.delete(
  '/:id',
  authorize('admin'),
  nutritionPlanController.deleteNutritionPlan
);

// Route for adding food to a nutrition plan
router.delete(
  '/:userId/meals/:mealId/foods/:foodId',
  authorize('admin'),
  nutritionPlanController.removeFoodFromMeal
);

module.exports = router;

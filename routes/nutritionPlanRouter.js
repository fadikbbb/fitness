const express = require('express');
const router = express.Router();
const nutritionPlanController = require('../controllers/nutritionPlanController');
const { validateNutritionPlan } = require('../middleware/validation');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.use(authenticate)
// Routes for nutrition plans
router.post('/', authorize('admin'), validateNutritionPlan, nutritionPlanController.createNutritionPlan);
router.get('/', nutritionPlanController.getNutritionPlans);
router.get('/:id', nutritionPlanController.getNutritionPlanById);
router.put('/:id', authorize('admin'), validateNutritionPlan, nutritionPlanController.updateNutritionPlan);
router.delete('/:id', authorize('admin'), nutritionPlanController.deleteNutritionPlan);

module.exports = router;

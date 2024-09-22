const nutritionPlanService = require('../services/nutritionPlanService');

exports.createNutritionPlan = async (req, res, next) => {
    const { userId } = req.params;
    const meal = req.body; // Expect a single meal object

    console.log(meal);
    try {
        const nutritionPlan = await nutritionPlanService.createNutritionPlan(userId, meal);
        res.status(201).json({ isSuccess: true, message: 'Nutrition plan created successfully', nutritionPlan });
    } catch (error) {
        next(error);
    }
};


// Get all nutrition plans
exports.getNutritionPlans = async (req, res, next) => {
    try {
        const { filter, sortBy, fields, page, limit } = req.query;
        const nutritionPlans = await nutritionPlanService.getNutritionPlans(filter, sortBy, fields, page, limit);
        res.status(200).json({ isSuccess: true, message: 'Nutrition plans retrieved successfully', nutritionPlans });
    } catch (error) {
        next(error);
    }
};

// Get nutrition plan by user ID
exports.getNutritionPlanByUser = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const nutritionPlan = await nutritionPlanService.getNutritionPlanByUser(userId);
        res.status(200).json({ isSuccess: true, message: 'Nutrition plan retrieved successfully', nutritionPlan });
    } catch (error) {
        next(error);
    }
};

// Get a specific nutrition plan by ID
exports.getNutritionPlanById = async (req, res, next) => {
    try {
        const nutritionPlan = await nutritionPlanService.getNutritionPlanById(req.params.id);
        res.status(200).json({ isSuccess: true, message: 'Nutrition plan retrieved successfully', nutritionPlan });
    } catch (error) {
        next(error);
    }
};

// Update a nutrition plan
exports.updateNutritionPlan = async (req, res, next) => {
    const { meals, totalCalories, startDate, endDate } = req.body;
    try {
        const nutritionPlan = await nutritionPlanService.updateNutritionPlan(req.params.id, { meals, totalCalories, startDate, endDate });
        res.status(200).json({ isSuccess: true, message: 'Nutrition plan updated successfully', nutritionPlan });
    } catch (error) {
        next(error);
    }
};

// Delete a nutrition plan
exports.deleteNutritionPlan = async (req, res, next) => {
    try {
        await nutritionPlanService.deleteNutritionPlan(req.params.id);
        res.status(204).json({ isSuccess: true, message: 'Nutrition plan deleted successfully' });
    } catch (error) {
        next(error);
    }
};
exports.removeFoodFromMeal = async (req, res) => {
    const { userId, foodId, mealId } = req.params;
    console.log(userId, foodId, mealId);

    try {
        await nutritionPlanService.removeFoodFromMeal(userId, foodId, mealId);
        res.status(200).json({ isSuccess: true, message: 'Food deleted successfully' });
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Failed to delete food', error: error.message });
    }
};

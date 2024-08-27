const NutritionPlan = require('../models/NutritionPlanModel');
const Meal = require('../models/MealModel');
const Food = require('../models/FoodModel');

// Create a new nutrition plan
exports.createNutritionPlan = async (req, res) => {
    try {
        const { userId, meals, totalCalories, startDate, endDate } = req.body;

        // Validate meals
        if (meals.length > 0) {
            const validMeals = await Meal.find({ _id: { $in: meals } });
            if (validMeals.length !== meals.length) {
                return res.status(400).json({ error: 'One or more meals are invalid' });
            }
        }

        const nutritionPlan = await NutritionPlan.create({
            userId,
            meals,
            totalCalories,
            startDate,
            endDate,
        });
        res.status(201).json(nutritionPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all nutrition plans

exports.getNutritionPlans = async (req, res) => {
    try {
        res.status(200).json({ message: 'Nutrition plans retrieved successfully', nutritionPlans: res.queryResults });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single nutrition plan

exports.getNutritionPlanById = async (req, res) => {
    try {
        const nutritionPlan = await NutritionPlan.findById(req.params.id).populate('meals');
        if (!nutritionPlan) {
            return res.status(404).json({ error: 'Nutrition plan not found' });
        }
        res.status(200).json(nutritionPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a nutrition plan

exports.updateNutritionPlan = async (req, res) => {
    try {
        const { meals, totalCalories, startDate, endDate } = req.body;

        if (meals.length > 0) {
            const validMeals = await Meal.find({ _id: { $in: meals } });
            if (validMeals.length !== meals.length) {
                return res.status(400).json({ error: 'One or more meals are invalid' });
            }
        }

        const nutritionPlan = await NutritionPlan.findByIdAndUpdate(
            req.params.id,
            { meals, totalCalories, startDate, endDate },
            { new: true, runValidators: true }
        ).populate('meals');

        if (!nutritionPlan) {
            return res.status(404).json({ error: 'Nutrition plan not found' });
        }

        res.status(200).json(nutritionPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a nutrition plan
exports.deleteNutritionPlan = async (req, res) => {
    try {
        const nutritionPlan = await NutritionPlan.findByIdAndDelete(req.params.id);
        if (!nutritionPlan) {
            return res.status(404).json({ error: 'Nutrition plan not found' });
        }
        res.status(204).json({ message: 'Nutrition plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


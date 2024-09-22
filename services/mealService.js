const Meal = require('../models/MealModel');
const Food = require('../models/FoodModel');
const apiError = require('../utils/apiError');

// Create a new meal
exports.createMeal = async ({ mealType, foods }) => {
    try {
        // Validate foods
        if (foods.length > 0) {
            const validFoods = await Food.find({ _id: { $in: foods } });
            if (validFoods.length !== foods.length) {
                throw new apiError('One or more food items are invalid', 400);
            }
        }

        const meal = await Meal.create({ mealType, foods });
        return meal;
    } catch (error) {
        throw error;
    }
};

// Get all meals
exports.getMeals = async (filter, sortBy, fields, page, limit) => {
    try {
        let query = Meal.find(filter).populate('foods');

        if (fields) {
            const fieldsList = fields.split(',').join(' ');
            query = query.select(fieldsList);
        }

        if (sortBy) {
            query = query.sort(sortBy);
        }

        const meals = await query.skip((page - 1) * limit).limit(limit);
        return meals;
    } catch (error) {
        throw error;
    }
};
exports.getMealById = async (id) => {
    try {
        const meal = await Meal.findById(id).populate('foods');
        if (!meal) {
            throw new apiError('Meal not found', 404);
        }
        return meal;
    } catch (error) {
        throw error;
    }
};
exports.updateMeal = async (id, { mealType, foods }) => {
    try {
        if (foods.length > 0) {
            const validFoods = await Food.find({ _id: { $in: foods } });
            if (validFoods.length !== foods.length) {
                throw new apiError('One or more food items are invalid', 400);
            }
        }
        const meal = await Meal.findByIdAndUpdate(
            id,
            { mealType, foods },
            { new: true, runValidators: true }
        ).populate('foods');
        if (!meal) {
            throw new apiError('Meal not found', 404);
        }
        return meal;
    } catch (error) {
        throw error;
    }
};
exports.deleteMeal = async (id) => {
    try {
        const meal = await Meal.findByIdAndDelete(id);
        if (!meal) {
            throw new apiError('Meal not found', 404);
        }
        return meal;
    } catch (error) {
        throw error;
    }
};
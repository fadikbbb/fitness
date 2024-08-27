const Meal = require('../models/MealModel');
const Food = require('../models/FoodModel'); // Assuming you have a Food model

// Create a new meal
exports.createMeal = async (req, res) => {
    try {
        const { mealType, foods } = req.body;

        // Validate foods
        if (foods.length > 0) {
            const validFoods = await Food.find({ _id: { $in: foods } });
            if (validFoods.length !== foods.length) {
                return res.status(400).json({ error: 'One or more food items are invalid' });
            }
        }

        const meal = await Meal.create({ mealType, foods });
        res.status(201).json(meal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all meals
exports.getMeals = async (req, res) => {
    try {
        res.status(200).json({ message: 'Meals retrieved successfully', meals: res.queryResults });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single meal
exports.getMealById = async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id).populate('foods');
        if (!meal) {
            return res.status(404).json({ error: 'Meal not found' });
        }
        res.status(200).json(meal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a meal
exports.updateMeal = async (req, res) => {
    try {
        const { mealType, foods } = req.body;

        if (foods.length > 0) {
            const validFoods = await Food.find({ _id: { $in: foods } });
            if (validFoods.length !== foods.length) {
                return res.status(400).json({ error: 'One or more food items are invalid' });
            }
        }

        const meal = await Meal.findByIdAndUpdate(
            req.params.id,
            { mealType, foods },
            { new: true, runValidators: true }
        ).populate('foods');

        if (!meal) {
            return res.status(404).json({ error: 'Meal not found' });
        }

        res.status(200).json(meal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a meal
exports.deleteMeal = async (req, res) => {
    try {
        const meal = await Meal.findByIdAndDelete(req.params.id);
        if (!meal) {
            return res.status(404).json({ error: 'Meal not found' });
        }
        res.status(204).json({ message: 'Meal deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



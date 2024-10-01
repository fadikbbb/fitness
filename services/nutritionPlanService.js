const mongoose = require('mongoose');
const NutritionPlan = require('../models/NutritionPlanModel');
const Food = require('../models/FoodModel');
const User = require('../models/UserModel');
const apiError = require('../utils/apiError');

exports.createNutritionPlan = async (userId, meal) => {
    try {
        // Fetch user
        const user = await User.findById(userId);
        if (!user || user.subscriptionStatus !== 'premium') {
            throw new apiError('User not found or not premium', 404);
        }

        // Validate meal data
        if (!meal || !meal.foods || meal.foods.length === 0) {
            throw new apiError('Meal data not provided or empty', 400);
        }

        // Check if nutrition plan already exists for the user
        let nutritionPlan = await NutritionPlan.findOne({ userId });

        if (!nutritionPlan) {
            // Create a new nutrition plan if it doesn't exist
            nutritionPlan = await NutritionPlan.create({ userId, meals: [], totalCalories: 0 });
        }

        // Initialize mealCalories to 0 if not set
        meal.mealCalories = meal.mealCalories || 0;

        // Calculate mealCalories for the new or updated foods
        const calculatedCalories = await Promise.all(
            meal.foods.map(async (food) => {
                const fd = await Food.findById(food.foodId);
                if (fd && fd.calories && fd.weight) {
                    const calories = (Number(fd.calories) * Number(food.quantity)) / Number(fd.weight);
                    return isNaN(calories) ? 0 : calories;  // Handle NaN cases
                }
                console.log(`Food with ID ${food.foodId} not found or has invalid data.`);
                return 0;
            })
        );

        // Sum the calories for the meal
        meal.mealCalories += calculatedCalories.reduce((acc, curr) => acc + curr, 0);

        // Log if the mealCalories is 0
        if (meal.mealCalories === 0) {
            console.log(`Meal ${meal.mealName} has 0 calories calculated.`);
        }

        // Check if the meal already exists in the nutrition plan
        const existingMealIndex = nutritionPlan.meals.findIndex(m => m.mealName === meal.mealName);
        if (existingMealIndex > -1) {
            // If the meal exists, update it
            const existingMeal = nutritionPlan.meals[existingMealIndex];

            meal.foods.forEach(newFood => {
                const existingFoodIndex = existingMeal.foods.findIndex(food => food.foodId.equals(newFood.foodId));
                if (existingFoodIndex > -1) {
                    // If the food already exists, sum the quantities
                    existingMeal.foods[existingFoodIndex].quantity += Number(newFood.quantity);
                } else {
                    // If the food doesn't exist, add it to the meal
                    existingMeal.foods.push({
                        foodId: newFood.foodId,
                        quantity: Number(newFood.quantity)
                    });
                }
            });
            existingMeal.mealCalories += meal.mealCalories;
        } else {
            // Otherwise, create a new meal entry
            nutritionPlan.meals.push({
                mealName: meal.mealName,
                foods: meal.foods.map(food => ({
                    foodId: food.foodId,
                    quantity: Number(food.quantity)
                })),
                mealCalories: Number(meal.mealCalories)
            });
        }

        // Update total calories for the nutrition plan
        nutritionPlan.totalCalories = nutritionPlan.meals.reduce((acc, meal) => acc + meal.mealCalories, 0);

        // Ensure totalCalories is a valid number
        if (isNaN(nutritionPlan.totalCalories)) {
            throw new apiError('Error calculating total calories', 500);
        }

        await nutritionPlan.save();
        return nutritionPlan;
    } catch (error) {
        throw error;
    }
};


// Get all nutrition plans with filters and pagination
exports.getNutritionPlans = async (filter, search, sortBy, fields, page, limit) => {
    try {
        const skip = Math.max(0, (page - 1) * limit);

        let nutritionPlanQuery = NutritionPlan.find(filter)

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            nutritionPlanQuery = nutritionPlanQuery.where({
                $or: [
                    { 'meals.mealName': { $regex: searchRegex } },
                ]
            });
        }

        if (sortBy) {
            const sortByFields = sortBy.split(',').join(' ');
            nutritionPlanQuery = nutritionPlanQuery.sort(sortByFields);
        }

        if (typeof fields === 'string') {
            const selectedFields = fields.split(',').join(' ');
            nutritionPlanQuery = nutritionPlanQuery.select(selectedFields);
        }

        nutritionPlanQuery = nutritionPlanQuery.skip(skip).limit(limit);

        const [nutritionPlans, totalNutritionPlans] = await Promise.all([
            nutritionPlanQuery.exec(),
            NutritionPlan.countDocuments(filter)
        ]);

        return { totalNutritionPlans, nutritionPlans };
    } catch (error) {
        throw error;
    }
};

// Get a specific nutrition plan by user ID
exports.getNutritionPlanByUser = async (userId) => {
    try {
        const nutritionPlan = await NutritionPlan.findOne({ userId }).populate('meals.foods.foodId').populate('userId');
        if (!nutritionPlan) {
            throw new apiError('Nutrition plan not found', 404);
        }
        return nutritionPlan;
    } catch (error) {
        throw error;
    }
};

// Delete a nutrition plan
exports.deleteNutritionPlan = async (planId) => {
    try {
        const nutritionPlan = await NutritionPlan.findByIdAndDelete(planId);
        if (!nutritionPlan) {
            throw new apiError('Nutrition plan not found', 404);
        }
        return nutritionPlan;
    } catch (error) {
        throw error;
    }
};
exports.updateMeal = async (userId, planId, mealId, mealName) => {
    console.log(mealName);
    try {
        // Validate user and plan
        const nutritionPlan = await NutritionPlan.findOne({ userId, _id: planId });
        if (!nutritionPlan) {
            throw new apiError('Nutrition plan not found', 404);
        }
        // Find the specific meal
        const meal = nutritionPlan.meals.find(m => m._id.toString() === mealId);
        if (!meal) {
            throw new apiError('Meal not found in the nutrition plan', 404);
        }
        // Update the meal name
        meal.mealName = mealName;
        // Save the updated nutrition plan
        await nutritionPlan.save();
        return nutritionPlan;
    } catch (error) {
        throw error;
    }
};
exports.removeMeal = async (userId, planId, mealId) => {
    try {
        // Validate inputs
        if (!userId || !planId || !mealId) {
            throw new apiError('Invalid input parameters', 400);
        }

        // Find the nutrition plan
        const nutritionPlan = await NutritionPlan.findOne({ userId, _id: planId });

        if (!nutritionPlan) {
            throw new apiError('Nutrition plan not found', 404);
        }
        // Check if the meal exists
        const mealIndex = nutritionPlan.meals.findIndex(m => {

            return m._id.toString() === mealId; // Add 'return' here
        });


        if (mealIndex === -1) {
            throw new apiError('Meal not found in the nutrition plan', 404);
        }
        nutritionPlan.meals.splice(mealIndex, 1);
        nutritionPlan.totalCalories = nutritionPlan.meals.reduce((acc, meal) => acc + meal.mealCalories, 0);
        await nutritionPlan.save();
        return nutritionPlan;
    } catch (error) {
        throw error;
    }
};

exports.removeFoodFromMeal = async (userId, foodId, mealId) => {
    try {
        // Fetch the nutrition plan for the user
        const nutritionPlan = await NutritionPlan.findOne({ userId });
        if (!nutritionPlan) {
            throw new apiError('Nutrition plan not found', 404);
        }

        // Loop through meals to find the specified meal
        const meal = nutritionPlan.meals.find(m => m._id.toString() === mealId);
        if (!meal) {
            throw new apiError('Meal not found in the nutrition plan', 404);
        }

        // Log the current foods in the meal for debugging
        console.log('Current foods in the meal:', meal.foods);

        // Find the food index to delete
        const foodIndex = meal.foods.findIndex(f => f.foodId.toString() === foodId);
        if (foodIndex === -1) {
            // Log the foodId being searched for
            console.log(`Food ID searched: ${foodId}`);
            throw new apiError('Food not found in the meal', 404);
        }

        // Food found, remove it
        meal.foods.splice(foodIndex, 1);

        // If the meal is empty after removal, remove it from the nutrition plan
        if (meal.foods.length === 0) {
            console.log(`Meal ${mealId} is empty and will be removed.`);
            const mealIndex = nutritionPlan.meals.findIndex(m => m._id.toString() === mealId);
            if (mealIndex > -1) {
                nutritionPlan.meals.splice(mealIndex, 1);
            }
        } else {
            // Recalculate the mealCalories based on the remaining foods
            meal.mealCalories = await Promise.all(
                meal.foods.map(async (f) => {
                    const food = await Food.findById(f.foodId);
                    if (food && food.calories && food.weight) {
                        return (Number(food.calories) * Number(f.quantity)) / Number(food.weight);
                    }
                    return 0;
                })
            ).then(calories => calories.reduce((acc, curr) => acc + curr, 0));
        }

        // Update totalCalories for the nutrition plan
        nutritionPlan.totalCalories = nutritionPlan.meals.reduce((acc, m) => acc + m.mealCalories, 0);
        await nutritionPlan.save();
        return nutritionPlan;
    } catch (error) {
        throw error;
    }
};

exports.updateFoodQuantity = async (userId, mealId, foodId, quantity) => {
    try {
        const nutritionPlan = await NutritionPlan.findOne({ userId });
        if (!nutritionPlan) {
            throw new apiError('Nutrition plan not found', 404);
        }
        const meal = nutritionPlan.meals.find(m => m._id.toString() === mealId);
        if (!meal) {
            throw new apiError('Meal not found in the nutrition plan', 404);
        }

        const foodIndex = meal.foods.findIndex(f => f.foodId.toString() === foodId);

        if (foodIndex === -1) {
            throw new apiError('Food not found in the meal', 404);
        }

        meal.foods[foodIndex].quantity = quantity;
        meal.mealCalories = await Promise.all(
            meal.foods.map(async (f) => {
                const food = await Food.findById(f.foodId);
                if (food && food.calories && food.weight) {
                    return (Number(food.calories) * Number(f.quantity)) / Number(food.weight);
                }
                return 0;
            })
        ).then(calories => calories.reduce((acc, curr) => acc + curr, 0));
        nutritionPlan.totalCalories = nutritionPlan.meals.reduce((acc, meal) => acc + meal.mealCalories, 0);
        await nutritionPlan.save();

        return nutritionPlan;
    } catch (error) {
        throw error;
    }
};
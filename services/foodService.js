const Food = require('../models/FoodModel');
const NutritionPlan = require("../models/NutritionPlanModel")
const apiError = require('../utils/apiError');
const { uploadToStorage, deleteFile, updateFile } = require('../utils/uploadUtils');

// Service method to create a new food item
exports.createFood = async (body, file) => {
    try {
        // Check if food already exists by name
        const existingFood = await Food.findOne({ name: body.name });
        
        if (existingFood) {
            throw new apiError('Food already exists', 400);
        }

        // If an image file is provided, upload it to Firebase Storage
        if (file) {
            body.image = await uploadToStorage(file.originalname, file.mimetype, file.buffer, 'img');
        }

        // Create the food item in the database
        const food = await Food.create(body);
        if (!food) {
            throw new apiError('Failed to create food', 500);
        }

        return food;
    } catch (error) {
        throw error;
    }
};

// Get all food items
exports.getAllFoods = async (filter, search, sortBy, fields, page, limit) => {
    try {
        let foodQuery = Food.find(filter);
        // Handle search if the 'search' parameter is present
        if (search !== null) {
            const searchRegex = new RegExp(search, 'i');
            foodQuery = foodQuery.find({
                $or: [
                    { name: { $regex: searchRegex } },
                ]
            });
            filter = foodQuery;
        }

        // Sorting
        if (sortBy) {
            const sortByFields = sortBy.split(',').join(' ');
            foodQuery = foodQuery.sort(sortByFields);
        }

        // Field limiting (projection)
        if (typeof fields === 'string') {
            const selectedFields = fields.split(',').join(' ');
            foodQuery = foodQuery.select(selectedFields);
        }

        // Pagination
        const skip = (page - 1) * limit;
        foodQuery = foodQuery.skip(skip).limit(limit);

        // Fetching food and total count
        const [foods, totalFoods] = await Promise.all([
            foodQuery,
            Food.countDocuments(filter)
        ]);

        return { totalFoods, foods };
    } catch (error) {
        throw error;
    }
};

// Get a food item by ID
exports.getFoodById = async (id) => {
    try {
        const food = await Food.findById(id);
        if (!food) {
            throw new apiError('Food not found', 404);
        }
        return food;
    } catch (error) {
        throw error;
    }
};

exports.updateFood = async (id, updates) => {
    try {
        const food = await Food.findById(id);
        if (!food) {
            throw new apiError('Food not found', 404);
        }
        if (updates.calories != food.calories || updates.weight != food.weight) {
            const associatedPlans = await NutritionPlan.find({ 'meals.foods.foodId': id });
            if (associatedPlans.length > 0) {
                throw new apiError('weight and calories cannot be update  because it is associated with one or more nutrition plans', 401);
            }
        }
        if (updates.image) {
            const existingImage = food.image;
            if (existingImage) {
                const newImageUrl = await updateFile(
                    existingImage,
                    updates.image.originalname,
                    updates.image.mimetype,
                    updates.image.buffer,
                    'img'
                );
                updates.image = newImageUrl;
            } else {
                const newImageUrl = await uploadToStorage(
                    updates.image.originalname,
                    updates.image.mimetype,
                    updates.image.buffer,
                    'img'
                );
                updates.image = newImageUrl;
            }
        } else {
            updates.image = food.image;
        }

        const updatedFood = await Food.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedFood) {
            throw new apiError('Failed to update food', 500);
        }

        return updatedFood;
    } catch (error) {
        throw error;
    }
};


exports.deleteFood = async (id) => {
    try {
        const food = await Food.findById(id);
        if (!food) {
            throw new apiError('Food not found', 404);
        }

        // Check if the food is associated with any nutrition plan
        const associatedPlans = await NutritionPlan.find({ 'meals.foods.foodId': id });
        if (associatedPlans.length > 0) {
            throw new apiError('Food cannot be deleted because it is associated with one or more nutrition plans', 401);
        }

        if (food.image) {
            await deleteFile(food.image);
        }

        // Proceed to delete the food from the Food collection
        const deletedFood = await Food.findByIdAndDelete(id);
        return deletedFood;
    } catch (error) {
        throw error;
    }
};


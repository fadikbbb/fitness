const Food = require('../models/FoodModel');
const apiError = require('../utils/apiError');

// Create a new food item
exports.createFood = async (body) => {
    try {
        const existingFood = await Food.findOne({ name: body.name });
        if (existingFood) {
            throw new apiError('Food already exists', 400);
        }
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
    exports.getAllFoods = async (filter, search, sortBy, fields, page = 1, limit = 10) => {
        try {
            // Ensure page and limit are positive integers
            const skip = Math.max(0, (page - 1) * limit); // Ensure skip is non-negative

            let foodQuery = Food.find(filter);

            // Handle search if the 'search' parameter is present
            if (search) {
                const searchRegex = new RegExp(search, 'i');
                foodQuery = foodQuery.where({
                    $or: [
                        { name: { $regex: searchRegex } },
                    ]
                });
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
            foodQuery = foodQuery.skip(skip).limit(limit);

            // Fetching food and total count
            const [foods, totalFoods] = await Promise.all([
                foodQuery.exec(),
                Food.countDocuments(filter)  // Count total food matching the filter
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

// Update a food item
exports.updateFood = async (id, updates) => {
    try {
        const food = await Food.findByIdAndUpdate(id, updates, { new: true });
        if (!food) {
            throw new apiError('Food not found', 404);
        }
        return food;
    } catch (error) {
        throw error;
    }
};

// Delete a food item
exports.deleteFood = async (id) => {
    try {
        const food = await Food.findByIdAndDelete(id);
        if (!food) {
            throw new apiError('Food not found', 404);
        }
        return food;
    } catch (error) {
        throw error;
    }
};

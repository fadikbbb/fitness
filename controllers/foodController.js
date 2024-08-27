const Food = require("../models/FoodModel");

// Create a new food item
exports.createFood = async (req, res) => {
    try {
        const { name, category, calories, protein, carbohydrates, fat, servingSize } = req.body;

        const food = new Food({ name, category, calories, protein, carbohydrates, fat, servingSize });
        await food.save();

        res.status(201).json({ message: "Food item created successfully", food });
    } catch (error) {
        res.status(500).json({ error: "Error creating food item", details: error.message });
    }
};

// Get all food items
exports.getAllFoods = async (req, res) => {
    try {
        res.status(200).json({ message: "Food items retrieved successfully", foods: res.queryResults });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving food items", details: error.message });
    }
};

// Get a food item by ID
exports.getFoodById = async (req, res) => {
    try {
        res.status(200).json({ message: "Food item fetched successfully", food: res.queryResults });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving food item", details: error.message });
    }
};

// Update a food item
exports.updateFood = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Add the updatedAt field manually
        updates.updatedAt = Date.now();

        const food = await Food.findByIdAndUpdate(id, updates, { new: true });
        if (!food) {
            return res.status(404).json({ error: "Food item not found" });
        }
        res.status(200).json({ message: "Food item updated successfully", food });
    } catch (error) {
        res.status(500).json({ error: "Error updating food item", details: error.message });
    }
};

// Delete a food item
exports.deleteFood = async (req, res) => {
    try {
        const { id } = req.params;
        const food = await Food.findByIdAndDelete(id);
        if (!food) {
            return res.status(404).json({ error: "Food item not found" });
        }
        res.status(200).json({ message: "Food item deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting food item", details: error.message });
    }
};

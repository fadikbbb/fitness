const foodService = require("../services/foodService");

// Controller method to create food
exports.createFood = async (req, res, next) => {
    try {
        const body = { ...req.body };
        const imageFile = req.files['image'] ? req.files['image'][0] : null;
        // Call the service to create the food item
        const food = await foodService.createFood(body, imageFile);

        res.status(201).json({
            isSuccess: true,
            message: "Food item created successfully",
            food
        });
    } catch (error) {
        next(error);
    }
};

// Get all food items
exports.getAllFoods = async (req, res, next) => {
    try {
        const { foods, totalFoods } =
            await foodService.getAllFoods(
                req.filter,
                req.search,
                req.sortBy,
                req.fields,
                req.page,
                req.limit
            );
        res.status(200).send({ isSuccess: true, totalFoods: totalFoods, foods: foods });
    } catch (error) {
        next(error);
    }
};

// Get a food item by ID
exports.getFoodById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const food = await foodService.getFoodById(id);
        res.status(200).json({ isSuccess: true, message: "Food item fetched successfully", food: food });
    } catch (error) {
        next(error);
    }
};

exports.updateFood = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
console.log(req.body)
        if (req.files) {
            updates.image = req.files['image'] ? req.files['image'][0] : null;; // Make sure req.file is populated correctly
        }

        // Call the service to update the food item
        const updatedFood = await foodService.updateFood(id, updates);
        if (!updatedFood) {
            return res.status(404).json({ isSuccess: false, message: "Food item not found" });
        }

        res.status(200).json({ isSuccess: true, message: "Food item updated successfully", food: updatedFood });
    } catch (error) {
        next(error);
    }
};


// Controller method to delete a food item
exports.deleteFood = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Call the service to delete the food item
        const food = await foodService.deleteFood(id);

        if (!food) {
            return res.status(404).json({
                isSuccess: false,
                message: "Food item not found"
            });
        }

        res.status(200).json({
            isSuccess: true,
            message: "Food item deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

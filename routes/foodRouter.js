const express = require("express");
const foodController = require("../controllers/foodController");
const authenticate = require("../middleware/authenticate");
const { query } = require("../middleware/query");
const Food = require("../models/FoodModel");
const authorize = require("../middleware/authorize");
const router = express.Router();

// Apply authentication middleware if required
router.use(authenticate);

// Food routes
router.post("/", authorize("admin"), foodController.createFood); // Create a new food item
router.get("/", query(Food), foodController.getAllFoods); // Get all food items
router.get("/:id", foodController.getFoodById); // Get a food item by ID
router.put("/:id", authorize("admin"), foodController.updateFood); // Update a food item
router.delete("/:id", authorize("admin"), foodController.deleteFood); // Delete a food item

module.exports = router;

const express = require("express");
const foodController = require("../controllers/foodController");
const authenticate = require("../middlewares/authenticate");
const { query } = require("../middlewares/query");
const authorize = require("../middlewares/authorize");
const { upload } = require('../utils/uploadUtils');
const { foodValidationMiddleware, foodUpdateValidationMiddleware } = require("../middlewares/validation/foodValidation");
const router = express.Router();

// Apply authentication middleware if required
router.use(authenticate);

// Food routes
router.post("/", authorize("admin"), upload, foodValidationMiddleware, foodController.createFood);
router.get("/", query(), foodController.getAllFoods);
router.get("/:id", foodController.getFoodById);
router.patch("/:id", authorize("admin"), upload, foodUpdateValidationMiddleware, foodController.updateFood);
router.delete("/:id", authorize("admin"), foodController.deleteFood);

module.exports = router;

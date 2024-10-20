const express = require("express");
const foodController = require("../controllers/foodController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const { query } = require("../middlewares/query");
const { upload } = require('../utils/uploadUtils');
const { param } = require("express-validator");
const foodValidationMiddleware = require("../middlewares/validation/foodValidation");
const router = express.Router();

router.use(authenticate);

const validateFoodId = [
    param("id").isMongoId().withMessage("Invalid user ID format"),
];

// Food routes
router.post("/", authorize("admin"), upload, foodValidationMiddleware.foodValidationMiddleware, foodController.createFood);
router.get("/", query(), foodController.getAllFoods);
router.get("/:id", validateFoodId, foodController.getFoodById);
router.patch("/:id", validateFoodId, authorize("admin"), upload, foodValidationMiddleware.foodUpdateValidationMiddleware, foodController.updateFood);
router.delete("/:id", validateFoodId, authorize("admin"), foodController.deleteFood);

module.exports = router;

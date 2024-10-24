const express = require("express");
const foodController = require("../controllers/foodController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const { query } = require("../middlewares/query");
const { upload } = require("../utils/uploadUtils");
const {
  foodValidationMiddleware,
  foodUpdateValidationMiddleware,
} = require("../middlewares/validation/foodValidation");
const { foodIdValidate } = require("../middlewares/validation/idValidation");
const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize("admin"),
  upload,
  foodValidationMiddleware,
  foodController.createFood
);
router.get("/", query(), foodController.getAllFoods);
router.get("/:foodId", foodIdValidate, foodController.getFoodById);
router.patch(
  "/:foodId",
  foodIdValidate,
  authorize("admin"),
  upload,
  foodUpdateValidationMiddleware,
  foodController.updateFood
);
router.delete(
  "/:foodId",
  foodIdValidate,
  authorize("admin"),
  foodController.deleteFood
);

module.exports = router;

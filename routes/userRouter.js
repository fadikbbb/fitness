const express = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const { param } = require("express-validator");
const { query } = require("../middleware/query");
const User = require("../models/UserModel");

const { userValidationMiddleware, passwordValidationMiddleware } = require("../middleware/validation");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Validation middleware for user ID
const validateUserId = [
  param("id").isMongoId().withMessage("Invalid user ID format"),
];

// User management routes with authorization, validation, and ID check
router.post("/",
  authorize("admin"),
  userController.createUser);
router.get("/",
  authorize("admin"),
  query(User),
  userController.getAllUsers);
router.get("/:id",
  validateUserId,
  userController.getUserById
);

router.patch(
  "/update-password",
  authenticate,
  passwordValidationMiddleware,
  userController.updatePassword
);
router.patch(
  "/:id",
  validateUserId,
  // userValidationMiddleware,
  userController.updateUser
);
router.delete(
  "/:id",
  validateUserId,
  userController.deleteUser
);

module.exports = router;

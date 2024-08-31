const express = require("express");
const adminRouter = require("../controllers/adminController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const { validateUser } = require("../middleware/validation");
const { param } = require("express-validator");
const { query } = require("../middleware/query");
const User = require("../models/UserModel");
const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Validation middleware for user ID
const validateUserId = [
  param("id").isMongoId().withMessage("Invalid user ID format"),
];

// User management routes with authorization, validation, and ID check
router.post("/", authorize("admin"), validateUser, adminRouter.createUser);
router.get("/", authorize("admin"), query(User), adminRouter.getAllUsers);
router.get("/:id", authorize("regular","admin"), validateUserId, adminRouter.getUserById);
router.put(
  "/:id",
  authorize("admin"),
  validateUserId,
  validateUser,
  adminRouter.updateUser
);
router.delete(
  "/:id",
  authorize("admin"),
  validateUserId,
  adminRouter.deleteUser
);

module.exports = router;

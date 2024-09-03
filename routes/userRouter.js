const express = require("express");
const adminRouter = require("../controllers/adminController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
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
router.post("/",
  authorize("admin"),
  adminRouter.createUser);
router.get("/",
  authorize("admin"),
  query(User),
  adminRouter.getAllUsers);
router.get("/:id",
  validateUserId,
  adminRouter.getUserById
);

router.patch(
  "/:id",
  validateUserId,
  adminRouter.updateUser
);
router.delete(
  "/:id",
  validateUserId,
  adminRouter.deleteUser
);

module.exports = router;

const express = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const { param } = require("express-validator");
const { query } = require("../middlewares/query");
const { upload } = require("../utils/uploadUtils");
const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Validation middleware for user ID
const validateUserId = [
  param("id").isMongoId().withMessage("Invalid user ID format"),
];

router.post("/",
  upload,
  authorize("admin"), 

  userController.createUser);
router.get("/",
  authorize("admin"),
  query(),
  userController.getAllUsers);

router.get("/:id",
  validateUserId,
  userController.getUserById
);

router.patch(
  "/update-password",

  userController.updatePassword
);
router.patch(
  "/:id",
  upload,
  validateUserId,
  userController.updateUser
);
router.delete(
  "/:id",
  validateUserId,
  userController.deleteUser
);

module.exports = router;

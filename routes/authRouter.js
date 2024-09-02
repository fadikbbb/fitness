const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateUser } = require("../middleware/validation");
const { validatePasswordUpdate } = require("../middleware/validation");
const authenticate = require("../middleware/authenticate");

// User Registration
router.post("/register", validateUser, authController.createUser);

// User Login
router.post("/send-verification-code", authController.sendVerificationCode);

// Verify Login Code
router.post("/login", authController.login);

// User Logout
router.post("/logout", authController.logout);

// Request Password Reset
router.post("/password-reset/request", authController.requestPasswordReset);

// Reset Password
router.post("/password-reset/reset/:token", authController.resetPassword);

// Refresh Token
router.post("/refresh-token", authController.refreshToken);

// Update Password
router.put(
  "/update-password",
  authenticate,
  validatePasswordUpdate,
  authController.updatePassword
);

module.exports = router;

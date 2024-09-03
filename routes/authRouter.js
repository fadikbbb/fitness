const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticate = require("../middleware/authenticate");
const { userValidationMiddleware, passwordValidationMiddleware } = require("../middleware/validation");

// User Registration
router.post("/register", userValidationMiddleware, authController.register);

// User Login
router.post("/login", authController.login);

// User Logout
router.post("/logout", authenticate, authController.logout);

// Verify Login Code
router.post("/verify-code", authController.verifyCode);

// Request Password Reset
router.post("/reset-password/request", authController.requestPasswordReset);

// Reset Password
router.post("/reset-password/reset/:token", passwordValidationMiddleware, authController.resetPassword);

// Refresh Token
router.post("/refresh-token", authenticate, authController.refreshToken);

// Update Password
router.put(
  "/update-password",
  authenticate,
  authController.updatePassword
);

module.exports = router;

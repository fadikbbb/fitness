const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateUser } = require("../middleware/validation");
const { validatePasswordUpdate } = require("../middleware/validation");
const authenticate = require("../middleware/authenticate");

// User Registration
router.post("/register", validateUser, authController.createUser);

// User Login
router.post("/login", authController.login);

// Verify Login Code
router.post("/verify-login-code", authController.verifyLoginCode);

// User Logout
router.post("/logout", authController.logout);

// Request Password Reset
router.post("/password-reset/request", authController.requestPasswordReset);

// Reset Password
router.post("/password-reset/reset/:token", authController.resetPassword);

// Refresh Token
router.post("/refresh-token", authController.refreshToken);

// resend Verification Code
router.post("/resend-code", authController.resendCode);

// Update Password
router.put(
  "/update-password",
  authenticate,
  validatePasswordUpdate,
  authController.updatePassword
);

module.exports = router;

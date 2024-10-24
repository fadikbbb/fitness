const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticate = require("../middlewares/authenticate");
const {
  registerValidationMiddleware,
  passwordValidationMiddleware,
} = require("../middlewares/validation/authValidation");

router.post("/register", registerValidationMiddleware, authController.register);
router.post("/login", authController.login);
router.post("/logout", authenticate, authController.logout);
router.post("/verify-code", authController.verifyCode);
router.post("/reset-password/request", authController.requestPasswordReset);
router.post(
  "/reset-password/reset/:token",
  passwordValidationMiddleware,
  authController.resetPassword
);
router.post("/refresh-token", authController.refreshToken);

module.exports = router;

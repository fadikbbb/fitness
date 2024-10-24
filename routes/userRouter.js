const express = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const { query } = require("../middlewares/query");
const { upload } = require("../utils/uploadUtils");
const {
  userValidationMiddleware,
  updatePasswordValidationMiddleware,
} = require("../middlewares/validation/userValidation");
const { userIdValidate } = require("../middlewares/validation/idValidation");

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize("admin"),
  userValidationMiddleware,
  upload,
  userController.createUser
);
router.get("/", authorize("admin"), query(), userController.getAllUsers);
router.get("/:userId", userIdValidate, userController.getUserById);
router.patch(
  "/update-password",
  updatePasswordValidationMiddleware,
  userController.updatePassword
);
router.patch("/:userId", userIdValidate, upload, userController.updateUser);
router.delete("/:userId", userIdValidate, userController.deleteUser);

module.exports = router;

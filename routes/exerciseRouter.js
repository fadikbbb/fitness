const express = require("express");
const exerciseController = require("../controllers/exerciseController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const {
  exerciseValidationMiddleware,
  exerciseUpdateValidationMiddleware,
} = require("../middlewares/validation/exerciseValidation");
const {
  exerciseIdValidate,
} = require("../middlewares/validation/idValidation");
const { query } = require("../middlewares/query");
const { upload } = require("../utils/uploadUtils");
const router = express.Router();

// Apply authentication middleware
router.use(authenticate);

// Exercise routes
router.post(
  "/",
  authorize("admin"),
  upload,
  exerciseValidationMiddleware,
  exerciseController.createExercise
);
router.get("/", query(), exerciseController.getAllExercises);
router.get(
  "/:exerciseId",
  exerciseIdValidate,
  exerciseController.getExerciseById
);
router.patch(
  "/:exerciseId",
  authorize("admin"),
  exerciseIdValidate,
  exerciseUpdateValidationMiddleware,
  upload,
  exerciseController.updateExercise
);
router.delete(
  "/:exerciseId",
  authorize("admin"),
  exerciseIdValidate,
  exerciseController.deleteExercise
);

module.exports = router;

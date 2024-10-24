const express = require("express");
const supplementController = require("../controllers/supplementController");
const authorize = require("../middlewares/authorize");
const authenticate = require("../middlewares/authenticate");
const { upload } = require("../utils/uploadUtils");
const { query } = require("../middlewares/query");
const {
  supplementValidationMiddleware,
  updateSupplementValidationMiddleware,
  validateSupplementId,
} = require("../middlewares/validation/supplementValidation");

const router = express.Router();

router.use(authenticate);

// Create a new supplement
router.post(
  "/",
  authorize("admin"),
  supplementValidationMiddleware,
  upload,
  supplementController.createSupplement
);

// Get all supplements
router.get(
  "/",
  authorize("admin"),
  query(),
  supplementController.getAllSupplements
);

// Get a supplement by ID
router.get(
  "/:id",
  validateSupplementId,
  supplementController.getSupplementById
);

// Update a supplement
router.put(
  "/:id",
  authorize("admin"),
  validateSupplementId,
  upload,
  updateSupplementValidationMiddleware,
  supplementController.updateSupplement
);

// Delete a supplement
router.delete(
  "/:id",
  authorize("admin"),
  validateSupplementId,
  supplementController.deleteSupplement
);

module.exports = router;

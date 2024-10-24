const express = require("express");
const supplementPlanController = require("../controllers/supplementPlanController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const {
  supplementPlanValidation,
} = require("../middlewares/validation/supplementPlanValidation");

const router = express.Router();

router.use(authenticate); // Ensures all routes are protected

router.post(
  "/",
  authorize("admin"),
  supplementPlanValidation,
  supplementPlanController.createSupplementPlan
);
router.get("/", supplementPlanController.getAllSupplementPlans);
router.get(
  "/:supplementPlanId",
  supplementPlanController.getSupplementPlanById
);
router.patch(
  "/:supplementPlanId",
  authorize("admin"),
  supplementPlanValidation,
  supplementPlanController.updateSupplementPlan
);
router.delete(
  "/:supplementPlanId",
  authorize("admin"),
  supplementPlanController.deleteSupplementPlan
);

module.exports = router;

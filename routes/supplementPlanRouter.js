const express = require("express");
const supplementPlanController = require("../controllers/supplementPlanController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const {
  supplementPlanIdValidate,
} = require("../middlewares/validation/idValidation");

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize("admin"),
  supplementPlanController.createSupplementPlan
);

router.get("/", supplementPlanController.getAllSupplementPlans);
router.get(
  "/:supplementPlanId",
  supplementPlanIdValidate,
  supplementPlanController.getSupplementPlanById
);

router.patch(
  "/:supplementPlanId",
  authorize("admin"),
  supplementPlanIdValidate,
  supplementPlanController.updateSupplementPlan
);

router.delete(
  "/:supplementPlanId",
  authorize("admin"),
  supplementPlanIdValidate,
  supplementPlanController.deleteSupplementPlan
);

module.exports = router;

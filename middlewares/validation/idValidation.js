const { param, validationResult } = require("express-validator");

const userIdValidate = [
  param("userId").isMongoId().withMessage("Invalid user ID format"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  },
];

const commentIdValidate = [
  param("commentId").isMongoId().withMessage("Invalid comment ID format"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  },
];

const foodIdValidate = [
  param("foodId").isMongoId().withMessage("Invalid food ID format"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  },
];
const supplementPlanIdValidate = [
  param("supplementPlanId")
    .isMongoId()
    .withMessage("Invalid supplement plan ID format"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  },
];

const exerciseIdValidate = [
  param("exerciseId").isMongoId().withMessage("Invalid exercise ID format"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  },
];

const validateSupplementId = [
  param("supplementId").isMongoId().withMessage("Invalid supplement ID"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  userIdValidate,
  commentIdValidate,
  foodIdValidate,
  exerciseIdValidate,
  validateSupplementId,
  supplementPlanIdValidate,
};

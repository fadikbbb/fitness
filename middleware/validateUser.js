const { body, validationResult } = require("express-validator");

const validateUser = [
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase letter")
    .matches(/[@$!%*?&]/)
    .withMessage("Password must contain a special character"),
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .trim()
    .escape(),
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .trim()
    .escape(),
  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Invalid gender"),
  body("weight")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Weight must be a positive number"),
  body("height")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Height must be a positive number"),
  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format for date of birth"),
  // Additional validations can be added here
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateUser;

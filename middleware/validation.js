const { check, body, validationResult } = require('express-validator');

// Validation for Nutrition Plan
const validateNutritionPlan = [
  body('userId').isMongoId().withMessage('Invalid user ID'),
  body('meals.*.mealType').isIn(['Breakfast', 'Lunch', 'Dinner', 'Snack']).withMessage('Invalid meal type'),
  body('meals.*.foods').isArray().withMessage('Foods must be an array of food IDs'),
  body('totalCalories').isNumeric().withMessage('Total calories must be a number'),
  body('startDate').isDate().withMessage('Start date must be a valid date'),
  body('endDate').isDate().withMessage('End date must be a valid date'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for Workout Plan
const validateWorkoutPlan = [
  body('userId').isMongoId().withMessage('Invalid user ID'),
  body('days.*.day').isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).withMessage('Invalid day'),
  body('days.*.exercises').isArray().withMessage('Exercises must be an array of exercise IDs'),
  body('totalCaloriesBurned').isNumeric().withMessage('Total calories burned must be a number'),
  body('startDate').isDate().withMessage('Start date must be a valid date'),
  body('endDate').isDate().withMessage('End date must be a valid date'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for a single meal
const validateMeal = [
  body('mealType')
    .isString()
    .withMessage('Meal type must be a string')
    .isIn(['Breakfast', 'Lunch', 'Dinner', 'Snack'])
    .withMessage('Invalid meal type'),

  body('foods')
    .isArray()
    .withMessage('Foods must be an array of food IDs')
    .custom((value) => {
      // Check if all elements in the array are valid MongoDB ObjectIds
      return value.every(id => /^[0-9a-fA-F]{24}$/.test(id));
    })
    .withMessage('Invalid food ID(s)'),

  // Custom validation to ensure that food IDs are valid ObjectId strings
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation for updating password
const validatePasswordUpdate = [
  check('oldPassword').notEmpty().withMessage('Old password is required'),
  check('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*]/)
    .withMessage('Password must contain at least one special character'),
  check('confirmPassword')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('Passwords do not match'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for user registration
const validateUser = [
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain a number')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter')
    .matches(/[@$!%*?&]/)
    .withMessage('Password must contain a special character'),
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .trim()
    .escape(),
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .trim()
    .escape(),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Invalid gender'),
  body('weight')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Weight must be a positive number'),
  body('height')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Height must be a positive number'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format for date of birth'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateUser, validatePasswordUpdate, validateNutritionPlan, validateWorkoutPlan, validateMeal };

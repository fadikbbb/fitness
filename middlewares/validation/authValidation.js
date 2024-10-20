const { body, validationResult } = require("express-validator");

exports.registerValidationMiddleware = [
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .notEmpty()
        .withMessage("Email is required"),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one digit")
        .matches(/[@$!%*?&]/)
        .withMessage("Password must contain at least one special character")
        .notEmpty()
        .withMessage("Password is required"),

    body("firstName")
        .isAlpha()
        .withMessage("First name must contain only letters")
        .notEmpty()
        .withMessage("First name is required"),

    body("lastName")
        .isAlpha()
        .withMessage("Last name must contain only letters")
        .notEmpty()
        .withMessage("Last name is required"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
]

exports.passwordValidationMiddleware = [
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one digit")
        .matches(/[@$!%*?&]/)
        .withMessage("Password must contain at least one special character")
        .notEmpty()
        .withMessage("Password is required"),

    body("confirmPassword")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one digit")
        .matches(/[@$!%*?&]/)
        .withMessage("Password must contain at least one special character")
        .notEmpty()
        .withMessage("Password is required"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
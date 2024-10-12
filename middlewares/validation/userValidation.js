const { body, validationResult } = require("express-validator");

const registerValidationMiddleware = [
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


const passwordValidationMiddleware = [
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

    // Middleware to check validation results
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];


const userValidationMiddleware = [
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

    body("role")
        .optional()
        .isIn(["user", "admin"])
        .withMessage("Role must be either regular, premium, or admin"),

    body("subscriptionStatus")
        .optional()
        .isIn(["free", "premium"])
        .withMessage("Subscription status must be either free or premium"),

    body('image')
        .custom((value, { req }) => {
            const imageFile = req.files['image'] ? req.files['image'][0] : null;

            // Only validate if an imageFile is provided
            if (imageFile) {
                // Check file type for common image formats
                const allowedTypes = [
                    'image/jpeg',
                    'image/jpg',
                    'image/png',
                    'image/gif',
                    'image/bmp',
                    'image/webp',
                ];

                if (!allowedTypes.includes(imageFile.mimetype)) {
                    throw new Error('Only JPG, JPEG, PNG, GIF, and WEBP image formats are allowed.');
                }

                // Check file size (limit to 2MB)
                const maxSize = 2 * 1024 * 1024; // 2MB in bytes
                if (imageFile.size > maxSize) {
                    throw new Error('Image size must be less than 2MB.');
                }
            }
            return true; // Passes validation
        })
    ,

    // Middleware to check validation results
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

module.exports = {
    userValidationMiddleware,
    registerValidationMiddleware,
    passwordValidationMiddleware
}
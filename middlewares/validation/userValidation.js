const { body, validationResult } = require("express-validator");

const updatePasswordValidationMiddleware = [
  body("newPassword")
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

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

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

  body("image").custom((value, { req }) => {
    const imageFile = req.files["image"] ? req.files["image"][0] : null;
    if (imageFile) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/webp",
      ];
      if (!allowedTypes.includes(imageFile.mimetype)) {
        throw new Error(
          "Only JPG, JPEG, PNG, GIF, and WEBP image formats are allowed."
        );
      }
      const maxSize = 2 * 1024 * 1024;
      if (imageFile.size > maxSize) {
        throw new Error("Image size must be less than 2MB.");
      }
    }
    return true;
  }),

  body("weight").custom((value) => {
    if (value <= 0) {
      throw new Error("Weight must be a positive number");
    }
    if (value > 500) {
      throw new Error("Weight must be less than 500");
    }
    return true;
  }),
  body("height").custom((value) => {
    if (value <= 0) {
      throw new Error("Height must be a positive number");
    }
    if (value > 300) {
      throw new Error("Height must be less than 250");
    }
    return true;
  }),
  body("dateOfBirth").custom((value) => {
    if (value) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error("Date of birth must be a valid date");
      }
      const currentDate = new Date();
      const minDate = new Date("1900-01-01");
      const eighteenYearsAgo = new Date(
        currentDate.setFullYear(currentDate.getFullYear() - 5)
      );
      if (date > currentDate || date < minDate || date > eighteenYearsAgo) {
        throw new Error(
          "Date of birth must be in the past and at least 5 years ago"
        );
      }
    }

    return true;
  }),
  body("gender").custom((value) => {
    if (value && value !== "" && value !== null && value !== undefined) {
      if (value !== "male" && value !== "female" && value !== "other") {
        throw new Error('Gender must be "male","female" or "other"');
      }
    }
    return true;
  }),
  body("subscriptionStatus").custom((value) => {
    if (value !== "free" && value !== "premium") {
      throw new Error('Subscription status must be either "free" or "premium"');
    }
    return true;
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  updatePasswordValidationMiddleware,
  userValidationMiddleware,
};

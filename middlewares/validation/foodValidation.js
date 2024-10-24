const { body, validationResult } = require("express-validator");

const foodValidationMiddleware = [
  body("name")
    .trim()
    .notEmpty()
    .custom((value) => {
      if (value === "") {
        throw new Error("Name is required");
      }

      if (typeof value !== "string") {
        throw new Error("Name must be a string");
      }
      return true; // Passes validation
    }),
  body("image").custom((value, { req }) => {
    const imageFile = req.files["image"] ? req.files["image"][0] : null;
    // Check if neither value nor imageFile is provided
    if (!value && !imageFile) {
      throw new Error("An image file must be provided.");
    }
    // Check file type for common image formats
    const allowedTypes = [
      "image/jpeg",
      "image/jpg", // Include 'jpg'
      "image/png",
      "image/gif",
      "image/bmp",
      "image/webp",
      "image/tiff",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(imageFile.mimetype)) {
      throw new Error(
        "Only JPG, JPEG, PNG, GIF, BMP, WEBP, TIFF, and SVG image formats are allowed."
      );
    }

    // Check file size (for example, limit to 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (imageFile.size > maxSize) {
      throw new Error("Image size must be less than 2MB.");
    }

    return true; // Passes validation
  }),

  body("category").custom((value) => {
    if (value === "") {
      throw new Error("Category is required");
    }
    if (
      ![
        "Vegetable",
        "Nuts",
        "Fish",
        "Fruit",
        "Meat",
        "Grain",
        "Dairy",
        "Snack",
      ].includes(value)
    ) {
      throw new Error("Invalid category");
    }
    return true;
  }),

  body("fiber").custom((value) => {
    if (value === "") {
      throw new Error("Fiber is required");
    }
    if (isNaN(value)) {
      throw new Error("fiber must be a number");
    }
    if (isNaN(value) || parseFloat(value) < 0) {
      throw new Error("Fiber should be greater than 0");
    }
    return true;
  }),

  body("calories").custom((value) => {
    if (value === "") {
      throw new Error("Calories are required");
    }
    if (isNaN(value)) {
      throw new Error("Calories must be a number");
    }
    if (isNaN(value) || parseFloat(value) < 0) {
      throw new Error("Calories should be greater than 0");
    }
    return true;
  }),

  body("weight").custom((value) => {
    if (value === "") {
      throw new Error("Weight is required");
    }
    if (isNaN(value)) {
      throw new Error("Weight must be a number");
    }
    if (isNaN(value) || parseFloat(value) < 0) {
      throw new Error("Weight should be greater than 0");
    }
    return true;
  }),

  // Optional fields can remain unchanged
  body("protein").custom((value) => {
    if (value === "") {
      throw new Error("protein is required");
    }
    if (isNaN(value)) {
      throw new Error("protein must be a number");
    }
    if (isNaN(value) || parseFloat(value) < 0) {
      throw new Error("protein should be greater than 0");
    }
    return true;
  }),

  body("carbohydrates").custom((value) => {
    if (value === "") {
      throw new Error("carbohydrates is required");
    }
    if (isNaN(value)) {
      throw new Error("carbohydrates must be a number");
    }
    if (isNaN(value) || parseFloat(value) < 0) {
      throw new Error("carbohydrates should be greater than 0");
    }
    return true;
  }),

  body("fat").custom((value) => {
    if (value === "") {
      throw new Error("fat is required");
    }
    if (isNaN(value)) {
      throw new Error("fat must be a number");
    }
    if (isNaN(value) || parseFloat(value) < 0) {
      throw new Error("fat should be greater than 0");
    }
    return true;
  }),

  // Middleware to check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const foodUpdateValidationMiddleware = [
  body("name").custom((value) => {
    if (value === "") {
      throw new Error("Name cannot be empty");
    }
    if (typeof value !== "string") {
      throw new Error("Name must be a string");
    }
    return true;
  }),
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
        "image/tiff",
        "image/svg+xml",
      ];

      if (!allowedTypes.includes(imageFile.mimetype)) {
        throw new Error(
          "Only JPG, JPEG, PNG, GIF, BMP, WEBP, TIFF, and SVG image formats are allowed."
        );
      }

      const maxSize = 2 * 1024 * 1024;
      if (imageFile.size > maxSize) {
        throw new Error("Image size must be less than 2MB.");
      }
    }

    return true;
  }),

  body("category").custom((value) => {
    if (value === "") {
      throw new Error("Category is required");
    }
    if (
      ![
        "Vegetable",
        "Nuts",
        "Fish",
        "Fruit",
        "Meat",
        "Grain",
        "Dairy",
        "Snack",
      ].includes(value)
    ) {
      throw new Error("Invalid category");
    }
    return true;
  }),

  body("fiber").custom((value) => {
    if (value === "") {
      throw new Error("Fiber is required");
    }
    if (isNaN(value) || parseFloat(value) < 0) {
      throw new Error("Fiber should be greater than 0");
    }
    return true;
  }),

  body("calories").custom((value) => {
    if (value === "") {
      throw new Error("Calories are required");
    }
    if (isNaN(value) || parseFloat(value) < 0) {
      throw new Error("Calories should be greater than 0");
    }
    return true;
  }),

  body("weight").custom((value) => {
    if (value === "") {
      throw new Error("Weight is required");
    }
    if (isNaN(value) || parseFloat(value) < 0) {
      throw new Error("Weight should be greater than 0");
    }
    return true;
  }),

  body("protein").custom((value) => {
    if (value === "") {
      throw new Error("protein is required");
    }
    if (isNaN(value) || parseFloat(value) < 0) {
      throw new Error("protein should be greater than 0");
    }
    return true;
  }),

  body("carbohydrates").custom((value) => {
    if (value === "") {
      throw new Error("carbohydrates is required");
    }
    if (isNaN(value) || parseFloat(value) < 0) {
      throw new Error("carbohydrates should be greater than 0");
    }
    return true;
  }),

  body("fat").custom((value) => {
    if (value === "") {
      throw new Error("fat is required");
    }
    if (isNaN(value) || parseFloat(value) < 0) {
      throw new Error("fat should be greater than 0");
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
  foodValidationMiddleware,
  foodUpdateValidationMiddleware,
};

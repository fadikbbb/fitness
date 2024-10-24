const { body, validationResult, param } = require("express-validator");

const supplementValidationMiddleware = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("image").custom((value, { req }) => {
    const imageFile =
      req.files && req.files["image"] ? req.files["image"][0] : null;
      
    if (!value && !imageFile) {
      throw new Error("An image file must be provided.");
    }

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
  body("weight")
    .notEmpty()
    .withMessage("Weight is required")
    .isFloat({ min: 0 })
    .withMessage("Weight must be a positive number"),
  body("measureUnit")
    .notEmpty()
    .withMessage("Measure unit is required")
    .isIn(["mg", "g", "kg", "lb", "oz", "tbsp", "tsp"])
    .withMessage("Invalid measure unit"),

  // Handle validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const updateSupplementValidationMiddleware = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("image").custom((value, { req }) => {
    const imageFile =
      req.files && req.files["image"] ? req.files["image"][0] : null;

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
  body("weight")
    .notEmpty()
    .withMessage("Weight is required")
    .isFloat({ min: 0 })
    .withMessage("Weight must be a positive number"),
  body("measureUnit")
    .notEmpty()
    .withMessage("Measure unit is required")
    .isIn(["mg", "g", "kg", "lb", "oz", "tbsp", "tsp"])
    .withMessage("Invalid measure unit"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];


module.exports = {
  supplementValidationMiddleware,
  updateSupplementValidationMiddleware,
};

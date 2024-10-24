const { body, validationResult } = require("express-validator");

const exerciseValidationMiddleware = [
  body("name").trim().notEmpty().withMessage("Exercise name is required"),

  body("description").trim().notEmpty().withMessage("Description is required"),

  body("image").custom((value, { req }) => {
    const imageFile = req.files["image"] ? req.files["image"][0] : null;
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
  body("video").custom((value, { req }) => {
    const videoFile = req.files["video"] ? req.files["video"][0] : null;
    if (!value && !videoFile) {
      throw new Error("A video file must be provided.");
    }
    if (videoFile) {
      const allowedTypes = [
        "video/mp4",
        "video/mpeg",
        "video/x-msvideo",
        "video/quicktime",
        "video/webm",
      ];
      if (!allowedTypes.includes(videoFile.mimetype)) {
        throw new Error(
          `Invalid format: ${videoFile.mimetype}. Only MP4, MPEG, AVI, MOV, and WEBM video formats are allowed.`
        );
      }
      const maxSize = 60 * 1024 * 1024;
      if (videoFile.size > maxSize) {
        throw new Error(
          `Video size is ${(videoFile.size / (1024 * 1024)).toFixed(
            2
          )}MB. Must be less than 10MB.`
        );
      }
    }
    return true;
  }),

  body("category")
    .trim()
    .custom((value) => {
      if (value === "") {
        throw new Error("Exercise category is required");
      }
      if (
        ![
          "strength",
          "cardio",
          "flexibility",
          "balance",
          "endurance",
          "team_sports",
          "combat_sports",
          "agility",
          "recreational",
        ].includes(value)
      ) {
        throw new Error("Invalid exercise category");
      }
      return true;
    }),

  body("restDuration").custom((value) => {
    if (value === "") {
      throw new Error("Rest duration is required");
    }
    if (isNaN(value) || parseFloat(value) < 0) {
      throw new Error("Rest duration should be less than 0");
    }
    return true;
  }),

  body("minReps").custom((value, { req }) => {
    if (value === "") {
      throw new Error("min reps is required");
    }
    if (isNaN(value) || parseFloat(value) <= 0) {
      throw new Error("min reps should be greater than 0");
    }
    if (isNaN(value) || req.body.maxReps < parseFloat(value)) {
      throw new Error("min reps should be less than max reps");
    }
    if (isNaN(value) || parseFloat(value) >= 200) {
      throw new Error("min reps should be less than 200");
    }
    return true;
  }),

  body("maxReps").custom((value) => {
    if (value === "") {
      throw new Error("max reps is required");
    }
    if (isNaN(value) || parseFloat(value) <= 0) {
      throw new Error("max reps should be greater than 0");
    }
    if (isNaN(value) || parseFloat(value) >= 200) {
      throw new Error("max reps should be less than 200");
    }
    return true;
  }),

  body("sets").custom((value) => {
    if (value === "") {
      throw new Error("Sets is required");
    }
    if (isNaN(value) || parseFloat(value) <= 0) {
      throw new Error("Rest duration should be greater than 0");
    }
    if (isNaN(value) || parseFloat(value) >= 20) {
      throw new Error("sets should be less than 21");
    }
    return true;
  }),

  body("intensity")
    .trim()
    .custom((value) => {
      if (value === "") {
        throw new Error("Intensity level is required");
      }
      if (!["low", "medium", "high"].includes(value)) {
        throw new Error("Invalid intensity level");
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

const exerciseUpdateValidationMiddleware = [
  body("name").trim().notEmpty().withMessage("Exercise name is required"),

  body("description").trim().notEmpty().withMessage("Description is required"),
  body("image").custom((value, { req }) => {
    const imageFile = req.files["image"] ? req.files["image"][0] : null;

    // Only validate if an imageFile is provided
    if (imageFile) {
      // Check file type for common image formats
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

      // Check file size (limit to 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (imageFile.size > maxSize) {
        throw new Error("Image size must be less than 2MB.");
      }
    }

    return true; // Passes validation
  }),

  body("video").custom((value, { req }) => {
    const videoFile = req.files["video"] ? req.files["video"][0] : null;

    // Only validate if a videoFile is provided
    if (videoFile) {
      // Check file type for common video formats
      const allowedTypes = [
        "video/mp4",
        "video/mpeg",
        "video/x-msvideo", // MIME type for AVI
        "video/quicktime", // MIME type for MOV
        "video/webm",
      ];

      if (!allowedTypes.includes(videoFile.mimetype)) {
        throw new Error(
          `Invalid format: ${videoFile.mimetype}. Only MP4, MPEG, AVI, MOV, and WEBM video formats are allowed.`
        );
      }

      // Check file size (limit to 60MB)
      const maxSize = 60 * 1024 * 1024; // 60MB
      if (videoFile.size > maxSize) {
        throw new Error(
          `Video size is ${(videoFile.size / (1024 * 1024)).toFixed(
            2
          )}MB. Must be less than 60MB.`
        );
      }
    }

    return true; // Passes validation
  }),

  body("category")
    .trim()
    .custom((value) => {
      if (value === "") {
        throw new Error("Exercise category is required");
      }
      if (
        ![
          "strength",
          "cardio",
          "flexibility",
          "balance",
          "endurance",
          "team_sports",
          "combat_sports",
          "agility",
          "recreational",
        ].includes(value)
      ) {
        throw new Error("Invalid exercise category");
      }
      return true;
    }),

  body("restDuration").custom((value) => {
    if (value === "") {
      throw new Error("Rest duration is required");
    }
    if (isNaN(value) || parseFloat(value) <= 0) {
      throw new Error("Rest duration should be greater than 0");
    }
    return true;
  }),
  body("minReps").custom((value) => {
    if (value === "") {
      throw new Error("min reps is required");
    }
    if (isNaN(value) || parseFloat(value) <= 0) {
      throw new Error("Rest duration should be greater than 0");
    }
    return true;
  }),
  body("maxReps").custom((value) => {
    if (value === "") {
      throw new Error("max reps is required");
    }
    if (isNaN(value) || parseFloat(value) <= 0) {
      throw new Error("Rest duration should be greater than 0");
    }
    return true;
  }),
  body("sets").custom((value) => {
    if (value === "") {
      throw new Error("Sets is required");
    }
    if (isNaN(value) || parseFloat(value) <= 0) {
      throw new Error("Rest duration should be greater than 0");
    }
    return true;
  }),
  body("intensity")
    .trim()
    .custom((value) => {
      if (value === "") {
        throw new Error("Intensity level is required");
      }
      if (!["low", "medium", "high"].includes(value)) {
        throw new Error("Invalid intensity level");
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
  exerciseValidationMiddleware,
  exerciseUpdateValidationMiddleware,
};

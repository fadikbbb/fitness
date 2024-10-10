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
  // body("gender")
  //   .optional()
  //   .isIn(["male", "female", "other"])
  //   .withMessage("Gender must be either male, female, or other"),

  // body("weight")
  //   .optional()
  //   .isFloat({ min: 0 })
  //   .withMessage("Weight must be a positive number"),

  // body("height")
  //   .optional()
  //   .isFloat({ min: 0 })
  //   .withMessage("Height must be a positive number"),

  // body("dateOfBirth")
  //   .optional()
  //   .isISO8601()
  //   .withMessage("Date of Birth must be a valid date"),

  body('image')
  .custom((value, { req }) => {
    const imageFile = req.files['image'] ? req.files['image'][0] : null;
    if (imageFile) {
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

      // Check file size (for example, limit to 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (imageFile.size > maxSize) {
        throw new Error('Image size must be less than 2MB.');
      }
    }

    return true; // Passes validation
  })
,


  // body("passwordChangedAt")
  //   .optional()
  //   .isISO8601()
  //   .withMessage("Password changed date must be a valid date"),

  // body("passwordResetToken")
  //   .optional()
  //   .isUUID()
  //   .withMessage("Password reset token must be a valid UUID"),

  // body("passwordResetExpires")
  //   .optional()
  //   .isISO8601()
  //   .withMessage("Password reset expiration date must be a valid date"),

  // Middleware to check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const exerciseValidatorMiddleware = [
  body('name')
    .trim()
    .notEmpty().withMessage('Exercise name is required'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),

  // Validate image as a URL or required file upload
  body('image')
    .custom((value, { req }) => {
      const imageFile = req.files['image'] ? req.files['image'][0] : null;

      // Check if neither value nor imageFile is provided
      if (!value && !imageFile) {
        throw new Error('An image file must be provided.');
      }

      // If imageFile is provided, check its properties
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

        // Check file size (for example, limit to 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        if (imageFile.size > maxSize) {
          throw new Error('Image size must be less than 2MB.');
        }
      }

      return true; // Passes validation
    })
  ,

  body('video')
    .custom((value, { req }) => {
      const videoFile = req.files['video'] ? req.files['video'][0] : null;
      // Check if neither value nor videoFile is provided
      if (!value && !videoFile) {
        throw new Error('A video file must be provided.');
      }

      // If videoFile is provided, check its properties
      if (videoFile) {
        // Check file type for common video formats
        const allowedTypes = [
          'video/mp4',
          'video/mpeg',
          'video/x-msvideo',  // MIME type for AVI
          'video/quicktime',  // MIME type for MOV
          'video/webm'
        ];

        if (!allowedTypes.includes(videoFile.mimetype)) {
          throw new Error(`Invalid format: ${videoFile.mimetype}. Only MP4, MPEG, AVI, MOV, and WEBM video formats are allowed.`);
        }

        // Check file size (limit to 10MB)
        const maxSize = 60 * 1024 * 1024; // 60MB
        if (videoFile.size > maxSize) {
          throw new Error(`Video size is ${(videoFile.size / (1024 * 1024)).toFixed(2)}MB. Must be less than 10MB.`);
        }
      }

      return true; // Passes validation
    }),

  body('category')
    .trim()
    .custom(value => {
      if (value === '') {
        throw new Error('Exercise category is required');
      }
      if (!['strength', 'cardio', 'flexibility', 'balance', 'endurance', 'team_sports', 'combat_sports', 'agility', 'recreational'].includes(value)) {
        throw new Error('Invalid exercise category');
      }
      return true;
    }),

  body('restDuration')
    .custom(value => {
      if (value === '') {
        throw new Error('Rest duration is required');
      }
      if (isNaN(value) || parseFloat(value) <= 0) {
        throw new Error('Rest duration should be greater than 0');
      }
      return true;
    }),
  body('minReps')
    .custom(value => {
      if (value === '') {
        throw new Error('min reps is required');
      }
      if (isNaN(value) || parseFloat(value) <= 0) {
        throw new Error('Rest duration should be greater than 0');
      }
      return true;
    }),
  body('maxReps')
    .custom(value => {
      if (value === '') {
        throw new Error('max reps is required');
      }
      if (isNaN(value) || parseFloat(value) <= 0) {
        throw new Error('Rest duration should be greater than 0');
      }
      return true;
    }),
  body('sets')
    .custom(value => {
      if (value === '') {
        throw new Error('Sets is required');
      }
      if (isNaN(value) || parseFloat(value) <= 0) {
        throw new Error('Rest duration should be greater than 0');
      }
      return true;
    }),

  body('intensity')
    .trim()
    .custom(value => {
      if (value === '') {
        throw new Error('Intensity level is required');
      }
      if (!['low', 'medium', 'high'].includes(value)) {
        throw new Error('Invalid intensity level');
      }
      return true;
    }),

  // Middleware to check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const exerciseUpdateValidatorMiddleware = [
  body('name')
    .trim()
    .notEmpty().withMessage('Exercise name is required'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),
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
    }),

  body('video')
    .custom((value, { req }) => {
      const videoFile = req.files['video'] ? req.files['video'][0] : null;

      // Only validate if a videoFile is provided
      if (videoFile) {
        // Check file type for common video formats
        const allowedTypes = [
          'video/mp4',
          'video/mpeg',
          'video/x-msvideo',  // MIME type for AVI
          'video/quicktime',   // MIME type for MOV
          'video/webm'
        ];

        if (!allowedTypes.includes(videoFile.mimetype)) {
          throw new Error(`Invalid format: ${videoFile.mimetype}. Only MP4, MPEG, AVI, MOV, and WEBM video formats are allowed.`);
        }

        // Check file size (limit to 60MB)
        const maxSize = 60 * 1024 * 1024; // 60MB
        if (videoFile.size > maxSize) {
          throw new Error(`Video size is ${(videoFile.size / (1024 * 1024)).toFixed(2)}MB. Must be less than 60MB.`);
        }
      }

      return true; // Passes validation
    }),

  body('category')
    .trim()
    .custom(value => {
      if (value === '') {
        throw new Error('Exercise category is required');
      }
      if (!['strength', 'cardio', 'flexibility', 'balance', 'endurance', 'team_sports', 'combat_sports', 'agility', 'recreational'].includes(value)) {
        throw new Error('Invalid exercise category');
      }
      return true;
    }),

  body('restDuration')
    .custom(value => {
      if (value === '') {
        throw new Error('Rest duration is required');
      }
      if (isNaN(value) || parseFloat(value) <= 0) {
        throw new Error('Rest duration should be greater than 0');
      }
      return true;
    }),
    body('minReps')
    .custom(value => {
      if (value === '') {
        throw new Error('min reps is required');
      }
      if (isNaN(value) || parseFloat(value) <= 0) {
        throw new Error('Rest duration should be greater than 0');
      }
      return true;
    }),
  body('maxReps')
    .custom(value => {
      if (value === '') {
        throw new Error('max reps is required');
      }
      if (isNaN(value) || parseFloat(value) <= 0) {
        throw new Error('Rest duration should be greater than 0');
      }
      return true;
    }),
  body('sets')
    .custom(value => {
      if (value === '') {
        throw new Error('Sets is required');
      }
      if (isNaN(value) || parseFloat(value) <= 0) {
        throw new Error('Rest duration should be greater than 0');
      }
      return true;
    }),
  body('intensity')
    .trim()
    .custom(value => {
      if (value === '') {
        throw new Error('Intensity level is required');
      }
      if (!['low', 'medium', 'high'].includes(value)) {
        throw new Error('Invalid intensity level');
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


const foodValidationMiddleware = [
  body('name')
    .custom(value => {
      if (value === '') {
        throw new Error('Name is required');
      }
      if (typeof value !== 'string') {
        throw new Error('Name must be a string');
      }
      return true; // Passes validation
    })
    .trim(),

  body('image')
    .custom((value, { req }) => {
      const imageFile = req.files['image'] ? req.files['image'][0] : null;
      // Check if neither value nor imageFile is provided
      if (!value && !imageFile) {
        throw new Error('An image file must be provided.');
      }

      // If imageFile is provided, check its properties
      if (imageFile) {
        // Check file type for common image formats
        const allowedTypes = [
          'image/jpeg',
          'image/jpg',  // Include 'jpg'
          'image/png',
          'image/gif',
          'image/bmp',
          'image/webp',
          'image/tiff',
          'image/svg+xml'
        ];

        if (!allowedTypes.includes(imageFile.mimetype)) {
          throw new Error('Only JPG, JPEG, PNG, GIF, BMP, WEBP, TIFF, and SVG image formats are allowed.');
        }

        // Check file size (for example, limit to 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        if (imageFile.size > maxSize) {
          throw new Error('Image size must be less than 2MB.');
        }
      }

      return true; // Passes validation
    }),


  body('category')
    .custom(value => {
      if (value === '') {
        throw new Error('Category is required');
      }
      if (!["Vegetable", "Nuts", "Fish", "Fruit", "Meat", "Grain", "Dairy", "Snack"].includes(value)) {
        throw new Error('Invalid category');
      }
      return true;
    }),

  body('fiber')
    .custom(value => {
      if (value === '') {
        throw new Error('Fiber is required');
      }
      if (isNaN(value) || parseFloat(value) <= 0) {
        throw new Error('Fiber should be greater than 0');
      }
      return true;
    }),

  body('calories')
    .custom(value => {
      if (value === '') {
        throw new Error('Calories are required');
      }
      if (isNaN(value) || parseFloat(value) <= 0) {
        throw new Error('Calories should be greater than 0');
      }
      return true;
    }),

  body('weight')
    .custom(value => {
      if (value === '') {
        throw new Error('Weight is required');
      }
      if (isNaN(value) || parseFloat(value) <= 0) {
        throw new Error('Weight should be greater than 0');
      }
      return true;
    }),

  // Optional fields can remain unchanged
  body('protein')
    .custom(value => {
      if (value === '') {
        throw new Error('protein is required');
      }
      if (isNaN(value) || parseFloat(value) <= 0) {
        throw new Error('protein should be greater than 0');
      }
      return true;
    }),

  body('carbohydrates')
    .custom(value => {
      if (value === '') {
        throw new Error('carbohydrates is required');
      }
      if (isNaN(value) || parseFloat(value) <= 0) {
        throw new Error('carbohydrates should be greater than 0');
      }
      return true;
    }),

  body('fat')
    .custom(value => {
      if (value === '') {
        throw new Error('fat is required');
      }
      if (isNaN(value) || parseFloat(value) <= 0) {
        throw new Error('fat should be greater than 0');
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
  }
];

const foodUpdateValidationMiddleware = [
  body('name')
    .custom(value => {
      if (value === '') {
        throw new Error('Name is required');
      }
      if (typeof value !== 'string') {
        throw new Error('Name must be a string');
      }
      return true; // Passes validation
    })
    .trim(),
  body('image')
    .custom((value, { req }) => {
      const imageFile = req.files['image'] ? req.files['image'][0] : null;
      if (imageFile) {
        const allowedTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/bmp',
          'image/webp',
          'image/tiff',
          'image/svg+xml'
        ];

        if (!allowedTypes.includes(imageFile.mimetype)) {
          throw new Error('Only JPG, JPEG, PNG, GIF, BMP, WEBP, TIFF, and SVG image formats are allowed.');
        }

        // Check file size (for example, limit to 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        if (imageFile.size > maxSize) {
          throw new Error('Image size must be less than 2MB.');
        }
      }

      return true; // Passes validation
    }),


  body('category')
    .custom(value => {
      if (value === '') {
        throw new Error('Category is required');
      }
      if (!["Vegetable", "Nuts", "Fish", "Fruit", "Meat", "Grain", "Dairy", "Snack"].includes(value)) {
        throw new Error('Invalid category');
      }
      return true;
    }),

  body('fiber')
    .custom(value => {
      if (value === '') {
        throw new Error('Fiber is required');
      }
      if (isNaN(value) || parseFloat(value) <= 0) {
        throw new Error('Fiber should be greater than 0');
      }
      return true;
    }),

  body('calories')
    .custom(value => {
      if (value === '') {
        throw new Error('Calories are required');
      }
      if (isNaN(value) || parseFloat(value) <= 0) {
        throw new Error('Calories should be greater than 0');
      }
      return true;
    }),

  body('weight')
    .custom(value => {
      if (value === '') {
        throw new Error('Weight is required');
      }
      if (isNaN(value) || parseFloat(value) <= 0) {
        throw new Error('Weight should be greater than 0');
      }
      return true;
    }),

  // Optional fields can remain unchanged
  body('protein')
    .custom(value => {
      if (value === '') {
        throw new Error('protein is required');
      }
      if (isNaN(value) || parseFloat(value) <= 0) {
        throw new Error('protein should be greater than 0');
      }
      return true;
    }),

  body('carbohydrates')
    .custom(value => {
      if (value === '') {
        throw new Error('carbohydrates is required');
      }
      if (isNaN(value) || parseFloat(value) <= 0) {
        throw new Error('carbohydrates should be greater than 0');
      }
      return true;
    }),

  body('fat')
    .custom(value => {
      if (value === '') {
        throw new Error('fat is required');
      }
      if (isNaN(value) || parseFloat(value) <= 0) {
        throw new Error('fat should be greater than 0');
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
  }
];

const contentValidationRules = [
  // Hero Title
  body("heroTitle")
    .custom(value => {
      if (value === '') {
        throw new Error('Hero title is required');
      }
      if (parseFloat(value) <= 100 && parseFloat(value) >= 5) {
        throw new Error('Hero title must be between 5 and 100 characters');
      }
      return true;
    }),

  // Hero Description
  body("heroDescription")
    .custom(value => {
      if (value === '') {
        throw new Error('Hero description is required');
      }
      if (parseFloat(value) <= 500 && parseFloat(value) >= 10) {
        throw new Error('Hero description must be between 10 and 500 characters');
      }
      return true;
    }),

  // Image
  body('heroImage')
    .custom((value, { req }) => {
      const imageFile = req.files['heroImage'] ? req.files['heroImage'][0] : null;
      if (imageFile) {

        const allowedTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/bmp',
          'image/webp',
          'image/tiff',
          'image/svg+xml'
        ];

        if (!allowedTypes.includes(imageFile.mimetype)) {
          throw new Error('Only JPG, JPEG, PNG, GIF, BMP, WEBP, TIFF, and SVG image formats are allowed.');
        }

        // Check file size (for example, limit to 2MB)
        const maxSize = 2 * 1024 * 1024;
        if (imageFile.size > maxSize) {
          throw new Error('Image size must be less than 2MB.');
        }

      }
      return true; // Passes validation
    }),

  body('heroVideo')
    .custom((value, { req }) => {
      const videoFile = req.files['heroVideo'] ? req.files['heroVideo'][0] : null;

      if (videoFile) {
        // Check file type for common video formats
        const allowedTypes = [
          'video/mp4',
          'video/mpeg',
          'video/x-msvideo',  // MIME type for AVI
          'video/quicktime',  // MIME type for MOV
          'video/webm'
        ];

        if (!allowedTypes.includes(videoFile.mimetype)) {
          throw new Error(`Invalid format: ${videoFile.mimetype}. Only MP4, MPEG, AVI, MOV, and WEBM video formats are allowed.`);
        }

        // Check file size (limit to 10MB)
        const maxSize = 60 * 1024 * 1024; // 60MB
        if (videoFile.size > maxSize) {
          throw new Error(`Video size is ${(videoFile.size / (1024 * 1024)).toFixed(2)}MB. Must be less than 10MB.`);
        }
      }
      return true; // Passes validation
    }),
  // Image
  body('logo')
    .custom((value, { req }) => {
      const imageFile = req.files['logo'] ? req.files['logo'][0] : null;
      if (imageFile) {

        const allowedTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/bmp',
          'image/webp',
          'image/tiff',
          'image/svg+xml'
        ];

        if (!allowedTypes.includes(imageFile.mimetype)) {
          throw new Error('Only JPG, JPEG, PNG, GIF, BMP, WEBP, TIFF, and SVG image formats are allowed.');
        }

        // Check file size (for example, limit to 2MB)
        const maxSize = 2 * 1024 * 1024;
        if (imageFile.size > maxSize) {
          throw new Error('Image size must be less than 2MB.');
        }

      }
      return true; // Passes validation
    }),

  // Facebook URL (Optional)
  body("facebook")
    .optional({ checkFalsy: true })
    .isURL().withMessage("Facebook link must be a valid URL"),

  // Twitter URL (Optional)
  body("twitter")
    .optional({ checkFalsy: true })
    .isURL().withMessage("Twitter link must be a valid URL"),

  // Instagram URL (Optional)
  body("instagram")
    .optional({ checkFalsy: true })
    .isURL().withMessage("Instagram link must be a valid URL"),

  // LinkedIn URL (Optional)
  body("linkedin")
    .optional({ checkFalsy: true })
    .isURL().withMessage("LinkedIn link must be a valid URL"),
  // Middleware to check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];



const nutritionPlanValidation = [
  body("mealName")
    .custom(value => {
      if (value === '') {
        throw new Error('mealName is required');
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


module.exports = {
  contentValidationRules,
  nutritionPlanValidation,
  userValidationMiddleware,
  registerValidationMiddleware,
  passwordValidationMiddleware,
  foodValidationMiddleware,
  foodUpdateValidationMiddleware,
  exerciseValidatorMiddleware,
  exerciseUpdateValidatorMiddleware,
};

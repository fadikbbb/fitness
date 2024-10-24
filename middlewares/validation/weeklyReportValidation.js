const { body, validationResult } = require("express-validator");

foodValidationMiddleware = [

    // body('image')
    //     .custom((value, { req }) => {
    //         const imageFile = req.files['image'] ? req.files['image'][0] : null;
    //         // Check if neither value nor imageFile is provided
    //         if (!value && !imageFile) {
    //             throw new Error('An image file must be provided.');
    //         }
    //         // Check file type for common image formats
    //         const allowedTypes = [
    //             'image/jpeg',
    //             'image/jpg',  // Include 'jpg'
    //             'image/png',
    //             'image/gif',
    //             'image/bmp',
    //             'image/webp',
    //             'image/tiff',
    //             'image/svg+xml'
    //         ];

    //         if (!allowedTypes.includes(imageFile.mimetype)) {
    //             throw new Error('Only JPG, JPEG, PNG, GIF, BMP, WEBP, TIFF, and SVG image formats are allowed.');
    //         }

    //         // Check file size (for example, limit to 2MB)
    //         const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    //         if (imageFile.size > maxSize) {
    //             throw new Error('Image size must be less than 2MB.');
    //         }


    //         return true; // Passes validation
    //     }),
    body('isProblems')
        .custom((value, { req }) => {
            if (value === '') {
                throw new Error('isProblems cannot be empty');
            }
            if (typeof value !== 'boolean') {
                throw new Error('isProblems must be a boolean');
            }
            return true; // Passes validation
        }),
    body('problems')
        .custom((value, { req }) => {
            // Check if isProblems is true
            if (req.body.isProblems) {
                // If isProblems is true, check if problems is empty
                if (value === '' || value === null || value === undefined ) { 
                    throw new Error('problems cannot be empty if isProblems is true');
                }
                // Check if the value is a string
                if (typeof value !== 'string') {
                    throw new Error('problems must be a string');
                }
            }
            return true; // Passes validation
        }),
    body('exerciseLevel')
        .custom(value => {
            if (value === '') {
                throw new Error('Weight is required');
            }
            if (isNaN(value)) {
                throw new Error('Weight must be a number');
            }
            if (isNaN(value) || parseFloat(value) < 0) {
                throw new Error('Weight should be greater than 0');
            }
            return true;
        }),
    body('eatingLevel')
        .custom(value => {
            if (value === '') {
                throw new Error('Weight is required');
            }
            if (isNaN(value)) {
                throw new Error('Weight must be a number');
            }
            if (isNaN(value) || parseFloat(value) < 0) {
                throw new Error('Weight should be greater than 0');
            }
            return true;
        }),
        body('sleepLevel')
        .custom(value => {
            if (value === '') {
                throw new Error('Weight is required');
            }
            if (isNaN(value)) {
                throw new Error('Weight must be a number');
            }
            if (isNaN(value) || parseFloat(value) < 0) {
                throw new Error('Weight should be greater than 0');
            }
            return true;
        }),
        body('weight')
        .custom(value => {
            if (value === '') {
                throw new Error('Weight is required');
            }
            if (isNaN(value)) {
                throw new Error('Weight must be a number');
            }
            if (isNaN(value) || parseFloat(value) <= 0) {
                throw new Error('Weight should be greater than 0');
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

module.exports = foodValidationMiddleware
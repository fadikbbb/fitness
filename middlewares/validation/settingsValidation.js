const { body, validationResult } = require("express-validator");
const settingsHeroValidationMiddleware = [
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
                const maxSize = 2 * 1024 * 1024;
                if (imageFile.size > maxSize) {
                    throw new Error('Image size must be less than 2MB.');
                }

            }
            return true;
        }),

    body('video')
        .custom((value, { req }) => {
            const videoFile = req.files['video'] ? req.files['video'][0] : null;
            if (videoFile) {
                const allowedTypes = [
                    'video/mp4',
                    'video/mpeg',
                    'video/x-msvideo',
                    'video/quicktime',
                    'video/webm'
                ];
                if (!allowedTypes.includes(videoFile.mimetype)) {
                    throw new Error(`Invalid format: ${videoFile.mimetype}. Only MP4, MPEG, AVI, MOV, and WEBM video formats are allowed.`);
                }
                const maxSize = 60 * 1024 * 1024;
                if (videoFile.size > maxSize) {
                    throw new Error(`Video size is ${(videoFile.size / (1024 * 1024)).toFixed(2)}MB. Must be less than 10MB.`);
                }
            }
            return true;
        }),
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
                const maxSize = 2 * 1024 * 1024;
                if (imageFile.size > maxSize) {
                    throw new Error('Image size must be less than 2MB.');
                }
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

const settingsSocialMediaValidationMiddleware = [
    body("facebook")
        .optional({ checkFalsy: true })
        .isURL().withMessage("Facebook link must be a valid URL"),
    body("twitter")
        .optional({ checkFalsy: true })
        .isURL().withMessage("Twitter link must be a valid URL"),
    body("instagram")
        .optional({ checkFalsy: true })
        .isURL().withMessage("Instagram link must be a valid URL"),
    body("linkedin")
        .optional({ checkFalsy: true })
        .isURL().withMessage("LinkedIn link must be a valid URL"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    settingsHeroValidationMiddleware,
    settingsSocialMediaValidationMiddleware
}


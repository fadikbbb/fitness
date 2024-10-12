const { body, validationResult } = require("express-validator");
const nutritionPlanValidationMiddleware = [
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
    nutritionPlanValidationMiddleware
}
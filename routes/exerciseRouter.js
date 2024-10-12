const express = require('express');
const exerciseController = require('../controllers/exerciseController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { exerciseValidationMiddleware, exerciseUpdateValidationMiddleware } = require('../middlewares/validation/exerciseValidation');
const { query } = require('../middlewares/query');
const { upload } = require('../utils/uploadUtils');
const router = express.Router();

// Apply authentication middleware
router.use(authenticate);

// Exercise routes
router.post('/', authorize("admin"), upload, exerciseValidationMiddleware, exerciseController.createExercise);
router.get('/', query(), exerciseController.getAllExercises);
router.get('/:id', exerciseController.getExerciseById)
router.patch('/:id', authorize("admin"), upload, exerciseUpdateValidationMiddleware, exerciseController.updateExercise);
router.delete('/:id', authorize("admin"), exerciseController.deleteExercise);

module.exports = router;

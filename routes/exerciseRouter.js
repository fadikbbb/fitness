const express = require('express');
const exerciseController = require('../controllers/exerciseController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { query } = require('../middleware/query');
const Exercise = require('../models/ExerciseModel');
const router = express.Router();

// Apply authentication middleware
router.use(authenticate);

// Exercise routes
router.post('/', authorize("admin"), exerciseController.createExercise); // Create a new exercise
router.get('/', query(Exercise), exerciseController.getAllExercises); // Get all exercises
router.get('/:id', exerciseController.getExerciseById); // Get an exercise by ID
router.put('/:id', exerciseController.updateExercise); // Update an exercise
router.delete('/:id', authorize("admin"), exerciseController.deleteExercise); // Delete an exercise

module.exports = router;

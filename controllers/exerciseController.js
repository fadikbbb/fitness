const exerciseService = require('../services/exerciseService');

// Create a new exercise
exports.createExercise = async (req, res, next) => {
    try {
        const exercise = await exerciseService.createExercise(req.body);
        res.status(201).send({ isSuccess: true, message: 'Exercise created successfully', exercises: exercise });
    } catch (error) {
        next(error); // Pass error to the next middleware
    }
};

// Get all exercises with filtering, sorting, and pagination
exports.getAllExercises = async (req, res, next) => {
    try {
        const { exercises, totalExercises } = await exerciseService.getAllExercises(req.filter, req.search, req.sortBy, req.fields, req.page, req.limit);

        res.status(200).send({ isSuccess: true, totalExercises: totalExercises, exercises: exercises });
    } catch (error) {
        next(error);
    }
};


// Get a single exercise by ID
exports.getExerciseById = async (req, res, next) => {
    try {
        const exercise = await exerciseService.getExerciseById(req.params.id);
        if (!exercise) {
            return res.status(404).send({ error: 'Exercise not found' });
        }
        res.status(200).send({ isSuccess: true, exercise: exercise });
    } catch (error) {
        next(error);
    }
};

// Update an exercise
exports.updateExercise = async (req, res, next) => {
    try {
        const exercise = await exerciseService.updateExercise(req.params.id, req.body);
        if (!exercise) {
            return res.status(404).send({ error: 'Exercise not found' });
        }
        res.status(200).send({ isSuccess: true, message: 'Exercise updated successfully', exercises: exercise });
    } catch (error) {
        next(error);
    }
};

// Delete an exercise
exports.deleteExercise = async (req, res, next) => {
    try {
        const exercise = await exerciseService.deleteExercise(req.params.id);
        if (!exercise) {
            return res.status(404).send({ error: 'Exercise not found' });
        }
        res.status(200).send({ isSuccess: true, message: 'Exercise deleted successfully' });
    } catch (error) {
        next(error);
    }
};

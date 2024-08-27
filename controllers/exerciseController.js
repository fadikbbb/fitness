const Exercise = require('../models/ExerciseModel');

// Create a new exercise
exports.createExercise = async (req, res) => {
    try {
        const exercise = new Exercise(req.body);
        await exercise.save();
        res.status(201).json({ message: 'Exercise created successfully', exercise });
    } catch (error) {
        res.status(500).json({ error: 'Error creating exercise', details: error.message });
    }
};

// Get all exercises
exports.getAllExercises = async (req, res) => {
    try {
        res.status(200).json({ message: 'Exercises retrieved successfully', exercises: res.queryResults });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching exercises', details: error.message });
    }
};

// Get a single exercise by ID
exports.getExerciseById = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) {
            return res.status(404).json({ error: 'Exercise not found' });
        }
        res.status(200).json(exercise);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching exercise', details: error.message });
    }
};

// Update an exercise
exports.updateExercise = async (req, res) => {
    try {
        // Manually set updatedAt field
        const updateData = { ...req.body, updatedAt: Date.now() };

        const exercise = await Exercise.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!exercise) {
            return res.status(404).json({ error: 'Exercise not found' });
        }
        res.status(200).json({ message: 'Exercise updated successfully', exercise });
    } catch (error) {
        res.status(500).json({ error: 'Error updating exercise', details: error.message });
    }
};

// Delete an exercise
exports.deleteExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findByIdAndDelete(req.params.id);
        if (!exercise) {
            return res.status(404).json({ error: 'Exercise not found' });
        }
        res.status(200).json({ message: 'Exercise deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting exercise', details: error.message });
    }
};

const WorkoutPlan = require('../models/WorkoutPlanModel');
const { validationResult } = require('express-validator');

// Create a new workout plan
exports.createWorkoutPlan = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const workoutPlan = new WorkoutPlan(req.body);
        await workoutPlan.save();
        res.status(201).json(workoutPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a workout plan
exports.updateWorkoutPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const workoutPlan = await WorkoutPlan.findByIdAndUpdate(id, req.body, { new: true });
        if (!workoutPlan) return res.status(404).json({ message: 'Workout Plan not found' });
        res.status(200).json(workoutPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all workout plans for a user
exports.getWorkoutPlans = async (req, res) => {
    try {
        res.status(200).json({ message: 'Workout Plans retrieved successfully', workoutPlans: res.queryResults });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a workout plan
exports.deleteWorkoutPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const workoutPlan = await WorkoutPlan.findByIdAndDelete(id);
        if (!workoutPlan) return res.status(404).json({ message: 'Workout Plan not found' });
        res.status(200).json({ message: 'Workout Plan deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

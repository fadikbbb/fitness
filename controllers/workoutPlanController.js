const workoutPlanService = require('../services/workoutPlanService');

// Create a new workout plan
exports.createWorkoutPlan = async (req, res, next) => {
    const body = req.body;
    const { userId } = req.params;
    console.log(body);
    try {
        const workoutPlan = await workoutPlanService.createWorkoutPlan(body, userId);
        res.status(201).json({ isSuccess: true, message: 'Workout Plan created successfully', workoutPlan });
    } catch (error) {
        next(error);
    }
};

// Update an exercise in the workout plan
exports.updateExercise = async (req, res, next) => {
    try {
        const { userId, id: planId, exerciseId } = req.params;
        const { day } = req.query;
        const updateData = req.body;
        const updatedWorkoutPlan = await workoutPlanService.updateExercise(userId, planId, exerciseId, day, updateData);
        res.status(200).json({ isSuccess: true, message: 'Exercise updated successfully', updatedWorkoutPlan });
    } catch (error) {
        next(error);
    }
};

// Get all workout plans for a user
exports.getWorkoutPlans = async (req, res, next) => {
    try {
        const { workoutPlans, totalWorkoutPlans } = await workoutPlanService.getWorkoutPlans(req.filter, req.search, req.sortBy, req.fields, req.page, req.limit);
        res.status(200).json({ isSuccess: true, message: 'Workout Plans retrieved successfully', totalWorkoutPlans: totalWorkoutPlans, workoutPlans });
    } catch (error) {
        next(error);
    }
};

// Get a single workout plan by user ID
exports.getWorkoutPlanByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const workoutPlan = await workoutPlanService.getWorkoutPlanByUser(userId);
        res.status(200).json({ isSuccess: true, message: 'Workout Plan retrieved successfully', workoutPlan });
    } catch (error) {
        next(error);
    }
};

// Remove an exercise from the workout plan
exports.removeExercise = async (req, res, next) => {
    try {
        const { userId, id: planId, exerciseId } = req.params;
        const { day } = req.query;
        const updatedWorkoutPlan = await workoutPlanService.removeExercise(userId, planId, exerciseId, day);
        res.status(200).json({ isSuccess: true, message: 'Exercise removed successfully', updatedWorkoutPlan });
    } catch (error) {
        next(error);
    }
};

// Delete a workout plan
exports.deleteWorkoutPlan = async (req, res, next) => {
    try {
        const { id } = req.params;
        await workoutPlanService.deleteWorkoutPlan(id);
        res.status(200).json({ isSuccess: true, message: 'Workout Plan deleted successfully' });
    } catch (error) {
        next(error);
    }
};
exports.deleteDayOfExercise = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { day } = req.query;
        const updatedWorkoutPlan = await workoutPlanService.deleteDayOfExercise(userId,day);
        res.status(200).json({ isSuccess: true, message: 'Day of exercise deleted successfully', updatedWorkoutPlan });
    } catch (error) {
        next(error);
    }
}
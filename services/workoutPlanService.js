const WorkoutPlan = require('../models/WorkoutPlanModel');
const Exercise = require('../models/ExerciseModel');
const User = require('../models/UserModel');
const mongoose = require('mongoose');
const apiError = require('../utils/apiError');

exports.createWorkoutPlan = async (body, userId) => {

    try {
        // Validate user ID
        if (!userId) {
            throw new apiError('User ID not provided', 400);
        }

        // Fetch user
        const user = await User.findById(userId);
        if (!user) {
            throw new apiError('User not found', 404);
        }
        if (user.subscriptionStatus !== 'premium') {
            throw new apiError('Only premium users can create workout plans', 403);
        }

        if (!body.day || !body.exercises || body.exercises.length === 0) {
            throw new apiError('Day or exercises data not provided', 400);
        }

        // Validate exercises data
        await Promise.all(body.exercises.map(async (exercise) => {
            if (!exercise.exerciseId || !exercise.sets || !exercise.reps || !exercise.restDuration) {
                throw new apiError('Exercise data not provided', 400);
            }

            if (!mongoose.Types.ObjectId.isValid(exercise.exerciseId)) {
                throw new apiError('Invalid exercise ID', 400);
            }

            const exerciseExists = await Exercise.findById(exercise.exerciseId);
            if (!exerciseExists) {
                throw new apiError('Exercise not found', 404);
            }
        }));

        // Fetch existing workout plan or create a new one
        let workoutPlan = await WorkoutPlan.findOne({ userId: userId });

        if (workoutPlan) {
            // Check if the day already exists
            const existingDay = workoutPlan.days.find(d => d.day === body.day);
            if (existingDay) {
                // Filter out exercises that are already in the workout plan
                const newExercises = body.exercises.filter(exercise => {
                    return !existingDay.exercises.some(existingExercise => existingExercise.exerciseId.toString() === exercise.exerciseId);
                });

                // If all exercises are duplicates, throw an error
                if (newExercises.length === 0) {
                    throw new apiError('All exercises are already added for this day', 400);
                }

                // Add only the new exercises to the existing day
                existingDay.exercises.push(...newExercises);
            } else {
                // Add new day with exercises
                workoutPlan.days.push({
                    day: body.day,
                    exercises: body.exercises
                });
            }
        } else {
            // Create a new workout plan with the provided day and exercises
            workoutPlan = await WorkoutPlan.create({
                userId: userId,
                days: [{
                    day: body.day,
                    exercises: body.exercises
                }]
            });
        }

        await workoutPlan.save();
        return workoutPlan;
    } catch (error) {
        throw error;
    }
};

exports.updateExercise = async (userId, planId, exerciseId, day, updateData) => {
    try {
        const data =
        {
            userId: userId,
            "days.day": day,
            "days.exercises.exerciseId": exerciseId
        }

        // First, find the workout plan
        const workoutPlan = await WorkoutPlan.findOne(data);

        if (!workoutPlan) {
            throw new apiError('Workout plan or exercise not found', 404);
        }

        // Find the specific day
        const dayPlan = workoutPlan.days.find(d => d.day === day);

        if (!dayPlan) {
            throw new apiError('Day not found in workout plan', 404);
        }

        // Find the specific exercise
        const exercise = dayPlan.exercises.find(e => e.exerciseId.equals(exerciseId));

        if (!exercise) {
            throw new apiError('Exercise not found in day', 404);
        }
        exercise.sets = updateData.sets;
        exercise.reps = updateData.reps;
        exercise.restDuration = updateData.restDuration;
        exercise.note = updateData.note;

        // Save the updated workout plan
        await workoutPlan.save();

        return workoutPlan;
    } catch (error) {
        throw error;
    }
};


exports.removeExercise = async (userId, planId, exerciseId, day) => {
    try {
        // Validate inputs
        if (!userId || !planId || !exerciseId || !day) {
            throw new apiError('Invalid input parameters', 400);
        }
        if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
            throw new apiError('Invalid exercise ID', 400);
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new apiError('Invalid user ID', 400);
        }
        if (!mongoose.Types.ObjectId.isValid(planId)) {
            throw new apiError('Invalid plan ID', 400);
        }

        // Find the workout plan
        const workoutPlan = await WorkoutPlan.findOne({ userId });

        if (!workoutPlan) {
            throw new apiError('Workout plan not found', 404);
        }

        // Check if the exercise exists in the specified day
        const dayContainingExercise = workoutPlan.days.find(dayItem =>
            dayItem.day === day && dayItem.exercises.some(exercise => exercise.exerciseId.equals(exerciseId))
        );

        if (!dayContainingExercise) {
            throw new apiError('Exercise not found in the specified day of the workout plan', 404);
        }

        // Remove the exercise from the specified day
        await WorkoutPlan.updateOne(
            { userId, 'days.day': day },
            { $pull: { 'days.$.exercises': { exerciseId } } }
        );

        // Fetch the updated workout plan to check the status of the day's exercises
        const updatedWorkoutPlan = await WorkoutPlan.findOne({ userId });

        // Check if the day now has no exercises left
        const dayAfterUpdate = updatedWorkoutPlan.days.find(dayItem => dayItem.day === day);

        if (dayAfterUpdate && dayAfterUpdate.exercises.length === 0) {
            // Remove the entire day if there are no exercises
            await WorkoutPlan.updateOne(
                { userId },
                { $pull: { days: { day } } }
            );
        }

        // Fetch the final updated workout plan after all modifications
        const finalUpdatedPlan = await WorkoutPlan.findOne({ userId });

        return finalUpdatedPlan;

    } catch (error) {
        throw error;
    }
};




// Get all workout plans
exports.getWorkoutPlans = async (filter, search, sortBy, fields, page, limit) => {
    try {
        const skip = Math.max(0, (page - 1) * limit);

        let workoutPlanQuery = WorkoutPlan.find(filter);

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            workoutPlanQuery = workoutPlanQuery.where({
                $or: [
                    { name: { $regex: searchRegex } },
                ]
            });
        }

        if (sortBy) {
            const sortByFields = sortBy.split(',').join(' ');
            workoutPlanQuery = workoutPlanQuery.sort(sortByFields);
        }

        if (typeof fields === 'string') {
            const selectedFields = fields.split(',').join(' ');
            workoutPlanQuery = workoutPlanQuery.select(selectedFields);
        }

        workoutPlanQuery = workoutPlanQuery.skip(skip).limit(limit);

        const [workoutPlans, totalWorkoutPlans] = await Promise.all([
            workoutPlanQuery.exec(),
            WorkoutPlan.countDocuments(filter)
        ]);

        return { totalWorkoutPlans, workoutPlans };
    } catch (error) {
        throw error
    }
};

exports.getWorkoutPlanByUser = async (userId) => {
    try {
        const workoutPlan = await WorkoutPlan.findOne({ userId: userId }).populate('days.exercises.exerciseId').populate('userId');
        if (!workoutPlan) {
            throw new apiError('Workout Plan not found', 404);
        }
        return workoutPlan;
    } catch (error) {
        throw error
    }
};

// Delete a workout plan
exports.deleteWorkoutPlan = async (id) => {
    try {
        const workoutPlan = await WorkoutPlan.findByIdAndDelete(id);
        if (!workoutPlan) {
            throw new apiError('Workout Plan not found', 404);
        }
        return workoutPlan;
    } catch (error) {
        throw error
    }
};
exports.deleteDayOfExercise = async (userId, day) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new apiError('User not found', 404);
        }
        
        const workoutPlan = await WorkoutPlan.findOne({ userId: userId });
        if (!workoutPlan) {
            throw new apiError('Workout plan not found', 404);
        }

        // Filter out the day from the days array
        workoutPlan.days = workoutPlan.days.filter(d => d.day !== day);

        await workoutPlan.save();
        return workoutPlan;
    } catch (error) {
        throw error;
    }
};



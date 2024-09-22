const Exercise = require('../models/ExerciseModel');
const apiError = require('../utils/apiError');

// Create a new exercise
exports.createExercise = async (data) => {
    const existingExercise = await Exercise.findOne({ name: data.name });
    if (existingExercise) {
        throw new apiError('Exercise already exists', 400);
    }
    const exercise = new Exercise(data);
    await exercise.save();
    return exercise;
};


// Get all exercises
exports.getAllExercises = async (filter, search, sortBy, fields, page, limit) => {
    try {
        
        let exercisesQuery = Exercise.find(filter);
        // Handle search if the 'search' parameter is present (assuming you are searching by name or other fields)
        if (search !== null) {
            const searchRegex = new RegExp(search, 'i');
            exercisesQuery = exercisesQuery.find({
                $or: [
                    { name: { $regex: searchRegex} },
                ]
            });
        }
        // Sorting
        if (sortBy) {
            const sortByFields = sortBy.split(',').join(' ');
            exercisesQuery = exercisesQuery.sort(sortByFields);
        }

        // Field limiting (projection)
        if (typeof fields === 'string') {
            const selectedFields = fields.split(',').join(' ');
            exercisesQuery = exercisesQuery.select(selectedFields);
        }

        // Pagination
        const skip = (page - 1) * limit;
        exercisesQuery = exercisesQuery.skip(skip).limit(limit);

        // Fetching exercises and total count
        const [exercises, totalExercises] = await Promise.all([
            exercisesQuery,
            Exercise.countDocuments(filter)  // Count total exercises matching the filter
        ]);

        return { totalExercises, exercises };

    } catch (error) {
        throw error;
    }
};




// Get a single exercise by ID
exports.getExerciseById = async (id) => {
    try {
        const exercise = await Exercise.findById(id);

        if (!exercise) {
            throw new apiError('Exercise not found', 404);
        }

        return exercise;
    } catch (error) {
        throw error
    }
};

// Update an exercise
exports.updateExercise = async (id, data) => {
    try {
        const exercise = await Exercise.findByIdAndUpdate(id, data, { new: true });
        if (!exercise) {
            throw new apiError('Exercise not found', 404);
        }

        return exercise;
    } catch (error) {
        throw error
    }
};

// Delete an exercise
exports.deleteExercise = async (id) => {
    try {
        const exercise = await Exercise.findByIdAndDelete(id);

        if (!exercise) {
            throw new apiError('Exercise not found', 404);
        }

        return exercise;
    } catch (error) {
        throw error
    }
};

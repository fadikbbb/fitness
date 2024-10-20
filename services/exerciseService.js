const Exercise = require('../models/ExerciseModel');
const WorkoutPlan = require('../models/WorkoutPlanModel');
const apiError = require('../utils/apiError');
const { uploadToStorage, deleteFile, updateFile } = require('../utils/uploadUtils');

// Create a new exercise
exports.createExercise = async (body, imageFile, videoFile) => {
    try {
        const existingExercise = await Exercise.findOne({ name: body.name });
        if (existingExercise) {
            throw new apiError('Exercise already exists', 400);
        }

        if (!imageFile) {
            throw new apiError('Image is required', 400);
        }

        body.image = await uploadToStorage(imageFile.originalname, imageFile.mimetype, imageFile.buffer, 'img');

        if (!videoFile) {
            throw new apiError('Video is required', 400);
        }

        body.videoUrl = await uploadToStorage(videoFile.originalname, videoFile.mimetype, videoFile.buffer, 'video');

        const exercise = new Exercise(body);
        await exercise.save();
        return exercise;
    } catch (error) {
        throw error;
    }
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
                    { name: { $regex: searchRegex } },
                ]
            });
            filter = exercisesQuery;

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
            Exercise.countDocuments(filter),

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
exports.updateExercise = async (id, body, imageFile, videoFile) => {
    try {
        let exercise = await Exercise.findById(id);
        if (!exercise) {
            throw new apiError('Exercise not found', 404);
        }

        if (imageFile) {
            body.image = await updateFile(exercise.image, imageFile.originalname, imageFile.mimetype, imageFile.buffer, 'img');
        } else {
            body.image = exercise.image;
        }

        if (videoFile) {
            body.videoUrl = await updateFile(exercise.videoUrl, videoFile.originalname, videoFile.mimetype, videoFile.buffer, 'video');
        } else {
            body.videoUrl = exercise.videoUrl;
        }

        exercise = Exercise.findByIdAndUpdate(id, body)

        return exercise;
    } catch (error) {
        throw error
    }
};

// Delete an exercise
exports.deleteExercise = async (id) => {
    try {
        // Find the exercise to be deleted
        let exercise = await Exercise.findById(id);
        if (!exercise) {
            throw new apiError('Exercise not found', 404);
        }

        // Delete associated files if they exist
        if (exercise.image && exercise.image !== '' && exercise.image !== null && exercise.image !== "undefined") {
            await deleteFile(exercise.image);
        }

        if (exercise.videoUrl && exercise.videoUrl !== '' && exercise.videoUrl !== null && exercise.videoUrl !== "undefined") {
            await deleteFile(exercise.videoUrl);
        }

        // Remove the exercise reference from all workout plans and check for empty days
        await WorkoutPlan.updateMany(
            { 'days.exercises.exerciseId': id },
            { $pull: { 'days.$[].exercises': { exerciseId: id } } }
        );
        // Remove any day that has an empty exercises array
        await WorkoutPlan.updateMany(
            {},
            { $pull: { days: { exercises: { $size: 0 } } } }
        )

        // Finally, delete the exercise from the exercises collection
        exercise = await Exercise.findByIdAndDelete(id);
        return exercise;

    } catch (error) {
        throw error;
    }
};


const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    days: [
        {
            day: {
                type: String,
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                required: true,
            },
            exercises: [
                {
                    exerciseId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Exercise',
                        required: true,
                    },
                    sets: {
                        type: Number,
                        min: [1, 'Sets must be at least 1'],
                        max: [20, 'Sets must be less than 20'],
                        required: true,
                    },
                    maxReps: {
                        type: Number,
                        min: [1, 'Reps must be at least 1'],
                        max: [200, 'Reps must be less than 200'],
                        required: true,
                    },
                    minReps: {
                        type: Number,
                        min: [1, 'Reps must be at least 1'],
                        max: [200, 'Reps must be less than 200'],
                        required: true,
                    },
                    restDuration: {
                        type: Number,
                        min: [1, 'Rest duration must be at least 1'],
                        required: true,
                    },
                    note: {
                        type: String,
                        trim: true,
                    },
                }
            ],
        }
    ],
}, {
    timestamps: true,
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);

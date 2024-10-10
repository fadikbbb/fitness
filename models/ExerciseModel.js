const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Exercise schema
const exerciseSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Exercise name is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'Description is required']
    },
    image: {
        type: String,
        trim: true,
        required: [false, 'Image URL is required']
    },
    videoUrl: {
        type: String,
        trim: true,
        required: [false, 'Video URL is required']
    },
    category: {
        type: String,
        enum: [
            "strength",
            "cardio",
            "flexibility",
            "balance",
            "endurance",
            "team_sports",
            "combat_sports",
            "agility",
            "recreational"
        ],
        required: [true, 'Exercise category is required'],
    },
    restDuration: {
        type: Number,
        min: [0, 'Rest duration must be a positive number'],
    },
    sets: {
        type: Number,
        required: [true, 'Sets are required'],
        min: [1, 'Sets must be at least 1'],
        max: [20, 'Sets must be less than 20'],
    },
    maxReps: {
        type: Number,
        required: [true, 'Reps are required'],
        min: [1, 'Reps must be at least 1'],
        max: [200, 'Reps must be less than 200'],
    },
    minReps: {
        type: Number,
        required: [true, 'Reps are required'],
        min: [1, 'Reps must be at least 1'],
        max: [200, 'Reps must be less than 200'],
    },
    intensity: {
        type: String,
        enum: ['low', 'medium', 'high'],
    },

}, { timestamps: true });

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;

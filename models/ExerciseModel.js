const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Exercise schema
const exerciseSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        enum: [
            'strength',
            'cardio',
            'flexibility',
            'balance',
            'endurance',
            'power',
            'agility',
            'mobility',
            'core',
            'plyometric',
            'functional',
            'rehabilitation',
            'hiit',
            'bodyweight',
            'resistance',
            'stretching'
        ],
        required: true,
    },
    duration: {
        type: Number, // Duration in minutes
        min: 0,
    },
    intensity: {
        type: String,
        enum: ['low', 'medium', 'high'],
    },
    sets: {
        type: Number,
        min: 0,
    },
    reps: {
        type: Number,
        min: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});


const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;

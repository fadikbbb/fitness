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
        required: [true, 'Image URL is required']
    },
    videoUrl: {
        type: String,
        trim: true,
        required: [true, 'Video URL is required']
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
    intensity: {
        type: String,
        enum: ['low', 'medium', 'high'],
    },

}, { timestamps: true });

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;

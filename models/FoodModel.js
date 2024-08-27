const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        enum: ["Vegetable", "Fruit", "Protein", "Grain", "Dairy", "Snack"],
        required: true,
    },
    calories: {
        type: Number,
        required: true,
        min: 0,
    },
    protein: {
        type: Number,
        default: 0,
        min: 0,
    },
    carbohydrates: {
        type: Number,
        default: 0,
        min: 0,
    },
    fat: {
        type: Number,
        default: 0,
        min: 0,
    },
    servingSize: {
        type: String,
        required: true,
        trim: true,
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

module.exports = mongoose.model('Food', foodSchema);

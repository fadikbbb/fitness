const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        enum: ["Vegetable", "Nuts", "Fish", "Fruit", "Meat", "Grain", "Dairy", "Snack"],
        required: true,
    },
    fiber: {
        type: String,
        required: true,
        min: [0, "Fiber should be greater than 0"],
    },
    calories: {
        type: Number,
        required: true,
        min: [0, "Calories should be greater than 0"],
    },
    protein: {
        type: Number,
        default: 0,
        min: [0, "Protein should be greater than 0"],
    },
    carbohydrates: {
        type: Number,
        default: 0,
        min: [0, "Carbohydrates should be greater than 0"],
    },
    fat: {
        type: Number,
        default: 0,
        min: [0, "Fat should be greater than 0"],
    },
    weight: {
        type: Number,
        required: true,
        trim: true,
        min: [0, "Weight should be greater than 0"],
    },
},{timestamps: true});

const Food = mongoose.model('Food', foodSchema);
module.exports = Food; 

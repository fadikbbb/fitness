const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    mealType: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
        required: true,
    },
    foods: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
    }],
});

module.exports = mongoose.model('Meal', mealSchema);

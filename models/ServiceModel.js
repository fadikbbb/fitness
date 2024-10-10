const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    image: { type: String },
    title: { type: String },
    description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
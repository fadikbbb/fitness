const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
    logo: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    video: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Hero', heroSchema)
const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
    logo: { type: String, required: true },
    companyName: {
        type: String, required: true
    },
    heroTitle: { type: String, required: true },
    heroDescription: { type: String, required: true },
    heroImage: { type: String, required: true },
    heroVideo: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Hero', heroSchema)
const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    heroTitle: { type: String, required: true },
    heroDescription: { type: String, required: true },
    heroImage: { type: String, required: true },
    logo: { type: String, required: false },
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
}, {
    timestamps: true
});

module.exports = mongoose.model('Content', contentSchema);

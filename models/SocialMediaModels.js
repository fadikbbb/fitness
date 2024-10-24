const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    whatsApp: { type: Number },
});

module.exports = mongoose.model('SocialMedia', heroSchema)
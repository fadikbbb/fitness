const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
});

module.exports = mongoose.model('SocialMedia', heroSchema)
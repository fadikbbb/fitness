const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    heroSection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hero",
        required: true,
    },
    socialMedia: {
        type: mongoose.Schema.Types.ObjectId,
    ref: "SocialMedia",
    required: true,
    },
    aboutSection: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "About",
        required: true,
    }],
    servicesSection: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    }],
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);

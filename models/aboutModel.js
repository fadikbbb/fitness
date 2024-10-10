const mongoose = require('mongoose');
const aboutSchema = new mongoose.Schema({
    image: { type: String },
    title: { type: String },
    content: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('About', aboutSchema)
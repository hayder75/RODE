const mongoose = require('mongoose');

const referenceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    stream: { type: String, enum: ['Social', 'Natural'], required: true },
    subject: { type: String, required: true },
    filePath: { type: String, required: true },
});

module.exports = mongoose.model('Reference', referenceSchema);

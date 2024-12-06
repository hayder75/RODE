const mongoose = require('mongoose');

const testAttemptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questions: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
        userAnswer: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
    }],
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TestAttempt', testAttemptSchema);

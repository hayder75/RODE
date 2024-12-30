const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    year: { type: Number, required: true },
    answeredQuestions: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
            userAnswer: { type: String, required: true }
        }
    ],
    currentQuestion: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
});

const UserProgress = mongoose.model('UserProgress', UserProgressSchema);
module.exports = UserProgress;

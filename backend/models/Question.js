const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    optionText: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
});

const QuestionSchema = new mongoose.Schema({
    stream: { type: String, required: true },
    subject: { type: String, required: true },
    year: { type: Number, required: true },
    questionText: { type: String, required: true }, // This should match what you're sending
    options: [OptionSchema], // This expects an array of option objects
    correctAnswer: { type: String, required: true },
    explanation: { type: String } // Optional field
});

const Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;

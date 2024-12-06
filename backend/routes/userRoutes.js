const express = require('express');
const {
    registerUser,
    loginUser,
    getQuestions,
    submitTestAttempt,
    getSubjects,
    getTestYearsBySubject,
} = require('../controllers/userController');

const router = express.Router();

// User Registration
router.post('/register', registerUser);

// User Login
router.post('/login', loginUser);

// Get Questions
router.get('/questions', getQuestions);

// Submit Test Attempt
router.post('/test-attempts', submitTestAttempt);

router.get('/subjects' , getSubjects);

// Get Test Years by Subject
router.get('/test-years', getTestYearsBySubject);

module.exports = router;

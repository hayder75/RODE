const express = require('express');
const {
    registerUser,
    loginUser,
    getQuestions,
    submitTestAttempt,
    getSubjects,
    getTestYearsBySubject,
    uploadPaymentScreenshot,
} = require('../controllers/userController');
const { protect } = require('../middleware/userMiddleware');

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

router.post('/upload-payment-screenshot', protect, uploadPaymentScreenshot); 

module.exports = router;

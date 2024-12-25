const express = require('express');
const multer = require('multer');
const {
    registerUser,
    loginUser,
    getQuestions,
    submitTestAttempt,
    getSubjects,
    getTestYearsBySubject,
    uploadPaymentScreenshot,
    getQuestionsByYearAndSubject
} = require('../controllers/userController');
const { protect } = require('../middleware/userMiddleware');

const upload = multer({ dest: 'uploads/' }); 

const router = express.Router();

// User Registration
router.post('/register', registerUser);

// User Login
router.post('/login', loginUser);

// Get all question based on the parameters passed ( year and subjects clicked )
router.get('/questions', getQuestions);

// Submit Test Attempt
router.post('/test-attempts', submitTestAttempt);

router.get('/subjects' , getSubjects);

// Get Test Years by Subject
router.get('/test-years', getTestYearsBySubject);

router.post('/upload-payment-screenshot', protect, upload.single('image'), uploadPaymentScreenshot); 

router.get('/questionslist' ,getQuestionsByYearAndSubject )
module.exports = router;

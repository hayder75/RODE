const express = require('express');
const {
    loginAdmin,
    uploadQuestion,
    editQuestion,
    deleteQuestion,
    uploadReference,
    getReferences,
    deleteReference,
    verifyUser,
    getAllUsers,
    getSingleUserById,
    getPendingVerifications ,
    getTotalUserCount,
    getUsersByStream,
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Authentication
router.post('/login', loginAdmin);

// Questions
router.post('/questions', protectAdmin, uploadQuestion);
router.put('/questions/:id', protectAdmin, editQuestion);
router.delete('/questions/:id', protectAdmin, deleteQuestion);

// References
router.post('/references', protectAdmin, uploadReference);
router.get('/references', protectAdmin, getReferences);
router.delete('/references/:id', protectAdmin, deleteReference);

// User Verification
router.put('/users/:id/verify', protectAdmin, verifyUser);

// Get All Users
router.get('/users', protectAdmin, getAllUsers); // Ensure this route is defined with GET method

router.get('/users/:id', protectAdmin, getSingleUserById); // Ensure this route is defined with GET method


router.get('/pending-verifications', protectAdmin, getPendingVerifications); // New route for pending verifications

// User Count
router.get('/user-count', protectAdmin, getTotalUserCount);
router.get('/users-by-stream', protectAdmin, getUsersByStream);


module.exports = router;

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
    createEntryCodes,
    listEntryCodes,
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Authentication
router.post('/login', loginAdmin);

// Questions
router.post('/questions', protectAdmin, uploadQuestion);
router.put('/questionsedit/:id', protectAdmin, editQuestion);
router.delete('/questionsdelte/:id', protectAdmin, deleteQuestion);

// References
router.post('/references', protectAdmin, uploadReference);
router.get('/references', protectAdmin, getReferences);
router.delete('/references/:id', protectAdmin, deleteReference);

// User Verification
router.put('/users/:id/verify', protectAdmin, verifyUser);

// Get All Users
router.get('/users', protectAdmin, getAllUsers); // All users are listes 

router.get('/users/:id', protectAdmin, getSingleUserById); // a user


router.get('/pending-verifications', protectAdmin, getPendingVerifications); // users waititng to be verififed

// User Count
router.get('/user-count', protectAdmin, getTotalUserCount);
router.get('/users-by-stream', protectAdmin, getUsersByStream);

router.get('/createEntryCodes',protectAdmin,createEntryCodes);
router.get('/listEntryCodes',protectAdmin,listEntryCodes);


module.exports = router;

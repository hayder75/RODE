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

module.exports = router;

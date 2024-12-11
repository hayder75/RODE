const Admin = require('../models/Admin');
const Question = require('../models/Question');
const Reference = require('../models/Reference');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin Login
const loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt:', req.body); // Log request body
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            console.log('Admin not found');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        console.log('Login successful, token:', token);
        res.json({ token });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// Upload Question
const uploadQuestion = async (req, res) => {
    const { stream, subject, year, questionText, options, correctAnswer, explanation } = req.body;
    try {
        if (!stream || !subject || !year || !questionText || !options || !correctAnswer) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const question = new Question({
            stream,
            subject,
            year,
            questionText,
            options,
            correctAnswer,
            explanation
        });

        await question.save();
        res.status(201).json({ message: 'Question uploaded successfully', question });
    } catch (error) {
        console.error('Error uploading question:', error); // Log error for debugging
        res.status(500).json({ message: 'Error uploading question', error: error.message });
    }
};


// Edit Question
const editQuestion = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const question = await Question.findByIdAndUpdate(id, updates, { new: true });
        if (!question) return res.status(404).json({ message: 'Question not found' });
        res.json({ message: 'Question updated successfully', question });
    } catch (error) {
        res.status(500).json({ message: 'Error updating question', error });
    }
};

// Delete Question
const deleteQuestion = async (req, res) => {
    const { id } = req.params;
    try {
        const question = await Question.findByIdAndDelete(id);
        if (!question) return res.status(404).json({ message: 'Question not found' });
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting question', error });
    }
};

// Upload Reference
const uploadReference = async (req, res) => {
    const { title, description, fileUrl } = req.body;
    try {
        const reference = new Reference({ title, description, fileUrl });
        await reference.save();
        res.status(201).json({ message: 'Reference uploaded successfully', reference });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading reference', error });
    }
};

// Get References
const getReferences = async (req, res) => {
    try {
        const references = await Reference.find();
        res.json(references);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching references', error });
    }
};

// Delete Reference
const deleteReference = async (req, res) => {
    const { id } = req.params;
    try {
        const reference = await Reference.findByIdAndDelete(id);
        if (!reference) return res.status(404).json({ message: 'Reference not found' });
        res.json({ message: 'Reference deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting reference', error });
    }
};

const uploadBulkQuestions = async (req, res) => {
    const questions = req.body; // Expecting an array of questions
    try {
        // Validate that the body is an array
        if (!Array.isArray(questions)) {
            return res.status(400).json({ message: 'Invalid input, expected an array of questions.' });
        }

        // Map through each question and create a new Question instance
        const questionInstances = questions.map(q => new Question(q));
        
        // Save all questions to the database
        await Question.insertMany(questionInstances);
        
        res.status(201).json({ message: 'Questions uploaded successfully', count: questionInstances.length });
    } catch (error) {
        console.error('Error uploading questions:', error);
        res.status(500).json({ message: 'Error uploading questions', error: error.message });
    }
};


// Verify User
const verifyUser = async (req, res) => {
    const { id } = req.params;
    try {
        // Find the user by ID
        const user = await User.findById(id);
        
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if the user has already paid
        if (user.hasPaid) {
            return res.status(400).json({ message: 'User has already paid, no need to verify.' });
        }

        // Update the user's payment status and verification state
        user.hasPaid = true; // Mark as paid
        user.state = "Verified"; // Update state to "Verified"

        await user.save(); // Save updated user

        res.json({ message: 'User verified successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying user', error });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name phoneNumber role state stream'); // Select fields to return
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

const getSingleUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id, 'name phoneNumber role state'); // Pass ID directly
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // Handle user not found
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

// Get Users Awaiting Verification
// Get Users Awaiting Verification
const getPendingVerifications = async (req, res) => {
    try {
        const users = await User.find({
            state: "Not Verified",
            hasPaid: false,
            paymentScreenshotUrl: { $ne: null } // Ensure there is a payment screenshot uploaded
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching pending verifications:', error);
        res.status(500).json({ message: 'Error fetching pending verifications', error });
    }
};

  
  
  // Ensure you export this function in your admin controller module.exports section.
  


module.exports = {
    loginAdmin,
    uploadQuestion,
    editQuestion,
    deleteQuestion,
    uploadReference,
    getReferences,
    deleteReference,
    verifyUser,
    uploadBulkQuestions,
    getAllUsers,
    getSingleUserById,
    getPendingVerifications,
};

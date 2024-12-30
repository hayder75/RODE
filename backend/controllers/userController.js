const User = require('../models/User');
const Question = require('../models/Question');
const EntryCode = require('../models/EntryCode');
const UserProgress = require('../models/UserProgress');
const TestAttempt = require('../models/TestAttempt');
const jwt = require('jsonwebtoken');
const cloudinary = require ('cloudinary').v2;
const multer = require('multer');
const crypto = require('crypto'); 

// Configuration
cloudinary.config({ 
    cloud_name: 'ddgukdjyd', 
    api_key: '769494294237147', 
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const upload = multer({ dest: 'uploads/' }); 

// Generate Referral ID
const generateReferralID = () => {
    return crypto.randomBytes(4).toString('hex'); // Generates a unique 8-character ID
};

// User Registration with Enhanced Error Handling
const registerUser = async (req, res) => {
    const { name, phoneNumber, password, stream, school, referralID, entryCode } = req.body;

    // Basic validation checks
    if (!name || !phoneNumber || !password || !stream) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return res.status(400).json({ message: 'Name can only contain letters and spaces' });
    }

    try {
        // Check if phone number already exists
        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'Phone number already used' });
        }

        let referredBy = null;
        if (referralID) {
            const referringUser = await User.findOne({ referralID });
            if (!referringUser) {
                return res.status(400).json({ message: 'Invalid referral ID' });
            }
            referredBy = referringUser.referralID;
            referringUser.referralCount = (referringUser.referralCount || 0) + 1;
            await referringUser.save();
        }

        // Generate a new referral ID for the new user
        const newReferralID = generateReferralID();

        let hasPaid = false;
        let validCode = null;

        // Handle entry code if provided
        let entryCodeUsed = false; // Default value for entry code usage
        if (entryCode) {
            validCode = await EntryCode.findOne({ code: entryCode, isUsed: false });
            if (!validCode) {
                return res.status(400).json({ message: 'Invalid or already used entry code' });
            }
            hasPaid = true;
            entryCodeUsed = true; // Set to true since an entry code was used
        }

        // Create a new user
        const newUser = new User({
            name,
            phoneNumber,
            password,
            stream,
            school,
            hasPaid,
            referralID: newReferralID, // Assign the generated referral ID
            referredBy,
            entryCodeUsed, // Use the updated value for entryCodeUsed
            state: hasPaid ? 'Verified' : 'Not Verified',
        });

        await newUser.save();

        // Mark the entry code as used if applicable
        if (validCode) {
            validCode.isUsed = true;
            validCode.usedBy = newUser._id;
            await validCode.save();
        }

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};



// User Login
const loginUser = async (req, res) => {
    const { phoneNumber, password } = req.body;
    try {
        const user = await User.findOne({ phoneNumber });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, name: user.name, hasPaid: user.hasPaid, stream: user.stream , id:user._id}); 
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get Questions
// Get Questions
const getQuestions = async (req, res) => {
    const { stream, subject, year } = req.query; // Accept year as query parameter
    try {
        let questions = await Question.find({ stream, subject, year }); // Filter by year

        // Shuffle questions
        questions = questions.sort(() => Math.random() - 0.5);

        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching questions', error });
    }
};

// Get List of Subjects Based on User stream
const getSubjects = async (req, res) => {
    const { stream } = req.query; // Expecting stream as a query parameter

    let subjects;

    if (stream === 'Natural') {
        subjects = ['Math', 'English', 'Biology', 'Chemistry']; // Natural subjects
    } else if (stream === 'Social') {
        subjects = ['Math', 'History', 'Geography']; // Social subjects
    } else {
        return res.status(400).json({ message: 'Invalid stream' });
    }

    res.json({ subjects });
};


const getTestYearsBySubject = async (req, res) => {
    const { subject } = req.query; // Expecting subject as a query parameter

    try {
        // Find distinct years for the specified subject
        const years = await Question.distinct('year', { subject });

        if (years.length === 0) {
            return res.status(404).json({ message: 'Tests not uploaded yet for this subject.' });
        }

        res.json({ years });
    } catch (error) {
        console.error('Error fetching test years:', error);
        res.status(500).json({ message: 'Error fetching test years', error: error.message });
    }
};




// Upload Payment Screenshot
const uploadPaymentScreenshot = async (req, res) => {
    const userId = req.user.id; // Get user ID from token (assuming you have middleware to protect this route)
    
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload image to Cloudinary (or any other storage)
        const result = await cloudinary.uploader.upload(req.file.path); // Use req.file.path

        // Update user with the uploaded image URL and set hasPaid to false initially
        await User.findByIdAndUpdate(userId, {
            paymentScreenshotUrl: result.secure_url,
            hasPaid: false,
            state: "Not Verified" // Ensure state is set to Not Verified
        });

        res.status(200).json({ message: 'Payment screenshot uploaded successfully', url: result.secure_url });
    } catch (error) {
        console.error('Error uploading payment screenshot:', error);
        res.status(500).json({ message: 'Error uploading payment screenshot', error });
    }
};



// In your controller file (e.g., controllers/questionController.js)
const getQuestionsByYearAndSubject = async (req, res) => {
    const { subject, year } = req.query; // Expecting both subject and year as query parameters

    try {
        const questions = await Question.find({ subject, year }); // Find questions matching subject and year

        if (questions.length === 0) {
            return res.status(404).json({ message: 'No questions found for this subject and year.' });
        }

        res.json(questions); // Return the found questions
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Error fetching questions', error: error.message });
    }
};


const startTest = async (req, res) => {
    const { userId, subject, year } = req.body;
    
    try {
        let userProgress = await UserProgress.findOne({ userId, subject, year, isCompleted: false });

        if (!userProgress) {
            userProgress = new UserProgress({
                userId,
                subject,
                year,
                answeredQuestions: [],
                currentQuestion: 0,
                isCompleted: false,
            });
            await userProgress.save();
        }

        res.status(200).json({ message: 'Test started successfully', progress: userProgress });
    } catch (error) {
        console.error('Error starting test:', error);
        res.status(500).json({ message: 'Error starting test', error: error.message });
    }
};

const updateProgress = async (req, res) => {
    const { userId, questionId, userAnswer } = req.body;
    
    try {
        let userProgress = await UserProgress.findOne({ userId, isCompleted: false });

        if (!userProgress) {
            return res.status(404).json({ message: 'No active test found' });
        }

        userProgress.answeredQuestions.push({ questionId, userAnswer });
        userProgress.currentQuestion += 1;
        await userProgress.save();

        res.status(200).json({ message: 'Progress updated successfully', progress: userProgress });
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({ message: 'Error updating progress', error: error.message });
    }
};


const submitTestAttempt = async (req, res) => {
    const { userId, subject, year, stream, questions } = req.body;

    try {
        console.log('Received data:', { userId, subject, year, stream, questions });

        // Initialize score and totalQuestions
        let score = 0;
        const totalQuestions = questions.length;

        // Calculate score and prepare question results
        const questionResults = questions.map((question) => {
            const isCorrect = question.isCorrect;
            if (isCorrect) score += 1; // Increment score for correct answers

            return {
                questionId: question.questionId,
                userAnswer: question.userAnswer,
                isCorrect,
            };
        });

        console.log('Calculated score:', score);
        console.log('Question results:', questionResults);

        // Create a new test attempt document
        const testAttempt = new TestAttempt({
            userId,
            subject,
            year,
            stream,
            score,
            totalQuestions,
            questions: questionResults,
        });

        // Save the test attempt to the database
        await testAttempt.save();

        // Send the response back with the score
        res.status(200).json({ score });
    } catch (error) {
        console.error('Error submitting test attempt:', error);
        res.status(500).json({ message: 'Error submitting test attempt', error: error.message });
    }
};




module.exports = {
    registerUser,
    loginUser,
    getQuestions,
    submitTestAttempt,
    getSubjects,
    getTestYearsBySubject,
    uploadPaymentScreenshot,
    getQuestionsByYearAndSubject,
    startTest,
    updateProgress

    
};





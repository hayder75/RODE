

// User routes
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register user
router.post('/register', async (req, res) => {
  const { firstName, lastName, phoneNumber, password, stream, school, state } = req.body;

  // Combine firstName and lastName into name
  const name = `${firstName} ${lastName}`;

  // Check if the phone number already exists
  const existingUser = await User.findOne({ phoneNumber });
  if (existingUser) {
    return res.status(400).json({ message: 'Phone number already in use' });
  }

  // Create new user
  const user = new User({
    name,
    phoneNumber,
    password,
    role: stream, // Map stream to role
    school,
    state,
  });

  try {
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a token (if needed for authentication)
    const token = jwt.sign({ id: user._id }, 'your_secret_key', { expiresIn: '1h' });

    res.status(200).json({ 
      message: 'Login successful', 
      userId: user._id, 
      name: user.name, 
      hasPaid: user.hasPaid,
      token, // Include the token in the response
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

// Update payment status
router.patch('/update-payment-status/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.hasPaid = true;
    await user.save();

    res.status(200).json({ message: 'Payment status updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating payment status', error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require ('jsonwebtoken')
const bcrypt = require('bcryptjs');

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

    // Include user's name in the response
    //res.json({ token });
    res.status(200).json({ message: 'Login successful', userId: user._id, name: user.name });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});



module.exports = router;

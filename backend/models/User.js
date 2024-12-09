const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema definition
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  hasPaid: {
    type: Boolean,
    default: false, // Default to false if payment not made
  },
  role: {
    type: String,
    enum: ['Social', 'Natural'],
    required: true,
  },
  school: {
    type: String,
  },
  state: {
    type: String,
   default: "Not Verified",
  },
});

// Password hashing before saving to the DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
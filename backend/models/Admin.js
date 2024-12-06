const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcrypt

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Hash password before saving
AdminSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Admin', AdminSchema);

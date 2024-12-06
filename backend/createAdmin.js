const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin'); // Adjust the path as necessary

const createAdmin = async () => {
    try {
        // Check if an admin already exists
        const existingAdmin = await Admin.findOne({ username: 'admin' }); // Change 'admin' to your preferred username
        if (existingAdmin) {
            console.log('Admin account already exists.');
            return;
        }

        // Create a new admin account
        const hashedPassword = await bcrypt.hash('adminPassword', 10); // Change 'adminPassword' to your desired password
        const newAdmin = new Admin({
            username: 'admin', // Change as needed
            password: '1234',
        });

        await newAdmin.save();
        console.log('Admin account created successfully.');
    } catch (error) {
        console.error('Error creating admin account:', error);
    }
};

module.exports = createAdmin;

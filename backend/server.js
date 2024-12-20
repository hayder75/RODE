const express = require('express');
const cors = require('cors')
const connectDB = require('./config/db'); // Use your db.js
const createAdmin = require('./createAdmin'); // Adjust path if necessary
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config(); // Load .env variables

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // For parsing application/json

// Connect to MongoDB and create an initial admin if needed
connectDB()
    .then(() => {
        createAdmin()
    })
    .catch(err => console.error('Error during initialization:', err));

// Use routes
app.use('/api/v1/admin', adminRoutes); 
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

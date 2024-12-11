import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage'; // This should contain your dashboard logic
import Dashboard from './components/Dashboard'; // Ensure you import Dashboard

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/admin/dashboard" element={<Dashboard />} /> {/* Dashboard route */}
                {/* Add other routes as needed */}
            </Routes>
        </Router>
    );
};

export default App;

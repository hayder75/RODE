import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './components/Dashboard'; 
import UserManagement from './components/UserManagement';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<UserManagement />} /> {/* Use element here */}
                {/* Add other routes as needed */}
            </Routes>
        </Router>
    );
};

export default App;

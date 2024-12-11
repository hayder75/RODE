import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLogin from '../components/AdminLogin';
import { login } from '../api/index';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      const { data } = await login(credentials); // Call login API
      localStorage.setItem('token', data.token); // Store token
      navigate('/admin/dashboard'); // Redirect to the dashboard
    } catch (error) {
      alert('Invalid credentials!'); // Error feedback
    }
  };

  return <AdminLogin onLogin={handleLogin} />; // Pass onLogin as a prop
};

export default LoginPage;

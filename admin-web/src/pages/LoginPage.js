import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { login } from '../api';

const LoginPage = () => {
    const navigate = useNavigate();

    const handleLogin = async (credentials) => {
        try {
            const { data } = await login(credentials);
            localStorage.setItem('token', data.token);
            navigate('/admin');
        } catch {
            alert('Invalid credentials!');
        }
    };

    return <LoginForm onLogin={handleLogin} />;
};

export default LoginPage;

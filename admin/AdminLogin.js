import React, { useState } from 'react';
import axios from 'axios';

const AdminLogin = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/admin/login', { email, password });
      setToken(response.data.token); // Store token in state or local storage
      // Redirect to dashboard
    } catch (error) {
      console.error(error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <input type="email" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usernmae" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

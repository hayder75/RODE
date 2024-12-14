import React, { useState } from 'react';
import { login } from '../api/index';

const AdminLogin = ({ onLogin }) => { // Accept onLogin as a prop
  const [username, setUsername] = useState(''); // State for username
  const [password, setPassword] = useState(''); // State for password
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleLogin = async () => {
    {
      await onLogin({ username, password }); // Use the passed onLogin handler
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Admin Login</h2>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          style={{ padding: '10px', width: '300px', marginBottom: '10px' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{ padding: '10px', width: '300px', marginBottom: '10px' }}
        />
      </div>
      <button
        onClick={handleLogin}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          backgroundColor: isLoading ? '#ccc' : '#007BFF',
          color: '#fff',
          border: 'none',
          cursor: isLoading ? 'not-allowed' : 'pointer',
        }}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
};

export default AdminLogin;
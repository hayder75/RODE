import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/admin', // Adjust based on your server URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginAdmin = async (email, password) => {
  return await apiClient.post('/login', { email, password });
};

// Add other API functions here...

export default apiClient;

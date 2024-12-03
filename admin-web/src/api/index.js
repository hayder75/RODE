import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/v1/admin' });

// Authentication
export const login = (credentials) => API.post('/auth/login', credentials);

// Fetch dashboard data
export const fetchDashboard = () => API.get('/dashboard');

// Verify screenshot
export const verifyScreenshot = (id) => API.post(`/verify/${id}`);

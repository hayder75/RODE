import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/v1/admin' });

// Add a request interceptor to include the token in headers
API.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // Get token from local storage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Set Authorization header
    }
    return config;
});
// Authentication
export const login = (credentials) => API.post('/login', credentials); // Ensure this matches your backend route

// Question Management
export const uploadQuestion = (questionData) => API.post('/questions', questionData);
export const editQuestion = (id, questionData) => API.put(`/questions/${id}`, questionData);
export const deleteQuestion = (id) => API.delete(`/questions/${id}`);

// Reference Management
export const uploadReference = (referenceData) => API.post('/references', referenceData);
export const deleteReference = (id) => API.delete(`/references/${id}`);
export const getReferences = () => API.get('/references');

// User Verification
export const getPendingVerifications = () => API.get('/pending-verifications');
export const verifyUser = (id) => API.put(`/users/${id}/verify`);

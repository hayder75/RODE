import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'http://192.168.31.138:5000/api/users', // Updated to match the backend IP
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Optional: Set a timeout to catch long waits
});

export default axiosInstance;

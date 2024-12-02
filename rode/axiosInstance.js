import axios from "axios";
const axiosInstance = axios.create({
  baseURL: 'http://192.168.17.141:5000/api/auth', // Replace this with your backend IP
  headers: {
    'Content-Type': 'application/json',
  },
});


export default axiosInstance;

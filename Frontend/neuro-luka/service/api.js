import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // URL backend Laravel
  withCredentials: true, // Untuk mendukung Laravel Sanctum
});

export default api;
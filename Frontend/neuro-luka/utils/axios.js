import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true,
    timeout: 10000
});

// Add response interceptor for better error handling
instance.interceptors.response.use(
    response => response,
    error => {
        // Don't log 401 errors as they are expected for unauthenticated users
        if (error.response?.status !== 401) {
            console.error('API Error:', error.response || error);
        }
        return Promise.reject(error);
    }
);

export default instance;
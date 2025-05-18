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

// Add request interceptor for CSRF token
instance.interceptors.request.use(
    async (config) => {
        // Don't add CSRF token for external APIs
        if (!config.url.includes('localhost:8090')) {
            try {
                await axios.get('/sanctum/csrf-cookie', {
                    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
                    withCredentials: true
                });
            } catch (error) {
                console.error('Error getting CSRF token:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('API Error:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
        } else if (error.request) {
            // The request was made but no response was received
            console.error('API Error: No response received', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('API Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default instance;
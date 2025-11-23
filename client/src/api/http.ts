import axios from 'axios';
import { auth } from '../config/firebase';
import { waitForAuth } from '../config/authReady';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8080', // Backend URL
});

// Add a request interceptor to attach the token
api.interceptors.request.use(async (config) => {
    try {
        // Wait for Firebase auth to be fully initialized
        await waitForAuth();

        const user = auth.currentUser;

        if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
            console.log('✅ Auth token attached to request');
        } else {
            console.error('❌ No authenticated user - please login');
            throw new Error('User not authenticated');
        }
    } catch (error) {
        console.error('❌ Error getting auth token:', error);
        throw error;
    }
    return config;
}, (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('401 Unauthorized - Please re-login');
        }
        return Promise.reject(error);
    }
);

export default api;

import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8080', // Backend URL
});

// Add a request interceptor to attach the token
api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;

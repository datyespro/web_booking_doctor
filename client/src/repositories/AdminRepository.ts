import axios from 'axios';
import { auth } from '../config/firebase';

const API_URL = 'http://localhost:8080/admin';

const getAuthHeader = async () => {
    const token = await auth.currentUser?.getIdToken();
    return { Authorization: `Bearer ${token}` };
};

export const AdminRepository = {
    getAllPatients: async () => {
        const headers = await getAuthHeader();
        const response = await axios.get(`${API_URL}/patients`, { headers });
        return response.data;
    },

    getPatientById: async (id: string) => {
        const headers = await getAuthHeader();
        const response = await axios.get(`${API_URL}/patients/${id}`, { headers });
        return response.data;
    },

    createPatient: async (data: any) => {
        const headers = await getAuthHeader();
        const response = await axios.post(`${API_URL}/patients`, data, { headers });
        return response.data;
    },

    updatePatient: async (id: string, data: any) => {
        const headers = await getAuthHeader();
        const response = await axios.put(`${API_URL}/patients/${id}`, data, { headers });
        return response.data;
    },

    deletePatient: async (id: string) => {
        const headers = await getAuthHeader();
        const response = await axios.delete(`${API_URL}/patients/${id}`, { headers });
        return response.data;
    },

    getAllDoctors: async () => {
        const headers = await getAuthHeader();
        const response = await axios.get(`${API_URL}/doctors`, { headers });
        return response.data;
    },

    getDoctorById: async (id: string) => {
        const headers = await getAuthHeader();
        const response = await axios.get(`${API_URL}/doctors/${id}`, { headers });
        return response.data;
    },

    createDoctor: async (data: any) => {
        const headers = await getAuthHeader();
        const response = await axios.post(`${API_URL}/doctors`, data, { headers });
        return response.data;
    },

    updateDoctor: async (id: string, data: any) => {
        const headers = await getAuthHeader();
        const response = await axios.put(`${API_URL}/doctors/${id}`, data, { headers });
        return response.data;
    },

    deleteDoctor: async (id: string) => {
        const headers = await getAuthHeader();
        const response = await axios.delete(`${API_URL}/doctors/${id}`, { headers });
        return response.data;
    }
};

import { useState, useEffect } from 'react';
import type { Doctor } from '../types/entities/Doctor';

const API_URL = 'http://localhost:8080';

export const useDoctorById = (doctorId: string) => {
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/doctors/${doctorId}`);
                if (!response.ok) throw new Error('Doctor not found');
                const data = await response.json();
                setDoctor(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (doctorId) {
            fetchDoctor();
        }
    }, [doctorId]);

    return { doctor, loading, error };
};

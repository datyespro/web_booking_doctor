import { useState, useEffect } from 'react';
import { doctorRepository } from '../api/repositories/DoctorRepository';
import type { Doctor } from '../types/entities/Doctor';

export function useDoctors() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                const data = await doctorRepository.getAll();
                setDoctors(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch doctors:', err);
                setError('Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    return { doctors, loading, error };
}

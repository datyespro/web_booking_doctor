import { useState, useEffect } from 'react';
import { doctorRepository } from '../api/repositories/DoctorRepository';
import type { Doctor } from '../types/entities/Doctor';

export function useDoctor(doctorId: string | undefined) {
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!doctorId) return;

        const fetchDoctor = async () => {
            try {
                setLoading(true);
                const data = await doctorRepository.getById(doctorId);
                setDoctor(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch doctor:', err);
                setError('Không thể tải thông tin bác sĩ.');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [doctorId]);

    return { doctor, loading, error };
}

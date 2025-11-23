import { useState, useEffect } from 'react';
import { appointmentRepository } from '../api/repositories/AppointmentRepository';
import type { Appointment } from '../types/entities/Appointment';

export function useMyAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const data = await appointmentRepository.getMyAppointments();
            setAppointments(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch appointments:', err);
            setError('Không thể tải lịch sử khám.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const refetch = () => {
        fetchAppointments();
    };

    return { appointments, loading, error, refetch };
}

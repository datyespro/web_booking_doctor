import { useState, useEffect, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import http from '../api/http';
import { Appointment } from '../types/entities/Appointment';

export const useDoctorAppointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAppointments = useCallback(async () => {
        try {
            setLoading(true);
            const response = await http.get('/appointments/doctor/me');
            setAppointments(response.data);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching doctor appointments:', err);
            setError(err.message || 'Failed to fetch appointments');
            notifications.show({
                title: 'Error',
                message: 'Failed to load appointments',
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const updateStatus = async (id: string, status: 'confirmed' | 'completed' | 'cancelled') => {
        try {
            await http.patch(`/appointments/${id}/status`, { status });
            notifications.show({
                title: 'Success',
                message: `Appointment ${status} successfully`,
                color: 'green',
            });
            // Optimistic update or refetch
            setAppointments(prev => prev.map(app =>
                app.id === id ? { ...app, status } : app
            ));
        } catch (err: any) {
            console.error('Error updating status:', err);
            notifications.show({
                title: 'Error',
                message: 'Failed to update status',
                color: 'red',
            });
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    return { appointments, loading, error, refetch: fetchAppointments, updateStatus };
};

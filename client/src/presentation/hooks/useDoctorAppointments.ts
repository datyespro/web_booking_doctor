import { useState, useEffect, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { AppointmentViewModel } from '../viewmodels/AppointmentViewModel';
import { getDoctorAppointmentsUseCase, updateAppointmentStatusUseCase, appointmentPresenter } from '../../infrastructure/container';
import type { AppointmentStatus } from '../../domain/entities/Appointment';

/**
 * Hook for doctor to view and manage their patient appointments using Clean Architecture
 */
export function useDoctorAppointments() {
    const [appointments, setAppointments] = useState<AppointmentViewModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAppointments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Execute use case
            const domainAppointments = await getDoctorAppointmentsUseCase.execute();

            // Convert to ViewModels
            const viewModels = appointmentPresenter.toViewModelList(domainAppointments);

            setAppointments(viewModels);
        } catch (err: unknown) {
            console.error('Error fetching doctor appointments:', err);
            const message = err instanceof Error ? err.message : 'Failed to fetch appointments';
            setError(message);
            notifications.show({
                title: 'Error',
                message: 'Failed to load appointments',
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const updateStatus = useCallback(async (id: string, status: AppointmentStatus) => {
        try {
            // Execute use case
            await updateAppointmentStatusUseCase.execute(id, status);

            notifications.show({
                title: 'Success',
                message: `Appointment ${status} successfully`,
                color: 'green',
            });

            // Optimistic update
            setAppointments(prev => prev.map(app =>
                app.id === id ? { ...app, status, statusLabel: getStatusLabel(status) } : app
            ));
        } catch (err) {
            console.error('Error updating status:', err);
            notifications.show({
                title: 'Error',
                message: 'Failed to update status',
                color: 'red',
            });
        }
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    return { appointments, loading, error, refetch: fetchAppointments, updateStatus };
}

function getStatusLabel(status: AppointmentStatus): string {
    const labels: Record<AppointmentStatus, string> = {
        pending: 'Chờ xác nhận',
        confirmed: 'Đã xác nhận',
        completed: 'Hoàn thành',
        cancelled: 'Đã hủy'
    };
    return labels[status];
}

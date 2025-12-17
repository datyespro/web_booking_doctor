import { useState, useEffect, useCallback } from 'react';
import { AppointmentViewModel } from '../viewmodels/AppointmentViewModel';
import { getMyAppointmentsUseCase, appointmentPresenter } from '../../infrastructure/container';

/**
 * Hook to fetch current user's appointments using Clean Architecture
 * Returns ViewModels ready for UI rendering
 */
export function useMyAppointments() {
    const [appointments, setAppointments] = useState<AppointmentViewModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAppointments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Execute use case (contains business logic)
            const domainAppointments = await getMyAppointmentsUseCase.execute();

            // Convert to ViewModels using presenter
            const viewModels = appointmentPresenter.toViewModelList(domainAppointments);

            setAppointments(viewModels);
        } catch (err) {
            console.error('Failed to fetch appointments:', err);
            setError('Không thể tải lịch sử khám.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const refetch = useCallback(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    return { appointments, loading, error, refetch };
}

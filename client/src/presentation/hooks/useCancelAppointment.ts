import { useState, useCallback } from 'react';
import { cancelAppointmentUseCase } from '../../infrastructure/container';

/**
 * Hook for cancelling appointments using Clean Architecture
 */
export function useCancelAppointment() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cancelAppointment = useCallback(async (appointmentId: string) => {
        try {
            setLoading(true);
            setError(null);

            // Execute use case
            await cancelAppointmentUseCase.execute(appointmentId);

            return true;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'Hủy lịch thất bại';
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return { cancelAppointment, loading, error };
}

import { useState, useCallback } from 'react';
import { deleteAppointmentUseCase } from '../../infrastructure/container';

/**
 * Hook for deleting appointments using Clean Architecture
 */
export function useDeleteAppointment() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteAppointment = useCallback(async (appointmentId: string) => {
        try {
            setLoading(true);
            setError(null);

            // Execute use case
            await deleteAppointmentUseCase.execute(appointmentId);

            return true;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'Xóa lịch thất bại';
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return { deleteAppointment, loading, error };
}

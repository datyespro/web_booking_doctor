import { useState, useCallback } from 'react';
import { bookAppointmentUseCase } from '../../infrastructure/container';
import { CreateAppointmentData } from '../../domain/entities/Appointment';

/**
 * Hook for booking appointments using Clean Architecture
 */
export function useBooking() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const bookAppointment = useCallback(async (data: CreateAppointmentData) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            // Execute use case
            await bookAppointmentUseCase.execute(data);

            setSuccess(true);
            return true;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'Đặt lịch thất bại';
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const resetState = useCallback(() => {
        setError(null);
        setSuccess(false);
    }, []);

    return {
        bookAppointment,
        loading,
        error,
        success,
        resetState
    };
}

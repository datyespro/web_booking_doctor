import { useState } from 'react';
import { appointmentRepository } from '../api/repositories/AppointmentRepository';
import type { CreateAppointmentRequest } from '../types/entities/Appointment';

export function useBooking() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const bookAppointment = async (data: CreateAppointmentRequest) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            await appointmentRepository.create(data);

            setSuccess(true);
            return true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Đặt lịch thất bại';
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setError(null);
        setSuccess(false);
    };

    return {
        bookAppointment,
        loading,
        error,
        success,
        resetState
    };
}

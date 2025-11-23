import { useState } from 'react';
import { appointmentRepository } from '../api/repositories/AppointmentRepository';

export const useDeleteAppointment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteAppointment = async (appointmentId: string, onSuccess?: () => void) => {
        setLoading(true);
        setError(null);

        try {
            await appointmentRepository.delete(appointmentId);

            if (onSuccess) {
                onSuccess();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { deleteAppointment, loading, error };
};

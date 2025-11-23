import { useState } from 'react';
import { appointmentRepository } from '../api/repositories/AppointmentRepository';
import { notifications } from '@mantine/notifications';

export function useCancelAppointment() {
    const [loading, setLoading] = useState(false);

    const cancelAppointment = async (appointmentId: string, onSuccess?: () => void) => {
        try {
            setLoading(true);
            await appointmentRepository.cancel(appointmentId);

            notifications.show({
                title: 'Thành công',
                message: 'Đã hủy lịch hẹn thành công',
                color: 'green',
            });

            if (onSuccess) {
                onSuccess();
            }
            return true;
        } catch (error: any) {
            const message = error.response?.data?.error || 'Không thể hủy lịch hẹn';
            notifications.show({
                title: 'Thất bại',
                message: message,
                color: 'red',
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        cancelAppointment,
        loading
    };
}

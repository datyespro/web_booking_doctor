import { useState, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import http from '../api/http';
import { useAuthStore } from '../stores/auth.store';
import dayjs from 'dayjs';

export interface TimeSlot {
    id: string;
    time: string;
    isBooked: boolean;
}

export interface DailySchedule {
    date: string;
    doctorId: string;
    slots: TimeSlot[];
}

export const useDoctorSchedule = () => {
    const { user } = useAuthStore();
    const [schedule, setSchedule] = useState<DailySchedule | null>(null);
    const [loading, setLoading] = useState(false);

    // ...

    const fetchSchedule = useCallback(async (date: Date) => {
        if (!user?.doctorId) return;

        try {
            setLoading(true);
            const dateStr = dayjs(date).format('YYYY-MM-DD');
            const response = await http.get(`/doctors/${user.doctorId}/schedule?date=${dateStr}`);
            setSchedule(response.data);
        } catch (err) {
            console.error('Error fetching schedule:', err);
            setSchedule(null);
        } finally {
            setLoading(false);
        }
    }, [user?.doctorId]);

    const saveSchedule = async (date: Date, slots: TimeSlot[]) => {
        if (!user?.doctorId) return;

        try {
            const dateStr = dayjs(date).format('YYYY-MM-DD');

            await http.post('/doctors/me/schedule', {
                date: dateStr,
                slots
            });

            notifications.show({
                title: 'Success',
                message: 'Schedule saved successfully',
                color: 'green',
            });

            fetchSchedule(date);
        } catch (err) {
            console.error('Error saving schedule:', err);
            notifications.show({
                title: 'Error',
                message: 'Failed to save schedule',
                color: 'red',
            });
        }
    };

    return { schedule, loading, fetchSchedule, saveSchedule };
};

import { useState, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import { ScheduleViewModel, TimeSlotViewModel } from '../viewmodels/ScheduleViewModel';
import { getDoctorScheduleUseCase, saveDoctorScheduleUseCase, schedulePresenter } from '../../infrastructure/container';
import { TimeSlot } from '../../domain/entities/Schedule';
import { useAuthStore } from '../../stores/auth.store';

/**
 * Hook for managing doctor schedule using Clean Architecture
 */
export function useDoctorSchedule() {
    const { user } = useAuthStore();
    const [schedule, setSchedule] = useState<ScheduleViewModel | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchSchedule = useCallback(async (date: Date) => {
        if (!user?.doctorId) return;

        try {
            setLoading(true);
            const dateStr = dayjs(date).format('YYYY-MM-DD');

            // Execute use case
            const domainSchedule = await getDoctorScheduleUseCase.execute(user.doctorId, dateStr);

            if (domainSchedule) {
                // Convert to ViewModel
                const viewModel = schedulePresenter.toViewModel(domainSchedule);
                setSchedule(viewModel);
            } else {
                setSchedule(null);
            }
        } catch (err) {
            console.error('Error fetching schedule:', err);
            setSchedule(null);
        } finally {
            setLoading(false);
        }
    }, [user?.doctorId]);

    const saveSchedule = useCallback(async (date: Date, slots: TimeSlotViewModel[]) => {
        if (!user?.doctorId) return;

        try {
            const dateStr = dayjs(date).format('YYYY-MM-DD');

            // Convert ViewModels to domain entities
            const domainSlots: TimeSlot[] = slots.map(slot =>
                new TimeSlot(slot.id, slot.time, slot.isBooked)
            );

            // Execute use case
            await saveDoctorScheduleUseCase.execute(user.doctorId, dateStr, domainSlots);

            notifications.show({
                title: 'Thành công',
                message: 'Đã lưu lịch làm việc',
                color: 'green',
            });

            fetchSchedule(date);
        } catch (err) {
            console.error('Error saving schedule:', err);
            notifications.show({
                title: 'Lỗi',
                message: 'Không thể lưu lịch làm việc',
                color: 'red',
            });
        }
    }, [user?.doctorId, fetchSchedule]);

    return { schedule, loading, fetchSchedule, saveSchedule };
}

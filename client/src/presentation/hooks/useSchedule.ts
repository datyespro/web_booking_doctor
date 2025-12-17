import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { TimeSlotViewModel } from '../viewmodels/ScheduleViewModel';
import { getDoctorScheduleUseCase, schedulePresenter } from '../../infrastructure/container';

/**
 * Hook for fetching a doctor's schedule (for patients) using Clean Architecture
 * Automatically fetches when doctorId or date changes
 * Returns slots directly for backward compatibility
 */
export function useSchedule(doctorId: string | undefined, date: string | null) {
    const [slots, setSlots] = useState<TimeSlotViewModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!doctorId || !date) {
            setSlots([]);
            return;
        }

        const fetchSchedule = async () => {
            try {
                setLoading(true);
                setError(null);

                // Execute use case
                const domainSchedule = await getDoctorScheduleUseCase.execute(doctorId, date);

                if (domainSchedule) {
                    // Convert to ViewModel and extract slots
                    const viewModel = schedulePresenter.toViewModel(domainSchedule);
                    setSlots(viewModel.slots);
                } else {
                    setSlots([]);
                }
            } catch (err) {
                console.error('Error fetching schedule:', err);
                setError('Không thể tải lịch làm việc');
                setSlots([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [doctorId, date]);

    return { slots, loading, error };
}

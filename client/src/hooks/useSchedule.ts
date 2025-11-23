import { useState, useEffect } from 'react';
import { doctorRepository } from '../api/repositories/DoctorRepository';
import type { TimeSlot } from '../types/entities/Schedule';

export function useSchedule(doctorId: string | undefined, dateString: string | null) {
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!doctorId || !dateString) {
            setSlots([]);
            setLoading(false);
            return;
        }

        const fetchSchedule = async () => {
            try {
                setLoading(true);
                const schedule = await doctorRepository.getSchedule(doctorId, dateString);
                setSlots(schedule.slots || []);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch schedule:', err);
                setSlots([]);
                setError('Không thể tải lịch khám.');
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [doctorId, dateString]);

    return { slots, loading, error };
}

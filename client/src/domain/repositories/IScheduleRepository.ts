import type { DailySchedule, TimeSlot } from '../entities/Schedule';

/**
 * Repository interface for Schedule operations
 * This is an abstraction - concrete implementation will be in infrastructure layer
 */
export interface IScheduleRepository {
    /**
     * Get doctor's schedule for a specific date
     */
    getSchedule(doctorId: string, date: string): Promise<DailySchedule | null>;

    /**
     * Save doctor's schedule for a specific date
     */
    saveSchedule(doctorId: string, date: string, slots: TimeSlot[]): Promise<void>;
}

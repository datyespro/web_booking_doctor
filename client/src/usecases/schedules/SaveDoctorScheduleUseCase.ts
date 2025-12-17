import type { TimeSlot } from '../../domain/entities/Schedule';
import type { IScheduleRepository } from '../../domain/repositories/IScheduleRepository';

/**
 * Use Case: Save doctor's schedule for a specific date
 * Application business logic for saving schedules
 */
export class SaveDoctorScheduleUseCase {
    constructor(private repository: IScheduleRepository) { }

    async execute(doctorId: string, date: string, slots: TimeSlot[]): Promise<void> {
        await this.repository.saveSchedule(doctorId, date, slots);
    }
}

import type { DailySchedule } from '../../domain/entities/Schedule';
import type { IScheduleRepository } from '../../domain/repositories/IScheduleRepository';

/**
 * Use Case: Get doctor's schedule for a specific date
 * Application business logic for retrieving schedules
 */
export class GetDoctorScheduleUseCase {
    constructor(private repository: IScheduleRepository) { }

    async execute(doctorId: string, date: string): Promise<DailySchedule | null> {
        return await this.repository.getSchedule(doctorId, date);
    }
}

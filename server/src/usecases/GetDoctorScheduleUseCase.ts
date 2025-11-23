import { DailySchedule } from '../domain/entities/Schedule';
import { IDoctorRepository } from '../domain/repositories/IDoctorRepository';

export class GetDoctorScheduleUseCase {
    constructor(private doctorRepository: IDoctorRepository) { }

    async execute(doctorId: string, date: string): Promise<DailySchedule | null> {
        const schedule = await this.doctorRepository.getSchedule(doctorId, date);

        // Return empty schedule if not found
        if (!schedule) {
            return {
                date,
                doctorId,
                slots: []
            };
        }

        return schedule;
    }
}

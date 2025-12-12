import { IDoctorRepository } from '../domain/repositories/IDoctorRepository';
import { TimeSlot } from '../domain/entities/Schedule';

export class SaveDoctorScheduleUseCase {
    constructor(private doctorRepository: IDoctorRepository) { }

    async execute(doctorId: string, date: string, slots: TimeSlot[]): Promise<void> {
        // Validate date is not in the past
        const scheduleDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Allow saving for today or future
        if (scheduleDate < today) {
            throw new Error('Cannot save schedule for past dates');
        }

        // Sort slots by time
        const sortedSlots = [...slots].sort((a, b) => {
            return a.time.localeCompare(b.time);
        });

        await this.doctorRepository.updateSchedule({
            doctorId,
            date,
            slots: sortedSlots
        });
    }
}

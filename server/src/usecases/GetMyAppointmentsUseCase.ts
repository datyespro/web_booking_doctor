import { Appointment } from '../domain/entities/Appointment';
import { IAppointmentRepository } from '../domain/repositories/IAppointmentRepository';

export class GetMyAppointmentsUseCase {
    constructor(private appointmentRepository: IAppointmentRepository) { }

    async execute(userId: string): Promise<Appointment[]> {
        const appointments = await this.appointmentRepository.findByUser(userId);

        // Sort by createdAt descending (newest first) - Application layer sorting
        return appointments.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
        });
    }
}

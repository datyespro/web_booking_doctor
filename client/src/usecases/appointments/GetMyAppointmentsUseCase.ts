import type { Appointment } from '../../domain/entities/Appointment';
import type { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';

/**
 * Use Case: Get current user's appointments
 * Application business logic for retrieving patient's appointments
 */
export class GetMyAppointmentsUseCase {
    constructor(private repository: IAppointmentRepository) { }

    async execute(): Promise<Appointment[]> {
        const appointments = await this.repository.getMyAppointments();
        // Sort by date descending (most recent first)
        return appointments.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
}

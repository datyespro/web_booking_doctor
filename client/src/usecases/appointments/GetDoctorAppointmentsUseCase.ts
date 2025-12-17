import type { Appointment } from '../../domain/entities/Appointment';
import type { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';

/**
 * Use Case: Get doctor's appointments
 * Application business logic for retrieving doctor's patient appointments
 */
export class GetDoctorAppointmentsUseCase {
    constructor(private repository: IAppointmentRepository) { }

    async execute(): Promise<Appointment[]> {
        const appointments = await this.repository.getDoctorAppointments();
        // Sort by date ascending (upcoming first)
        return appointments.sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }
}

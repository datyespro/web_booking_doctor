import type { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';

/**
 * Use Case: Delete an appointment
 * Application business logic for deleting appointments
 */
export class DeleteAppointmentUseCase {
    constructor(private repository: IAppointmentRepository) { }

    async execute(appointmentId: string): Promise<void> {
        await this.repository.delete(appointmentId);
    }
}

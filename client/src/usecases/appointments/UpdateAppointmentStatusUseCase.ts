import type { AppointmentStatus } from '../../domain/entities/Appointment';
import type { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';

/**
 * Use Case: Update appointment status
 * Application business logic for doctors to update appointment status
 */
export class UpdateAppointmentStatusUseCase {
    constructor(private repository: IAppointmentRepository) { }

    async execute(appointmentId: string, status: AppointmentStatus): Promise<void> {
        await this.repository.updateStatus(appointmentId, status);
    }
}

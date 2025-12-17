import type { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';

/**
 * Use Case: Cancel an appointment
 * Application business logic for cancelling appointments
 */
export class CancelAppointmentUseCase {
    constructor(private repository: IAppointmentRepository) { }

    async execute(appointmentId: string): Promise<void> {
        await this.repository.cancel(appointmentId);
    }
}

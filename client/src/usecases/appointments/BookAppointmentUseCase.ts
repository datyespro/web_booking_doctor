import type { Appointment, CreateAppointmentData } from '../../domain/entities/Appointment';
import type { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';

/**
 * Use Case: Book a new appointment
 * Application business logic for creating appointments
 */
export class BookAppointmentUseCase {
    constructor(private repository: IAppointmentRepository) { }

    async execute(data: CreateAppointmentData): Promise<Appointment> {
        // Business validation could go here
        // e.g., check if date is not in the past, etc.
        return await this.repository.create(data);
    }
}

import { Appointment } from '../domain/entities/Appointment';
import { IAppointmentRepository } from '../domain/repositories/IAppointmentRepository';

export class GetDoctorAppointmentsUseCase {
    constructor(private appointmentRepository: IAppointmentRepository) { }

    async execute(doctorId: string): Promise<Appointment[]> {
        // In a real app, we might want to add date filtering or pagination here
        return this.appointmentRepository.findByDoctorId(doctorId);
    }
}

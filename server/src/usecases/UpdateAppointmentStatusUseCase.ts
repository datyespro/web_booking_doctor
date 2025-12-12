import { IAppointmentRepository } from '../domain/repositories/IAppointmentRepository';
import { IDoctorRepository } from '../domain/repositories/IDoctorRepository';
import { AppointmentStatus } from '../domain/entities/Appointment';

export class UpdateAppointmentStatusUseCase {
    constructor(
        private appointmentRepository: IAppointmentRepository,
        private doctorRepository: IDoctorRepository
    ) { }

    async execute(appointmentId: string, status: AppointmentStatus, doctorId: string): Promise<void> {
        const appointment = await this.appointmentRepository.findById(appointmentId);

        if (!appointment) {
            throw new Error('Appointment not found');
        }

        if (appointment.doctorId !== doctorId) {
            throw new Error('Unauthorized: You can only update your own appointments');
        }

        appointment.status = status;
        await this.appointmentRepository.update(appointment);
    }
}

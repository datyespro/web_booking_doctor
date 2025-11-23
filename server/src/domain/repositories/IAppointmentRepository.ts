import { Appointment } from '../entities/Appointment';

export interface IAppointmentRepository {
    create(appointment: Appointment): Promise<void>;
    findByUser(userId: string): Promise<Appointment[]>;
    findByDoctorAndDate(doctorId: string, date: string): Promise<Appointment[]>;
    delete(id: string): Promise<void>;
}

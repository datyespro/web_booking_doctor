import { Appointment } from '../entities/Appointment';

export interface IAppointmentRepository {
    create(appointment: Appointment): Promise<void>;
    findByUser(userId: string): Promise<Appointment[]>;
    findByDoctorId(doctorId: string): Promise<Appointment[]>;
    findByDoctorAndDate(doctorId: string, date: string): Promise<Appointment[]>;
    findById(id: string): Promise<Appointment | null>;
    update(appointment: Appointment): Promise<void>;
    delete(id: string): Promise<void>;
}

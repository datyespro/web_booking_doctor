import type { Appointment, CreateAppointmentData, AppointmentStatus } from '../entities/Appointment';

/**
 * Repository interface for Appointment operations
 * This is an abstraction - concrete implementation will be in infrastructure layer
 */
export interface IAppointmentRepository {
    /**
     * Get current user's appointments
     */
    getMyAppointments(): Promise<Appointment[]>;

    /**
     * Create a new appointment (book)
     */
    create(data: CreateAppointmentData): Promise<Appointment>;

    /**
     * Cancel an appointment
     */
    cancel(id: string): Promise<void>;

    /**
     * Delete an appointment
     */
    delete(id: string): Promise<void>;

    /**
     * Get appointments for the logged-in doctor
     */
    getDoctorAppointments(): Promise<Appointment[]>;

    /**
     * Update appointment status (for doctors)
     */
    updateStatus(id: string, status: AppointmentStatus): Promise<void>;
}

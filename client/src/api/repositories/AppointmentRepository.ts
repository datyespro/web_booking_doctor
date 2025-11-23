import api from '../http';
import type { Appointment, CreateAppointmentRequest } from '../../types/entities/Appointment';

export class AppointmentRepository {
    /**
     * Create a new appointment (book appointment)
     */
    async create(data: CreateAppointmentRequest): Promise<Appointment> {
        const response = await api.post<Appointment>('/appointments', data);
        return response.data;
    }

    /**
     * Get current user's appointments
     */
    async getMyAppointments(): Promise<Appointment[]> {
        const response = await api.get<Appointment[]>('/appointments/my-appointments');
        return response.data;
    }

    /**
     * Cancel an appointment
     */
    async cancel(appointmentId: string): Promise<void> {
        await api.post(`/appointments/${appointmentId}/cancel`);
    }

    /**
     * Delete an appointment
     */
    async delete(appointmentId: string): Promise<void> {
        await api.delete(`/appointments/${appointmentId}`);
    }
}

// Export singleton instance
export const appointmentRepository = new AppointmentRepository();

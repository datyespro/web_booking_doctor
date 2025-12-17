import { IAppointmentRepository } from '../../domain/repositories/IAppointmentRepository';
import { Appointment, CreateAppointmentData, AppointmentStatus } from '../../domain/entities/Appointment';
import apiClient from '../http/httpClient';

/**
 * DTO from API response
 */
interface AppointmentDTO {
    id: string;
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    specialtyName: string;
    date: string;
    timeSlotId: string;
    timeText: string;
    status: AppointmentStatus;
    patientPhone: string;
    patientGender: string;
    patientDob: string;
    patientAddress: string;
    reason: string;
    createdAt: string;
    hasReviewed?: boolean;
}

/**
 * API implementation of IAppointmentRepository
 * Converts between API DTOs and Domain Entities
 */
export class ApiAppointmentRepository implements IAppointmentRepository {
    async getMyAppointments(): Promise<Appointment[]> {
        const response = await apiClient.get<AppointmentDTO[]>('/appointments/my-appointments');
        return response.data.map(dto => this.toDomain(dto));
    }

    async create(data: CreateAppointmentData): Promise<Appointment> {
        const response = await apiClient.post<AppointmentDTO>('/appointments', data);
        return this.toDomain(response.data);
    }

    async cancel(id: string): Promise<void> {
        await apiClient.post(`/appointments/${id}/cancel`);
    }

    async delete(id: string): Promise<void> {
        await apiClient.delete(`/appointments/${id}`);
    }

    async getDoctorAppointments(): Promise<Appointment[]> {
        const response = await apiClient.get<AppointmentDTO[]>('/appointments/doctor/me');
        return response.data.map(dto => this.toDomain(dto));
    }

    async updateStatus(id: string, status: AppointmentStatus): Promise<void> {
        await apiClient.patch(`/appointments/${id}/status`, { status });
    }

    /**
     * Convert API DTO to Domain Entity
     */
    private toDomain(dto: AppointmentDTO): Appointment {
        return new Appointment(
            dto.id,
            dto.patientId,
            dto.patientName,
            dto.doctorId,
            dto.doctorName,
            dto.specialtyName,
            dto.date,
            dto.timeSlotId,
            dto.timeText,
            dto.status,
            dto.patientPhone,
            dto.patientGender,
            dto.patientDob,
            dto.patientAddress,
            dto.reason,
            dto.createdAt,
            dto.hasReviewed || false
        );
    }
}

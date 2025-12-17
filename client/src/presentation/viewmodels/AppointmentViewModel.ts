import type { AppointmentStatus } from '../../domain/entities/Appointment';

/**
 * View Model for Appointment
 * UI-friendly data structure optimized for rendering
 */
export interface AppointmentViewModel {
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
    hasReviewed: boolean;

    // Formatted display values
    formattedDate: string;           // "Thứ Hai, 16 tháng 12, 2025"
    statusLabel: string;             // "Chờ xác nhận"
    statusColor: string;             // "yellow", "green", etc.

    // UI indicators / Business rule flags
    canBeCancelled: boolean;
    canBeReviewed: boolean;
    isPast: boolean;
    isToday: boolean;
}

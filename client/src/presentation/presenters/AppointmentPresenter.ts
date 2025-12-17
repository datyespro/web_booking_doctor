import { Appointment } from '../../domain/entities/Appointment';
import { AppointmentViewModel } from '../viewmodels/AppointmentViewModel';

/**
 * Presenter for converting Appointment entities to ViewModels
 * Separates domain entities from UI representation
 */
export class AppointmentPresenter {
    /**
     * Convert a single Appointment entity to ViewModel
     */
    toViewModel(appointment: Appointment): AppointmentViewModel {
        return {
            id: appointment.id,
            patientId: appointment.patientId,
            patientName: appointment.patientName,
            doctorId: appointment.doctorId,
            doctorName: appointment.doctorName,
            specialtyName: appointment.specialtyName,
            date: appointment.date,
            timeSlotId: appointment.timeSlotId,
            timeText: appointment.timeText,
            status: appointment.status,
            patientPhone: appointment.patientPhone,
            patientGender: appointment.patientGender,
            patientDob: appointment.patientDob,
            patientAddress: appointment.patientAddress,
            reason: appointment.reason,
            createdAt: appointment.createdAt,
            hasReviewed: appointment.hasReviewed,

            // Formatted values using entity business logic
            formattedDate: appointment.getFormattedDate(),
            statusLabel: appointment.getStatusLabel(),
            statusColor: appointment.getStatusColor(),

            // Business rule flags
            canBeCancelled: appointment.canBeCancelled(),
            canBeReviewed: appointment.canBeReviewed(),
            isPast: appointment.isPast(),
            isToday: appointment.isToday()
        };
    }

    /**
     * Convert an array of Appointment entities to ViewModels
     */
    toViewModelList(appointments: Appointment[]): AppointmentViewModel[] {
        return appointments.map(app => this.toViewModel(app));
    }
}

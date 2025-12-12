export const AppointmentStatus = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
} as const;

export interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    specialtyName: string;
    date: string; // YYYY-MM-DD
    timeSlotId: string;
    timeText: string;
    status: typeof AppointmentStatus[keyof typeof AppointmentStatus] | 'pending' | 'confirmed' | 'cancelled' | 'completed';

    // Patient Info
    patientPhone: string;
    patientGender: string;
    patientDob: string;
    patientAddress: string;
    reason: string;

    createdAt: string;

    // Review status
    hasReviewed?: boolean;
}

export interface CreateAppointmentRequest {
    doctorId: string;
    doctorName: string;
    specialtyName: string;
    date: string;
    timeSlotId: string;
    timeText: string;
    // New fields
    patientPhone: string;
    patientGender: string;
    patientDob: string;
    patientAddress: string;
    reason: string;
}

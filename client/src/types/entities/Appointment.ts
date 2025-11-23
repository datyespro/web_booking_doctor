export const AppointmentStatus = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
} as const;

export interface Appointment {
    id: string;
    doctorName: string;
    specialtyName: string;
    date: string; // YYYY-MM-DD
    timeText: string; // e.g., "08:00 - 08:30"
    status: typeof AppointmentStatus[keyof typeof AppointmentStatus] | 'pending' | 'confirmed' | 'cancelled' | 'completed';
    createdAt: string;
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

export enum AppointmentStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    specialtyName: string; // Snapshot

    // Patient Details
    patientPhone: string;
    patientGender: string; // 'male' | 'female' | 'other'
    patientDob: string; // YYYY-MM-DD
    patientAddress: string;
    reason: string;

    date: string; // YYYY-MM-DD
    timeSlotId: string; // e.g. "08:00"
    timeText: string;
    status: AppointmentStatus;
    createdAt: Date;

    // Review status (populated when fetching)
    hasReviewed?: boolean;
}

/**
 * Appointment Domain Entity
 * Contains business logic and rules related to appointments
 */

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export class Appointment {
    constructor(
        public readonly id: string,
        public readonly patientId: string,
        public readonly patientName: string,
        public readonly doctorId: string,
        public readonly doctorName: string,
        public readonly specialtyName: string,
        public readonly date: string, // YYYY-MM-DD
        public readonly timeSlotId: string,
        public readonly timeText: string,
        public readonly status: AppointmentStatus,
        public readonly patientPhone: string,
        public readonly patientGender: string,
        public readonly patientDob: string,
        public readonly patientAddress: string,
        public readonly reason: string,
        public readonly createdAt: string,
        public readonly hasReviewed: boolean = false
    ) { }

    /**
     * Check if appointment can be cancelled
     * Business rule: Only pending or confirmed appointments can be cancelled
     */
    canBeCancelled(): boolean {
        return this.status === 'pending' || this.status === 'confirmed';
    }

    /**
     * Check if appointment can be reviewed
     * Business rule: Only completed appointments that haven't been reviewed can be reviewed
     */
    canBeReviewed(): boolean {
        return this.status === 'completed' && !this.hasReviewed;
    }

    /**
     * Check if appointment is in the past
     */
    isPast(): boolean {
        const appointmentDate = new Date(this.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return appointmentDate < today;
    }

    /**
     * Check if appointment is today
     */
    isToday(): boolean {
        const appointmentDate = new Date(this.date);
        const today = new Date();
        return appointmentDate.toDateString() === today.toDateString();
    }

    /**
     * Get status display label in Vietnamese
     */
    getStatusLabel(): string {
        const labels: Record<AppointmentStatus, string> = {
            pending: 'Chờ xác nhận',
            confirmed: 'Đã xác nhận',
            completed: 'Hoàn thành',
            cancelled: 'Đã hủy'
        };
        return labels[this.status];
    }

    /**
     * Get status color for UI
     */
    getStatusColor(): string {
        const colors: Record<AppointmentStatus, string> = {
            pending: 'yellow',
            confirmed: 'blue',
            completed: 'green',
            cancelled: 'red'
        };
        return colors[this.status];
    }

    /**
     * Get formatted date for display
     */
    getFormattedDate(): string {
        const date = new Date(this.date);
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

/**
 * DTO for creating new appointments
 */
export interface CreateAppointmentData {
    doctorId: string;
    doctorName: string;
    specialtyName: string;
    date: string;
    timeSlotId: string;
    timeText: string;
    patientPhone: string;
    patientGender: string;
    patientDob: string;
    patientAddress: string;
    reason: string;
}

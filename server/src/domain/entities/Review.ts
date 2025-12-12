export interface Review {
    id: string;
    doctorId: string;
    patientId: string;
    patientName: string;
    appointmentId?: string; // Link to the appointment being reviewed
    rating: number; // 1-5
    comment: string;
    createdAt: Date;
}

export interface CreateReviewRequest {
    doctorId: string;
    patientId: string;
    patientName: string;
    appointmentId?: string;
    rating: number;
    comment: string;
}

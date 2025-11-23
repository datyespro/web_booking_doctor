export interface Review {
    id: string;
    doctorId: string;
    patientId: string;
    patientName: string;
    rating: number;
    comment: string;
    createdAt: string; // ISO string from JSON
}

export interface CreateReviewRequest {
    rating: number;
    comment: string;
}

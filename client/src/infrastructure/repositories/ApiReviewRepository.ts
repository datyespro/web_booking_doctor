import { IReviewRepository } from '../../domain/repositories/IReviewRepository';
import { Review, CreateReviewData } from '../../domain/entities/Review';
import apiClient from '../http/httpClient';

/**
 * DTO from API response
 */
interface ReviewDTO {
    id: string;
    doctorId: string;
    patientId: string;
    patientName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

/**
 * API implementation of IReviewRepository
 * Converts between API DTOs and Domain Entities
 */
export class ApiReviewRepository implements IReviewRepository {
    async getByDoctorId(doctorId: string): Promise<Review[]> {
        const response = await apiClient.get<ReviewDTO[]>(`/doctors/${doctorId}/reviews`);
        return response.data.map(dto => this.toDomain(dto));
    }

    async create(doctorId: string, data: CreateReviewData): Promise<Review> {
        const response = await apiClient.post<ReviewDTO>(`/doctors/${doctorId}/reviews`, data);
        return this.toDomain(response.data);
    }

    /**
     * Convert API DTO to Domain Entity
     */
    private toDomain(dto: ReviewDTO): Review {
        return new Review(
            dto.id,
            dto.doctorId,
            dto.patientId,
            dto.patientName,
            dto.rating,
            dto.comment,
            dto.createdAt
        );
    }
}

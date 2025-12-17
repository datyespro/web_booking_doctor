import type { Review, CreateReviewData } from '../entities/Review';

/**
 * Repository interface for Review operations
 * This is an abstraction - concrete implementation will be in infrastructure layer
 */
export interface IReviewRepository {
    /**
     * Get all reviews for a doctor
     */
    getByDoctorId(doctorId: string): Promise<Review[]>;

    /**
     * Create a new review for a doctor
     */
    create(doctorId: string, data: CreateReviewData): Promise<Review>;
}

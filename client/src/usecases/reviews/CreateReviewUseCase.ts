import type { Review, CreateReviewData } from '../../domain/entities/Review';
import type { IReviewRepository } from '../../domain/repositories/IReviewRepository';

/**
 * Use Case: Create a review for a doctor
 * Application business logic for creating reviews
 */
export class CreateReviewUseCase {
    constructor(private repository: IReviewRepository) { }

    async execute(doctorId: string, data: CreateReviewData): Promise<Review> {
        // Business validation could go here
        // e.g., validate rating is between 1-5
        if (data.rating < 1 || data.rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }
        return await this.repository.create(doctorId, data);
    }
}

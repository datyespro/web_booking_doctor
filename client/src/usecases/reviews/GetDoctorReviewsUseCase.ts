import type { Review } from '../../domain/entities/Review';
import type { IReviewRepository } from '../../domain/repositories/IReviewRepository';

/**
 * Use Case: Get reviews for a doctor
 * Application business logic for retrieving doctor reviews
 */
export class GetDoctorReviewsUseCase {
    constructor(private repository: IReviewRepository) { }

    async execute(doctorId: string): Promise<Review[]> {
        const reviews = await this.repository.getByDoctorId(doctorId);
        // Sort by date descending (newest first)
        return reviews.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
}

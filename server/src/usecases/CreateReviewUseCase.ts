import { IReviewRepository } from '../domain/repositories/IReviewRepository';
import { CreateReviewRequest, Review } from '../domain/entities/Review';
import { v4 as uuidv4 } from 'uuid';

export class CreateReviewUseCase {
    constructor(private reviewRepository: IReviewRepository) { }

    async execute(request: CreateReviewRequest): Promise<Review> {
        // Basic validation
        if (request.rating < 1 || request.rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }
        if (!request.comment) {
            throw new Error('Comment is required');
        }

        const review: Review = {
            id: uuidv4(),
            doctorId: request.doctorId,
            patientId: request.patientId,
            patientName: request.patientName,
            rating: request.rating,
            comment: request.comment,
            createdAt: new Date()
        };

        return this.reviewRepository.create(review);
    }
}

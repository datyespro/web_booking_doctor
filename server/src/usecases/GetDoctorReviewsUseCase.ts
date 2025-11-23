import { IReviewRepository } from '../domain/repositories/IReviewRepository';
import { Review } from '../domain/entities/Review';

export class GetDoctorReviewsUseCase {
    constructor(private reviewRepository: IReviewRepository) { }

    async execute(doctorId: string): Promise<Review[]> {
        return this.reviewRepository.getByDoctorId(doctorId);
    }
}

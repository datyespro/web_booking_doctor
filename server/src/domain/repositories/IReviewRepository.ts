import { Review } from '../entities/Review';

export interface IReviewRepository {
    create(review: Review): Promise<Review>;
    getByDoctorId(doctorId: string): Promise<Review[]>;
}

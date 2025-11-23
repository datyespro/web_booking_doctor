import { db } from './firestore';
import { Review } from '../../domain/entities/Review';
import { IReviewRepository } from '../../domain/repositories/IReviewRepository';

export class FirestoreReviewRepository implements IReviewRepository {
    private collection = db.collection('reviews');

    async create(review: Review): Promise<Review> {
        await this.collection.doc(review.id).set(review);
        return review;
    }

    async getByDoctorId(doctorId: string): Promise<Review[]> {
        const snapshot = await this.collection.where('doctorId', '==', doctorId).get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: data.id,
                doctorId: data.doctorId,
                patientId: data.patientId,
                patientName: data.patientName,
                rating: data.rating,
                comment: data.comment,
                createdAt: data.createdAt.toDate() // Convert Firestore Timestamp to Date
            } as Review;
        });
    }
}

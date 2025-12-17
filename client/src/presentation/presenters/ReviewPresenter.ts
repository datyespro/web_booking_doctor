import { Review } from '../../domain/entities/Review';
import { ReviewViewModel } from '../viewmodels/ReviewViewModel';

/**
 * Presenter for converting Review entities to ViewModels
 * Separates domain entities from UI representation
 */
export class ReviewPresenter {
    /**
     * Convert a single Review entity to ViewModel
     */
    toViewModel(review: Review): ReviewViewModel {
        return {
            id: review.id,
            doctorId: review.doctorId,
            patientId: review.patientId,
            patientName: review.patientName,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,

            // Formatted values using entity business logic
            starsDisplay: review.getStarsDisplay(),
            displayDate: review.getDisplayDate(),
            relativeTime: review.getRelativeTime(),

            // Business rule flags
            isPositive: review.isPositive(),
            hasComment: review.hasComment()
        };
    }

    /**
     * Convert an array of Review entities to ViewModels
     */
    toViewModelList(reviews: Review[]): ReviewViewModel[] {
        return reviews.map(review => this.toViewModel(review));
    }
}

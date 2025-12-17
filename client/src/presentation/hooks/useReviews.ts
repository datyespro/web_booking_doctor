import { useState, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { ReviewViewModel } from '../viewmodels/ReviewViewModel';
import { getDoctorReviewsUseCase, createReviewUseCase, reviewPresenter } from '../../infrastructure/container';
import { CreateReviewData } from '../../domain/entities/Review';

/**
 * Hook for reviews using Clean Architecture
 */
export function useReviews(doctorId: string) {
    const [reviews, setReviews] = useState<ReviewViewModel[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchReviews = useCallback(async () => {
        try {
            // Execute use case
            const domainReviews = await getDoctorReviewsUseCase.execute(doctorId);

            // Convert to ViewModels
            const viewModels = reviewPresenter.toViewModelList(domainReviews);

            setReviews(viewModels);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    }, [doctorId]);

    const createReview = useCallback(async (data: CreateReviewData) => {
        setLoading(true);
        try {
            // Execute use case
            const newReview = await createReviewUseCase.execute(doctorId, data);

            // Convert to ViewModel and add to list
            const viewModel = reviewPresenter.toViewModel(newReview);
            setReviews(prev => [viewModel, ...prev]);

            notifications.show({
                title: 'Thành công',
                message: 'Đánh giá đã được gửi thành công',
                color: 'green'
            });
            return true;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to submit review';
            notifications.show({
                title: 'Lỗi',
                message,
                color: 'red'
            });
            return false;
        } finally {
            setLoading(false);
        }
    }, [doctorId]);

    return { reviews, fetchReviews, createReview, loading };
}

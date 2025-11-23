import { useState, useCallback } from 'react';
import type { Review, CreateReviewRequest } from '../types/entities/Review';
import { notifications } from '@mantine/notifications';

const API_URL = 'http://localhost:8080'; // Should be from config

export const useReviews = (doctorId: string) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchReviews = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/doctors/${doctorId}/reviews`);
            if (!response.ok) throw new Error('Failed to fetch reviews');
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    }, [doctorId]);

    const createReview = async (data: CreateReviewRequest, token: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/doctors/${doctorId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to submit review');
            }

            const newReview = await response.json();
            setReviews(prev => [newReview, ...prev]);
            notifications.show({
                title: 'Success',
                message: 'Review submitted successfully',
                color: 'green'
            });
            return true;
        } catch (error: any) {
            notifications.show({
                title: 'Error',
                message: error.message,
                color: 'red'
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { reviews, fetchReviews, createReview, loading };
};

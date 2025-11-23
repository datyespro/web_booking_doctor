import React, { useState } from 'react';
import { Paper, Text, Button, Textarea, Rating, Stack, Group } from '@mantine/core';
import { useAuthStore } from '../../stores/auth.store';

interface ReviewFormProps {
    onSubmit: (rating: number, comment: string) => Promise<boolean>;
    loading: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, loading }) => {
    const { user } = useAuthStore();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = async () => {
        if (rating === 0) return;
        const success = await onSubmit(rating, comment);
        if (success) {
            setRating(0);
            setComment('');
        }
    };

    if (!user) {
        return (
            <Paper withBorder p="md" radius="md" bg="gray.0">
                <Text ta="center" size="sm">Please login to write a review.</Text>
            </Paper>
        );
    }

    return (
        <Paper withBorder p="md" radius="md">
            <Stack gap="sm">
                <Text fw={500}>Write a Review</Text>
                <Group>
                    <Text size="sm">Rating:</Text>
                    <Rating value={rating} onChange={setRating} />
                </Group>
                <Textarea
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={(event) => setComment(event.currentTarget.value)}
                    minRows={3}
                />
                <Button
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={rating === 0 || !comment.trim()}
                >
                    Submit Review
                </Button>
            </Stack>
        </Paper>
    );
};

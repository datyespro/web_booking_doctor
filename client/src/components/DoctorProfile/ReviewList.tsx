import React from 'react';
import { Paper, Text, Group, Avatar, Rating, Stack } from '@mantine/core';
import type { Review } from '../../types/entities/Review';

interface ReviewListProps {
    reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
    if (reviews.length === 0) {
        return <Text c="dimmed" ta="center" py="xl">No reviews yet. Be the first to review!</Text>;
    }

    return (
        <Stack gap="md">
            {reviews.map((review) => (
                <Paper key={review.id} withBorder p="md" radius="md">
                    <Group>
                        <Avatar radius="xl" color="blue">
                            {review.patientName.charAt(0).toUpperCase()}
                        </Avatar>
                        <div>
                            <Text size="sm" fw={500}>{review.patientName}</Text>
                            <Text size="xs" c="dimmed">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </Text>
                        </div>
                    </Group>
                    <Rating value={review.rating} readOnly mt="xs" />
                    <Text mt="sm" size="sm">
                        {review.comment}
                    </Text>
                </Paper>
            ))}
        </Stack>
    );
};

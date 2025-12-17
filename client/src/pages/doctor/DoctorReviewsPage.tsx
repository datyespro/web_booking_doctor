import { useEffect, useState, useMemo } from 'react';
import { Title, Paper, Text, Group, LoadingOverlay, Stack, Center, Box, SegmentedControl } from '@mantine/core';
import { IconStar } from '@tabler/icons-react';
import { useAuthStore } from '../../stores/auth.store';
import { useReviews } from '../../presentation/hooks/useReviews';
import { ReviewList } from '../../components/DoctorProfile/ReviewList';

export default function DoctorReviewsPage() {
    const { user } = useAuthStore();
    const doctorId = user?.doctorId || '';
    const { reviews, fetchReviews, loading } = useReviews(doctorId);
    const [ratingFilter, setRatingFilter] = useState<string>('all');

    useEffect(() => {
        if (doctorId) {
            fetchReviews();
        }
    }, [doctorId, fetchReviews]);

    // Calculate average rating
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    // Filter reviews by rating
    const filteredReviews = useMemo(() => {
        if (ratingFilter === 'all') return reviews;
        const targetRating = parseInt(ratingFilter);
        return reviews.filter(r => r.rating === targetRating);
    }, [reviews, ratingFilter]);

    return (
        <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={loading} />

            <Title order={2} mb="lg">Đánh giá từ bệnh nhân</Title>

            {/* Summary Stats */}
            <Paper withBorder p="lg" mb="lg" radius="md">
                <Group justify="center" gap="xl">
                    <Box ta="center">
                        <Group gap="xs" justify="center">
                            <IconStar size={24} color="#fab005" fill="#fab005" />
                            <Text size="xl" fw={700}>{averageRating.toFixed(1)}</Text>
                        </Group>
                        <Text size="sm" c="dimmed">Đánh giá trung bình</Text>
                    </Box>
                    <Box ta="center">
                        <Text size="xl" fw={700}>{reviews.length}</Text>
                        <Text size="sm" c="dimmed">Tổng số đánh giá</Text>
                    </Box>
                </Group>
            </Paper>

            {/* Reviews List */}
            <Paper withBorder p="lg" radius="md">
                <Group justify="space-between" mb="md">
                    <Title order={4}>Tất cả đánh giá</Title>
                    <SegmentedControl
                        value={ratingFilter}
                        onChange={setRatingFilter}
                        data={[
                            { label: 'Tất cả', value: 'all' },
                            { label: '⭐ 5', value: '5' },
                            { label: '⭐ 4', value: '4' },
                            { label: '⭐ 3', value: '3' },
                            { label: '⭐ 2', value: '2' },
                            { label: '⭐ 1', value: '1' },
                        ]}
                        size="xs"
                    />
                </Group>
                {filteredReviews.length === 0 && !loading ? (
                    <Center py="xl">
                        <Stack align="center" gap="xs">
                            <IconStar size={48} color="gray" />
                            <Text c="dimmed">
                                {ratingFilter === 'all' ? 'Chưa có đánh giá nào' : `Không có đánh giá ${ratingFilter} sao`}
                            </Text>
                        </Stack>
                    </Center>
                ) : (
                    <ReviewList reviews={filteredReviews} />
                )}
            </Paper>
        </div>
    );
}

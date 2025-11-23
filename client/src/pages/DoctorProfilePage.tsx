import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Paper, Title, Text, Group, Avatar, Stack, Tabs, Divider, Button } from '@mantine/core';
import { IconStethoscope, IconMapPin } from '@tabler/icons-react';
import { useAuthStore } from '../stores/auth.store';
import { useReviews } from '../hooks/useReviews';
import { ReviewList } from '../components/DoctorProfile/ReviewList';
import { ReviewForm } from '../components/DoctorProfile/ReviewForm';
import { useDoctorById } from '../hooks/useDoctorById';

export const DoctorProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuthStore();
    const { doctor, loading: doctorLoading } = useDoctorById(id!);
    const { reviews, fetchReviews, createReview, loading: reviewLoading } = useReviews(id!);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleReviewSubmit = async (rating: number, comment: string) => {
        if (!user) return false;
        const token = await user.getIdToken();
        return createReview({ rating, comment }, token);
    };

    if (doctorLoading) {
        return <Container><Text>Loading...</Text></Container>;
    }

    if (!doctor) {
        return <Container><Text>Doctor not found</Text></Container>;
    }

    return (
        <Container size="lg" py="xl">
            <Paper withBorder p="xl" radius="md">
                {/* Doctor Header */}
                <Group align="flex-start" mb="xl">
                    <Avatar src={doctor.avatarUrl} size={100} radius="md" color="blue">
                        {doctor.name.charAt(0)}
                    </Avatar>
                    <Stack gap="xs" style={{ flex: 1 }}>
                        <Title order={2}>{doctor.name}</Title>
                        <Group gap="xs">
                            <IconStethoscope size={16} />
                            <Text size="sm" c="dimmed">{doctor.specialty}</Text>
                        </Group>
                        {doctor.clinicAddress && (
                            <Group gap="xs">
                                <IconMapPin size={16} />
                                <Text size="sm">{doctor.clinicAddress}</Text>
                            </Group>
                        )}
                        <Text size="sm" fw={500} c="blue">
                            Giá khám: {doctor.pricePerVisit.toLocaleString('vi-VN')} VNĐ
                        </Text>
                        <Button
                            component={Link}
                            to={`/booking/${id}`}
                            variant="filled"
                            color="blue"
                            mt="sm"
                            w="fit-content"
                        >
                            Đặt lịch khám
                        </Button>
                    </Stack>
                </Group>

                <Divider my="lg" />

                {/* Tabs for Info and Reviews */}
                <Tabs defaultValue="info">
                    <Tabs.List>
                        <Tabs.Tab value="info">Thông tin</Tabs.Tab>
                        <Tabs.Tab value="reviews">
                            Đánh giá ({reviews.length})
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="info" pt="md">
                        <Stack gap="md">
                            {doctor.bio && (
                                <>
                                    <Title order={4}>Giới thiệu</Title>
                                    <Text>{doctor.bio}</Text>
                                </>
                            )}
                            {doctor.experience && (
                                <>
                                    <Title order={4}>Kinh nghiệm</Title>
                                    <Text>{doctor.experience} năm</Text>
                                </>
                            )}
                            {doctor.clinicAddress && (
                                <>
                                    <Title order={4}>Địa chỉ phòng khám</Title>
                                    <Text>{doctor.clinicAddress}</Text>
                                </>
                            )}
                        </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="reviews" pt="md">
                        <Stack gap="xl">
                            <ReviewForm onSubmit={handleReviewSubmit} loading={reviewLoading} />
                            <ReviewList reviews={reviews} />
                        </Stack>
                    </Tabs.Panel>
                </Tabs>
            </Paper>
        </Container>
    );
};

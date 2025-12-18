import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Title, Text, Group, Avatar, Stack, Divider, Button } from '@mantine/core';
import { IconStethoscope, IconMapPin } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useDoctorById } from '../hooks/useDoctorById';
import { useAuthStore } from '../stores/auth.store';
import { AuthModal } from '../components/Auth/AuthModal';

export const DoctorProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { doctor, loading: doctorLoading } = useDoctorById(id!);
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [authModalOpened, { open: openAuthModal, close: closeAuthModal }] = useDisclosure(false);

    const handleBookingClick = () => {
        if (user) {
            navigate(`/booking/${id}`);
        } else {
            openAuthModal();
        }
    };

    if (doctorLoading) {
        return <Container><Text>Loading...</Text></Container>;
    }

    if (!doctor) {
        return <Container><Text>Doctor not found</Text></Container>;
    }

    return (
        <>
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
                                onClick={handleBookingClick}
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

                    {/* Doctor Info Section */}
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
                </Paper>
            </Container>
            <AuthModal opened={authModalOpened} onClose={closeAuthModal} />
        </>
    );
};

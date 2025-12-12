import { Container, Title, Text, Paper, SimpleGrid, LoadingOverlay } from '@mantine/core';
import { useAuthStore } from '../../stores/auth.store';
import { useDoctorAppointments } from '../../hooks/useDoctorAppointments';
import { useDoctorById } from '../../hooks/useDoctorById';
import { useMemo } from 'react';
import dayjs from 'dayjs';

export default function DoctorDashboard() {
    const { user } = useAuthStore();
    const { appointments, loading: appointmentsLoading } = useDoctorAppointments();
    const { doctor, loading: doctorLoading } = useDoctorById(user?.doctorId || '');

    const stats = useMemo(() => {
        const today = dayjs().format('YYYY-MM-DD');

        const todayAppointments = appointments.filter(apt => apt.date === today);

        const uniquePatients = new Set(appointments.map(apt => apt.patientId));

        return {
            todayCount: todayAppointments.length,
            totalPatients: uniquePatients.size,
            rating: doctor?.rating || '--'
        };
    }, [appointments, doctor]);

    const isLoading = appointmentsLoading || (!!user?.doctorId && doctorLoading);

    return (
        <Container size="xl" pos="relative">
            <LoadingOverlay visible={isLoading} />
            <Title order={2} mb="lg">Xin chào, Bác sĩ {user?.displayName}</Title>

            <SimpleGrid cols={{ base: 1, sm: 3 }}>
                <Paper p="md" shadow="sm" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Lịch hẹn hôm nay</Text>
                    <Text fw={700} size="xl" mt="sm">{stats.todayCount}</Text>
                </Paper>
                <Paper p="md" shadow="sm" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Tổng bệnh nhân</Text>
                    <Text fw={700} size="xl" mt="sm">{stats.totalPatients}</Text>
                </Paper>
                <Paper p="md" shadow="sm" radius="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Đánh giá trung bình</Text>
                    <Text fw={700} size="xl" mt="sm">{stats.rating}</Text>
                </Paper>
            </SimpleGrid>
        </Container>
    );
}

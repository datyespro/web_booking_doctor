import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Image, Text, Title, Group, Paper, Stepper, Modal, Stack, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuthStore } from '../stores/auth.store';
import { useDoctor } from '../hooks/useDoctor';
import { useBooking } from '../hooks/useBooking';
import { BookingProvider, useBookingContext } from '../contexts/BookingContext';
import { SelectScheduleStep } from '../components/BookingSteps/SelectScheduleStep';
import { PatientInfoStep } from '../components/BookingSteps/PatientInfoStep';
import { ConfirmationStep } from '../components/BookingSteps/ConfirmationStep';

function BookingContent() {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const { user, loginWithGoogle } = useAuthStore();
    const { activeStep, bookingData, setBookingData } = useBookingContext();
    // Removed unused useBooking hook
    const [opened, { open, close }] = useDisclosure(false);

    // Use custom hooks
    const { doctor, loading: doctorLoading } = useDoctor(doctorId);

    // Initialize doctor data in context
    useEffect(() => {
        if (doctor && bookingData.doctor?.id !== doctor.id) {
            setBookingData({ doctor });
        }
    }, [doctor, bookingData.doctor, setBookingData]);

    // Handler for successful booking
    const handleBookingSuccess = () => {
        open();
    };

    if (doctorLoading || !doctor) {
        return <Text>Đang tải thông tin bác sĩ...</Text>;
    }

    if (!user) {
        return (
            <Container size="sm" py="xl">
                <Paper p="xl" withBorder shadow="md" radius="md" ta="center">
                    <Title order={3} mb="md">Vui lòng đăng nhập</Title>
                    <Text mb="xl">Bạn cần đăng nhập để đặt lịch khám.</Text>
                    <Button onClick={loginWithGoogle} size="md">Đăng nhập với Google</Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container size="lg" py="xl">
            <Grid>
                {/* Left Column: Doctor Info */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper shadow="sm" p="md" radius="md" withBorder>
                        <Group wrap="nowrap" align="flex-start">
                            <Image src={doctor.avatarUrl} width={80} height={80} radius="md" />
                            <div>
                                <Title order={4}>{doctor.name}</Title>
                                <Text c="dimmed" size="sm">{doctor.bio}</Text>
                                <Text mt="sm" fw={500} size="sm">Giá khám: {doctor.pricePerVisit.toLocaleString()} VND</Text>
                                <Text size="sm">{doctor.clinicAddress}</Text>
                            </div>
                        </Group>
                    </Paper>
                </Grid.Col>

                {/* Right Column: Booking Wizard */}
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Stepper active={activeStep} onStepClick={() => { }} allowNextStepsSelect={false}>
                        <Stepper.Step label="Lịch khám" description="Chọn ngày & giờ">
                            <SelectScheduleStep />
                        </Stepper.Step>
                        <Stepper.Step label="Thông tin" description="Nhập thông tin">
                            <PatientInfoStep />
                        </Stepper.Step>
                        <Stepper.Step label="Xác nhận" description="Kiểm tra lại">
                            <ConfirmationStep onSuccess={handleBookingSuccess} />
                        </Stepper.Step>
                    </Stepper>
                </Grid.Col>
            </Grid>

            <Modal opened={opened} onClose={() => { close(); navigate('/'); }} title="Đặt lịch thành công!" centered>
                <Stack align="center">
                    <Text>Bạn đã đặt lịch thành công với bác sĩ {doctor.name}.</Text>
                    <Button onClick={() => navigate('/')}>Về trang chủ</Button>
                </Stack>
            </Modal>
        </Container>
    );
}

export default function BookingPage() {
    return (
        <BookingProvider>
            <BookingContent />
        </BookingProvider>
    );
}

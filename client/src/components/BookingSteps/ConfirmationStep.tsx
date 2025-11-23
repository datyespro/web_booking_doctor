import { Paper, Title, Text, Button, Grid, Divider, Group } from '@mantine/core';
import dayjs from 'dayjs';
import { useBookingContext } from '../../contexts/BookingContext';
import { useBooking } from '../../hooks/useBooking';

interface ConfirmationStepProps {
    onSuccess?: () => void;
}

export function ConfirmationStep({ onSuccess }: ConfirmationStepProps) {
    const { bookingData, prevStep } = useBookingContext();
    const { doctor, date, slot, patientInfo } = bookingData;
    const { bookAppointment, loading } = useBooking();

    const handleConfirm = async () => {
        if (!doctor || !date || !slot) return;

        const success = await bookAppointment({
            doctorId: doctor.id,
            doctorName: doctor.name,
            date: dayjs(date).format('YYYY-MM-DD'),
            timeSlotId: slot.id,
            timeText: slot.time,
            specialtyName: doctor.specialty || 'General',
            // New fields
            patientPhone: patientInfo.phoneNumber,
            patientGender: patientInfo.gender,
            patientDob: patientInfo.dateOfBirth ? dayjs(patientInfo.dateOfBirth).format('YYYY-MM-DD') : '',
            patientAddress: patientInfo.address,
            reason: patientInfo.reason,
        });

        if (success && onSuccess) {
            onSuccess();
        }
    };

    return (
        <Paper shadow="sm" p="md" radius="md" withBorder>
            <Title order={4} mb="md">3. Xác nhận thông tin</Title>

            <Grid>
                <Grid.Col span={12}>
                    <Title order={5} c="blue">Thông tin lịch khám</Title>
                    <Group mt="xs">
                        <Text fw={500}>Bác sĩ:</Text>
                        <Text>{doctor?.name}</Text>
                    </Group>
                    <Group mt="xs">
                        <Text fw={500}>Chuyên khoa:</Text>
                        <Text>{doctor?.specialty}</Text>
                    </Group>
                    <Group mt="xs">
                        <Text fw={500}>Ngày khám:</Text>
                        <Text>{date ? dayjs(date).format('DD/MM/YYYY') : ''}</Text>
                    </Group>
                    <Group mt="xs">
                        <Text fw={500}>Giờ khám:</Text>
                        <Text>{slot?.time}</Text>
                    </Group>
                    <Group mt="xs">
                        <Text fw={500}>Giá khám:</Text>
                        <Text>{doctor?.pricePerVisit.toLocaleString()} VND</Text>
                    </Group>
                </Grid.Col>

                <Divider my="md" w="100%" />

                <Grid.Col span={12}>
                    <Title order={5} c="blue">Thông tin bệnh nhân</Title>
                    <Group mt="xs">
                        <Text fw={500}>Họ tên:</Text>
                        <Text>{patientInfo.fullName}</Text>
                    </Group>
                    <Group mt="xs">
                        <Text fw={500}>Số điện thoại:</Text>
                        <Text>{patientInfo.phoneNumber}</Text>
                    </Group>
                    <Group mt="xs">
                        <Text fw={500}>Ngày sinh:</Text>
                        <Text>{patientInfo.dateOfBirth ? dayjs(patientInfo.dateOfBirth).format('DD/MM/YYYY') : ''}</Text>
                    </Group>
                    <Group mt="xs">
                        <Text fw={500}>Giới tính:</Text>
                        <Text>{patientInfo.gender === 'male' ? 'Nam' : patientInfo.gender === 'female' ? 'Nữ' : 'Khác'}</Text>
                    </Group>
                    <Group mt="xs">
                        <Text fw={500}>Địa chỉ:</Text>
                        <Text>{patientInfo.address}</Text>
                    </Group>
                    <Group mt="xs">
                        <Text fw={500}>Lý do khám:</Text>
                        <Text>{patientInfo.reason}</Text>
                    </Group>
                </Grid.Col>
            </Grid>

            <Grid mt="xl">
                <Grid.Col span={6}>
                    <Button variant="default" fullWidth onClick={prevStep}>
                        Quay lại
                    </Button>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Button
                        fullWidth
                        onClick={handleConfirm}
                        loading={loading}
                        color="blue"
                    >
                        Xác nhận đặt lịch
                    </Button>
                </Grid.Col>
            </Grid>
        </Paper>
    );
}

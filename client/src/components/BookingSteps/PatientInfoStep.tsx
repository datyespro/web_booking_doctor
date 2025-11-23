import { TextInput, Select, Textarea, Button, Paper, Title, Grid } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useBookingContext } from '../../contexts/BookingContext';

export function PatientInfoStep() {
    const { bookingData, updatePatientInfo, nextStep, prevStep } = useBookingContext();
    const { patientInfo } = bookingData;

    const form = useForm({
        initialValues: {
            fullName: patientInfo.fullName,
            phoneNumber: patientInfo.phoneNumber,
            dateOfBirth: patientInfo.dateOfBirth,
            gender: patientInfo.gender,
            address: patientInfo.address,
            reason: patientInfo.reason,
        },

        validate: {
            fullName: (value) => (value.length < 2 ? 'Tên phải có ít nhất 2 ký tự' : null),
            phoneNumber: (value) => (/^\d{10}$/.test(value) ? null : 'Số điện thoại không hợp lệ'),
            dateOfBirth: (value) => (value ? null : 'Vui lòng chọn ngày sinh'),
            gender: (value) => (value ? null : 'Vui lòng chọn giới tính'),
            address: (value) => (value.length < 5 ? 'Địa chỉ quá ngắn' : null),
            reason: (value) => (value.length < 5 ? 'Vui lòng nhập lý do khám chi tiết hơn' : null),
        },
    });

    const handleSubmit = (values: typeof form.values) => {
        updatePatientInfo(values);
        nextStep();
    };

    return (
        <Paper shadow="sm" p="md" radius="md" withBorder>
            <Title order={4} mb="md">2. Thông tin bệnh nhân</Title>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="Họ và tên"
                            placeholder="Nguyễn Văn A"
                            withAsterisk
                            {...form.getInputProps('fullName')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="Số điện thoại"
                            placeholder="0901234567"
                            withAsterisk
                            {...form.getInputProps('phoneNumber')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <DateInput
                            label="Ngày sinh"
                            placeholder="Chọn ngày sinh"
                            withAsterisk
                            {...form.getInputProps('dateOfBirth')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Select
                            label="Giới tính"
                            placeholder="Chọn giới tính"
                            data={[
                                { value: 'male', label: 'Nam' },
                                { value: 'female', label: 'Nữ' },
                                { value: 'other', label: 'Khác' },
                            ]}
                            withAsterisk
                            {...form.getInputProps('gender')}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <TextInput
                            label="Địa chỉ"
                            placeholder="Số nhà, đường, phường/xã..."
                            withAsterisk
                            {...form.getInputProps('address')}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Textarea
                            label="Lý do khám"
                            placeholder="Mô tả triệu chứng, tiền sử bệnh..."
                            minRows={3}
                            withAsterisk
                            {...form.getInputProps('reason')}
                        />
                    </Grid.Col>
                </Grid>

                <Grid mt="xl">
                    <Grid.Col span={6}>
                        <Button variant="default" fullWidth onClick={prevStep}>
                            Quay lại
                        </Button>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Button type="submit" fullWidth>
                            Tiếp tục
                        </Button>
                    </Grid.Col>
                </Grid>
            </form>
        </Paper>
    );
}

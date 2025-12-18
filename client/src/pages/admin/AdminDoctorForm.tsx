import React, { useEffect } from 'react';
import { Modal, TextInput, PasswordInput, Button, Group, LoadingOverlay, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { AdminRepository } from '../../repositories/AdminRepository';

interface AdminDoctorFormProps {
    opened: boolean;
    onClose: () => void;
    onSuccess: () => void;
    doctorId?: string | null;
}

export const AdminDoctorForm = ({ opened, onClose, onSuccess, doctorId }: AdminDoctorFormProps) => {
    const [loading, setLoading] = React.useState(false);

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            name: '',
            specialty: '',
            phone: '',
            location: '',
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email không hợp lệ'),
            password: (value) => {
                if (!doctorId && value.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
                if (doctorId && value && value.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
                return null;
            },
            name: (value) => (value.length < 2 ? 'Tên phải có ít nhất 2 ký tự' : null),
            specialty: (value) => (value.length < 2 ? 'Vui lòng chọn chuyên khoa' : null),
        },
    });

    useEffect(() => {
        if (doctorId) {
            setLoading(true);
            AdminRepository.getDoctorById(doctorId)
                .then((doctor) => {
                    form.setValues({
                        email: doctor.email,
                        password: '', // Reset password field
                        name: doctor.name,
                        specialty: doctor.specialty || '',
                        phone: doctor.phone || '',
                        location: doctor.location || '',
                    });
                })
                .catch(() => {
                    notifications.show({ message: 'Không thể tải thông tin bác sĩ', color: 'red' });
                    onClose();
                })
                .finally(() => setLoading(false));
        } else {
            form.reset();
        }
    }, [doctorId, opened]);

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        try {
            if (doctorId) {
                // Only include password if it's provided
                const updateData = { ...values };
                if (!updateData.password) {
                    delete (updateData as any).password;
                }
                await AdminRepository.updateDoctor(doctorId, updateData);
                notifications.show({ message: 'Cập nhật bác sĩ thành công', color: 'green' });
            } else {
                await AdminRepository.createDoctor(values);
                notifications.show({ message: 'Tạo bác sĩ thành công', color: 'green' });
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            notifications.show({
                title: 'Lỗi',
                message: error.response?.data?.error || 'Thao tác thất bại',
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title={doctorId ? 'Chỉnh sửa Bác sĩ' : 'Tạo Bác sĩ'}>
            <LoadingOverlay visible={loading} />
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    label="Email"
                    placeholder="email@example.com"
                    required
                    {...form.getInputProps('email')}
                />
                <TextInput
                    label="Họ tên"
                    placeholder="BS. Nguyễn Văn A"
                    required
                    mt="md"
                    {...form.getInputProps('name')}
                />
                <PasswordInput
                    label={doctorId ? "Mật khẩu mới (để trống nếu giữ nguyên)" : "Mật khẩu"}
                    placeholder="Mật khẩu"
                    required={!doctorId}
                    mt="md"
                    {...form.getInputProps('password')}
                />
                <Select
                    label="Chuyên khoa"
                    placeholder="Chọn chuyên khoa"
                    required
                    mt="md"
                    data={[
                        { value: 'Cơ xương khớp', label: 'Cơ xương khớp' },
                        { value: 'Tim mạch', label: 'Tim mạch' },
                        { value: 'Tiêu hóa', label: 'Tiêu hóa' },
                        { value: 'Thần kinh', label: 'Thần kinh' },
                        { value: 'Da liễu', label: 'Da liễu' },
                        { value: 'Tai Mũi Họng', label: 'Tai Mũi Họng' },
                        { value: 'Răng Hàm Mặt', label: 'Răng Hàm Mặt' },
                        { value: 'Sản Phụ Khoa', label: 'Sản Phụ Khoa' },
                        { value: 'Mắt', label: 'Mắt' },
                        { value: 'Nội Khoa', label: 'Nội Khoa' },
                        { value: 'Nhi Khoa', label: 'Nhi Khoa' },
                        { value: 'Y học Cổ truyền', label: 'Y học Cổ truyền' },
                    ]}
                    {...form.getInputProps('specialty')}
                />
                <TextInput
                    label="Điện thoại"
                    placeholder="Số điện thoại"
                    mt="md"
                    {...form.getInputProps('phone')}
                />
                <Select
                    label="Địa điểm"
                    placeholder="Chọn địa điểm"
                    mt="md"
                    data={[
                        { value: 'Hà Nội', label: 'Hà Nội' },
                        { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
                        { value: 'Đà Nẵng', label: 'Đà Nẵng' },
                    ]}
                    {...form.getInputProps('location')}
                />
                <Group justify="flex-end" mt="xl">
                    <Button variant="default" onClick={onClose}>Hủy</Button>
                    <Button type="submit">{doctorId ? 'Cập nhật' : 'Tạo'}</Button>
                </Group>
            </form>
        </Modal>
    );
};

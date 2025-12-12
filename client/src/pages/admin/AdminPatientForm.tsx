import React, { useEffect } from 'react';
import { Modal, TextInput, PasswordInput, Button, Group, Select, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { AdminRepository } from '../../repositories/AdminRepository';

interface AdminPatientFormProps {
    opened: boolean;
    onClose: () => void;
    onSuccess: () => void;
    patientId?: string | null;
}

export const AdminPatientForm = ({ opened, onClose, onSuccess, patientId }: AdminPatientFormProps) => {
    const [loading, setLoading] = React.useState(false);

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            displayName: '',
            role: 'patient',
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email không hợp lệ'),
            password: (value) => {
                // For create: required and min 6 chars
                // For update: optional, but if provided must be min 6 chars
                if (!patientId && value.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
                if (patientId && value.length > 0 && value.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
                return null;
            },
            displayName: (value) => (value.length < 2 ? 'Tên phải có ít nhất 2 ký tự' : null),
        },
    });

    useEffect(() => {
        if (patientId) {
            setLoading(true);
            AdminRepository.getPatientById(patientId)
                .then((patient) => {
                    form.setValues({
                        email: patient.email,
                        password: '', // Password not editable directly usually, or handled separately
                        displayName: patient.displayName,
                        role: patient.role,
                    });
                })
                .catch(() => {
                    notifications.show({ message: 'Không thể tải thông tin bệnh nhân', color: 'red' });
                    onClose();
                })
                .finally(() => setLoading(false));
        } else {
            form.reset();
        }
    }, [patientId, opened]);

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        try {
            if (patientId) {
                // Include password only if provided
                const updateData = values.password
                    ? values
                    : { email: values.email, displayName: values.displayName, role: values.role };
                await AdminRepository.updatePatient(patientId, updateData);
                notifications.show({ message: 'Cập nhật bệnh nhân thành công', color: 'green' });
            } else {
                await AdminRepository.createPatient(values);
                notifications.show({ message: 'Tạo bệnh nhân thành công', color: 'green' });
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
        <Modal opened={opened} onClose={onClose} title={patientId ? 'Chỉnh sửa Bệnh nhân' : 'Tạo Bệnh nhân'}>
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
                    placeholder="Nguyễn Văn A"
                    required
                    mt="md"
                    {...form.getInputProps('displayName')}
                />
                <PasswordInput
                    label={patientId ? "Mật khẩu mới (để trống nếu giữ nguyên)" : "Mật khẩu"}
                    placeholder={patientId ? "Nhập mật khẩu mới hoặc để trống" : "Mật khẩu của bạn"}
                    required={!patientId}
                    mt="md"
                    {...form.getInputProps('password')}
                />
                <Select
                    label="Vai trò"
                    placeholder="Chọn vai trò"
                    data={[
                        { value: 'patient', label: 'Bệnh nhân' },
                        { value: 'admin', label: 'Quản trị viên' },
                    ]}
                    mt="md"
                    {...form.getInputProps('role')}
                />
                <Group justify="flex-end" mt="xl">
                    <Button variant="default" onClick={onClose}>Hủy</Button>
                    <Button type="submit">{patientId ? 'Cập nhật' : 'Tạo'}</Button>
                </Group>
            </form>
        </Modal>
    );
};

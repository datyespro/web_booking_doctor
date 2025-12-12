import { Container, Paper, Title, Text, TextInput, PasswordInput, Button, Stack, Divider, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconBrandGoogle, IconAlertCircle } from '@tabler/icons-react';
import { useAuthStore } from '../../stores/auth.store';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

export default function DoctorLoginPage() {
    const { loginWithEmail, loginWithGoogle, logout } = useAuthStore();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email không hợp lệ'),
            password: (value) => (value.length < 6 ? 'Mật khẩu phải có ít nhất 6 ký tự' : null),
        },
    });

    const handleRoleCheck = async (role: string) => {
        if (role === 'doctor') {
            notifications.show({
                title: 'Xin chào Bác sĩ',
                message: 'Đăng nhập thành công',
                color: 'green',
            });
            navigate('/doctor');
        } else {
            // If not a doctor, logout and redirect to home with warning
            await logout();
            notifications.show({
                title: 'Truy cập bị từ chối',
                message: 'Tài khoản của bạn không phải là tài khoản Bác sĩ. Bạn đã được chuyển về trang chủ.',
                color: 'orange',
                autoClose: 5000,
            });
            navigate('/');
        }
    };

    const handleSubmit = async (values: typeof form.values) => {
        try {
            setError(null);
            const role = await loginWithEmail(values.email, values.password);
            await handleRoleCheck(role);
        } catch (err: any) {
            setError(err.message || 'Đăng nhập thất bại');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setError(null);
            const role = await loginWithGoogle();
            await handleRoleCheck(role);
        } catch (err: any) {
            setError(err.message || 'Đăng nhập Google thất bại');
        }
    };

    return (
        <Container size="xs" h="100vh" style={{ display: 'flex', alignItems: 'center' }}>
            <Paper radius="md" p="xl" withBorder w="100%">
                <Text size="lg" fw={500} ta="center" mb="xs">
                    BookingCare Doctor
                </Text>
                <Title order={2} ta="center" mb="md">
                    Đăng nhập Bác sĩ
                </Title>

                {error && (
                    <Alert icon={<IconAlertCircle size={16} />} title="Lỗi" color="red" mb="md">
                        {error}
                    </Alert>
                )}

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput
                            required
                            label="Email"
                            placeholder="doctor@bookingcare.vn"
                            {...form.getInputProps('email')}
                        />
                        <PasswordInput
                            required
                            label="Mật khẩu"
                            placeholder="Mật khẩu của bạn"
                            {...form.getInputProps('password')}
                        />
                        <Button type="submit" fullWidth mt="md">
                            Đăng nhập
                        </Button>
                    </Stack>
                </form>

                <Divider label="Hoặc" labelPosition="center" my="lg" />

                <Button
                    variant="default"
                    fullWidth
                    leftSection={<IconBrandGoogle size={20} />}
                    onClick={handleGoogleLogin}
                >
                    Đăng nhập bằng Google
                </Button>

                <Text c="dimmed" size="sm" ta="center" mt="xl">
                    Dành cho Bệnh nhân?{' '}
                    <Text span c="blue" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                        Quay về trang chủ
                    </Text>
                </Text>
            </Paper>
        </Container>
    );
}

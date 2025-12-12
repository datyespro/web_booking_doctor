import { TextInput, PasswordInput, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';

import { useAuthStore } from '../../stores/auth.store';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
    onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
    const { loginWithEmail } = useAuthStore();
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

    const navigate = useNavigate();

    const handleSubmit = async (values: typeof form.values) => {
        try {
            const role = await loginWithEmail(values.email, values.password);
            notifications.show({
                title: 'Thành công',
                message: 'Đăng nhập thành công',
                color: 'green',
            });
            onSuccess();
            if (role === 'doctor') {
                navigate('/doctor');
            } else if (role === 'admin') {
                navigate('/admin/patients');
            }
        } catch (error: any) {
            notifications.show({
                title: 'Lỗi',
                message: error.message || 'Đăng nhập thất bại',
                color: 'red',
            });
        }
    };



    return (
        <Stack>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <TextInput
                        required
                        label="Email"
                        placeholder="your@email.com"
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


        </Stack>
    );
}

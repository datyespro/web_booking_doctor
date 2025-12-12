import { TextInput, PasswordInput, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuthStore } from '../../stores/auth.store';
import { notifications } from '@mantine/notifications';

interface RegisterFormProps {
    onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
    const { registerWithEmail } = useAuthStore();
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validate: {
            name: (value) => (value.length < 2 ? 'Tên phải có ít nhất 2 ký tự' : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email không hợp lệ'),
            password: (value) => (value.length < 6 ? 'Mật khẩu phải có ít nhất 6 ký tự' : null),
            confirmPassword: (value, values) =>
                value !== values.password ? 'Mật khẩu không khớp' : null,
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        try {
            await registerWithEmail(values.email, values.password, values.name);
            notifications.show({
                title: 'Thành công',
                message: 'Đăng ký tài khoản thành công',
                color: 'green',
            });
            onSuccess();
        } catch (error: any) {
            notifications.show({
                title: 'Lỗi',
                message: error.message || 'Đăng ký thất bại',
                color: 'red',
            });
        }
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
                <TextInput
                    required
                    label="Họ và tên"
                    placeholder="Nguyễn Văn A"
                    {...form.getInputProps('name')}
                />
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
                <PasswordInput
                    required
                    label="Xác nhận mật khẩu"
                    placeholder="Nhập lại mật khẩu"
                    {...form.getInputProps('confirmPassword')}
                />
                <Button type="submit" fullWidth mt="md">
                    Đăng ký
                </Button>
            </Stack>
        </form>
    );
}

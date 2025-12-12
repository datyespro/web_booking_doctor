
import { AppShell, Group, Button, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { AuthModal } from './Auth/AuthModal';
import { useDisclosure } from '@mantine/hooks';

export const AppHeader = () => {
    const { user, logout } = useAuthStore();
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Title order={3} c="blue">BookingCare</Title>
                    </Link>
                    <Group>
                        <Button variant="subtle" component={Link} to="/search">Tìm bác sĩ</Button>
                        {user ? (
                            <>
                                {user.role === 'doctor' && (
                                    <Button variant="subtle" component={Link} to="/doctor">Trang Bác sĩ</Button>
                                )}
                                {user.role === 'admin' && (
                                    <Button variant="subtle" component={Link} to="/admin">Trang Admin</Button>
                                )}
                                <Button variant="subtle" component={Link} to="/my-appointments">Lịch hẹn của tôi</Button>
                                <Text fw={500}>Xin chào, {user.displayName}</Text>
                                <Button variant="light" color="red" onClick={logout}>Đăng xuất</Button>
                            </>
                        ) : (
                            <Button onClick={open}>Đăng nhập</Button>
                        )}
                    </Group>
                </Group>
            </AppShell.Header>
            <AuthModal opened={opened} onClose={close} />
        </>
    );
};

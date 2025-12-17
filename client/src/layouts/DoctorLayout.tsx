import { AppShell, Burger, Group, NavLink, Title, UnstyledButton, Box, ThemeIcon, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDashboard, IconCalendar, IconClock, IconUser, IconLogout, IconStar } from '@tabler/icons-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

export default function DoctorLayout() {
    const [opened, { toggle }] = useDisclosure();
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Title order={3} c="blue">BookingCare Doctor</Title>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}>
                    <NavLink
                        label="Tổng quan"
                        leftSection={<IconDashboard size="1rem" stroke={1.5} />}
                        component={Link}
                        to="/doctor"
                        active={location.pathname === '/doctor'}
                    />
                    <NavLink
                        label="Quản lý lịch hẹn"
                        leftSection={<IconCalendar size="1rem" stroke={1.5} />}
                        component={Link}
                        to="/doctor/appointments"
                        active={location.pathname === '/doctor/appointments'}
                    />
                    <NavLink
                        label="Lịch làm việc"
                        leftSection={<IconClock size="1rem" stroke={1.5} />}
                        component={Link}
                        to="/doctor/schedule"
                        active={location.pathname === '/doctor/schedule'}
                    />
                    <NavLink
                        label="Đánh giá"
                        leftSection={<IconStar size="1rem" stroke={1.5} />}
                        component={Link}
                        to="/doctor/reviews"
                        active={location.pathname === '/doctor/reviews'}
                    />
                    <NavLink
                        label="AI Chẩn đoán hình ảnh"
                        leftSection={<IconUser size="1rem" stroke={1.5} />}
                        component={Link}
                        to="/doctor/profile"
                        active={location.pathname === '/doctor/profile'}
                    />
                </div>

                <Box style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
                    <UnstyledButton
                        onClick={handleLogout}
                        style={{
                            display: 'block',
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                        }}
                    >
                        <Group>
                            <ThemeIcon color="red" variant="light">
                                <IconLogout size={16} />
                            </ThemeIcon>
                            <Text size="sm">Đăng xuất</Text>
                        </Group>
                    </UnstyledButton>
                </Box>
            </AppShell.Navbar>

            <AppShell.Main bg="gray.0">
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}

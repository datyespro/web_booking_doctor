import { AppShell, Burger, Group, NavLink, Title, Avatar, Menu, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDashboard, IconCalendar, IconClock, IconUser, IconLogout } from '@tabler/icons-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

export default function DoctorLayout() {
    const [opened, { toggle }] = useDisclosure();
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

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
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Title order={3} c="blue">BookingCare Doctor</Title>
                    </Group>
                    <Group>
                        <Menu shadow="md" width={200}>
                            <Menu.Target>
                                <Button variant="subtle" leftSection={<Avatar src={user?.photoURL} radius="xl" size="sm" />}>
                                    {user?.displayName || 'Doctor'}
                                </Button>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Label>Tài khoản</Menu.Label>
                                <Menu.Item leftSection={<IconUser size={14} />} component={Link} to="/doctor/profile">
                                    Hồ sơ cá nhân
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item color="red" leftSection={<IconLogout size={14} />} onClick={handleLogout}>
                                    Đăng xuất
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
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
                    label="AI Chẩn đoán hình ảnh"
                    leftSection={<IconUser size="1rem" stroke={1.5} />}
                    component={Link}
                    to="/doctor/profile"
                    active={location.pathname === '/doctor/profile'}
                />
            </AppShell.Navbar>

            <AppShell.Main bg="gray.0">
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}

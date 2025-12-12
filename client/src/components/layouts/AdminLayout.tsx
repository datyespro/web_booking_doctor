import React from 'react';
import { AppShell, Group, Text, UnstyledButton, Box, ThemeIcon, Burger, Title } from '@mantine/core';
import { IconUsers, IconStethoscope, IconLogout } from '@tabler/icons-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { useDisclosure } from '@mantine/hooks';

interface AdminLayoutProps {
    children?: React.ReactNode;
}

interface MainLinkProps {
    icon: React.ReactNode;
    color: string;
    label: string;
    path: string;
    active: boolean;
    onClick: () => void;
}

function MainLink({ icon, color, label, active, onClick }: Omit<MainLinkProps, 'path'>) {
    return (
        <UnstyledButton
            onClick={onClick}
            style={() => ({
                display: 'block',
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                color: 'black',
                backgroundColor: active ? '#f0f0f0' : 'transparent',
                marginBottom: '5px',
            })}
        >
            <Group>
                <ThemeIcon color={color} variant="light">
                    {icon}
                </ThemeIcon>

                <Text size="sm">{label}</Text>
            </Group>
        </UnstyledButton>
    );
}

export const AdminLayout: React.FC<AdminLayoutProps> = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuthStore();
    const [opened, { toggle }] = useDisclosure();

    const links = [
        { icon: <IconUsers size={16} />, color: 'teal', label: 'Bệnh nhân', path: '/admin/patients' },
        { icon: <IconStethoscope size={16} />, color: 'violet', label: 'Bác sĩ', path: '/admin/doctors' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
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
                        <Title order={3} c="blue">BookingCare Admin</Title>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <Box style={{ flex: 1 }}>
                    {links.map((link) => (
                        <MainLink
                            key={link.label}
                            {...link}
                            active={location.pathname === link.path}
                            onClick={() => {
                                navigate(link.path);
                                if (opened) toggle();
                            }}
                        />
                    ))}
                </Box>

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

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
};


import { AppShell, Box } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { Footer } from '../components/Footer';

export const PublicLayout = () => {
    return (
        <AppShell header={{ height: 60 }} padding="md">
            <AppHeader />
            <AppShell.Main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Box style={{ flex: 1 }}>
                    <Outlet />
                </Box>
                <Footer />
            </AppShell.Main>
        </AppShell>
    );
};

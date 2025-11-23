import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import { useEffect } from 'react';
import { MantineProvider, AppShell, Group, Button, Text, Title } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { useAuthStore } from './stores/auth.store';

import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import { DoctorProfilePage } from './pages/DoctorProfilePage';

const Header = () => {
  const { user, loginWithGoogle, logout } = useAuthStore();

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Title order={3} c="blue">BookingCare</Title>
        </Link>
        <Group>
          <Button variant="subtle" component={Link} to="/search">Tìm bác sĩ</Button>
          {user ? (
            <>
              <Button variant="subtle" component={Link} to="/my-appointments">Lịch hẹn của tôi</Button>
              <Text fw={500}>Xin chào, {user.displayName}</Text>
              <Button variant="light" color="red" onClick={logout}>Đăng xuất</Button>
            </>
          ) : (
            <Button onClick={loginWithGoogle}>Đăng nhập</Button>
          )}
        </Group>
      </Group>
    </AppShell.Header>
  );
};

export default function App() {
  console.log('App rendering...');
  const { setUser } = useAuthStore();

  useEffect(() => {
    console.log('Setting up Auth Listener...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth State Changed:', user?.email);
      setUser(user);
    });
    return () => unsubscribe();
  }, [setUser]);

  return (
    <MantineProvider>
      <Notifications />
      <BrowserRouter>
        <AppShell header={{ height: 60 }} padding="md">
          <Header />
          <AppShell.Main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/doctors/:id" element={<DoctorProfilePage />} />
              <Route path="/booking/:doctorId" element={<BookingPage />} />
              <Route path="/my-appointments" element={<MyAppointmentsPage />} />
            </Routes>
          </AppShell.Main>
        </AppShell>
      </BrowserRouter>
    </MantineProvider>
  );
}

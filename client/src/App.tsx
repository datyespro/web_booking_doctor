import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import { useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { useAuthStore } from './stores/auth.store';

import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import { DoctorProfilePage } from './pages/DoctorProfilePage';

import { PublicLayout } from './layouts/PublicLayout';
import DoctorLayout from './layouts/DoctorLayout';
import { AdminLayout } from './components/layouts/AdminLayout';

import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointmentsPage from './pages/doctor/DoctorAppointmentsPage';
import DoctorSchedulePage from './pages/doctor/DoctorSchedulePage';
import DoctorProfileEditPage from './pages/doctor/DoctorProfileEditPage';
import DoctorLoginPage from './pages/doctor/DoctorLoginPage';


import { AdminPatientsPage } from './pages/admin/AdminPatientsPage';
import { AdminDoctorsPage } from './pages/admin/AdminDoctorsPage';

import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  console.log('App rendering...');
  const { setUser, initializeUser } = useAuthStore();

  useEffect(() => {
    console.log('Setting up Auth Listener...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth State Changed:', user?.email);
      if (user) {
        initializeUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [setUser, initializeUser]);

  return (
    <MantineProvider>
      <Notifications />
      <BrowserRouter>
        <Routes>
          {/* Public Routes (wrapped in PublicLayout) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/doctors/:id" element={<DoctorProfilePage />} />
            <Route path="/doctor/login" element={<DoctorLoginPage />} />

            {/* Protected Routes for Patients (still use PublicLayout) */}
            <Route element={<ProtectedRoute allowedRoles={['patient', 'admin']} />}>
              <Route path="/booking/:doctorId" element={<BookingPage />} />
              <Route path="/my-appointments" element={<MyAppointmentsPage />} />
            </Route>
          </Route>

          {/* Doctor Routes (wrapped in DoctorLayout) */}
          <Route path="/doctor" element={<ProtectedRoute allowedRoles={['doctor']} />}>
            <Route element={<DoctorLayout />}>
              <Route index element={<DoctorDashboard />} />
              <Route path="appointments" element={<DoctorAppointmentsPage />} />
              <Route path="schedule" element={<DoctorSchedulePage />} />
              <Route path="profile" element={<DoctorProfileEditPage />} />
            </Route>
          </Route>

          {/* Admin Routes (wrapped in AdminLayout) */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="patients" replace />} />
              <Route path="patients" element={<AdminPatientsPage />} />
              <Route path="doctors" element={<AdminDoctorsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

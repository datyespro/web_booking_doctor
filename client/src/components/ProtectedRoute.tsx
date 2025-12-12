import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { Loader, Center } from '@mantine/core';

interface ProtectedRouteProps {
    allowedRoles?: ('patient' | 'doctor' | 'admin')[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { user, loading } = useAuthStore();

    if (loading) {
        return (
            <Center h="100vh">
                <Loader size="xl" />
            </Center>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

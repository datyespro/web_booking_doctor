import { Modal, Tabs } from '@mantine/core';
import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthModalProps {
    opened: boolean;
    onClose: () => void;
}

export function AuthModal({ opened, onClose }: AuthModalProps) {
    const [activeTab, setActiveTab] = useState<string | null>('login');

    const handleSuccess = () => {
        onClose();
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Chào mừng đến với BookingCare" centered>
            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List grow mb="md">
                    <Tabs.Tab value="login">Đăng nhập</Tabs.Tab>
                    <Tabs.Tab value="register">Đăng ký</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="login">
                    <LoginForm onSuccess={handleSuccess} />
                </Tabs.Panel>

                <Tabs.Panel value="register">
                    <RegisterForm onSuccess={handleSuccess} />
                </Tabs.Panel>
            </Tabs>
        </Modal>
    );
}

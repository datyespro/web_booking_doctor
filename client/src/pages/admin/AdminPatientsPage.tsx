import React, { useEffect, useState } from 'react';
import { Title, Table, Group, Text, ActionIcon, Button, TextInput, Modal, LoadingOverlay } from '@mantine/core';
import { IconTrash, IconSearch, IconPlus, IconEdit } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { AdminRepository } from '../../repositories/AdminRepository';
import { AdminPatientForm } from './AdminPatientForm';

interface Patient {
    id: string;
    email: string;
    displayName: string;
    role: string;
    createdAt?: any;
}

export const AdminPatientsPage = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deleteModalOpen, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
    const [patientToDelete, setPatientToDelete] = useState<string | null>(null);

    const [formOpen, { open: openForm, close: closeForm }] = useDisclosure(false);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const data = await AdminRepository.getAllPatients();
            setPatients(data);
        } catch (error: any) {
            notifications.show({
                title: 'Lỗi',
                message: error.response?.data?.error || 'Không thể tải danh sách bệnh nhân',
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleDelete = async () => {
        if (!patientToDelete) return;
        try {
            await AdminRepository.deletePatient(patientToDelete);
            notifications.show({
                title: 'Thành công',
                message: 'Đã xóa bệnh nhân thành công',
                color: 'green',
            });
            fetchPatients();
            closeDeleteModal();
        } catch (error: any) {
            notifications.show({
                title: 'Lỗi',
                message: error.response?.data?.error || 'Không thể xóa bệnh nhân',
                color: 'red',
            });
        }
    };

    const confirmDelete = (id: string) => {
        setPatientToDelete(id);
        openDeleteModal();
    };

    const handleCreate = () => {
        setSelectedPatientId(null);
        openForm();
    };

    const handleEdit = (id: string) => {
        setSelectedPatientId(id);
        openForm();
    };

    const filteredPatients = patients.filter(patient =>
        patient.displayName?.toLowerCase().includes(search.toLowerCase()) ||
        patient.email?.toLowerCase().includes(search.toLowerCase())
    );

    const rows = filteredPatients.map((patient) => (
        <Table.Tr key={patient.id}>
            <Table.Td>{patient.displayName}</Table.Td>
            <Table.Td>{patient.email}</Table.Td>
            <Table.Td>{patient.role}</Table.Td>
            <Table.Td>
                <Group gap="xs">
                    <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(patient.id)}>
                        <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" onClick={() => confirmDelete(patient.id)}>
                        <IconTrash size={16} />
                    </ActionIcon>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={loading} />
            <Group justify="space-between" mb="lg">
                <Title order={2}>Quản lý Bệnh nhân</Title>
                <Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
                    Thêm bệnh nhân
                </Button>
            </Group>

            <TextInput
                placeholder="Tìm theo tên hoặc email"
                mb="md"
                leftSection={<IconSearch size={16} />}
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
            />

            <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Tên</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Vai trò</Table.Th>
                        <Table.Th>Thao tác</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>

            <Modal opened={deleteModalOpen} onClose={closeDeleteModal} title="Xác nhận xóa">
                <Text size="sm">Bạn có chắc muốn xóa bệnh nhân này? Hành động này không thể hoàn tác.</Text>
                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={closeDeleteModal}>Hủy</Button>
                    <Button color="red" onClick={handleDelete}>Xóa</Button>
                </Group>
            </Modal>

            <AdminPatientForm
                opened={formOpen}
                onClose={closeForm}
                onSuccess={fetchPatients}
                patientId={selectedPatientId}
            />
        </div>
    );
};

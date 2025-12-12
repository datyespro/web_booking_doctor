import React, { useEffect, useState } from 'react';
import { Title, Table, Group, Text, ActionIcon, Button, TextInput, Modal, LoadingOverlay, Badge } from '@mantine/core';
import { IconTrash, IconSearch, IconPlus, IconEdit } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { AdminRepository } from '../../repositories/AdminRepository';
import { AdminDoctorForm } from './AdminDoctorForm';

interface Doctor {
    id: string;
    email: string;
    name: string;
    specialty?: string;
    phone?: string;
    address?: string;
}

export const AdminDoctorsPage = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deleteModalOpen, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
    const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);

    const [formOpen, { open: openForm, close: closeForm }] = useDisclosure(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const data = await AdminRepository.getAllDoctors();
            setDoctors(data);
        } catch (error: any) {
            notifications.show({
                title: 'Lỗi',
                message: error.response?.data?.error || 'Không thể tải danh sách bác sĩ',
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleDelete = async () => {
        if (!doctorToDelete) return;
        try {
            await AdminRepository.deleteDoctor(doctorToDelete);
            notifications.show({
                title: 'Thành công',
                message: 'Đã xóa bác sĩ thành công',
                color: 'green',
            });
            fetchDoctors();
            closeDeleteModal();
        } catch (error: any) {
            notifications.show({
                title: 'Lỗi',
                message: error.response?.data?.error || 'Không thể xóa bác sĩ',
                color: 'red',
            });
        }
    };

    const confirmDelete = (id: string) => {
        setDoctorToDelete(id);
        openDeleteModal();
    };

    const handleCreate = () => {
        setSelectedDoctorId(null);
        openForm();
    };

    const handleEdit = (id: string) => {
        setSelectedDoctorId(id);
        openForm();
    };

    const filteredDoctors = doctors.filter(doctor =>
        doctor.name?.toLowerCase().includes(search.toLowerCase()) ||
        doctor.email?.toLowerCase().includes(search.toLowerCase()) ||
        doctor.specialty?.toLowerCase().includes(search.toLowerCase())
    );

    const rows = filteredDoctors.map((doctor) => (
        <Table.Tr key={doctor.id}>
            <Table.Td>{doctor.name}</Table.Td>
            <Table.Td>{doctor.email}</Table.Td>
            <Table.Td>
                {doctor.specialty ? <Badge color="blue">{doctor.specialty}</Badge> : <Text c="dimmed" size="sm">N/A</Text>}
            </Table.Td>
            <Table.Td>{doctor.phone || '-'}</Table.Td>
            <Table.Td>
                <Group gap="xs">
                    <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(doctor.id)}>
                        <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" onClick={() => confirmDelete(doctor.id)}>
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
                <Title order={2}>Quản lý Bác sĩ</Title>
                <Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
                    Thêm bác sĩ
                </Button>
            </Group>

            <TextInput
                placeholder="Tìm theo tên, email hoặc chuyên khoa"
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
                        <Table.Th>Chuyên khoa</Table.Th>
                        <Table.Th>Điện thoại</Table.Th>
                        <Table.Th>Thao tác</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>

            <Modal opened={deleteModalOpen} onClose={closeDeleteModal} title="Xác nhận xóa">
                <Text size="sm">Bạn có chắc muốn xóa bác sĩ này? Hành động này không thể hoàn tác.</Text>
                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={closeDeleteModal}>Hủy</Button>
                    <Button color="red" onClick={handleDelete}>Xóa</Button>
                </Group>
            </Modal>

            <AdminDoctorForm
                opened={formOpen}
                onClose={closeForm}
                onSuccess={fetchDoctors}
                doctorId={selectedDoctorId}
            />
        </div>
    );
};

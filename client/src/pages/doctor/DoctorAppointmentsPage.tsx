import { Container, Title, Paper, Text, Group, Select, Modal, Button } from '@mantine/core';
import { useDoctorAppointments } from '../../hooks/useDoctorAppointments';
import { DoctorAppointmentTable } from '../../components/doctor/DoctorAppointmentTable';
import { useState } from 'react';
import { useDeleteAppointment } from '../../hooks/useDeleteAppointment';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

export default function DoctorAppointmentsPage() {
    const { appointments, loading, updateStatus, refetch } = useDoctorAppointments();
    const { deleteAppointment, loading: deleteLoading } = useDeleteAppointment();
    const [filter, setFilter] = useState<string | null>('all');

    const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const filteredAppointments = appointments.filter(app => {
        if (filter === 'all' || !filter) return true;
        return app.status === filter;
    });

    const handleDeleteClick = (id: string) => {
        setSelectedId(id);
        openDeleteModal();
    };

    const confirmDelete = async () => {
        if (selectedId) {
            await deleteAppointment(selectedId, () => {
                notifications.show({
                    title: 'Thành công',
                    message: 'Đã xóa lịch hẹn',
                    color: 'green',
                });
                refetch();
                closeDeleteModal();
            });
        }
    };

    return (
        <Container size="xl">
            <Group justify="space-between" mb="lg">
                <Title order={2}>Quản lý lịch hẹn</Title>
                <Select
                    placeholder="Lọc theo trạng thái"
                    data={[
                        { value: 'all', label: 'Tất cả' },
                        { value: 'pending', label: 'Chờ xác nhận' },
                        { value: 'confirmed', label: 'Đã xác nhận' },
                        { value: 'completed', label: 'Đã khám xong' },
                        { value: 'cancelled', label: 'Đã hủy' },
                    ]}
                    value={filter}
                    onChange={setFilter}
                    w={200}
                />
            </Group>

            <Paper shadow="xs" radius="md" p="md" withBorder>
                {loading ? (
                    <Text>Đang tải...</Text>
                ) : filteredAppointments.length > 0 ? (
                    <DoctorAppointmentTable
                        appointments={filteredAppointments}
                        onUpdateStatus={updateStatus}
                        onDelete={handleDeleteClick}
                    />
                ) : (
                    <Text ta="center" c="dimmed" py="xl">Không có lịch hẹn nào</Text>
                )}
            </Paper>

            <Modal opened={deleteModalOpened} onClose={closeDeleteModal} title="Xác nhận xóa" centered>
                <Text size="sm" mb="lg">
                    Bạn có chắc chắn muốn xóa lịch hẹn này không? Hành động này không thể hoàn tác.
                </Text>
                <Group justify="flex-end">
                    <Button variant="default" onClick={closeDeleteModal}>Hủy</Button>
                    <Button color="red" onClick={confirmDelete} loading={deleteLoading}>Xóa</Button>
                </Group>
            </Modal>
        </Container>
    );
}

import { Container, Title, Table, Badge, Text, Center, Loader, Paper, Button, Modal, Group, Stack, Textarea, Rating } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { useMyAppointments } from '../hooks/useMyAppointments';
import { useCancelAppointment } from '../hooks/useCancelAppointment';
import { useDeleteAppointment } from '../hooks/useDeleteAppointment';
import axiosInstance from '../config/axios';

export default function MyAppointmentsPage() {
    const { user } = useAuthStore();
    const { appointments, loading, error, refetch } = useMyAppointments();
    const { cancelAppointment, loading: cancelLoading } = useCancelAppointment();
    const { deleteAppointment, loading: deleteLoading } = useDeleteAppointment();

    const [opened, { open, close }] = useDisclosure(false);
    const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
    const [reviewModalOpened, { open: openReviewModal, close: closeReviewModal }] = useDisclosure(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
    const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
    const [selectedDoctorName, setSelectedDoctorName] = useState<string>('');
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);

    const handleCancelClick = (id: string) => {
        setSelectedAppointmentId(id);
        open();
    };

    const handleDeleteClick = (id: string) => {
        setSelectedAppointmentId(id);
        openDeleteModal();
    };

    const handleReviewClick = (appointmentId: string, doctorId: string, doctorName: string) => {
        setSelectedAppointmentId(appointmentId);
        setSelectedDoctorId(doctorId);
        setSelectedDoctorName(doctorName);
        setReviewRating(0);
        setReviewComment('');
        openReviewModal();
    };

    const confirmCancel = async () => {
        if (selectedAppointmentId) {
            await cancelAppointment(selectedAppointmentId, () => {
                refetch();
                close();
            });
        }
    };

    const confirmDelete = async () => {
        if (selectedAppointmentId) {
            await deleteAppointment(selectedAppointmentId, () => {
                refetch();
                closeDeleteModal();
            });
        }
    };

    const submitReview = async () => {
        if (!selectedDoctorId || !selectedAppointmentId || reviewRating === 0) return;

        setReviewLoading(true);
        try {
            await axiosInstance.post(`/doctors/${selectedDoctorId}/reviews`, {
                rating: reviewRating,
                comment: reviewComment,
                appointmentId: selectedAppointmentId
            });
            notifications.show({
                title: 'Thành công',
                message: 'Cảm ơn bạn đã đánh giá bác sĩ!',
                color: 'green'
            });
            closeReviewModal();
            refetch(); // Refresh to update hasReviewed status
        } catch (err: any) {
            notifications.show({
                title: 'Lỗi',
                message: err.response?.data?.error || 'Không thể gửi đánh giá',
                color: 'red'
            });
        } finally {
            setReviewLoading(false);
        }
    };

    if (!user) {
        return (
            <Container py="xl">
                <Text ta="center">Vui lòng đăng nhập để xem lịch sử khám.</Text>
            </Container>
        );
    }

    if (loading) {
        return (
            <Center h={300}>
                <Loader size="xl" />
            </Center>
        );
    }

    if (error) {
        return (
            <Container py="xl">
                <Text c="red" ta="center">{error}</Text>
            </Container>
        );
    }

    return (
        <Container size="lg" py="xl">
            <Title order={2} mb="xl">Lịch hẹn của tôi</Title>

            {appointments.length === 0 ? (
                <Text c="dimmed">Bạn chưa có lịch hẹn nào.</Text>
            ) : (
                <Paper shadow="sm" radius="md" withBorder>
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Bác sĩ</Table.Th>
                                <Table.Th>Chuyên khoa</Table.Th>
                                <Table.Th>Ngày khám</Table.Th>
                                <Table.Th>Giờ khám</Table.Th>
                                <Table.Th>Trạng thái</Table.Th>
                                <Table.Th>Hành động</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {appointments.map((apt) => (
                                <Table.Tr key={apt.id}>
                                    <Table.Td fw={500}>{apt.doctorName}</Table.Td>
                                    <Table.Td>{apt.specialtyName}</Table.Td>
                                    <Table.Td>{dayjs(apt.date).format('DD/MM/YYYY')}</Table.Td>
                                    <Table.Td>{apt.timeText}</Table.Td>
                                    <Table.Td>
                                        <Badge
                                            color={
                                                apt.status === 'confirmed' ? 'green' :
                                                    apt.status === 'cancelled' ? 'red' :
                                                        apt.status === 'completed' ? 'blue' : 'yellow'
                                            }
                                        >
                                            {apt.status === 'pending' ? 'Chờ xác nhận' :
                                                apt.status === 'confirmed' ? 'Đã xác nhận' :
                                                    apt.status === 'cancelled' ? 'Đã hủy' : 'Đã khám'}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            {apt.status === 'pending' && (
                                                <Button
                                                    color="red"
                                                    variant="subtle"
                                                    size="xs"
                                                    onClick={() => handleCancelClick(apt.id)}
                                                >
                                                    Hủy
                                                </Button>
                                            )}
                                            {apt.status === 'completed' && !apt.hasReviewed && (
                                                <Button
                                                    color="blue"
                                                    variant="subtle"
                                                    size="xs"
                                                    onClick={() => handleReviewClick(apt.id, apt.doctorId, apt.doctorName)}
                                                >
                                                    Đánh giá
                                                </Button>
                                            )}
                                            {apt.status === 'completed' && apt.hasReviewed && (
                                                <Badge color="green" variant="light" size="sm">Đã đánh giá</Badge>
                                            )}
                                            {(apt.status === 'cancelled' || apt.status === 'completed') && (
                                                <Button
                                                    color="gray"
                                                    variant="subtle"
                                                    size="xs"
                                                    onClick={() => handleDeleteClick(apt.id)}
                                                >
                                                    Xóa
                                                </Button>
                                            )}
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Paper>
            )}

            <Modal opened={opened} onClose={close} title="Xác nhận hủy lịch hẹn" centered>
                <Stack>
                    <Text>Bạn có chắc chắn muốn hủy lịch hẹn này không? Hành động này không thể hoàn tác.</Text>
                    <Group justify="flex-end">
                        <Button variant="default" onClick={close}>Không</Button>
                        <Button color="red" onClick={confirmCancel} loading={cancelLoading}>Hủy lịch hẹn</Button>
                    </Group>
                </Stack>
            </Modal>

            <Modal opened={deleteModalOpened} onClose={closeDeleteModal} title="Xác nhận xóa lịch sử" centered>
                <Stack>
                    <Text>Bạn có chắc chắn muốn xóa lịch sử khám này không? Hành động này không thể hoàn tác.</Text>
                    <Group justify="flex-end">
                        <Button variant="default" onClick={closeDeleteModal}>Không</Button>
                        <Button color="red" onClick={confirmDelete} loading={deleteLoading}>Xóa</Button>
                    </Group>
                </Stack>
            </Modal>

            <Modal opened={reviewModalOpened} onClose={closeReviewModal} title={`Đánh giá ${selectedDoctorName}`} centered>
                <Stack>
                    <Group>
                        <Text size="sm">Đánh giá:</Text>
                        <Rating value={reviewRating} onChange={setReviewRating} />
                    </Group>
                    <Textarea
                        placeholder="Chia sẻ trải nghiệm của bạn..."
                        value={reviewComment}
                        onChange={(event) => setReviewComment(event.currentTarget.value)}
                        minRows={3}
                    />
                    <Group justify="flex-end">
                        <Button variant="default" onClick={closeReviewModal}>Hủy</Button>
                        <Button
                            color="blue"
                            onClick={submitReview}
                            loading={reviewLoading}
                            disabled={reviewRating === 0}
                        >
                            Gửi đánh giá
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Container>
    );
}
